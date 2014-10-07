---
layout:  article
section: Documentation
title:   Getting Started
---

# Getting Started

## Development

First, include jspm somewhere in your page :

```html
<script src="https://jspm.io/system@0.6.7.js"></script>
```

Then configure your paths :

```html
<script>
    System.paths[ 'virtjs/*' ] = '/virtjs/libraries/virtjs/virtjs/*.js';
    System.paths[ 'virtjs-gbjit/*' ] = '/virtjs/libraries/virtjs-gbjit/virtjs-gbjit/*.js';
</script>
```

And finally, load the modules you wish to use !

```html
<script>
    Promise.all( [
        System.import( 'virtjs-gbjit/Engine' )
    ] ).then( function ( modules ) {
        console.log( modules[ 0 ].Engine );
    } );
</script>
```

However, my personal advice is to use ES6 yourself, so you would end up with this :

```html
<script>
    System.import( 'my-script' );
</script>
```

And, in `my-script.js` :

```js
import { Engine } from 'virtjs-gbjit/Engine';

console.log( Engine );
```

## Release

Short answer : concatenate the Traceur output, or use the JSPM bundler.

*More to come about this.*
