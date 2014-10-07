---
layout:  article
section: Developers
title:   Implementing a Device
---

# Implementing a Device

Despite having a few handy default devices, you may want to create your own, better suited to your usage. Since this task is very easy, we will see some examples rather than doing a step-by-step. Remember: just like about everything else in Virt.js, implementing a device is merely creating a class with a few methods. Easy!

## Stat Screen Device

This device allows you to know how many pixels are white at any given time. Neat, uh?

Almost no code at all!

```js
export class StatScreen extends WebGLScreen {

    constructor( ) {

        this.whitePixelCount = 0;
        this.whitePixelRatio = 0;

    }

    setPixel( x, y, r, g, b ) {

        var target = this._data;
        var index = ( y * this._inputWidth + x ) * 3;

        if ( target[ index + 0 ] === 0xFF &&
             target[ index + 1 ] === 0xFF &&
             target[ index + 2 ] === 0xFF )
            this.whitePixelCount -= 1;

        super( x, y, r, g, b );

        if ( target[ index + 0 ] === 0xFF &&
             target[ index + 1 ] === 0xFF &&
             target[ index + 2 ] === 0xFF )
            this.whitePixelCount -= 1;

        var whitePixelCount = this.whitePixelCount;
        var inputSize = this._inputWidth * this._inputHeight;

        this.whitePixelRatio = this.whitePixelCount / inputSize;

    }

}
```

## Random Input Device

Basic device usable by any RNG-Plays-Pokemon concept :)

```js
import { EmitterMixin } from 'virtjs/mixins/EmitterMixin';
import { mixin }        from 'virtjs/utils/ObjectUtils';

/**
 * Usage:
 *
 * import { inputs } from 'virtjs-gbjit/Engine';
 *
 * new RandomInput( {
 *     delay: 1000,
 *     inputs: inputs
 * } )
 *
 * new RandomInput( {
 *     delay: 400,
 *     distribution: [
 *         [ 0.10, inputs.A ],
 *         [ 0.13, inputs.B ],
 *         [ 0.13, inputs.START ],
 *         [ 0.13, inputs.UP ],
 *         [ 0.16, inputs.DOWN ],
 *         [ 0.16, inputs.LEFT ],
 *         [ 0.16, inputs.RIGHT ]
 *     ]
 * } )
 */

export class RandomInput extends mixin( null, EmitterMixin ) {

    constructor( { delay = 500, distribution, inputs } ) {

        if ( ! distribution )
            distribution = this._createDistribution( inputs );

        this._distribution = distribution;

        this._currentKey = null;
        this._running = true;

        this._timer = setInterval( ( ) => {

            // At each iteration, we send a "keyup" event on the previous key, and
            // a "keydown" event on the new key.
            //
            // If the device has been destroyed, we still send a last event to tell
            // the engine that the previous key should be released.

            if ( this._currentKey !== null ) {
                this.emit( 'keyup', this._currentKey );
                this._currentKey = null;
            }

            if ( this._running ) {
                this._currentKey = this._pickRandomKey( );
                this.emit( 'keydown', this._currentKey );
            } else {
                clearInterval( this._timer );
            }

        }, delay )

    }

    destroy( ) {

        this._running = false;

    }

    /**
     * This function takes a map in parameter (each key being a symbol, and each value an
     * input), and returns an array whose each entry is a pair `[ probability, input ]`.
     *
     * The probability is uniform, ie. that it will be the same for each input.
     */

    _createDistribution( inputs ) {

        var symbols = Object.keys( inputs );
        var probabilities = 1 / symbols.length;

        return symbols.map( symbol => [ probability, inputs[ symbol ] ] );

    }

    /**
     * Pretty simple, uh? We're just selecting a random number, and find which key should
     * be triggered by the value (we substract the probability of each key, and once we
     * go negative, we found the good one).
     *
     * Notice that we could use `crypto.getRandomValues` instead of `Math.random`, but we
     * would have to convert the random value into the [0;1[ range before.
     */

    _pickRandomKey( ) {

        var rnd = Math.random( );
        var key = null;

        this._distribution.some( ( [ probability, input ] ) => {
            if ( ( rnd -= probability ) < 0 ) {
                key = input;
                return true;
            } else {
                return false;
            }
        } );

        return key;

    }

}
```
