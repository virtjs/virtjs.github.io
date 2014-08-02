---
layout:  article
section: Developers
title:   Writing an Engine
---

# Writing an Engine

Creating an emulator is as simple as creating a few classes. Let's see what Virt.js can do for you!

In this tutorial, we will create an engine for the brainfuck language.

## Instruction Set

If you've never heard about it before, the brainfuck is an esotheric language whose particularity is to contain only six instructions (in the following array, `*P` means *"The data located at `P`"*).

| Character | Meaning                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| **>**     | Increase `P`                                                                                                       |
| **<**     | Decrease `P`                                                                                                       |
| **+**     | Increase `*P`                                                                                                      |
| **-**     | Decrease `*P`                                                                                                      |
| **[**     | Push the current address in the address stack, enter sleep mode if `*P` is zero                                    |
| **]**     | Pop the top of the address stack, exit sleep mode if the stack is empty, jump to the stack address if `*P` is zero |

Usually, the `[` and `]` instructions are paired. We will proceed a bit differently in our engine: pairing these instructions means doing a bit of parsing, and we don't want to do it (since it's not really in the scope of this course). To avoid it, we will keep an extra stack of address:

- Each time we see a `[` instruction, we will push it into this stack. Then, if we're not in sleep mode, we will check the value of `*P`. If it's zero, we will enter into sleep mode. Otherwise, nothing happen.
- Each time we see a `]` instruction, we will pop the stack top value. If it empties the stack, we exit the sleep mode. Then, if we're not in sleep mode anymore, we check the value of `*P`. If it's not zero, we go back to the poped address.

## The engine

So, as we say, an engine is a simple Javascript class (yep, ES6 has classes!). Let's write its public interface, even unimplemented:

```js
export class Engine {

    setup( environment ) {
    }

    loadArrayBuffer( environment, options = { } ) {
    }

    run( ) {
    }

}
```

These three methods, `setup`, `loadArrayBuffer` and `run` are used in most engines in order to give users some consistency. The `loadArrayBuffer` creates a new environment, and passes it to `setup` in order to plug it into the engine. Once everything is ready, the `run` method is called, and everything can happen.

So, with these rules in mind, let's fill the methods:

```js
export class Engine {

    setup( environment ) {

        this._environment = environment;

    }

    loadArrayBuffer( programBuffer, { autostart } = { } ) {

        this.setup( new Environment( {
            programBuffer : arrayBuffer
        } ) );

        if ( autostart ) {
            return this.run( );
        }

    }

    run( ) {

        return this._environment.out;

    }

}
```

Yeah! We have an engine! Which doesn't do anything!

## The environment

When emulating a system, you will want to store the current emulator state somewhere. This place is called an *environment*, and is a simple instance of a class. For our brainfuck engine, we will only need a very basic environment:

```js
export class Environment {

    constructor( { programBuffer } ) {

        // Creates a new uint8 buffer view
        this.program = new Uint8Array( programBuffer );

        // Creates the data array (16kb)
        this.data = new Uint8Array( 16 * 1024 );

        // Contains any output
        this.out = '';

    }

}
```

Nothing more for now. See? Isn't it simple?

## The JIT

We're finally attacking the hard work!

An emulator may be designed from multiple ways:

- **An interpreter** would read every operation from the emulated program, and execute some code to emulate this instruction behavior. It's pretty simple (basically, it's just a `for` loop followed by `switch` clauses), but not especially efficient.
- **A recompiler** will, as implied, recompile the original program in order to convert all the emulated machine primitives into the host environment primitives. For example, an asm-like `add a, b` instruction would become `a + b` in Javascript. Since the recompiled code is native, it can be run much faster, avoiding expensive indirections. However, it involves a long startup time, and may be impossible in some cases (for example with self-modifying codes).
- **A JIT** is a bit like the recompiler approach, but with different advantages and inconvenients. The JIT will recompile part of the original program, but only when needed. It avoids the burden of having to compile the full program, and allows to recompile some parts of the code if they happen to change during the execution, but requires some additional runtime code to do its magic.

Nevertheless, JIT engines offer many advantages over the two other approaches, and most of Virt.js engines will use them. And guess what? That's a good news! Since they are so powerful, the Virt.js core contains a ready-to-use JIT compilation strategy. You can use it to bootstrap your engine without hassle. Let's dig it.

```js
import { JIT } from 'virtjs/core/JIT';

var compiler;    /* we'll get to that later :) */
var environment; /* 'environment' is just an instance of your class Environment */

var jit = new JIT( compiler, environment );
jit.continue( );
```

That's possibly everything you need to know about the JIT structure. Cross my heart. It takes two parameters at construction:

- A **compiler**, which is an instance of a special type of class that we will detail in the following part.
- An **environment**, which is nothing more than an instance of the class that be defined in the previous chapter. Easy, right?

When calling the `continue` method, the JIT will run until being stopped by the program (which, in our case, will happen at the end of the execution).

So, let's plug it into our engine:

```js
export class Engine {

    setup( environment ) {

        var compiler; /* next chapter! */

        this._environment = environment;
        this._jit = new JIT( compiler, environment );

    }

    loadArrayBuffer( programBuffer, { autostart } = { } ) {

        this.setup( new Environment( {
            programBuffer : arrayBuffer
        } ) );

        if ( autostart ) {
            return this.run( );
        }

    }

    run( ) {

        this._jit.continue( );

        return this._environment.out;

    }

}
```

## The compiler

Remember this variable called `compiler`? It's another class instance. See, in order to live-compile the emulated bytecode into regular Javascript, the JIT engine has to know how to proceed. That's what the compiler is for.

Just like other classes, a compiler is a simple Javascript class, but this time we have to implement some non-optional methods. Let's start with empty functions:

```js
class Compiler {

    compileFrom( base, limit ) {
        return function ( jit, environment ) {
            /* something something */
        };
    }

    disassembleAt( address ) {
        return '<not implemented>';
    }

}
```

So, a compiler contains two methods:

  - `compileFrom` is the main one. It is used to transform emulated bytecode into a Javascript function (we'll see how to do it later). The `base` parameter is the start address, and the `limit` is the maximal read size. Actually, you may want to read more than this amount if your instructions take more than a single byte. The point is, stop reading instructions as soon as possible when you hit the limit.

    The last thing we should talk about this function is its return type. As you can see, we actually return another function. This later function will be executing by the JIT engine any time it would have to execute the code located at the `base` address, and will pass it two parameters: the JIT class instance itself, and the environment that you put in the JIT instanciation parameters.

  - `disassembleAt` is very simple: it takes an address, and returns the textual representation of the instruction. It is actually not required strictly speaking (since it would hurt performances to do so), but it's usually a useful thing to have, and some devices or program may like it (for example the Virt.js debugger).

So, with these informations, we can start implementing our compiler:

```js
class Compiler {

    constructor( { environment } ) {

        this._environment = environment;

    }

    compileFrom( base, limit ) {

        var code = '';

        var pCell = `env.data[ env.p % env.data.length ]`;

        for ( var offset = 0; offset < limit; ++ limit ) {

            var address = base + offset;

            if ( address >= this._environment.program.length )
                break ;

            var instruction = this._environment.program[ address ];

            switch ( String.fromCharCode( instruction ) ) {

                case '>' : code += `if ( ! env.sleep ) env.p += 1;`; break ;
                case '<' : code += `if ( ! env.sleep ) env.p -= 1;`; break ;

                case '+' : code += `if ( ! env.sleep ) ${pCell} += 1;`; break ;
                case '-' : code += `if ( ! env.sleep ) ${pCell} -= 1;`; break ;

                case '[' : code += `
                    env.stack.push( ${address} );
                    if ( ${pCell} === 0 ) env.sleep = true;
                `; break ;

                case ']' : code += `
                    var tmp = env.stack.pop( );
                    if ( env.stack.length === 0 ) env.sleep = false;
                    if ( ! env.sleep && ${pCell} !== 0 ) return tmp;
                `; break ;

            }

        }

        if ( address >= this._environment.program.length ) {
            code += `jit.stop( ); return 0;`;
        } else {
            code += `return ${address};`;
        }

        return new Function( 'jit, environment', code );

    }

    disassembleAt( address ) {

        return String.fromCharCode( this._environment.program[ address ] );

    }

}
```

A lot of things are going on, here! Let's detail them:

  - First, we declare our `code` variable. It's what will contain the final compiled Javascript code.

  - Then we create an helper to access the data pointed by the `P` variable (since the code is a bit long, it makes sense to factorize it). By the way, notice how we're using ES6 template literals here! That's not extra-useful in this particular case, but a few other strings make a great use of the builtin interpolation.

  - We iterate on each instruction that we want to compile (the JIT will be telling us how many instructions we should compile at most)

      - If the instruction is out-of-bound (ie. if we reached the end of the program), we abort the process immediately

      - Otherwise, we craft the right code matching the instruction

          - Notice that we're using `env.p`, `env.data`, `env.sleep` and `env.stack`. All of those variables have been previously declared in our Environment class!

          - If you pay attention, you will see an odd thing : the `]` instruction may return! Actually, when the compiled function is run by the JIT engine, any returned value will be immediately jumped at. It's very handy to chain the execution of multiple code paths.

            If you do not wish to immediately continue the execution, you may pause the JIT execution by calling `jit.stop( )` then returning an address from which the execution will resume later (usually, the next instruction address).

  - If we are the end of the program, we append some code to quit the JIT executon. In other cases, we add a jump toward the next part of the program.

  - And finally, we actually create the function from it's body (by using the dreaded `Function` constructor) and return it.

I wouldn't mind you not understanding some points, so feel free to breath a bit and read again (by the way, this tutorial is far from perfect, so I would love to hear your thoughts about how to improve it! But back to the point.).
