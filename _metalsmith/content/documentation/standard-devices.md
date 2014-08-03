---
layout:  article
section: Documentation
title:   Standard Devices
---

# Standard Devices

The default Virt.js library contains a handful of ready-to-use devices, compatible with most standard engines (but not every environment). Here is a quick reference, by type.

*Please note that some engines may not be compatible with every device. These abstractions should work in many cases, but sometimes an engine is too complex for them, and a new custom device has to be wrote*

---

## Screen Devices (`virtjs/devices/screen/*`)

### Standard API

#### setOutputSize( width, height )

This method is used to inform the device from the size of the output canvas. You may want to call it whenever you resize the canvas.

#### setInputSize( width, height )

**This method should probably be only called by engines.**

This method is used to inform the device from the size of the screen, from an engine point of view.

#### setPixel( x, y, r, g, b )

**This method should probably be only called by engines.**

This method defines the color value of a specific pixel.

#### flushScreen( )

**This method should probably be only called by engines.**

It informs the device that the current frame has been completed, and that the pending updates can be displayed.

### Implementations

#### new WebGLScreen( { element } )

This device is using a WebGL canvas in order to display its output. The `element` option is the canvas (if missing, a new canvas will be created and put available in the `element` property of the created instance).

#### new NullScreen( )

The `NullScreen` is the dead-simple screen no-op. It never does anything. Useful when you want to achieve maximal performance under most restrictive environments (such as running tests in a Node.js context).

---

## Input Devices (`virtjs/devices/inputs/*`)

### Standard API

#### destroy( { force = false } )

Call this method when you wish to unbind any attached event. The device will probably stop working as expected when the call return, even if there is no guarantee (some devices will want to clean their state before leaving). Use the `force` option to explicitely ask to end everything *now*.

### Implementations

#### new KeyboardInput( { element, map, inputs } )

This device watches keyboard event on `element` (using `addEventListener` APIs), and map them to Engine inputs. If missing, the element defaults to `document.body`. One of `map` or `inputs` has to be specified:

  - The `map` is an object whose each key is a keyCode, and each value an engine symbol value, **or, if missing**

  - The `inputs` is an object whose each key is a keyCode symbol name and the value is an engine symbol value

In this last case, a map is deduced based on the symbol names (basically, arrow keys are mapped on left/right/up/down symbols, and a few other keys are mapped too). Not all engines are compatible with this last option.

#### new NullInput( )

The `NullInput` is the dead-simple input no-op. It never does anything. Useful when you want to achieve maximal performance under most restrictive environments (such as running tests in a Node.js context).
