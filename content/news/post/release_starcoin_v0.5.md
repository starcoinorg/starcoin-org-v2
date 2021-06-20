+++
title = "Starcoin Blockchain release v0.5"
summary = "Starcoin Blockchain released v0.5, which is a major refactoring of the Block, Genesis, Stdlib modules, and implements the new Service Registry framework and adds a new Consensus Algorithm. The last version has been running stably for more than a month without deleting data, deployed six test nodes, and has reached more than 300,000 blocks of data. Feel free to download Starcoin to join the Proxima test network for testing!"
date = "2020-09-20"
author = "suoyuan"
tags = [
    "Release",
    "Starcoin"
]
archives="2020"
+++

Starcoin Blockchain released v0.5, which is a major refactoring of the Block, Genesis, Stdlib modules, and implements the new Service Registry framework and adds a new Consensus Algorithm. The last version has been running stably for more than a month without deleting data, deployed six test nodes, and has reached more than 300,000 blocks of data. Feel free to download [download](https://github.com/starcoinorg/starcoin/releases/) Starcoin to join the Proxima test network for testing!

## Main feature and update

1. Implement the new Service Registry framework and refactor the relevant modules of the original Actor implementation.
2. [break] Rebuild the block header field, remove gas_limit and add the chain_id field, and modify the showing of the public_key field.
3. [break] Update the accumulator field of block_info and make relevant changes to the affected modules.
4. [break] Refactor the prologue/epilogue function parameters of block.
5. [break] Stdlib fix the order of module names and add Spec validation for Block, Account, Token, etc.
6. [break] Stdlib adds extensible Token, and supports multiple Stdlib versions, and implements token gov voting governance mechanism.
7. Add a consensus implementation of the keccak Hash algorithm.
8. Implementation of the VM readonly function calls.
9. Support user-defined Chain, change the chain configuration to genesis configuration.
10. Enhance Account, State, epoch_info_by_number, generate genesis config, etc. commands.
11. Refactor the logic of initializing Storage via genesis.
12. Refactor the error handling mechanism during Node startup.
13. Further improve the test cases of block synchronization, state synchronization, and uncle block checking, as well as the unit test coverage of core modules such as accumulators and jellyfish_tree.

## Main dependency bump

1. move-vm bump to e297690c7ffbab2eccb42245a407e5d03e715ba3 (August 26) .
2. rust tool chain bump to 1.46.0.

For a full rundown of the changes please consult the Starcoin 0.5 [release milestone](https://github.com/starcoinorg/starcoin/milestone/10)
