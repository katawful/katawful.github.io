---
layout: single
title:  "My Linux History and Plans"
date:   2020-03-14 10:37:25 -0400
excerpt: A quick run down of why I use Linux and my experiences.
header: 
  teaser: /assets/images/teaser-image.png
  overlay_image: /assets/images/header-image.jpg
sidebar:
   title: "Similar Posts"
   nav: linux
categories: linux 
tags:
  - wine
  - oblivion
---
A quick run down of why I use linux and my experiences.
I have been using Linux as a daily OS for almost 2 years now, switching after being annoyed at Windows but more realistically just bored of it.
Windows is very limiting. Any sort of customization is hacky, there's nothing you can really change inherently to it.
Windows Explorer is possibly the worst program ever made. And MicroSoft continues to ruin older program compatibility,
namely middle era DirectX 9 games. So I bought a cheap no-name SSD for $30 and decided to mess around.

<h3>My Distro History</h3>

Initially I had started with [KDE Neon][kde-neon]. It was a fine distro, being a showcase of [KDE][kde] as a desktop environment.
Based on Ubuntu 16.04, I quickly realized that I didn't know what I was doing. Thankfully I hadn't fully switched at that point so I did end up breaking things quite often and having to reinistall.
Probably wasn't the smartest thing to do but eh, its a quick way to learn.


Eventually I ended up getting frustrated at Ubuntu's stable ethos and eventually made my way to [Manjaro][manjaro].
Of course I still used KDE, it's quite the enjoyable desktop environment. As Manjaro is based off of Arch Linux, I got driver and kernel updates much faster.
It did help fix issues I had here and there. I also learned more about bash scripting and using that to manage WINEPREFIXes better. 

After getting further annoyed by Manjaro's testing period on top of Arch's, I decided to just install bare Arch and what I need. 
Still kept KDE, but I eventually changed from [Vim][vim] to [NeoVim][neovim], [Bash][bash] to [Zsh][zsh] and adding [i3][i3] as another desktop environment, which I'm writing this on right now.
I'm a tinkerer at heart :p

[WINE][wine] lets one run Windows apps on non-Windows OSes and part of that is creating "bottles" of Windows directories and programs as WINEPREFIXes.
This lets me essentially have self contained programs, <b>and</b> multiple installs of the same program. This last part is the singular reason I believe that Oblivion is better on Linux.
In Windows, everything relating to program installs is stored in the registry and unique unchanging file locations usually.
Installing Oblivion tells Windows where that app is, where the plugins info is stored, and where the user files are stored.
Multiple installs are practically impossible, meaning all of your mod development and playing is on the same install, causing bloat.
Multiple installs with WINE is as simple as creating a new WINEPREFIX and installing the game.
Back before my storage SSD died or something, I had 3 installs: one for playing, one for screenshots, and one for development.
It does require modifying and creating shell/bash scripts but its very straight forward once set up.
Create the WINEPREFIX, install the game (using the downloaded installer from [GoG][obl-gog]), and copying the scripts you already have for any apps. 

I enjoy using Linux and I hope that I can get more people interested, especially those that love older moddable games like Oblivion. 
There's a lot that Linux can offer that Windows simply can't and I hope to showcase all of those little things in future :)


[kde-neon]:	https://neon.kde.org/
[manjaro]:	https://manjaro.org/
[wine]:		https://www.winehq.org/
[obl-gog]:	https://www.gog.com/game/elder_scrolls_iv_oblivion_game_of_the_year_edition_deluxe_the
[vim]:		https://www.vim.org/
[neovim]:	https://neovim.io/
[bash]:		https://www.gnu.org/software/bash/
[zsh]:		https://www.zsh.org/
[kde]:		https://kde.org/
[i3]:		https://i3wm.org/
