---
layout:  article
section: Developers
title:   Extra Events
---

# Extra Events

In some cases, you may want to hook some parts of the engine while it's running. In most emulators, such a thing can be very difficult since they are not really made for being extended at runtime. Virt.js is different, and allows you to choose between performances and extensibility by exposing events. All of them are totally optionals, and will be disabled if you do not explicitely ask for them when instanciating your engine.

## Usage

```js
```

## Event list

Here is the list of the events for standard engines (each engine expose its own events, even if most of them share the same names and parameters).

### Gameboy

  - `setup { }` (available on `engine` with the `setup` namespace)

    Emitted after an environment is bound to an engine.

  - `read { address, value }` (available on `engine.mmu` with the `read` namespace)

    Emitted when the emulator wants to know the data at some place in the memory.

    Note that `value` is writable: you can set it to something else than `undefined`, and the emulator will return this value rather than the actual one.

  - `write { address, value }` (available on `engine.mmu` with the `write` namespace)

    Emitted right before writing something somewhere.

    Note that `value` is writable: you can set it to something else, and the emulator will return this value rather than the actual one.

  - `post-write { address, value }` (available on `engine.mmu` with the `write` namespace)

    Emitted right after writing something somewhere.

    Changing the `value` parameter is not possible anymore.
