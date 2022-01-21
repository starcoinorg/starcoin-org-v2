---
title: Safety-conscious Design Concept
weight: 21
---

~~~
* By Starcoin community
~~~

Starcoin's vision is to become a new generation of layered smart contracts and distributed financial networks. In short, Starcoin provides a general platform that allows developers to use Move to safely implement their own applications, and provides an interoperable network that links various applications to form a complete ecosystem . Then through the second layer, the data on the chain is connected with the real scene, which improves the user experience, reaches the real users, and finally allows users to enjoy  the convenience of the blockchain and enjoy the dividends brought by the blockchain.

 This article will focus on the security attributes of Starcoin, which is an aspect of Starcoin's key design. Through security design at different levels, users can easily play with Starcoin and DeFi. We first introduce the security of Starcoin. 

![starcoin_safety](https://tva1.sinaimg.cn/large/008i3skNly1gx6f5948owj31em0ncdht.jpg)

## Enhanced Starcoin Consensus

Anyone who knows the blockchain knows that a very big highlight of Bitcoin is that it guarantees the basic trust between people through algorithms. This is what we call the PoW consensus, which can be understood as an algorithmic credit system and the cornerstone of Bitcoin. Compared with other centralized or semi-centralized consensus solutions such as PoS, Starcoin firmly chose PoW to ensure that the Starcoin network is safe under decentralized conditions. At the same time, in order to solve some of the limitations of the Satoshi Nakamoto consensus algorithm and further strengthen the security of one layer, Starcoin has made some very interesting optimizations to the consensus. 

![starcoin_consensus](https://tva1.sinaimg.cn/large/008i3skNly1gx67mdtql5j30uz0buwfm.jpg)

The Starcoin consensus is an enhanced version of the Satoshi Nakamoto consensus. In order to speed up the block generation and reduce the transaction confirmation time, the introduction of runtime data such as the uncle block rate ,it can detect network congestion with a lower delay, and automatically dynamically adjust the block generation time, difficulty, and block rewards, thereby maximize the use of the network, try to avoid the risk of uncertainty caused by the network, at the same time, reduce user waiting time and improve user experience. When the computing power of the whole network fluctuates greatly, the difficulty can respond quickly and play a role in protecting the Starcoin network. 

## On-chain Governance Escorts for Upgrades 

The contract is the law, and the free upgrade of the contract has always been a more controversial issue in the blockchain field. On the one hand, the contract must be upgradable when you encounter problems. On the other hand, upgrading the contract arbitrarily without trust may cause problems. 

Starcoin strives to explore a new path from this dilemma of "can" and "cannot", through on-chain governance and community voting, to supervisely upgrade the contract. It not only solves the extreme situations that must be upgraded when encountering problems, but also increases transparency and security. Under the supervision of community users, rationally upgrade the contract to better protect the interests of users from loss. 

## Verifiable two MerkleAccumulator 

MerkleAccumulator, a very core data structure of Starcoin, is used to provide proof of blocks and transactions, ensuring that blocks and transactions on the main chain can be verified anytime and anywhere, so that data can be used safely. 

The feature of MerkleAccumulator is that the leaf nodes can increase and accumulate from left to right, and then build a tree-shaped MerkleAccumulator, and finally save the hash of the Root node in the block. The advantage of using MerkleAccumulator is that it is very easy to prove whether a block or transaction is on the chain. For example, the Proof of leaf node B in the figure is node C,node A and node D. Starcoin masterly designed two MerkleAccumulators to provide proofs of blocks and transactions, corresponding to the block_accumulator_root and txn_accumulator_root of BlockHeader, which are Starcoin's "two MerkleAccumulator". 

![st![starcoin_merkle_accumulator_proof](https://tva1.sinaimg.cn/large/008i3skNly1gx6fqycrz0j30br06smx9.jpg)arcoin_merkle_accumulator_proof](https://tva1.sinaimg.cn/large/008i3skNly1gx6fqycrz0j30br06smx9.jpg)









## Construct a two-layer Cornerstone

The Starcoin ecosystem has not only one layer, but also a second layer. The first layer focuses on the ability of the chain itself, and the second layer, as an important part of the ecosystem , carries the important role of linking real life scenarios and improving user experience, and is the channel for Starcoin to expand to the outside world. 

Starcoin strives to find an algorithmic credit solution, building a secure bridge between the first and second layers, so that data can flow safely, freely and conveniently between the two layers. At the same time, with the first layer as the cornerstone, a safe and fair arbitration capability is provided to the second layer to further protect the security of user data. 

![starcoin_bridge](https://tva1.sinaimg.cn/large/008i3skNly1gxk1nuctnxj30p20bcjs5.jpg)

## Move, a Smart Contract Language Born for DeFi 

In the DeFi era,  the entire industry have been plagued by endless security vulnerabilities . In order to better support the ability of the chain and create a safe and smooth ecosystem, Starcoin takes the security of smart contracts as one of its important design goals.

The smart contract language Move is a language designed specifically for financial scenarios. The designers fully summarized the experience and lessons from the real smart contract security accidents in history, and use Move as a resource-oriented programming language, which significantly improved the security of the smart contract language. 

![starcoin_resource_vs_info](https://tva1.sinaimg.cn/large/008i3skNly1gx6hmjjdvvj30my0c2t93.jpg)

## Safe Design Concept

As a general public chain platform, Starcoin has raised security to a very important level from the beginning of its design, and has made many aspects of thinking and design for the concept of security. Only by achieving a sufficient level of safety and laying a solid foundation can support a prosperous future ecology. Starcoin embraces security, makes DeFi more trustable. 

