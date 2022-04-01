---
title: How Move solves the security risks of large arrays in Solidity
weight: 5
---

```
* By Starcoin community.
```

Ethereum is the first blockchain to introduce smart contracts, which is a very important milestone in the development of blockchain. Smart contracts allow the blockchain to have better expressiveness, laying a solid foundation for the DeFi era.

Since the birth of smart contracts, there are not many smart contract languages to choose. The more common ones are Solidity, Move, ink, etc. Among them, the longest and most commonly used is Solidity. Because Solidity is the earliest smart contract language, at the beginning of the design, there is no practical experience that can be used for reference, especially valuable experience in security. Therefore, with the rapid development of the blockchain, some flaws of Solidity are gradually exposed.

Here, we analyze DoS attacks to understand the difference between Solidity and Move storage, and at the same time, discuss reasonable solutions for large arrays.

## Principles of DoS Attacks Against Large Arrays

DoS attacks are denial of service attacks. In the field of blockchain, there are various types of DoS attacks, such as DoS attacks by miners and DoS through revert. This article mainly analyzes the DoS attacks caused by arrays.

The principle of the DoS attack caused by the array is shown in the figure:

- All users who use the contract write data into the same array, which accumulates over time and becomes a large array
- In the logic of the contract, there is a case of traversing the array, especially in the key logic that traverses the array
- A single transaction has a gas limit, and the gas consumption of traversing a large array is likely to exceed the gas limit, at the end, this logic cannot be executed.

![solidity_dos](https://tva1.sinaimg.cn/large/008i3skNly1gy78c3xaz7j316s0kqdhd.jpg)

The above is the DoS attack principle of smart contracts. Here are three key points:

- Centrally store data in arrays, resulting in large arrays
- Iterate over a large array
- Gas limit for a single transaction

Among them, the gas limit is fixed, so contract developers need to pay attention to the two situations of large arrays and traversal.

## Real DoS Attack Events

There have been real DoS attacks against large arrays, such as [the GovernMental security bugs.](https://www.reddit.com/r/ethereum/comments/4ghzhv/governmentals_1100_eth_jackpot_payout_is_stuck/)

```Move
creditorAddresses = new address[](0);
creditorAmounts = new uint[](0);
```

GovernMental's contract uses two arrays to store all user data, and there are array traversal operations in the contract, which eventually cause exceeding of the gas limit.

The DistributeTokens contract in the figure below is also an example of a contract with a large array. The investorTokens variable is a uint[] that stores all user data. The distribute function distributes the tokens locked in the contract to users by traversing the investorTokens array. This is a very normal logic. However, when the investorTokens array is very large, the gas consumed by the distribute may exceed the gas limit, which will cause the distribute function to fail to execute and complete the distribution of the tokens locked by the investorTokens, which will ultimately cause the user to suffer losses.

![sol_dos_for](https://tva1.sinaimg.cn/large/008i3skNly1gy79ggin6nj31060jggng.jpg)

## Decentralized Storage in Move

Large arrays are essentially a problem of centralized data storage. Solidity data is centrally stored in a defined contract, and Move data can cross contracts and accounts, so Move data can be stored in a decentralized way. For the problem of centralized storage, Move can easily reduce such security risks and store data in each user's own account. There are many benefits of decentralized storage. In addition to avoiding large arrays of DoS attacks, even if there is a security flaw in the contract, it can also prevent all users from suffering losses together.

![starcoin_account_example](https://tva1.sinaimg.cn/large/008i3skNly1gy7a7y8zmaj30n60c9gmc.jpg)

## Avoid Bulk Operations

In the Move system, the data can be stored dispersedly as much as possible. If the storage cannot be dispersed, the following solutions can easily avoid large arrays:

- Avoid bulk operations and let each user trigger the operation on their own initiative
- On-chain + off-chain
- Other schemes, such as generics, linked lists, etc.

![move_dos](https://tva1.sinaimg.cn/large/e6c9d24ely1gzm1wg9larj20sa0g0754.jpg)

The distribute function of the DistributeTokens contract above is a typical bulk operation. In this case, a very reasonable optimization solution is to let each user initiate a transaction and take the initiative to take out the locked Token, thereby avoiding the bulk operation of traversing the array.

## On-chain and Off-chain Combination

For arrays, another simple solution to avoid the gas limit is to combine on-chain and off-chain, and operate in segments.

The data on the chain is deterministic. Therefore, the data on the chain can be processed in various ways. The typical ways are:

- Subscribing to on-chain events off-chain and mapping on-chain data to off-chain
- Off-chain analyzes on-chain data and extracts array lists

![onchain_offchain](https://tva1.sinaimg.cn/large/008i3skNly1gy7b97xfjij31640fwgmr.jpg)

With data that is consistent on the chain, the off-chain data is segmented and processed on the chain by passing parameters to avoid the limitation of Gas.

In the Move contract, there are some ways to avoid the security risks of big data, such as avoiding the use of arrays through generics.

![move_generic](https://tva1.sinaimg.cn/large/008i3skNly1gy7c367bmhj316a0gq40a.jpg)

## Safer Move

For the security risks of big data, compared to Solidity, Move has more solutions. The essential difference is:

Move data can be stored in different accounts across contracts and accounts.

In fact, Move also has many security features designed for financial scenarios, making contracts more secure, thus better ensuring the security of users' digital assets
