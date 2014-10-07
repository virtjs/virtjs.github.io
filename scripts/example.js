// By the way, this exact code is used for launching the emulator above :)

import { KeyboardInput }       from 'virtjs/devices/inputs/KeyboardInput';
import { WebGLScreen }         from 'virtjs/devices/screens/WebGLScreen';
import { AnimationFrameTimer } from 'virtjs/devices/timers/AnimationFrameTimer';
import { fetch }               from 'virtjs/tools';

import { Engine }              from 'virtjs-gb/Engine';
import { inputs }              from 'virtjs-gb/constants';

var input = new KeyboardInput( { inputs : inputs } );
var screen = new WebGLScreen( { canvas : document.querySelector( '.example .screen' ) } );
var timer = new AnimationFrameTimer( );

var engine = window.engine = new Engine( { devices : {
    input : input,
    screen : screen,
    timer : timer
} } );

fetch( '/roms/tuff.gb' ).then( rom => {
    engine.loadArrayBuffer( rom );
} );

