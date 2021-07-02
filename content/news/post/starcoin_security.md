+++
title = "Starcoin  security bounty plan"
date = "2021-03-17"
summary = "With the upcoming launch of the Starcoin blockchain mainnet, a security bounty program is being launched, which will run from March 24, 2021 to April 24, 2021. "
author = "fikgol"
tags = [
    "security",
    "Starcoin"
]
archives="2021"
+++

With the upcoming launch of the Starcoin blockchain mainnet, a security bounty program is being launched, which will run from March 24, 2021 to April 24, 2021. It is hoped that security researchers from the global community will collaborate to continuously enhance the security of the Starcoin system by examining potential vulnerabilities in the Starcoin blockchain test network system. The event will conclude with the launch of the Starcoin mainline.

Starcoin is a new generation of layered smart contracts and distributed financial network designed to provide a secure platform for digital assets and decentralised financial operations, allowing blockchain to be used in a wider range of applications with lower barriers.

* Enhanced Satoshi Nakamoto consensus protocol to maximize throughput while ensuring security
* Flexible decentralised on-chain governance system to ensure continuous evolution of the chain
* New generation of smart contract programming language Move, virtual machines and standard libraries for asset-oriented programming
* Layered network model, with one and two layers working together to solve blockchain scalability challenges

Event Period: 2021.3.24 - 2021.4.24

Submit to:[ Starcoin github issue](https://github.com/starcoinorg/starcoin/issues)

The event will not only include a generous prize pool of USDT and STC mainnet coins, but will also give each participating user a Starcoin mining machine. You will be able to mine the Starcoin mainnet as soon as the mainnet goes live.

## Reward Description
Participation prize: Anyone who submits ≥1 valid bug during the campaign period will be awarded a Starcoin miner worth several thousand dollars. Limit one per user.



L0: 5,000U+5,000STC; Bug causes a need to be resolved through a hard fork.

L1: 2,500U+2,500STC; Vulnerability affects most nodes across the network and requires them to be updated.

L2: 500U+500STC; Vulnerability affects a single node and requires its updated version.

## Vulnerability Description
Includes but is not limited to

Consensus Attack

1. Network-wide block failure/slow block generation: Less than 100 blocks generated in 2 hours. l1/l2
2. Network-wide transaction not uploading: >100 empty blocks in 2 hours. l1/l2
3. Successful double-spend problem with non-51% algorithm attacks L0

Node/p2p network attacks

1. The node is put into an abnormal state by network message broadcast, protocol attack, etc. The abnormal state is determined by:
   1. Node exits abnormally. l2
   2. The node is unable to broadcast transactions to the public and broadcast new blocks.
   3. Node fails to synchronize to consensus blocks. Slow sync/incorrectly synced blocks.
   4. Non-counting power causes blocks to not come out, unable to receive/execute transactions.
   5. Causes node to have abnormal memory/cpu usage. L2
   6. Manual judgement that is not one of the above, but also causes node anomalies/fake deaths. L2
   7. The above attacks can automatically mass infect other nodes in the network. l1
   
Account Attack

1. Successfully steals the private_key, password of an account. L2
2. Successfully steals the node's node_key. L2
3. Successful construction of a fake signature. L2

Smart contract vulnerability attack

1. Successful modification of account resource without access: e.g. transferring starcoin from account. L0/L1
2. Censorship attack, successfully thwarting a majority challenge within a time window: bypassing a vote to change the configuration of a contract. L0/L1
3. Fake top-up. l0
4. Disrupting Starcoin's financial system, e.g. by issuing additional tokens. L0

## Activity description
* This program is only available on [Starcoin](https://github.com/starcoinorg/starcoin).
* It must be submitted on the official Starcoin page, describing the work done and the steps taken to reproduce the vulnerability.
* If multiple people report similar vulnerabilities, only the first to submit will be rewarded.
* The prize (USDT/STC) will be awarded within one month of the Starcoin main website going live.
* The final word on this campaign belongs to Starcoin.
