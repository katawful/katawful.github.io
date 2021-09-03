---
title:  "Oblivion Scripting Tutorial Part 0: An Introduction"
date:   2021-02-17 12:00:00 -0500
excerpt: An introduction to making Oblivion scripts
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

# 0. Preface:
[ObliVim][oblivim] is a plugin for the venerable text editors Vim and NeoVim.
Both of which are keyboard focused text editors designed for fast editing, and recommended for anyone who does a lot of text work.
The following tutorial will be under the assumption that this used, but in general this tutorial is applicable to anyone who wishes to create scripts for Oblivion.

# 1. Introduction:
If you're reading this, you're clearly familiar with Oblivion and wish to make some sort of mod for the game.
That mod probably contains scripts, but you're not sure how to start.
So what actually is scripting, and in particular how does that pertain to Oblivion?

## 1a. Scripting and Oblivion:
Scripting is a general statement that relates to using a code language to perform specific tasks.
It differs slightly from "programming" in that it's generally a lot less complex.
That isn't to say you won't end up programming, Oblivion scripting can get quite conceptual very fast (take a look at any of Maskar's mods).
But for most beginners we mostly care about basic things, like turning on a light for a house mod or having an weapon have some sort of non-vanilla magic effect.
This is where, as the community describes it, OBScript comes in.

### i. OBScript
OBScript is Oblivion's internal language that's used for general game needs, like doing things during quests.
The vanilla language itself is very limited, but OBSE greatly enhances what we can do (and make programming much easier).

The language itself is very relaxed, it is case-insensitive and does not care about indentation so the following examples are completely sound:

<table>
<thead><tr class="header">
<th>Valid</th>
<th>Also valid</th>
</tr></thead>
<tbody><tr><td>
<pre>
if stuff == 0
stuff
ELSE
other stuff
enDiF
</pre>
</td>
<td>
<pre>
if stuff == 0
  stuff
else
  other stuff
endif
</pre>
</td></tr></tbody>
</table>

I will explain more as the time comes, but OBScript isn't something to be afraid of especially if you're never even touched a code language.

### ii. Scripting
So what exactly can we do?
Quite a lot, but also not enough.
OBSE adds a ton of new features, but we are also limited by the features that Bethesda themselves have added to the game.
So while we can do basic stuff like light switches, and complex stuff like anything Maskar has made, we are also stuck within those defined features.
For instance, we have no screenspace effect management meaning we can't even dim the screen without external OBSE DLL files!
But for the scope of this tutorial, and for our own sanity, let's come up with scripts that a beginner might want to use immediately.

# 2. Our Goal
Let's create a simple mod that turns on a light in a house mod you have made.
So what do we need to do that?
Obviously we need the script, we need a light source, and then some sort of light switch.
Which means we need to be familiar with the CS.
I am not going to go over that here, but [this][cs-primer] guide on the Construction Set wiki is a great guide for general familiarity.
While you can read all of it, the first section is really the most important.
It's not too long, mostly just getting familiar, but at the end you should be able to do the following:
* create a cell where you wish to add a light source
* know how to add your own light sources and how to make new base objects
* and in general be familiar with manipulation in the CS

With that in mind, lets get familiar with working with scripts.
As said, this guide will be assuming you're using ObliVim for Vim/NeoVim, so from now on expect discrepancies if you're not using it.

# 3. Creating the Script
Before we begin, we need some sort of light source.
For this guide, create a new base object named "OSGLightSource" (OSG being short for "Oblivion Scripting Guide", abbreviations are a recommended prefix for your mods) with the lighting color you desire (such as warm candle color).
Give it the reference name of "HouseLightSource01".
You should be left with something like below:

![lightsource](/assets/images/obscript-guide/lightsource.png)

We will need this later.
Also place whatever static lighting model you desire, for this guide I am using "Candlestick01Fake".

As described in the documentation of [ObliVim][oblivim], you will need to modify your `Construction Set Extender.ini`.
Once done, create your script file in a directory named "HouseLightScript.obl".
This will not only be our light switch script, but also the filename **is** our script name.
What does this mean?

## i. Script Names
Oblivion is weird, and the scripts we create are compiled into the plugin we create.
Which means that Oblivion needs a way to actually know what script is which.
It achieves this with a simple header: `ScriptName YourScriptName`.
This header is required for every script you make, must be on the first line, and the abbreviated form `scn` can also be used (and most recommended).
Into your new script file, enter `scn HouseLightScript`.
You have now technically made a script!
We do need to actually add it to the CS, so save the file (and ignore the error atm).

## ii. Adding Scripts to the CS
With CSE v10.0 ScriptSync we still need to open up the script editor to add a script to our plugin.
Open up the script editor now.
You will want to create a new script by hitting the new script button in the top left corner: 
![newscript](/assets/images/obscript-guide/newscript.png)
Copy and paste your new script from Vim/NeoVim (hint: `:%y`) into this new script window, then hit save in the script editor.
There you go, you now have a script *in* your plugin!
With the plugin having your script we can now set up ScriptSync.

From the main CS window under "Gameplay", open up the script sync window.
This brings up the ScriptSync window, and we need to do 2 things.
First set the working directory to where you saved the your script file in the top right corner.
Then in the first pane, hit the button that says select to get the scripts we need to sync.
A new window will popup, and we need to click the top left most box:
![selectscript](/assets/images/obscript-guide/selectscript.png)
This will sort by scripts contained in our plugin, so pick your new plugin.
Then finally hit "Start Syncing" at the bottom of the script sync window.
Your script will finally start syncing to the CSE, but make sure you keep that script sync window open.
Type some garbage and save and you should see the ObliVim features enable.
We can now create the script.

## iii. What our script should do
So, what exactly is it that we need to do?
We have the general idea, we need to have some sort of activator that turns our light source on and off.
Let's start with that first part, the activator.

# 4. Activators
Oblivion has a general idea of "activators", something that activates a script.
This is generally an "Activator" object in the Object Window.
So let's add a button to make our script nice and easy to test.
I am using "Aichan01Button01" for this guide, but really any one will work, we need to make a new base object anyways.
In the object settings, you will need to change the base object name, the title that appears when you hover over said activator and most importantly the script that's bound to this activator:
![switchobject](/assets/images/obscript-guide/switchobject.png)
This, once saved as a new base object, creates an activator with our script attached to it.
Whenever you press the button our script will run.
Kinda.
It's more involved than that.

# 5. Activator Scripts
Ok, we have the activator but now we need to actually make our script do literally anything.
Oblivion, like most languages, has what is called "scope".
You only want to do some actions during some event, and Oblivion (most generally) describes these with "block modes".
These are entire blocks of code that only run during a specified mode.
The syntax for these block modes are like so:
```
Begin BlockMode
  stuff
End
```
These are the first places where you can actually write code.
[This][block-mode] article is a good read of the available modes, and in our case we need the mode "OnActivate":
```
Begin OnActivate
End
```
Our script will now work whenever we activate the activator.
To see it working, add a message command for quick testing:
```
Begin OnActivate
  Message "This is our button!"
End
```
Save and open up your game to your cell (enter `coc YourCell` if needed), and press the button.
Our message will appear on screen.

# 6. References in Scripts
References, as a refresher, are exactly what they sound like.
They refer to an object in the game.
It allows us, the mod creators, to directly control specific base objects that might be duplicated across the game.
After all, having 500 unique chair objects seems awfully silly now doesn't it?
If in doubt, just remember that references refer to base objects.

Let's use our light reference that we created earlier in a script.
For a simple test, lets just disable the light outright.
We need a function that works on a reference.
Oblivion describes these scenarios with the following syntax: `reference.function`.
Think of it as the function works on the reference.
If you're thinking on working *on* a specific object this is most likely the syntax needed.
If you're working with an unspecified object you won't need this syntax.
Thus if we need to disable a reference we use `reference.Disable`:
```
Begin OnActivate
  HouseLightSource01.Disable
End
```
Save and wait...   
What's that error?   
`[E] Line 3 Non-persistent reference 'HouseLightSource01' cannot be used in a script.`

Using references in scripts isn't as simple as it seems now is it?
What is persistence?

## Persistence
Oblivion, being the almost smart game it is, needs a way to not only process references in scripts but also a way to not process references in scripts at all.
You can't process a reference that's not in memory, the game doesn't think it exists how could it process it?
And well, Oblivion doesn't have reference loading regrettably. 
Thus if we want to process a reference in a script, we need to make it persistent.
This tells Oblivion to keep all reference data in memory, which of course means we want to minimize this whenever possible.
For our uses, its just one light source.
Double click on our light source in the Render Window, and click the "Persistent Reference" button near the bottom.
Now go back and save your script, it should save and compile without error.
Save your plugin, open your game, and press your button.
Your light source should turn off now.

# 7. Making the switch
Now we are onto the final part of this tiny little script, making it an actual switch.
So let's think, what kind of statement can we come up with that lets us disable and enable the light?
Well if the light is off it needs to be on, if the light is on it needs to then be off.
What this is, functionally, is a condition.

# 8. Conditionals
Conditionals are the most essential and fundamental idea in programming and scripting.
It is a very simple idea, if Condition A is true, do Action A.
We can also describe additional conditions, or maybe a condition that happens if none of our conditions are true.
Within OBScript we can define conditionals like so:
```
if condition A
  action A
elseif condition B
  action B
else
  action C
endif
```
This is sometimes called an "if block", and the only core component is that it must start with `if condition A` and must be closed by exactly 1 `endif` statement.

| Statement | Purpose                                                                                             |
|-----------|-----------------------------------------------------------------------------------------------------|
| `if`      | Starts block, must have condition, only one allowed per conditional block                           |
| `elseif`  | Comes after any `if` or `elseif` statement, must have a condition                                   |
| `else`    | Comes after any `if` or `elseif`, cannot have a condition and can't be followed by `if` or `elseif` |
| `endif`   | Ends block, has no condition, only one allowed per block                                            |

So what actually determines if a condition is valid or not?
We are looking for conditions that create "true" and "false" relationships.
For comparing two values in a condition we use comparison symbols

| Symbol   | Meaning                    |
|----------|----------------------------|
|   a == b | a equals b                 |
|   a != b | a does not equal b         |
|   a > b  | a is greater than b        |
|   a < b  | a is less than b           |
|   a >= b | a is greater or equal to b |
|   a <= b | a is less or equal to b    |

In general we are comparing two numbers, like the output of a numeric function vs a literal number.
But what if a function doesn't return a number?

## Truthy and falsy
In computer science, there's a general concept of "truthy" and "falsy".
A truthy value will be considered "true" by conditions, a falsy value with be considered "false" by conditions.
And for Oblivion, '0' is a falsy value and **any** other number is truthy.
Thus, functions that are either true or false actually return 1 or 0 respectively.
Therefore we can compare the result of these functions to a number.
`if reference.GetDisabled == 1` is seeing if the reference is disabled, the result of which is true or false.
In fact, we only need the condition itself to return a truthy or falsy.
For Oblivion, positive and negative integers are always truthy, 0 is always falsy.
This means that Oblivion is truly only looking for a non-zero number or a 0 when evaluating conditionals.
Add this block to your script if you're confused:
```
  Print "1 condition"
  if 1
    Print "truthy"
  else
    Print "falsy"
  endif
  Print "0 condition"
  if 0
    Print "truthy"
  else
    Print "falsy"
  endif
```
Due to this, we don't even need to *compare* anything to anything.
We just need to return a 0 or a non-zero number.
Thus we can write the condition `if reference.GetDisabled` and have that be complete.
However if we want the opposite result (i.e. the condition is true if the reference isn't disabled) we must compare it to zero like so `if reference.GetDisabled == 0`.

# 9. Finishing the Script
So we now have a way to see if the light is on or off, and we know how to create a condition that allows the light to switch.
We can put everything together:
```
Begin OnActivate
  if HouseLightSource01.GetDisabled
    HouseLightSource01.Enable
  else
    HouseLightSource01.Disable
  endif
End
```
Note that we disable the light without a condition applied to it.
And that's it!
We have a light switch!

# 10. Final Thoughts
We learned a lot in this section:
* we can create functional scripts
* we can edit scripts
* we learned the basics of conditionals
* we learned the basics of references

This is only the beginning however, there's a lot more to learn and the next part will go over more advanced conditions and script usage.
For now, see if you can modify the script and your plugin to have a candle change in appearance from lit to unlit when the lights change.
You can do it with only what we learned here.



[oblivim]:    https://github.com/katawful/Obli-Vim
[cs-primer]:  https://cs.elderscrolls.com/index.php?title=A_beginner%28s_guide,_lesson_1_-_The_Construction_Set_Primer
[block-mode]: https://cs.elderscrolls.com/index.php?title=Begin
