---
layout:  article
section: Documentation
title:   Getting Started
---

# Getting Started

Virt.js is a kind of oddball in this world full of Require.js and CommonJS: it actually stays true to its roots, and uses the full power of ES6. Rather than sacrifying time and sweat on build issues (as [Ember.js](http://emberjs.com), for example), it assumes that you are yourself using an ES6-compliant environment.

At this point, you may be afraid by this requirement, but fear not my friends: in addition to being super-useful to any Javascript developer, large parts of the ES6 spec can also be emulated by any ES5 browser using the great Traceur library. Let's get to it.

## Traceur

[Traceur](https://github.com/ModuleLoader/es6-module-loader) is a Google-fueled project allowing to compile ES6 into ES5, runnable in most browsers. The best part? It's written into ES6, and is self-compiling! Its use may be a bit experimental, but I haven't noticed any critical bug on Virt.js, so I would say that you can use it without fear for other applications.

Anyway, they have a weird build process, since you will have to install an npm package (or compile the library yourself) in order to get the required file. They don't have a ready-to-use web cdn, sadly.

```sh
$> cd /tmp
$> npm install traceur
$> cp node_modules/traceur/bin/traceur.js "/some/path"
```

## ES6-Module-Loader

Compiling ES6 is fine, but at some point we will need to load it. That what is [ES6-Module-Loader](https://github.com/ModuleLoader/es6-module-loader) for. It will polyfills the ES6 global `System` variable, which is especially useful for its `System.import` method.

To load this library, you just have to fetch the file from the Github repository:

```sh
$> wget -O"/some/path" https://raw.githubusercontent.com/ModuleLoader/es6-module-loader/master/dist/es6-module-loader.min.js
```

## SystemJS

ES6-Module-Loader allows to load any ES6 module in your browser (by dynamically using the Traceur compiler), but cannot load anything else. That's what [SystemJS](https://github.com/systemjs/systemjs) is for. It implements AMD and CommonJS loader, and also a few very useful options such as `paths` or `map` (allowing to namespace your modules).

Getting System.js is as simple as doing a simple curl:

```sh
$> wget -O"/some/path" https://raw.githubusercontent.com/systemjs/systemjs/master/dist/system.min.js
```

## Including those vendors

Once you get these vendors, you just have to add them into your source code, in the right order:

```html
<script src="traceur.js"></script>
<script src="es6-module-loader.min.js"></script>
<script src="system.min.js"></script>
```

Congratulations, you're now running under a proper ES6 environment! For your information, Traceur can be run as a build step in order to convert your many ES6 modules into a single ES5 file. I will not detail how to do it here, because it is out of scope, but know that it is possible.
