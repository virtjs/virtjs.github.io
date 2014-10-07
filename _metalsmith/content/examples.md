---
layout: standalone
title:  Examples
---

# Examples

Drop me a [mail](mailto:nison.mael@gmail.com) and I'll gladly add your projects on this page!

## [Pokelib](https://github.com/arcanis/pokelib) ([example](https://github.com/arcanis/pokelib))

![](http://i.imgur.com/L4jZIzW.jpg)

The Pokelib is a little project using Virtjs. The library is meant to be bound onto on an emulator running Pokemon Red, and will catch every event emitted by this engine. It abstracts whole parts of the code threw a Javascript API, so that you can dynamically fetch & alter the content of the ram using a very convenient API (so instead of using a memory address to get the player team, you use something like `pokelib.teams.player` instead). Since the memory writes are catched, the library can also expose custom events, such as player / bag / team updates, which allow you to react in real time to any game event.
