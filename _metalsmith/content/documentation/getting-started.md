---
layout:  article
section: Documentation
title:   Getting Started
---

# Getting Started

Virt.js is a kind of oddball in this world full of Require.js and CommonJS packages: it actually stays true to its roots (Javascript), and uses the full power of ES6. Rather than sacrifying time and sweat on build issues (as in [Ember.js](http://emberjs.com), for example), it assumes that you are yourself using an ES6-compliant environment.

At this point, you may be afraid by this requirement, but fear not my friends: in addition to being super-useful to any Javascript developer, large parts of the ES6 spec can also be emulated by any ES5 browser using the great Traceur library. Since it is written in Javascript,

Let's get to it.

## Traceur

[Traceur](https://github.com/ModuleLoader/es6-module-loader) is a Google-fueled project allowing to compile ES6 into ES5, runnable in most browsers. The best part? It has been itself written with ES6, and is self-compiling! That means that you can run any ES6 code in your browser with Traceur live-compiling it, and that you can steel precompile your application for your production build.

Traceur may be a bit experimental, but I really haven't noticed any critical bug on Virt.js, so I would say that you can use it without much fear on other applications.

Anyway, I must admit that they may have a weird build process, since you will have to install an npm package (or compile the library yourself) in order to get the required file. They don't have a ready-to-use web cdn, sadly. So, in order to get it, type something like this in your terminal:

```sh
$> cd /tmp
$> npm install traceur
$> cp node_modules/traceur/bin/traceur.js "/some/path"
```

## ES6-Module-Loader

Compiling ES6 with Traceur is fine, but at some point we will need to load it. That's what [ES6-Module-Loader](https://github.com/ModuleLoader/es6-module-loader) is for. It will polyfill the ES6 global `System` variable, which is especially useful for its `System.import` method. I guess you can understand what this method do, but here is an example:

```js
System.import( './main' ).then( function ( module ) {
    module.myExportedFunction( );
} );
```

In order to get this library, you just have to fetch the file from the Github repository:

```sh
$> wget -O"/some/path" https://raw.githubusercontent.com/ModuleLoader/es6-module-loader/master/dist/es6-module-loader.min.js
```

## SystemJS

ES6-Module-Loader allows you to load any ES6 module in your browser (by dynamically using the Traceur compiler), but cannot load anything else. That's what [SystemJS](https://github.com/systemjs/systemjs) is for. It supersedes `System.import` by adding both AMD and CommonJS loaders, in addition to some few very useful options such as `paths` or `map` (allowing to namespace your modules).

System.js is a `wget` away, so let's fetch it!

```sh
$> wget -O"/some/path" https://raw.githubusercontent.com/systemjs/systemjs/master/dist/system.min.js
```

## Including those vendors

Once you've got those vendors, you just have to add them into your source code, in the right order:

```html
<script src="traceur.js"></script>
<script src="es6-module-loader.min.js"></script>
<script src="system.min.js"></script>
```

Congratulations, you're now running under a proper ES6 environment!
