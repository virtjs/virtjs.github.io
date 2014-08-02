---
layout:  article
section: Documentation
title:   Instanciating an Emulator
---

# Instanciating an Emulator

A Virt.js emulator is a simple object. Its exact type depends on the emulator type. For example, assuming you want to instanciate a Gameboy emulator :

```js
import { Engine } from 'virtjs-gbjit/Engine';

var engine = new Engine( /*...*/ );
```

Most of emulators require some devices in order to communicate with the world. A device is an instance exposing a few handy methods used by the emulators. For example, the Gameboy use these devices :

```js
// The "Input" devices usually handle user inputs
import { KeyboardInput } from 'virtjs/devices/inputs/KeyboardInput';

// The "Screen" devices allow to specify how the engine should display during execution
import { WebGLScreen } from 'virtjs/devices/screens/WebGLScreen';

// The "inputs" variable contains a dict used to feed the Input devices
import { Engine, inputs } from 'virtjs-gbjit/Engine';

var canvas = document.querySelector( '#canvas' );

// Each of them takes additional options
var input = new KeyboardInput( { map : inputs } );
var screen = new WebGLScreen( { element : canvas } );

// Once created, we can use them to feed the engine creation
var engine = new Engine( { devices : {
    input: input,
    screen: screen
} } );
```

The next step may be optional depending on the engine type, but you will probably have to select some kind of rom to execute. A convenient function to do so is the `loadArrayBuffer` method.

```js
var engine = new Engine( /*...*/ );

var load = function ( ) {
    engine.loadArrayBuffer( xhr.response ); };

// A simple XHR2 routine to fetch the file
var xhr = new XMLHttpRequest( );
xhr.open( 'GET', 'testrom.gb', false );
xhr.responseType = 'arraybuffer';
xhr.onload = load;
xhr.send( null );
```

Note that in a Node environment, usual APIs return `Buffer` objects (rather than `ArrayBuffer`). You may use the `bufferToUint8` located into the `virtjs/tools` module to do the conversion for you:

```js
import { bufferToUint8 } from 'virtjs/tools';

var engine = new Engine( /*...*/ );

var buffer = readFileSync( 'testrom.gb' );
var arrayBuffer = bufferToUint8( buffer ).buffer;

engine.loadArrayBuffer( arrayBuffer );
```
