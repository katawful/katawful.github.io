---
title:  "Oblivion Scripting Tutorial Part 1: Conditionals"
date:   2021-02-28 12:00:00 -0500
excerpt: Conditionals in Oblivion Scripting, and their oddities.
permalink: /:categories/:title
teaser: /assets/images/obscript-guide/thumb.png
header: /assets/images/obscript-guide/proper-header.png
categories: oblivion
toc: true
toc_label: "Guidepost"
tags:
  - oblivion
  - linux
  - guide
  - cs
---

# 1. Introduction:
Conditionals are a core component to any code language.
They provide "branching" which allows us to direct the direction we want our code to go.
In OBScript, they are the core feature we use in basically every script.

# 2. Script Goal:
With conditonals, we can come up with a lot more advanced scripts.
They allow quite elaborate conditions and events for things like a house mod.
So for this section, let's create an alchemy station.
This station will:
* be activated by the alchemy apparatus
* determines use by alchemy skill

Seems simple right?
In function it seems like it, but it also requires quite a bit of new concepts in order to to work.
We need to get the player's alchemy skill and store it somewhere.
We need to enter the alchemy menu.
We need to get the alchemy items based on our skill.
Let's start with getting our player skills.

# 3. Setting up the station:
You can really use whatever you want, but I shall use [this][alchemy-resource] resource.
Unpack the resource you desire in a path within your Data folder.
I am going to put all of the resources into `Data\Meshes\kat\`, but choose something appropriate for you.
Create at least one activator (the same place you copied the button last tutorial), and add whatever else you want.
Make sure to assign a 'NIF' to this new activator.
We just need one to attach our script to.

# 4. Getting and Storing Player Skill:
Start by making a new script, which was discussed in the previous tutorial.
Name it what you please, but I'm gonna call it "AlchemyStation", then add this script to whatever activators you made.

Like every object in the game, the player character can be defined not only as a reference but also as a base object.
And there's a special reference that Oblivion uses to talk to the player, `PlayerREF`.
`Player` also works, but has a caveat.
The CS compiler allows it to refer to the base object or the reference, but can confused.
Thus it's best to only use `PlayerREF` as much as possible.

We can then use this reference to get the player's alchemy actor value:
```
Begin OnActivate
  PrintC "Player alchemy level is: %g", PlayerREF.GetAV Alchemy
End
```
`PrintC` allows us to print to console and is short for `PrintToConsole` with a string with a format specifier.   
We will discuss this in more detail later.
`GetAV`, short for `GetActorValue`, gets the actor value specified after (alchemy) for the reference attached to it (the player).
However, when we go to save this script we find that the CS doesn't like this:   
`[E] Line 4 Unknown variable 'GetAV' for parameter variable.`   

What gives?

It turns out a number of functions can't also take functions as values.
We need to instead find a way to store the result of this `GetAV` function so that `PrintC` can work properly.
This is where variables come in.

# 5. Variables:
Variables allow us to store values.
They are essential to programming, and Oblivion uses them heavily.
There are 4 main types of variables in Oblivion with OBSE:   

| Type       | Contains                        | Declaration  |
|------------|---------------------------------|--------------|
| References | Any reference or base object    | `ref`        |
| Numbers    | Any float or integer, see below | See below    |
| Strings    | Strings, OBSE construct         | `string_var` |
| Arrays     | Arrays, OBSE construct          | `array_var`  |

## Numbers:
Numbers are a special case.
Normal languages cleanly separate the different types of numbers such as floats, unsigned integers, signed integers, etc...
A floating point number has decimal places, an integer has none.
Short and long are types of integers with different ranges.
They can mostly be converted but will lose data and have limits.
Oblivion is quite unique.
You can convert the various number types quite easily (unsigned integers, floats, shorts, and longs), with basic truncation.
Oblivion won't complain.
In fact, **every** number is stored as a float.
Yes, every number.
You don't even need to declare a variable as a float to add floats to it.
Because **EVERYTHING IS FLOATS!!!!!**
**BUT NUMBERS GET TRUNCATED STILL**.

This leads us to a problem, and how we should best handle this.
Because all numbers are stored as floats, specifying long and short numbers is pointless.
So pointless in fact that its best to just avoid the distinction as much as possible.
You can effectively set all number variables as floats, but I also like setting numbers that aren't meant to be floats as integers.
Thus the only two types I use are `int` and `float`.
`int` is an alias for `short`, but since numbers are stored as floats we aren't limited by the range of `short` numbers.
So if you need an integer, pick one type and stick with it forever.
There's no reason to change integer type.

## Declaring Variables:
In programming you can declare, and either define or initialize variables.
A declaration means that you decide what type a variable is without giving it a value.
For Oblivion, every variable must be declared before use.
To do so, you can declare outside of any block mode.
```
scn ScriptName
int integer
Begin GameMode
  ...
End
float float
Begin MenuMode
```
This script is valid.
However, Oblivion scripts process top to bottom, thus you need to declare variables properly.
As a result just put your declarations first, right after the script name.
This is good practice.   
A declaration requires a type and some variable name that is not already in use.
For the most part it can be anything, but don't name it a function or another variable:
```
int iInteger
short sShort
long lLong
float fFloat
ref rReference
array_var aArray
string_var ssString
```
If you notice, I add a prefix to each variable name.
This gives you a general idea of what variables there are and what they're used for.
It's not required, but *highly* encouraged.
Pick a method and stick with it.

Definition/initialization happens when you load this variable with a value.
It does depend on the type itself, but for the most part we can set variables directly with values, with another variable, or the result of a function:
```
set iInteger to 9
set fFloat to 9.9
set rReference to PlayerREF
set iInteger to GetFPS
set fFloat to iInteger
```
While there are two ways to define/initialize variables with either `set var to ...` or `let var := ...`, for now it is best to stick with the first method.
These two methods will be expanded upon in a later post.

# 6: Using Variables:
Ok, now that we know what variables are and how to use them we can finally get the player alchemy level.
What we need to do is to declare some number, and then add the result of the `GetActorValue` function to it:
```
int iAlchemyLevel
Begin OnActivate
  set iAlchemyLevel to PlayerREF.GetAV Alchemy
  PrintC "Player alchemy level is: %g", iAlchemyLevel
End
```
Enter the game and activate your alchemy item, the player level will be printed to the console.
You can mod your player skill in-game with the console with: `player.setav alchemy #`.
It'll be useful later.

# 7: Creating a Conditional Block
We can get the player's alchemy level, but now what should we do with it?
Oblivion segments skills into ranks, and we can create an if block that allows us to detect what rank we are in:
```
int iAlchemyLevel

Begin OnActivate
  set iAlchemyLevel to PlayerREF.GetAV Alchemy
  if iAlchemyLevel >= 100
    Print "Master: Above 100"
  elseif iAlchemyLevel >= 75
    Print "Expert: Above 75 to 100"
  elseif iAlchemyLevel >= 50
    Print "Journeyman: Above 50 to 75"
  elseif iAlchemyLevel >= 25
    Print "Apprentice: Above 25 to 50"
  else
    Print "Novice: Below the others"
  endif
  PrintC "Player alchemy level is: %g", iAlchemyLevel
End
```
The general idea is to match where the player's level is with these rank ranges.
Add the script as-is and mess with the console command I mentioned if you want to see how it works.
We can view this if block in a more simplistic manner:
```
if player level >= master rank
else if player level >= expert rank
else if player level >= journeyman rank
else if player level >= apprentice rank
else player level doesn't fit in with these
```
When you're creating an if block, thinking more abstractly about the conditions you want before writing them is very helpful.

This if block we came up with is pretty nice, but it's also simple.
What if we wanted to do something more complex, like requiring the right intelligence level?
It's purely a role playing perspective, but what if the player needed the right intelligence level in order to use the fancier equipment?
That if block would look something like this:
```
if player level >= master rank AND intelligence is above a
else if player level >= expert rank AND intelligence is above b
else if player level >= journeyman rank AND intelligence is above c
else if player level >= apprentice rank AND intelligence is above d
else player level and/or intelligence doesn't fit in with these
```
So how do we actually do this?
We need to combine two statements, if the player level is in the range and if the intelligence is in the range.

# 7: AND and OR statements:
In programming, AND statements takes the result of two expressions and if they are the same the result is true.
An OR statement requires one *or* the other statement to be true for the result to be true.
```
if true AND true
  result is true
else if true AND false
  result is false
else if false AND false
  result is false

if true OR false
  result is true
else if true OR true
  result is false
else if false OR true
  result is false
else if false OR false
  result is false
```
In Oblivion, AND and OR are symbolized by `&&` and `||` respectively.
Thus for this problem, we need AND statements:
```
int iAlchemyLevel
int iIntelligenceLevel

Begin OnActivate
  set iAlchemyLevel to PlayerREF.GetAV Alchemy
  set iIntelligenceLevel to PlayerREF.GetAV Intelligence
  if iAlchemyLevel >= 100 && iIntelligenceLevel >= 100
    Print "Master: Above 100"
    Print "Intelligence: Above 100"
  elseif iAlchemyLevel >= 75 && iIntelligenceLevel >= 85
    Print "Expert: Above 75 to 100"
    Print "Intelligence: Above 85 to 100"
  elseif iAlchemyLevel >= 50 && iIntelligenceLevel >= 70
    Print "Journeyman: Above 50 to 75"
    Print "Intelligence: Above 70 to 85"
  elseif iAlchemyLevel >= 25 && iIntelligenceLevel >= 60
    Print "Apprentice: Above 25 to 50"
    Print "Intelligence: Above 60 to 70"
  else
    Print "Novice: Below the others"
    Print "Intelligence: Below the others"
  endif
  PrintC "Player alchemy level is: %g", iAlchemyLevel
  PrintC "Player intellgence level is: %g", iIntelligenceLevel
End
```
You can adjust these values at your leisure.

# 8: Adding the Items:
Contrary to the above conditional work, adding items in Oblivion is super easy!
There are two general ways to add and remove items in Oblivion, with notifications and without.
The functions for either are very straightforward:

| Function          | Use                                        | Description                                                                   |
|-------------------|--------------------------------------------|-------------------------------------------------------------------------------|
| `AddItem`         | `Reference.AddItem Item n`                 | Adds n `Item` to `Reference`, notified                                        |
| `AddItemNS`       | `Reference.AddItemNS Item n`               | Adds n `Item` to `Reference`, silent                                          |
| `EquipItem`       | `Reference.EquipItem Item NoUnequipFlag`   | Equips `Item` on `Reference`, notified. `NoUnequiFlag` takes true or false    |
| `EquipItemNS`     | `Reference.EquipItemNS Item NoUnequipFlag` | Equips `Item` on `Reference`, with sound. `NoUnequipFlag` takes true or false |
| `EquipItemSilent` | `Reference.EquipItemSilent`                | Equips `Item` on `Reference`, silent. `NoUnequipFlag` takes true or false     |
| `RemoveItem`      | `Reference.RemoveItem Item n`              | Removes n `Item` from `Reference`, notified                                   |
| `RemoveItemNS`    | `Reference.RemoveItemNS Item n`            | Removes n `Item` from `Reference`, silent                                     |

While notified item changes can be nice, they are slow and clog up Oblivion's notification system.
So for this guide we want to use the silent `NS` versions.
I am going to simply segment this script between the various types of alchemy equipment:
```
int iAlchemyLevel
int iIntelligenceLevel

Begin OnActivate
  set iAlchemyLevel to PlayerREF.GetAV Alchemy
  set iIntelligenceLevel to PlayerREF.GetAV Intelligence
  if iAlchemyLevel >= 100 && iIntelligenceLevel >= 100
    PlayerREF.AddItemNS AlembicMaster 1
    PlayerREF.AddItemNS CalcinatorMaster 1
    PlayerREF.AddItemNS RetortMaster 1
    PlayerREF.AddItemNS MortarPestleMaster 1
  elseif iAlchemyLevel >= 75 && iIntelligenceLevel >= 85
    PlayerREF.AddItemNS AlembicExpert 1
    PlayerREF.AddItemNS CalcinatorExpert 1
    PlayerREF.AddItemNS RetortExpert 1
    PlayerREF.AddItemNS MortarPestleExpert 1
  elseif iAlchemyLevel >= 50 && iIntelligenceLevel >= 70
    PlayerREF.AddItemNS AlembicJourneyman 1
    PlayerREF.AddItemNS CalcinatorJourneyman 1
    PlayerREF.AddItemNS RetortJourneyman 1
    PlayerREF.AddItemNS MortarPestleJourneyman 1
  elseif iAlchemyLevel >= 25 && iIntelligenceLevel >= 60
    PlayerREF.AddItemNS AlembicApprentice 1
    PlayerREF.AddItemNS CalcinatorApprentice 1
    PlayerREF.AddItemNS RetortApprentice 1
    PlayerREF.AddItemNS MortarPestleApprentice 1
  else
    PlayerREF.AddItemNS Alembic 1
    PlayerREF.AddItemNS Calcinator 1
    PlayerREF.AddItemNS Retort 1
    PlayerREF.AddItemNS MortarPestle 1
  endif
  PrintC "Player alchemy level is: %g", iAlchemyLevel
  PrintC "Player intellgence level is: %g", iIntelligenceLevel
End
```
Well we have the alchemy apparatus now, but how do we actually use it?
The simplest way is to just equip one of them believe it or not.
That's actually what happens when you click on **any** item in your inventory!
```
int iAlchemyLevel
int iIntelligenceLevel

Begin OnActivate
  set iAlchemyLevel to PlayerREF.GetAV Alchemy
  set iIntelligenceLevel to PlayerREF.GetAV Intelligence
  if iAlchemyLevel >= 100 && iIntelligenceLevel >= 100
    PlayerREF.AddItemNS AlembicMaster 1
    PlayerREF.AddItemNS CalcinatorMaster 1
    PlayerREF.AddItemNS RetortMaster 1
    PlayerREF.AddItemNS MortarPestleMaster 1
    PlayerREF.EquipItemSilent MortarPestleMaster
  elseif iAlchemyLevel >= 75 && iIntelligenceLevel >= 85
    PlayerREF.AddItemNS AlembicExpert 1
    PlayerREF.AddItemNS CalcinatorExpert 1
    PlayerREF.AddItemNS RetortExpert 1
    PlayerREF.AddItemNS MortarPestleExpert 1
    PlayerREF.EquipItemSilent MortarPestleExpert
  elseif iAlchemyLevel >= 50 && iIntelligenceLevel >= 70
    PlayerREF.AddItemNS AlembicJourneyman 1
    PlayerREF.AddItemNS CalcinatorJourneyman 1
    PlayerREF.AddItemNS RetortJourneyman 1
    PlayerREF.AddItemNS MortarPestleJourneyman 1
    PlayerREF.EquipItemSilent MortarPestleJourneyman
  elseif iAlchemyLevel >= 25 && iIntelligenceLevel >= 60
    PlayerREF.AddItemNS AlembicApprentice 1
    PlayerREF.AddItemNS CalcinatorApprentice 1
    PlayerREF.AddItemNS RetortApprentice 1
    PlayerREF.AddItemNS MortarPestleApprentice 1
    PlayerREF.EquipItemSilent MortarPestleApprentice
  else
    PlayerREF.AddItemNS Alembic 1
    PlayerREF.AddItemNS Calcinator 1
    PlayerREF.AddItemNS Retort 1
    PlayerREF.AddItemNS MortarPestle 1
    PlayerREF.EquipItemSilent MortarPestle
  endif
End
```
Save the script and let's test it out!

# 9: We Forgot Something!:
So needless to say, this script doesn't work perfectly.
Yes, we have segmented out the alchemy station to our heart's content.
We've added and used the alchemy apparatus.
The problem however, is that we forgot to remove the alchemy apparatus!

This is where things get a bit tricky.
See, its easy enough to add and equip items whenever we activate the station.
But how do we get rid of those items?

# 10: Script Flags:
In Oblivion, we will come across a situation like this quite often where we need to do something after something else unconditionally.
In our case we need to remove the alchemy items *after* we've exited the alchemy menu.
This sounds simple, but there isn't a way to do this within the `OnActivate` block mode this script uses.
That only works when we activate an object, which we clearly haven't.

What if we instead flagged that we're done with the menu, and when we're back to the regular game we remove the items?
```
...
int bInMenu
...
Begin OnActivate
  ...
  set bInMenu to 1
  ; put near the top
  ...
End
```
The flag `bInMenu` (prefixed with `b` for boolean), tells us when we're in the alchemy menu.
We set it to 1 since we are entering a menu within this block mode.
This flag can then be used to detect when we are back into the regular game.
For this we use the block mode `GameMode`:
```
...
Begin GameMode
  if bInMenu == 1
    Print "out of menu"
    set bInMenu to 0 ; set to 0 since we aren't in the alchemy menu
  endif
End
```
Add this below the `OnActivate` block along with the above flag declaration and go back into the game.
You'll see that the print will run when we leave the alchemy menu from this station.

Now that we have this flag, we need another flag that lets us know what alchemy items to remove.
In this case, we have 5 different things we need to keep track of.
We need to know what segment the player fits into.
For this, we still use a number:
```
...
int iSegment
...
Begin OnActivate
  ...
  if iAlchemyLevel >= 100 && iIntelligenceLevel >= 100
    set iSegment to 1
    ...
  elseif iAlchemyLevel >= 75 && iIntelligenceLevel >= 85
    set iSegment to 2
    ...
  elseif iAlchemyLevel >= 50 && iIntelligenceLevel >= 70
    set iSegment to 3
    ...
  elseif iAlchemyLevel >= 25 && iIntelligenceLevel >= 60
    set iSegment to 4
    ...
  else
    set iSegment to 5
    ...
  endif
End
```
The flag `iSegment` is added to each segment, before we add the items, and numbered in a way which we know what segment the player is in.
We can then use this flag to set what items we need to remove from the player:
```
...
Begin GameMode
  if bInMenu == 1
    if iSegment == 1
      PlayerREF.RemoveItemNS MortarPestleMaster 1
      PlayerREF.RemoveItemNS AlembicMaster 1
      PlayerREF.RemoveItemNS CalcinatorMaster 1
      PlayerREF.RemoveItemNS RetortMaster 1
    elseif iSegment == 2
      PlayerREF.RemoveItemNS MortarPestleExpert 1
      PlayerREF.RemoveItemNS AlembicExpert 1
      PlayerREF.RemoveItemNS CalcinatorExpert 1
      PlayerREF.RemoveItemNS RetortExpert 1
    elseif iSegment == 3
      PlayerREF.RemoveItemNS MortarPestleJourneyman 1
      PlayerREF.RemoveItemNS AlembicJourneyman 1
      PlayerREF.RemoveItemNS CalcinatorJourneyman 1
      PlayerREF.RemoveItemNS RetortJourneyman 1
    elseif iSegment == 4
      PlayerREF.RemoveItemNS MortarPestleApprentice 1
      PlayerREF.RemoveItemNS AlembicApprentice 1
      PlayerREF.RemoveItemNS CalcinatorApprentice 1
      PlayerREF.RemoveItemNS RetortApprentice 1
    elseif iSegment == 5
      PlayerREF.RemoveItemNS MortarPestle 1
      PlayerREF.RemoveItemNS Alembic 1
      PlayerREF.RemoveItemNS Calcinator 1
      PlayerREF.RemoveItemNS Retort 1
    EndIf
    set bInMenu to 0
  endif
End
```
Save and go into the game and try out the script.
Everything should work well!

# 11: Finishing Up:
The script works fine, but there's a minor issue we need to address.
The `GameMode` block in this script will always run no matter what while we are in the normal game.
While this script isn't complex enough for this to be an issue, it is good practice to never keep a script running during `GameMode` if we don't need it to.
Too much and it can affect performance.
To do this, we just need to adjust the first conditional in our script to instead quit the script if our flags deem so:
```
Begin GameMode
  if bInMenu != 1
    Return
  elseif bInMenu == 1
    ...
```
`Return` is an exit function that quits script processing.
We use our `bInMenu` flag to see if we are not in the alchemy menu from the alchemy station, and if true we stop the script from processing from that point on.
This might seem weird, but it will be addressed more in depth in the future.

The full script should look like this:
```
scn AlchemyStation

int iAlchemyLevel
int iIntelligenceLevel
int bInMenu
int iSegment

Begin OnActivate
  set iAlchemyLevel to PlayerREF.GetAV Alchemy
  set iIntelligenceLevel to PlayerREF.GetAV Intelligence
  set bInMenu to 1
  if iAlchemyLevel >= 100 && iIntelligenceLevel >= 100
    set iSegment to 1
    PlayerREF.AddItemNS AlembicMaster 1
    PlayerREF.AddItemNS CalcinatorMaster 1
    PlayerREF.AddItemNS RetortMaster 1
    PlayerREF.AddItemNS MortarPestleMaster 1
    PlayerREF.EquipItemSilent MortarPestleMaster
  elseif iAlchemyLevel >= 75 && iIntelligenceLevel >= 85
    set iSegment to 2
    PlayerREF.AddItemNS AlembicExpert 1
    PlayerREF.AddItemNS CalcinatorExpert 1
    PlayerREF.AddItemNS RetortExpert 1
    PlayerREF.AddItemNS MortarPestleExpert 1
    PlayerREF.EquipItemSilent MortarPestleExpert
  elseif iAlchemyLevel >= 50 && iIntelligenceLevel >= 70
    set iSegment to 3
    PlayerREF.AddItemNS AlembicJourneyman 1
    PlayerREF.AddItemNS CalcinatorJourneyman 1
    PlayerREF.AddItemNS RetortJourneyman 1
    PlayerREF.AddItemNS MortarPestleJourneyman 1
    PlayerREF.EquipItemSilent MortarPestleJourneyman
  elseif iAlchemyLevel >= 25 && iIntelligenceLevel >= 60
    set iSegment to 4
    PlayerREF.AddItemNS AlembicApprentice 1
    PlayerREF.AddItemNS CalcinatorApprentice 1
    PlayerREF.AddItemNS RetortApprentice 1
    PlayerREF.AddItemNS MortarPestleApprentice 1
    PlayerREF.EquipItemSilent MortarPestleApprentice
  else
    set iSegment to 5
    PlayerREF.AddItemNS Alembic 1
    PlayerREF.AddItemNS Calcinator 1
    PlayerREF.AddItemNS Retort 1
    PlayerREF.AddItemNS MortarPestle 1
    PlayerREF.EquipItemSilent MortarPestle
  endif
End

Begin GameMode
  if bInMenu != 1
    Return
  elseif bInMenu == 1
    if iSegment == 1
      PlayerREF.RemoveItemNS MortarPestleMaster 1
      PlayerREF.RemoveItemNS AlembicMaster 1
      PlayerREF.RemoveItemNS CalcinatorMaster 1
      PlayerREF.RemoveItemNS RetortMaster 1
    elseif iSegment == 2
      PlayerREF.RemoveItemNS MortarPestleExpert 1
      PlayerREF.RemoveItemNS AlembicExpert 1
      PlayerREF.RemoveItemNS CalcinatorExpert 1
      PlayerREF.RemoveItemNS RetortExpert 1
    elseif iSegment == 3
      PlayerREF.RemoveItemNS MortarPestleJourneyman 1
      PlayerREF.RemoveItemNS AlembicJourneyman 1
      PlayerREF.RemoveItemNS CalcinatorJourneyman 1
      PlayerREF.RemoveItemNS RetortJourneyman 1
    elseif iSegment == 4
      PlayerREF.RemoveItemNS MortarPestleApprentice 1
      PlayerREF.RemoveItemNS AlembicApprentice 1
      PlayerREF.RemoveItemNS CalcinatorApprentice 1
      PlayerREF.RemoveItemNS RetortApprentice 1
    elseif iSegment == 5
      PlayerREF.RemoveItemNS MortarPestle 1
      PlayerREF.RemoveItemNS Alembic 1
      PlayerREF.RemoveItemNS Calcinator 1
      PlayerREF.RemoveItemNS Retort 1
    EndIf
    set bInMenu to 0
  endif
End
```

# 12: Final Thoughts:
With this we have gone over the essentials of conditionals and how to create flags in Oblivion.
These two are the most essential components of OBScript.
It provides a lot of power to the developer, and while there's more that needs to be discussed, it is a great starting point.
See if you can expand the segmenting to be more complex.

[alchemy-resource]: https://www.nexusmods.com/oblivion/mods/50848
