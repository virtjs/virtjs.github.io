---
layout:  article
section: Developers
title:   Extra Events
---

# Extra Events

In some cases, you may want to hook some parts of the engine while it's running. In most emulators, such a thing can be very difficult since they are not really made for being extended at runtime. Virtjs is different, and allows you to choose between performances and extensibility by exposing events. All of them are totally optionals, and will be disabled if you do not explicitely ask for their namespaces when instanciating your engine.

## Usage

```js
import { Engine } from 'virtjs-gb/Engine';

var engine = new Engine( { events : [
    'setup',      // enable the 'setup' event
    'read',       // enable the 'read' event
    'write',      // enable the 'write' and 'post-write' events
    'instruction' // enable the 'instruction' event
] } );

engine.on( 'setup', ( ) => {
    console.log( 'engine setup' );
} );

engine.mmu.on( 'write', address => {
    // *(0) == 0, *(1) == 1, ...
    // will probably break everything :)
    return address;
} );
```

## Event list

Here is the list of the events for standard engines (each engine expose its own events, even if most of them share the same names and parameters).

### Gameboy

#### setup

**Available on `engine` with the `setup` namespace.**

Emitted after an environment is bound to an engine.

#### instruction (address, opcode, breakRequested)

**Available on `engine.interpreter` with the `instruction` namespace.**

Emitted before the emulator execute an instruction.

<div class="alert alert-info" role="alert">
    `breakRequested` is writable: you can set it to `true` (default `false`). If you do so, the emulator will leave the execution before executing the instruction.
</div>

<div class="alert alert-warning" role="alert">
    **Be careful**, doing something like this would prevent the emulator from going further, since you would always break when resuming:
</div>

```js
engine.on( 'instruction', event => {
    if ( address === 0x0042 ) {
        event.breakRequested = true;
    }
} );
```

#### read (address, value)

**Available on `engine.mmu` with the `read` namespace.**

Emitted when the emulator wants to know the data at some place in the memory.

<div class="alert alert-info" role="alert">
    `value` is writable: you can set it to something else than `undefined`, and the emulator will return this value rather than the actual one.
</div>

#### write (address, value)

**Available on `engine.mmu` with the `write` namespace.**

Emitted right before writing something somewhere.

<div class="alert alert-info" role="alert">
    `value` is writable: you can set it to something else, and the emulator will return this value rather than the actual one.
</div>

#### post-write (address, value)

**Available on `engine.mmu` with the `write` namespace.**

Emitted right *after* writing something somewhere.
