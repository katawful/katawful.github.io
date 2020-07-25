---
title: Oblivion Scripting Woes
date: 2020-07-25 12:00:00 -0400
excerpt: "Lamenting over Oblivion's scripting language by presenting a personal problem. Much hilarity and fun to be had."
categories: oblivion
---

## Introduction
If you've played any Bethesda game you'll probably describe them in one word: buggy.
The games ship broken and remains broken through their release.
Bugs just **aren't** fixed a year down the line.
Yeah, BGS tosses out updates that fixes things but it's only for major problems in the game.
While I could probably go *on and on* about Bethesda games, I wanna focus on possibly Bethesda's least loved middle child: Oblivion.

## Oblivion: The Potato-Headed Middle Child
Oh Oblivion, how I love and hate you so.
You have great writing and characters, but you're a broken mess of potato people.
Your quests are always a blast to go through, but you don't make it easy to enjoy anything else about it.
And by gods is modding you annoying and frustrating.
So many weird intricacies, so many things to know, so much more to learn.
You give me so much, but you don't give enough.
Everyone has left you for better projects and games, leaving what's here a half working mess.

But that's not even what I hate about you the most.
It goes much deeper than that.
It goes to your core.
And I'm sorry to have to bring it up.
Truth be told, your scripting language just isn't that good.

## Oblivion Scripting: The Three Potato-Headed Beast
Let's start with some personal history:
I've always had an interest in programming, but I never got into it cause idk crippling ADHD I guess.
My first real experience with programming was developing hardware via Arduino's for undergrad research.
It used some weird version of C but it was an okay to get started with programming.
It taught me a fair bit, but due to health reasons I couldn't continue so I never learned enough.
One year goes by, out of college, and finding some new found interest decided to pick up mod development for Oblivion.
I managed to make a basic house mod (that you totally shouldn't check out [here](https://www.nexusmods.com/oblivion/mods/49668)),
which wasn't anything fancy but did manage to spark *something* in me for the future.
I ended up having to make some scripts to do some neat things like light switches.
And that set things off.

I first started by making some scripting resources.
That quickly expanded into possibly my most ambitious project so far: [dynamic ingredient effect preview](https://www.nexusmods.com/oblivion/mods/49901).
This project, while not successful, taught me a lot about Oblivion scripting.
I learned just how performant scripts are, the general limitations of Oblivion, and what Oblivion scripting **can't** do.
And what it can't do is hard to know.
There's a ton of dumb things you simply have to know, that isn't explained unless you search it up and might not be found online at all.

## My One Month Long Problem
Currently, I am working on a new start mod for Oblivion.
Part of that entails creating new ways for the player to get the Amulet of Kings.
The existing new start mods either just give it to you, or they have you go on the exact same quest every time.
So, I wanted something new and fun and one of those ways was having the player going to the start dungeon if they got arrested within the Imperial City.
Simple right?
Just gotta add some flags to dialog and we're good to go, right?
Well, kinda. 
This is where my problem came in.

### How My Mod is Set Up
You see, my goal with this mod is to make it appear as "vanilla" as possible, so I need to be able to integrate it with the rest of the main game.
I can't introduce new dialog since that will make the mod not feel natural.
So I didn't want have my changes seem out of place at any point, nor interfere if the changes don't need to apply.
Essentially what I initially decided was to have the original "Go to jail" dialog option be unchanged, then introduce a flag that would allow another "Go to jail" option that tosses the player in the start dungeon.
Seems simple enough, and it was working fine.
But I swiftly ran into a problem.
*The game always crashed with the vanilla dialog*.
How is this possible?
What did I do wrong?
So off to testing I went.

### Button No Work
First I just put a button on the ground that when activated it would call the function `PlayerREF.GoToJail`.
And when I pressed it?
Nothing.
The only thing that happened was that the guards stopped being hostile.
What's the deal, the CS wiki doesn't mention anything.
Hell, I later asked on the Nexus forums about my problem and Arthmoor replied that what I did should work fine.
Well, here's the deal.
Turns out the function `GoToJail` **does not** work in a regular script.
It only works as a result script, presumably only for dialog result scripts.
At no point was this mentioned *anywhere* online.
Arthmoor didn't even know this.
Hell, I assume other long time modders didn't.
It was only an off-hand suggestion when I was talking to someone about it.

### Finally a Repeatable Crash
So, I instead made an NPC with a dialog option that had `PlayerREF.GoToJail` as part of a dialog result script.
And it crashed.
Ok, I'm onto something.
But what am I onto?
I asked around a bunch and got nothing helpful.
My last hope was to start disabling things and that got me *somewhere*.

In my start mod, I give the player some random equipment and items and what not.
And the way I do this is by putting all of that into a user function that I can call at some arbitrary point.
Disabling this call stopped the game from crashing.
But what was in there?
What secrets were hiding inside?
Well, I didn't have to wait very long.
As I was disabling and testing things in my script, I was talking to someone about my mod and why it wasn't working.
And I ended up having them go through my scripts.
What they found was obvious and clear.

### Kat and the Curse of Not Reading
You know how I said that my equipment randomization script gives the player stuff?
Well it also equipped the armor/clothes onto the player.
Oblivion has functions like `AddItem`, `RemoveItem`, and so on where you name the item then how many of said item (aka a flag) like so:

```
PlayerREF.AddItem EpicArmor420 1
```
Oblivion of course also has `EquipItem` to equip items in the reference's inventory.
This also has a flag after you name the item.
And in my infinite wisdom I had assumed that the flag for `EquipItem` was for the number of items.
Cause you would want to specify right?
(Author's note: this makes no sense)
No.
This flag, if it is 1, means the item that is equipped cannot be unequipped from the reference in question.
And guess what happens with `PlayerREF.GoToJail`?
*Your items get removed*.
How can you remove items from your inventory if you can't unequip them?
You can't so the game crashes.
This is what the CS wiki says about this flag:
> If you equip a playable non-quest item with the `NoUnequipFlag` set to 1 on the player, a subsequent call of `RemoveAllItems` on the player will crash the game.

While `GoToJail` doesn't *explicitly* call `RemoveAllItems`, it performs the same thing.
Once I removed that flag from `EquipItem`, the crashing stopped.
One month of nothing wasted on a simple flag that I should have read about earlier.

## Conclusions
Modding games is probably one of the weirder things to get into, at least for those that don't have good SDKs or source code available.
In Oblivion's case, most information pertaining to mod development is older than 2011 (I wonder why).
While there are a number of great modders out there still doing really cool things, there is a lack of documentation of what should and should not be done in Oblivion.
I love this game, I love creating mods, but having to somehow juggle all of this information is a real undertaking.
And it doesn't help that OBSE has stopped development when there's a number of lingering bugs that would be nice to fix.
That's not to mention the functions I'd like to see added to the game.

I hope for one day that Oblivion gets it's Morrowind resurgence.
Maybe even a resurgence with the help of OpenMW getting Oblivion support in 5+ years.
But until that happens, problems like mine will continue to crop up for anyone that isn't a very seasoned modder.
And it makes the work of the greats all the more impressive considering what they're up against in moddev.
