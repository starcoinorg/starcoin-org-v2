+++
title = "Starcoin Blockchain release v0.3"
summary = "Starcoin blockchain is released in v0.3, which includes unified block, dynamic algorithm for difficulty adjustment and Starcoin MoveVM stdlib."
date = "2020-07-21"
author = "jolestar"
tags = [
    "Epoch",
    "Starcoin"
]
archives="2020"
+++

Starcoin blockchain is released in v0.3, which includes unified block, dynamic algorithm for difficulty adjustment and Starcoin MoveVM stdlib.

## Main feature and update

1. Epoch and Uncle Block mechanism are introduced, the difficulty of PoW can be dynamically adjusted according to the Uncle Block rate.
2. The `Package` transaction type is introduced, which supports batch deployment of multiple Modules with initialization scripts.
3. Stabilization of Token module and issuance mechanism, the value of Token is changed from u64 to u128, which can support larger total amount and higher accuracy.
4. Implementation of Transaction fee distribution contracts.
5. Stdlib added SortedLinkedList, Math, BitOperators modules.
6. The BlockReword contract was refactored to accommodate Epoch and Uncle Block mechanisms.
7. Module upgrade mechanism is provided, and developers can customize the strategy of contract upgrade. Module upgrade compatibility check is implemented to ensure compatibility with the old version when upgrading.
8. Refactor Genesis to implement Genesis transaction via Package transaction. Simplify Genesis Account, retaining only 0x1 Genesis account.
9. Introduced the network rpc framework to simplify the implementation of the rpc interface on p2p networks.
10. Introduce Move's coverage tool to count stdlib's test coverage.
11. Simplify Node configuration and unify command line parameter format.

## Main dependency bump

1. move-vm bump to 821ac69a5e3ff3e323601c355d8de42f957d9c26 (July 14) .
2. libp2p bump to 0.22.
3. rust tool chain bump to 1.44.1.

For a full rundown of the changes please consult the Starcoin 0.3.0 [release milestone](https://github.com/starcoinorg/starcoin/milestone/8).
