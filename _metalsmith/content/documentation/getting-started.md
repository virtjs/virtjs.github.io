---
layout:  article
section: Documentation
title:   Getting Started
---

# Getting Started

## Node.js

Install the `virtjs` npm package:

```
$> npm install virtjs
```

The module exports a single function, that you can use to actually import the Virtjs modules you wish to use:

```
var virtjs = require( 'virtjs' );

var Engine = virtjs( 'arch/gb/Engine' );
```

## Browser, as a standalone file

Just like for Node.js, include the [latest dist build](https://github.com/arcanis/virt.js/blob/master/build/output/virtjs.web.js) from the repository, link it in a `<script>` tag, then use the global `virtjs` function to load the modules:

```
var engine = virtjs( 'arch/gb/Engine' );
```

## Browser, directly using ES6 modules

First, include jspm somewhere in your page:

```html
<script src="https://jspm.io/system@0.6.7.js"></script>
```

Then clone Virtjs and configure your paths:

```
$> git clone git@github.com:arcanis/virt.js virtjs
$> cd virtjs
```

```html
<script>
    System.paths[ 'virtjs/*' ] = '/virtjs/sources/*.js';
</script>
```

And finally, load the modules you wish to use !

```html
<script>
    Promise.all( [
        System.import( 'virtjs/arch/gb/Engine' )
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
import { Engine } from 'virtjs/arch/gb/Engine';

console.log( Engine );
```
