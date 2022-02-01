---
title: Ten Highlights of Starcoin
weight: 28
---

~~~
* By Starcoin community
~~~

On May 18, 2021, Starcoin held a Starcoin main network launch event, inviting a group of crypto industry leaders, builders and innovators to witness the birth of the Starcoin main network. Just a few months after the launch of the Starcoin main network, it has attracted lots of attention in the industry and accumulated a number of loyal fans. Compared with other public chains, what advantages does Starcoin have? This article counts the ten highlights and innovative designs of Starcoin. 



## Enhanced PoW

The Starcoin consensus is an enhanced version of the Satoshi Nakamoto consensus. In Bitcoin's Satoshi Nakamoto consensus, there are two methods to increase network throughput,increase the block size or shorten the block interval. All both methods will increase probability of Uncle or Orphan blocks in the network,increasing Uncle or Orphan block will increase congestion of the network,then reducing the difficulty of double-spending attacks,thereby threatening the security of the network. To solve this problem, balance the network throughput and congestion,maximize the usage of  network,Starcoin's consensus has been optimized and enhanced based on Bitcoin's consensus:

- The Starcoin consensus introduces run-time data such as Uncle block rate to detect network congestion, and then automatically and dynamically adjust block generation time, difficulty, and block rewards, find a balance between throughput and network congestion, and reduce network security risks To improve user experience;
- The Starcoin consensus can more sensitively capture the fluctuations of computing power, adjust the difficulty in time, and reduce the risk of computing power attacks;
- Consensus-related parameters can be safely upgraded through community governance; 



## Bootstrapped Economic Model 

STC is the native Token of the Starcoin network, with a total issuance of 3,185,136,000 STC, with a constant total amount and was locked in the Treasury module. One part of amount is used to reward honest nodes who guard the security of the Starcoin network, and the other part enters the chain ecology through the linear release of withdrawal rights. By stimulating the ecology on the chain, the overall application will flourish. With the prosperous ecological application on the chain and the basic ecological benefits on the chain, the circulating STC is finally returned to the Treasury module in some ways. 

![starcoin_economy](http://westar.io/blog/starcoin_features/images/starcoin_economy.jpg)

## Clear Ownership

Public chains which use Solidity as the smart contract language, taking ERC20 as an example,although the wallet shows that a certain ERC20 belongs to a specific account,but this data does not exists in the account. Where are these data? These data are uniformly stored in the account implemented by the ERC20 contract, and are marked and separated by Address through a data structure similar to Map. This method of centralized storage of data, on the one hand, the ownership of the data is not owned by the corresponding account, on the other hand, there are security risks.

![starcoin_account](http://westar.io/blog/starcoin_features/images/starcoin_account_example.jpg)



## State Billing

State explosion is a problem faced by many public chains. Lots of data is written to the chain. Even these data no longer has any value or meaning, it must be stored for a long time and be synchronized by other nodes. This is actually a waste of resources. In the long run, a distributed system that only increases without decreasing data will be difficult to maintain continuously. This is a problem to be faced sooner or later.

At the beginning of the Starcoin design, Starcoin focused on the problem of state explosion, through this smart design, it has made long-term preparations for state billing and gradually eliminated valuable data. Eliminating non-value data and providing value space for more value data is a benign development law. 



## Linear logic smart contract language: Move 

In the era of DeFi,security issues occur frequently,such as DAO vulnerability, Parity wallet vulnerability, PolyNetwork vulnerability, etc., which cost hundreds of millions of dollars each year. There are many reasons to cause these vulnerabilities, but most of the common vulnerabilities are just ignored during developing and designing, such as overflow problems. On the one hand, no one can completely guarantee that there will be no flaws. On the other hand, security is a very professional subdivision of the computer industry. There are usually professional practitioners, and smart contract developer is usually not the same practitioners. In fact, this is a higher security requirement for smart contract developers, which raises the development threshold in disguise.

Starcoin expects to choose a more secure language as its smart contract language to solve most of the common vulnerabilities on the language level, such as overflow vulnerabilities, lower the threshold for developers, lower the security risks of smart contracts, and thereby reduce the occurrence of vulnerabilities. With this original intention, Starcoin finally chose Move as the smart contract language.

Move is a linear logic smart contract language, resource-oriented programming, with very good security features. Smart contract developers can also easily write contracts that meet certain security requirements while only focusing on business logic, which can minimize security risks such as overflow and unlimited issuance.

![starcoin_resource_vs_info](http://westar.io/blog/starcoin_features/images/starcoin_resource_vs_info.jpg)

## Formal Verification 

Formal verification is a relatively cutting-edge technology that uses mathematical methods to prove the security of the program. The public chain led such as Ethereum has been exploring ways to improve the security of smart contracts through formal verification. It has been exploring for many years and has not found a solution that can be implemented.

On the basis of resource-oriented programming and improving security, Move has supported a set of mature formal verification tools. Users only need to write SPEC to provide proof of program security through mathematical methods, can easily avoid security hazards due to negligence. 

![starcoin_move_spec](http://westar.io/blog/starcoin_features/images/starcoin_move_spec.jpg)



## Stdlib

Starcoin has a very interesting feature that other public chains do not have: Stdlib.

Starcoin uses Stdlib to officially customize and publish some general contracts, which is convenient for other users to use. Starcoin mainly publishes two types of contracts:

- Basic contracts, such as floating-point number operation contracts;
- Customize general protocols, such as Token protocol, NFT protocol, Oracle protocol, etc.;

Starcoin's Stdlib is an implemented contract. Because the official implementation has been provided, based on the basic protocol of Stdlib, users can easily design their own applications, such as NFT applications or Oracle applications, without having to implement them according to the protocol, but only need to implement the business logic contract code. 



## On-chain Governance: DAO

Starcoin has customized a set of very general on-chain governance DAO contracts in Stdlib, which can be used directly. Anyone can easily use it, and any contract-level decision can be done in the form of on-chain governance. At the same time, anyone in the community can participate in the governance of the community by voting or against.

This is a general-purpose DAO that supports any type of Token voting. Voting has a valid time. Voting is valid only after the number of votes reaches the threshold of 4% of the Token circulation within the specified time. If there are more votes for yes than no votes, the vote is passed, otherwise, if there are more votes for no, then the vote is not passed. 

![starcoin_dao](http://westar.io/blog/starcoin_features/images/starcoin_dao.jpg)



## Safe Smart Contract Upgrade Plan 

Starcoin embrace law as code. In some very special circumstances, Starcoin also hopes to have a safe upgrade of smart contracts.

The Starcoin contract uses the Module name to mark uniqueness, and the Ethereum contract uses HashCode to mark uniqueness. Therefore, Starcoin's smart contracts can be upgraded while ensuring compatibility. Then, through the combination with the on-chain governance DAO, the upgrade of the contract is voted, and the purpose of safely upgrading the smart contract is achieved under the supervision of all community members. Starcoin's Stdlib uses this method to safely upgrade. 

![starcoin_upgrade](http://westar.io/blog/starcoin_features/images/starcoin_upgrade.jpg)



## Scalable Layer2 

Starcoin is a layered smart contract and DeFi network, which means that Starcoin not only has layer1 of network, but also designs and implements its own layer2. The 2-layer of Starcoin is committed to connecting everyone securely, infiltrating blockchain technology into daily life scenarios, and allowing users to enjoy the benefits and convenience of blockchain.

The 2-layer of Starcoin will be a general solution. By looking for a safe algorithm, let the laye1 and layer2 be more natively combined, so that data can travel safely, arbitrarily and conveniently between the two layers.



## More Features of Starcoin

In addition to the ten highlights mentioned above, Starcoin has many interesting features, such as first-class citizen Resource, dual Merkle Accumulator, two-layer state tree, two-stage submission, natural NFT type, more secure Token, Oracle protocol, and convenient contract Accounts, etc., slowly replenish them when you have time.





