---
layout: standalone
title:  News
---

# News

## 2014-10-07: JIT'ing delayed

I would have loved to implement a JIT engine to power the Gameboy engine, but it sadly won't happen anytime soon. The issue is that the Gameboy is very laxist on its memory layout. For example:

  - There is no alignment, so an instruction can warp onto multiple 'pages'
  - The instructions don't have fixed length, so we can't use that to avoid the wrapping
  - An instruction can jump anywhere, including in the middle of another instruction
  - **The code can be self modifying**, and invalidating the instruction cache efficiently is hard

In the meantime, I've built back the interpreter (improving it a lot in the process, so no time has really been lost), and will work to improve its performances by other means. I might get back to the JIT compiler later, but I will have to think twice about the issues above before commiting.

In other news, I've finally added the example on the frontpage of the Website, implemented shader filters (and removed some for now), and worked on my first real Virtjs project, which I hope to show you soon!

## 2014-08-03: New website!

I finally decided to give Virt.js a real website to host some documentation. I spent a bit of time on choosing the right framework to do so, and finally kept [Metalsmith](http://www.metalsmith.io/). For reference, I chose not to use standard plugins in order to be able to configure the website generation exactly as I wanted to. You can find it [here](https://github.com/virtjs/virtjs.github.io/blob/master/_metalsmith/metalsmith.js), the code is pretty neat.

I'm now going to work a bit more on the emulator itself - as you may have noticed, the version described in the website articles is not yet published. So first priority is to finish the Gameboy engine, which shouldn't take too long, then write an engine for another console.
