// By the way, this exact code is used for launching the emulator above :)

import { Engine }              from 'virtjs/arch/gb/Engine';
import { inputs }              from 'virtjs/arch/gb/constants';

import { KeyboardInput }       from 'virtjs/devices/inputs/KeyboardInput';
import { WebGLScreen }         from 'virtjs/devices/screens/WebGLScreen';
import { AnimationFrameTimer } from 'virtjs/devices/timers/AnimationFrameTimer';

import { fetchArrayBuffer }    from 'virtjs/utils/DataUtils';

var input = new KeyboardInput( { inputs : inputs } );
var screen = new WebGLScreen( { canvas : document.querySelector( '.example .screen' ) } );
var timer = new AnimationFrameTimer( );

var engine = window.engine = new Engine( { devices : {
    input, screen, timer
} } );

fetchArrayBuffer( '/roms/tuff.gb' ).then( rom => {
    engine.loadArrayBuffer( rom );
} );

