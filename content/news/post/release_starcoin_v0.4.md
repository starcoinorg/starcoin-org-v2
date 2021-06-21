+++
title = "Starcoin Blockchain release v0.4"
summary = "Starcoin Blockchain releases v0.4, which includes refactoring and stabilization of basic types and protocols. One month after that, Starcoin Blockchain will start a month-long unabridged beta test. Feel free to download Starcoin and join the Proxima test network."
date = "2020-08-06"
author = "jolestar"
tags = [
    "Release",
    "Starcoin"
]
archives="2020"
+++

Starcoin Blockchain releases v0.4, which includes refactoring and stabilization of basic types and protocols. One month after that, Starcoin Blockchain will start a month-long unabridged beta test. Feel free to [download](https://github.com/starcoinorg/starcoin/releases/) Starcoin and join the Proxima test network.

## Main feature and update

1. Refactor and stabilize the basic data types, Block, Transaction, etc. 
2. Add ChainID in the transaction to distinguish the transactions of different chain networks. 
3. Add Gas TokenCode in transactions, in preparation for supporting any Token as Gas in the future. 
4. Improve the expiration mechanism of transactions. 
5. Rebuild and stabilize Stdlib. 
6. Refactor VM and VM error handling. 
7. Fix the Token Type Determination bug in Token Module, and use TokenCode to mark the Token Type, such as: 0x1::STC::STC. 
8. Clean up and stabilize P2P network messages. 
9. Restructure and implement Fast Sync. 
10. Fix some bugs in the uncle block. 
11. Refactor the cli, rename the wallet command to account, and implement the off-chain data storage and query of account. 
12. Introduce Move prover, prepare for Stdlib to implement formal proof. 
13. Improve the unit test coverage of Stdlib to 80%. 
14. Refactoring and improving the integration testing framework. 
15. Refactor and stabilize node configuration. 

## Main dependency bump

1. move-vm bump to 9eadc565466d3db3a2b6b4f38c3fea78dcddc372 (July 29) .
3. rust tool chain bump to 1.45.0.

For a full rundown of the changes please consult the Starcoin 0.4 [release milestone](https://github.com/starcoinorg/starcoin/milestone/9)
