---
title: The Governance Method Behind Starcoin Voting-On-Chain Governance DAO 
weight: 34
---

```
* By Starcoin community
```

## Starcoin Block Chain

Starcoin is a new generation public chain infrastructure. It uses Move, a smart contract programming language for digital assets, and has a unique decentralized on-chain governance system, from the basic layer, consensus layer, protocol layer, extension layer, application layer, it ensures its security at multiple levels, and fully guarantees the security of the main chain and digital assets. 



## Off-chain and On-chain Governance

Traditional public chains such as Bitcoin and Ethereum have adopted off-chain governance methods. After years of verification, the effectiveness of the governance methods has been proven, but some problems are still exposed, such as hard forks caused by disagreement in the community and late upgrades.  

Starcoin summarizes the shortcomings of off-chain governance, and combines blockchain technology to develop a unique on-chain governance model that improves proposals, voting, and upgrades. It has the characteristics of high community participation, strong consensus, and upgrade security. 



## Traditional Off-chain Governance

For the blockchain community, the process of making decisions to change the characteristics of the blockchain can be called governance. Through reasonable governance, the blockchain system can grow stably for a long time. However, the traditional method belongs to off-chain governance. The general process is to release a new version through the developer after the discussion in the community is completed and the proposal is proposed, and finally the miner upgrades the node. In most of the time, this governance model operates normally. However, if there are differences within the community, resulting in different versions nodes running by miners, this will cause problems such as hard forks.

Due to these problems, many communities are also looking for different ways of governance. For example, Bitcoin governance proposes to determine the proportion of consent to upgrade by the status of miners running nodes, which can be determined whether or not to upgrade by several data bits in the transactions packaged when running miner nodes. 

These methods belong to off-chain governance, which are more commonly used governance modes in traditional open source communities.

By observing several significant divergences between Bitcoin and Ethereum, two dilemmas faced in community governance can be summarized:

- There is no clear indicator of which proposition has a majority consensus in the community.
- The agreements negotiated off-chain do not have constraints on the chain. These problems are difficult to solve off-chain, so it is better to change the way of thinking and conduct governance on the chain. 



## Starcoin's On-chain Governance

For on-chain or off-chain governance, there is a process of proposal, voting, and upgrade. First, developers and miners in the community can evaluate the practicability of the proposal, then develop and upgrade nodes. After the proposal, the community members decide whether to activate new features and when to activate them, and finally determine the upgrade status based on the voting results. According to the commonality of the two governance methods, the characteristics of the blockchain and the stability of the chain, Starcoin proposes the design principle of the governance mechanism: "Technology creates possibilities, and the community decides to choose".

During the development and upgrade stages, developers and miners should maintain a technology-neutral attitude towards proposals. After the upgrade is completed and voting is required, they can exercise their right to choose values as community members and decide whether to choose or not.

Starcoin's on-chain governance is divided into 4 processes:

1. The proposer initiates a proposal. Currently, there is no admission restriction for initiating a proposal. Any system participant can initiate a proposal.    
2. After the announcement, voters cast their votes. The current voting mechanism is Token pledge voting, and the number of votes is proportional to the number of pledged Tokens.    
3. After the voting, any system participant can call the decision-making contract to make a proposal decision    
4. After the decision is passed, the proposal can be submitted and executed by any system participant after being publicized again.

At the same time, Starcoin also has several important design considerations for on-chain governance.

-  Governance system can be governed. Due to the complexity of governance, it is impossible to build a perfect governance system from the beginning, so a governance system that can be governed is also very important. The governance system on Starcoin is also stored on the chain, and the governance system can be improved in a decentralized manner through on-chain governance, and can be continuously updated any time.
- The governance system is reusable. Starcon's on-chain governance is built-in Starcoin's standard contract library. Not only the native tokens of Starcoin can be used in the governance process, but the entire governance system can also be used in different protocols. The protocol can be connected to Starcoin's governance contract. This allows the governance system to be easily reused in other protocols, enabling sustainable upgrade and development of the protocol 



## Advantages of the Governance System 

The development of the blockchain ecosystem is fast, and there are more needs for upgrades and improvements, and more places need to be governed. Starcoin's governance mechanism is to unify the governance of the chain itself and the governance of contract agreements, so that Starcoin can serve a wider range of applications, and continues to self-evolution to become a more mature and valuable public chain.
