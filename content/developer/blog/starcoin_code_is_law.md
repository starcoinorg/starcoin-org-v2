---
title: Starcoin Embrace The Code is Law Principle
weight: 12
---

## Starcoin Embrace The Code is Law Principle

~~~
* By Starcoin community
~~~



## Does the Code is Law principle mean smart contracts cannot be upgraded?

The Code is Law is esteemed by us, but, does it mean we cannot upgrade smart contracts?

Let's have a look at the state of current smart contract.

Over the past two yeras, DeFi is booming now, there is no doubt this is inseparable from smart contract. However, due to the rapid development of DeFi, we have been plagued by endless security issues, such as TheDAO hack,PolyNetwork hack,etc., to a large content, this limits the development of whole industries. It's obvious these security vulnerabilities are caused by many factors,even in centralized systems, no one cannot guarantee that there are no bugs in contracts,not to mention the decentralized systems.For various concerns, Ethereum sorted out smart contracts upgrade plans finally,we will do some analysis late.

Next we will analyze contracts upgrade plans from perspective of law.

In fact,laws of various countries are not static,with continuous change of the era,new things appear, new perception has been generally accepted, and the old things should be washed away.To meet the requriments of our era, so the law should be improved continously and will be supported by the society. Without a doubt, the law should not be changed rapidly, within certain constraints,following certain regulations and reaching a general consensus, the law can be further improved.

Code is law, if the human law can be improved within certain contraints, does this mean smart constracts can be upgraded under some restricts? The answer is YES. The key of "code is law" isn't that smart contract cannot be upgraded,the key is the limitiation when the smart contracts need to be upgraded.



## Upgrading Starcon's smart contract

Starcon comply with code is law.  Regarding contract upgrades, Starcoin has done lots of exploration.

First, Starcoin's account's model is designed to support contract upgrades.

Then,there are many built-in contract upgrades strategy(It also includes a strategy to prohibit upgrades),users have many options.

Finally, the library Stdlin includes complete DAO on-chain governance functions. Combine with upgrades startegey can constraint on smart contract on Starcoin.

Starcoin has flexible contracts upgrades, and users have their own right to choose proper one. Next,let's look deeply what Starcoin has done to implement smart contract upgrades.



## More advanced account model

There are singinficant difference in account between Starcoin and Ethereum, even account model is used in Starcoin and Ethereum,Starcoin's account is more advanced than Ethereum's account.

1. Starcoin only have one kind of accont, there are two different types of account: externally owned account and contracts account.
2. Starcoin's data is stored in distributed sever,there's clearly ownership.
3. There are two different areas in an account: data and code.
4. Starcoin's contracts support upgrades, but in Ethereum,after deployment,contracts cannot be upgraded.

There are many difference between Starcoin and Ethereum,we will focus on the data storage.

 ![eth vs starcoin](https://tva1.sinaimg.cn/large/008i3skNgy1gupbkpeqzsj60rk0bsq3d02.jpg)

1. Data storage and query in Ethereum

   Ethereum's contract code will calculate hash of the code, then use the hash(code_hash in the left part of above figure) as the unique index,and map the hash to real contract code. So the hash will be used to find  code when loading contract code.

2. Data storage and query in Starcoin

   There is a data structure named Moduled,address and identifier(module's name) are stored in Moduled,then perform hash calculation on Moduled to get the hash of Moduled(Moduled hash in the right part of above figure), and use the hash value as unique index, map the hash value to real contract code,so the Moulded hash will be used to find code when loading contract code.		

The above is about data storage, next, let's pay close attention on contracts upgrades.

1. Ethereum

   The code_hash will be changed if contract was upgraded,the old code_hash cannot be mapped to upgraded code, this means that contract cannot be upgraded after deployment, this is why Ethereum society will take Proxy plan,deploy one new contract, to get results like upgrades,but does not do real upgrades on the old contract.

1. Starcoin

   As long as the Moduleld remains unchanged(address and identifier remain unchanged), then the Moduleld has will not change,so this means contract code can be upgraded.

The difference in code storage will eventually lead to different contract upgrade schemes. Starcoin has better contract upgrade features.



## Ethereum's Proxy contract upgrades plan

We have introduced how Ethereum stores data,Let's have a look at the principle of Ethereum's proxy contracts upgrade plan.

Developer of the smart contract need to deploy proxy contract  with an interface where each method delegates to the real contract,  function of the proxy contract  is simliar to code_hash in real contract, before upgrading old contract, there are two steps:

1. Deploy a new contract(Latest real contract in the below figure);
2. Upddate data in proxy contract (this can be understood as setting old code_hash to new contract's code_hash), please read red rectangle in the below figure

![2](https://tva1.sinaimg.cn/large/008i3skNly1gvj81n8tcmj60ws0bcmxl02.jpg)

Essentially,in Ethereum, we cannot upgrade contract, we need to deploy new contract,to implement contract upgrades.



## Starcoin's two-phase update

Unlike Ethereum's proxy contract upgrades plan, you can upgrade the original contract.To uupgrade contract, Starcoin support multiple upgrade stretagies, and leave the choice to user:

1. STRATEGY_ARBITRARY: Contracts can be upgraded anytime
2. STRATEGY_TWO_PHASE: Contracts can be upgraded in two phase
3. STRATEGY_NEW_MODULE: You can creat new Module, but cannot modify old Module
4. STRATEGY_FREEZE: Contracts are freezed, you cannot upgrade the contracts.

There are a few things that need to be explained: 

1. Starcoin's contract upgrade stretagy is account-level, this means the stretagy will be applied to all accounts which belong to this account.
2. From STRATEGY_ARBITRARY to STRATEGY_FREEZE,the limitation of stretagy is getting more strict.The STRATEGY_ARBITRARY has lowest limitation, and STRATEGY_FREEZE has highest limitation. From low to high is allowed when you set the stretagy, but from high to low, is prohibited.
3. Default stretagy of contract is STRATEGY_ARBITRARY.

The STRATEGY_TWO_PHASE is a very interesting strategy in Starcoin's upgrade protocol. Next we will focus on this strategy, as shown in the below figure. 

![two phase](https://tva1.sinaimg.cn/large/008i3skNgy1gupblxtzp5j60py0ikaaj02.jpg)

There are two procedures in the STRATEGY_TWO_PHASE stretagy.

1. Submit transaction of upgrade plan(upgrade plan txn in above figure)
2. After waiting a certain amount blocks,submit transaction of contract upgrade(code ten in above figure), after the transaction is accepted, the new contract code will overwrite the old contract code.

 There are two steps in this stretagy, so is called STRATEGY_TWO_PHASE. In this stretagy, the waiting blocks can be considered as that the contract need to be publicized. The way of contract upgrade in STRATEGY_TWO_PHASE is a common method in community governance: publicize roadmap, decide update date, then use the new version to replace the old contract.



## DAO and TwoPhaseUpgrade

Contracts should be upgradable within some contraints as we have mentioned about code is law. And upgradable contract represents most of people's willing. There are four different stretagies in Starcoin, user can choose anyone suits them. How dose Starcoin restrain the owner of contracts?The answer is DAO.

Starcoin has complete on-chain governance DAO:

1. Submit upgrade proposal,and enter PENDING state;
2. Waiting some time, commuity need this time to consider the proposal, enter Active state.
3. From Proposal to Active,we have to wait again, during this time,commuity need to vote about this proposal;
4. When the vote reaches the threshold, from Proposal to AGREED; 
5. The proposal passed vote now in queue,enter QUEUE state;
6. The final state is Publicity state, enter EXECUTABLE state after Publicity is finished.

Starcoin choose the vote way to implement on-chain governance,to reach a general consensus.After the vote is passed, it will enter the final contract upgrade stage. Starcoin encourages users to trust the contract to DAO for management. 

Starcoin's DAO and TwoPhaseUpgrade perfectly illustrate a fair and open community governance process. Starcoin's Stdlib also uses DAO+TwoPhaseUpgrade for governance. The entire Stdlib upgrade process is shown in the figure below. Here you can see how Starcoin upgrades Stdlib.

![starcoin stdlib upgrade](https://tva1.sinaimg.cn/large/008i3skNgy1gupbnleomtj60mc0tyjt802.jpg)



## Conclusion

Starcoin has designed a more advanced account model, supports a variety of contract upgrade strategies, and leave choice to users. At the same time, Starcoin also provides a very complete DAO on-chain governance, respecting the consensus of the community. Through the combination of DAO and contract upgrade, the contract upgrade is constrained, which not only ensures that the contract can be upgraded, but also guarantees that the contract cannot be upgraded casually, which perfectly solves the problem of "code is law".  Starcoin can perfectly implements "code is law".

