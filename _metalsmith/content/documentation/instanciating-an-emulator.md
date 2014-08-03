---
layout:  article
section: Documentation
title:   Instanciating an Emulator
---

# Instanciating an Emulator

A Virt.js emulator is a simple object. Its exact type depends on the emulator (there is no strict inheritance), but that doesn't really matter since most emulators will expose the same API. For example, assuming you want to instanciate a Gameboy emulator, the following code is a good start.

```js
import { Engine } from 'virtjs-gbjit/Engine';

var engine = new Engine( /*...*/ );
```

Most of emulators then require some devices in order to communicate with the world (think input & output). A device is a class instance exposing a few handy methods used by the emulators. For example, the Gameboy use these devices:

```js
// The "Input" devices usually handle user inputs
import { KeyboardInput } from 'virtjs/devices/inputs/KeyboardInput';

// The "Screen" devices allow to specify what the engine should display during execution
import { WebGLScreen } from 'virtjs/devices/screens/WebGLScreen';

// The "inputs" variable contains a dict used to feed the Input devices
import { Engine, inputs } from 'virtjs-gbjit/Engine';

var canvas = document.querySelector( '#canvas' );

// Each of them may take additional options, check the "Standard Devices" article for more information
var input = new KeyboardInput( { map : inputs } );
var screen = new WebGLScreen( { element : canvas } );

// Once created, we can use the devices to initialize the engine
var engine = new Engine( { devices : {
    input: input,
    screen: screen
} } );
```

The next step may be optional depending on the engine type, but you will probably want to select some kind of rom to execute. Since such thing is so common, a convenient way to do it is the `fetch` / `loadArrayBuffer` combination, which should work whatever the environment is.

```js
import { fetch } from 'virtjs/tools';

var engine = new Engine( /*...*/ );

fetch( './testrom.gb' ).then( rom => {
    engine.loadArrayBuffer( rom );
} );
```
