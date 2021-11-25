---
title: Formal Verification
weight: 10
---

Introduce to Move's formal verification tool

<!--more-->

# Formal Verification 

Move's formal verification tool, the Move Prover, supports formal specification and verification of Move programs. It can automatically prove
logical properties of Move smart contracts, while providing a user experience similar to a type checker or linter.
It's purpose is to make contracts more *trustworthy*, specifically:

- Protect massive assets managed by the Starcoin blockchain from smart contract bugs
- Anticipate justified regulator scrutiny and compliance requirements
- Allow domain experts with mathematical background, but not necessarily software engineering background, to
  understand what smart contracts do
  
  
## Installation

run (in the Starcoin root directory):

```shell script
bash scripts/dev_setup.sh -t -y -p
```

This command should work on MacOS and Linux flavors like Ubuntu or CentOS. (Windows is currently not supported).

Notice the `-p` flag means that the setup script will automatically update the .profile file to add environment variables, or you can choose to set the following environment variables manually.

```
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$HOME/.dotnet/tools:$PATH
export Z3_EXE=$HOME/bin/z3
export CVC4_EXE=$HOME/bin/cvc4
export BOOGIE_EXE=$HOME/.dotnet/tools/boogie
```

## Running the Prover

To run the Move prover while working in the Starcoin tree, we recommend to use `cargo run`. 
The Move prover has a traditional compiler-style command line interface: you pass a set of sources, tell it where to
look for dependencies of those sources, and optionally provide flags to control operation:

```shell script
> cargo run --package move-prover -- --dependency . arithm.move
```

Above, we process a file `arithm.move` in the current directory, and tell the prover to look up any dependencies this source
might have in the current directory. If verification succeeds, the prover will terminate with printing
some statistics dependent on the configured verbosity level. Otherwise, it will print diagnosis. 
We will use `arithm.move` to demonstrate how to write formal specification.

```move
/// arithm.move
module TestArithmetic {

    spec module {
        pragma verify = true;
        pragma aborts_if_is_strict = true;
    }

    fun arithmetic(x: u64, y: u64): u64 {
        (x + y) / x
    }
}
```

We add specification directly into the move source file. `pragma verify = true` tells the prover to verify this module.
`pragma aborts_if_is_strict = true` tells the prover to strictly check all the possible abort conditions. 
If we run the Move prover on the above example, we get the following error:

```abort happened here with execution failure```

This happens if the function's aborting is not covered by the specification. Let's fix the above and add the following condition:

```move
module TestArithmetic {

    spec module {
        pragma verify = true;
        pragma aborts_if_is_strict = true;
    }

    fun arithmetic(x: u64, y: u64): u64 {
        (x + y) / x
    }

    spec fun arithmetic {
        aborts_if x + y > max_u64();
        aborts_if x == 0;
    }
}
```
With this, the prover will succeed without any errors.

For more information, refer to the documentation:

-  [Introduction to Move Formal Verification](http://westar.io/blog/move_prover/)
-  [Move Prover User Guide](https://github.com/starcoinorg/starcoin/tree/master/vm/move-prover/docs/prover-guide.md)
-  [Move Specification Language](https://github.com/starcoinorg/starcoin/tree/master/vm/move-prover/docs/spec-lang.md)
