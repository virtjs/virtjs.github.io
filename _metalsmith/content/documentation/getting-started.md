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

Then clone Virtjs and configure your paths :

```
$> git clone git@github.com:arcanis/virt.js virtjs
$> ( cd virtjs && git checkout next )
```

<div class="alert alert-warning" role="alert">
    <strong>Don't forget to checkout!</strong> The branch *master* currently contains a different (old) version of Virtjs. Since then, the project has slightly shifted (mainly from ES5 to ES6), and master has not been updated yet to reflect this change. So don't forget to checkout the *next* branch!
</div>

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
