+++
title = "Starcoin Blockchain release v0.7"
summary = "Starcoin Blockchain released v0.7, On the basis that the previous version has been running stably for more than a month, we continue to optimize the Chain, Consensus, Stdlib, Network and other modules to implement the CNR consensus algorithm, adjust the time accuracy, and improve the Spec verification coverage to more than 90%. Feel free to download Starcoin to join the Proxima test network for testing!"
date = "2020-10-27"
author = "suoyuan"
tags = [
    "Release",
    "Starcoin"
]
archives="2020"
+++

Starcoin Blockchain released v0.7, On the basis that the previous version has been running stably for more than a month, we continue to optimize the Chain, Consensus, Stdlib, Network and other modules to implement the CNR consensus algorithm, adjust the time accuracy, and improve the Spec verification coverage to more than 90%. Feel free to download [download](https://github.com/starcoinorg/starcoin/releases/) Starcoin to join the Proxima test network for testing!

## Main feature and update

1. [break] Enhancement Stdlib events handle, and account deposit handle.
2.  Refactor json-rpc, Mutex RpcClientInner instead of RefCell, and bump jsonrpc to 15.1.0.
3. [break] Refactor timeService and related module references to time-based changes, modify stdlib timestamp to millisecond.
4. [break] Further refinement of Stdlib Spec verify, Account, ConsensusConfig, Authenticator, Dao, etc.
5. Refactor consensus, implements of new algorithms of cryptonight, update consensus_config for modify strategy.
6. [break] Upgrade Move-vm and do some clean.
7. Implement new network rpc api and BlockAccumulatorSyncTask.
8. Enhancement and optimize accumulator, migration InMemoryAccumulator from libra, and related storage refactor.
9. Enhancement association_account use multi key address and account support multi key.
10. Refactor miner,  modify miner client remove consensus strategy.
11. [break] Remove scaling factor, improve dao related features and events, modify Config script and TransactionTimeoutConfig.   
12. [break] Update genesis for CNR config and fix hash rate info.
13. [break] Refactor Stdlib error code.
14. Refactor chain network, fix GetBlockStateByHash error, add test apply without execute for chain, and add verify uncle test_case.
15. Optimize stest error message report, modify node start error handle, add tool to explain move abort error code.
16. Fix a PoW difficulty calculate window bug.
17. Each epoch dynamically adjusts the block gas limit of the next epoch according to the average value of block gas_used of the previous epoch and the block target time.

## Main dependency bump

1. move-vm bump to 6e0b5f3be37f586f8bf9cb5e534ea138705b1e6f (October 16) .

For a full rundown of the changes please consult the Starcoin 0.7 [release](https://github.com/starcoinorg/starcoin/releases/tag/v0.7.0)
