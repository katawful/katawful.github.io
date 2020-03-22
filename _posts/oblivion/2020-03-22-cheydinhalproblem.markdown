---
layout: single
title:  "The Cheydinhal Problem: Understanding Performance in Oblivion"
date:   2020-03-22 13:48:25 -0400
excerpt: Figuring out the performance problems of Cheydinhal and why Oblivion doesn't perform well.
header: 
  teaser: /assets/images/cheydinhal-problem/teaser.png
  overlay_image: /assets/images/cheydinhal-problem/header.png
categories: oblivion 
tags:
  - performance
---

I've been playing Oblivion on and off for over a decade at this point, and by the time I got it on PC there was an issue that has been plaguing me.
Why does the Cheydinhal West Gate run so poorly?
I'm sure like many of you, I have never been able to keep a solid 60fps when playing Oblivion.
I expect dips, but even in the vanilla game I get 30FPS with an i5 4690K at 4.4GHz and an RX 570.

*-> Ok so I was I was writing this, I was doing some testing with DXVK HUD versus Gallium HUD and switching to DXVK made my performance much better and switching back to Gallium Nine kept that good performance.
The reason for this post kinda got ruined so maybe this isn't affecting you.
The framerates you see shouldn't be a direct indication or taken as fact.
I have no idea what I did.
It's still an interesting problem.*

![west-gate](/assets/images/cheydinhal-problem/cheydinhal-yes-houses.png)

It's an old game and our hardware is sooooo much better than what was available at the time.
[AnandTech][benchmark] was using an Athlon 64 dual core and SLI/Crossfire GPUs (which did actually scale pretty well, Oblivion takes well to it) and were lucky to hit 30 FPS at **medium** settings at 1024x768.
We have $200 GPUs and CPUs that can scream past 100FPS at 1080p in many newer games yet when we go back to Oblivion we struggle to keep 60FPS.
What gives?
This is a huge discussion and not something I want to dive into too deeply in this post. So I'm going to explain it rather simply just based on my own observations.



<h2>Oblivion System Usage</h2>

Oblivion is a middle-era DirectX 9 game using the GameByro engine updated from Morrowind with a bunch of new features.
For our uses in this post, the ones we are concerned about are: physics provided by Havok, distant level of detail (LOD), and dynamic lighting.
"Radiant AI" as we got is new, but it's just an improvement from what was seen in Morrowind.

<h4>GPU Usage</h4>

The vanilla game, and even modded, hardly uses the GPU.
The only effects that really change the GPU load are stuff like shaders from ENB or Oblivion Reloaded.
Most rendering effects like refraction and water reflections are GPU bound.
Modern GPUs just don't even notice these things so you're GPU is bound to stay well below 100% usage.

<h4>CPU Usage</h4>

Being a game from 2006, the game does not multithread very much.
Most things (draw calls and AI being the big ones) are shoved onto the main CPU thread while 1 and maybe an additional thread doing something
(OSR seems to do something with a third thread but I've yet to test this).
While AI is an issue, there's only like 2 guards in view while at the West Gate so we can ignore that.
There's nothing using physics around here.
Dynamic lighting is drawn by the CPU, but there's none here.
There's hardly any LOD in the Cheydinhal cell area, and the vanilla game doesn't have much to begin with.
So if LOD isn't the issue, what is?

<h2>Draw Calls</h2>

You've probably heard this term before, and maybe you know that "more number equals less performance", but what actually is a draw call?
GPUs, especially older ones, are pretty dumb. They mostly just take information and render it to screen.
While GPUs now have become much more complex and able to do many of the things a CPU can in game, back in 2006 that was a pipe dream.
The idea of shaders wasn't even a decade old at that point.
So how on earth do you render an object? Where does this information come from?

The CPU tells the GPU what, where, and how to render something.
The what aspect of this is the most important because it's the most limiting.
For this context, I will describe the whole mesh of an object as a model, and the whole texture mapping as the texture map.
Individual components are meshes and textures.
A singular object, say a character model, is not just a single mesh with a texture applied to it.
Complex model tend to be split up to allow for easier texture mapping and modification of the model.
So you split up the character model into 3 meshes each with 2 textures each (a color and a normal map).
The problem is, that the CPU doesn't know this is one object.
It sees 3 meshes with 2 textures each and says to the GPU "here's 9 things to render".
So instead of the character model being 1 mesh with 2 textures, it's now 3 meshes with 6 total textures.
You just *tripled* your draw calls on a single model.
And this process is the **slowest** part of rendering 3D graphics by far.
So much so that modern engines shove as many things as possible onto the GPU so the CPU doesn't have to waste time making draw calls.

Modern CPUs seem to be limited to about 10k draw calls before FPS drops below 60FPS.
However, more draw calls doesn't necessarily mean your FPS will tank to 0.
Cheydinhal can take up to 46k draw calls but 30FPS is maintainable, but 20k draw calls from RAEVWD can't even maintain 25FPS.
Its a touch relative which is important to keep in mind. Look at draw calls in a specific area, not overall.

<h2>My Testing</h2>

The first thing I had to do was create a HUD to display the information I needed.
Being on Linux, and having an AMD GPU my best option is Gallium HUD using the Gallium Nine driver add-on for Wine games.
This give me per core CPU performance, FPS, GPU load, and draw calls.
An example:

![hud](/assets/images/cheydinhal-problem/hud.png)

<h4>First Thoughts</h4>

Originally I believed that the crux of the issue were the lights.
I had tested my HUD in the starting prison cell and believed that the light was taking about 1500 draw calls.
That's quite a lot for a light.
So I went to Cheydinhal and messed around with lights at the West Gate and quickly realized that lights weren't the issue:

![light](/assets/images/cheydinhal-problem/light-on.png)
![nolight](/assets/images/cheydinhal-problem/light-off.png)

Disabling the lights changed nothing! Clearly I was thinking in the wrong direction.

<h4>Next Thought</h4>

My next thought was maybe that it's the houses that are the problem.
I had already known that they were inefficient.
So I did the same test with a house:

![house](/assets/images/cheydinhal-problem/house-on.png)
![nohouse](/assets/images/cheydinhal-problem/house-off.png)

A dramatic drop in draw calls happened!
5000 draw calls dropped in an instance.

So I decided to do something even more drastic, I deleted a bunch of houses and the chapel and tested again:

![west-gate](/assets/images/cheydinhal-problem/cheydinhal-yes-houses.png)
![nohouses](/assets/images/cheydinhal-problem/cheydinhal-no-houses.png)

Almost 20k draw calls removed in an instant. The problem was never lighting, or LOD. It is all of the houses in Cheydinhal.

<h2>Oblivion and Draw Calls</h2>

Oblivion was developed for PC and Xbox 360 concurently.
In fact in some cases it was developed for Xbox 360 primarily.
The Xbox 360 only had 512MB of RAM to work with for the entire system while a modest gaming PC probably had 1GB of system RAM and a 256MB video card at the time.
Plus the game was designed to be run off of a single dual layer DVD (holding about 8GB).
Bethesda needed to minimize texture size without making the game a blurry mess.
To do that, they created generic textures designed to fit into a generic mesh then pieced meshes together to create a model.
Those meshes might also be placed generically to create new structures.
They simply couldn't make every model in the game have 1 mesh and 1-2 textures, that would eat up too much space in storage and memory.
One of the basic Cheydinhal house models look like this:

![nifskope](/assets/images/cheydinhal-problem/nifskope.png)

where each "NiTriStrips" has a corresponding texture and that texture might have a corresponding normal map.
That's ~50 draw calls **per house**. And there's dozens of houses in view at any one time.
And Oblivion doesn't have occlusion culling so they're always rendered when in view.
Is it any surprise Cheydinhal doesn't perform all too well?

<h2>The Number Issue</h2>

If you do some mental math, you'll realize that the 50 draw calls per house can't really line up with the 46k draw calls at the West Gate.
Honestly? I don't know how it works either. Its very difficult to determine what exactly takes a draw call, especially when we don't have the engine SDK.
If anyone has more in-depth information, I'd love to hear it.

<h2>Solution</h2>

There's really only one thing that can fix the draw call problem in Oblivion and it's not an easy one.
All of Oblivion's static models (rocks, buildings, etc...) need to remade into one mesh each and use atlas textures.
Morrowind has an amazing [Atlas texture][atlas] project that goes through Morrowind's models and combines mesh components into one model.
Doing something similar for that Cheydinhal house from earlier would take the model from ~50 draw calls to a whopping 3, 6% of the original.
I would test this out myself, but I don't know modeling and don't have time to learn.

qwertyasdfgh's [VWD opitimized meshes][vwd] is a great starting point, but they're only for VWD far models.
In my opinion we need a project that expands its scope to all vanilla meshes. In that case, VWD models made from vanilla would also perform very well.
This is the **only** way I can see Oblivion performing well for the future, especially with an OpenMW port being 5+ years away and Boris not returning to Oblivion to give us occlusion culling.
Then the Cheydinhal problem can finally be put to rest for good.



[benchmark]:		https://www.anandtech.com/show/1996
[atlas]:		https://www.nexusmods.com/morrowind/mods/45399
[vwd]:			https://www.nexusmods.com/oblivion/mods/49595?
