---
title: Important Features of Move
weight: 31
---

```
* By Starcoin community 
```


## What is Move?

Move is a static typing programming language for digital assets. It originated from Libra released by Facebook in 2019 and has grown significantly on Starcoin. Starcoin is the first public chain project to use Move as a smart contract programming language. The main network was launched in mid-2021, and Move allows us to see a better era of digital assets.

![1640831288496](https://tva1.sinaimg.cn/large/008i3skNly1gy8c645qz9j30d007mmye.jpg)



## Resource-oriented Programming Language Move

When it comes to the Move, most important of its design concept is resource-oriented programming. Many people have a high opinion of this concept, and some people even commented that this is the brightest part of Libra. Move allows developers to write programs that flexibly manage and move assets, while providing security and protection against attacks on those assets. In the era of digital assets, this seems to be the basic guarantee that all platforms should give, but the truth is depressing, we have seen asset theft again and again. The Move programming language makes the smart contract language more suitable for its asset-oriented scenarios through features such as resource definition and control authority separation, static typing, generics, module system, and formal verification, to ensures the security of digital assets from the smart contract level.



## Move's Ability

The separation of resource definition and permission control not only clarifies resource attributes, but also gives users more space for manipulation. Blockchain gives us the possibility to control over the ownership of information. In the process of transforming information into resources or even assets, the problem we face is how to better define its attributes, whether it is general information that can be copied indefinitely, or whether it is the only asset that belongs to a person. The Move programming language abstracts four attributes of resources, which are: can be copied (copy), indexable (key), can dropped(drop), and can be stored (store), through different combinations of these four attributes, users can easily define any type of resource. For example, users can define a common information type through the combination of key + copy + drop + store, and define an asset type through the combination of key + store. This definition makes the problem of being copied and issuance almost non-existent. Current EVM requires developers to ensure that assets are secure from a personal decision. Through the abstraction of resource operation permissions, users can clearly define the behavior of resources that can be operated, so as to put their attention to other places that should be more concerned, thereby improving creativity.



## Static Type Move

Move uses a static type system, which is essentially a logical constraint. It's stricter than EVM. Modern programming languages such as Rust, Golang, and Typescript all adopt static type systems. The advantage of them is that many low-level programming errors can be found at compile time, rather than delayed until runtime. For developers, this undoubtedly adds some obstacles, stricter constraints require developers to think more. Web2's ultimate pursuit of efficiency has greatly increased developers' tolerance for bugs, but when we realize asset-oriented smart contracts, we will undoubtedly support this feature.



## Generic Programming

The use of generics greatly increases the flexibility of Move. We can introduce generics for data structures and function methods, so that code with the same function only needs to be implemented once to apply on multiple types. For example, if a user wants to order a safe-box, the other functions of the safe-box are basically the same except that the types of assets are different. In such a scenario, a safe-box can be easily implemented using generics in Move, and the code structure is very concise and clear. What's more worth mentioning is that, compared with the Ethereum EVM platform, the Move module system does not support circular recursive dependencies, which perfectly solves the contract vulnerability.



## Formal Verification Tools

Another great feature of the Move language is support for formal verification. Formal verification is a method based on mathematics and logic. Before the smart contract is deployed, its code and documents are formally modeled, and then the security and functional correctness of the code are strictly proved by mathematical means. It can effectively detect whether there are security and logic bugs in smart contracts. Formal verification will surely become an necessary tool for smart contract programming.



## Starcoin and Move

Starcoin uses the Move programming language to build Stdlib, and various resource-oriented applications can be easily constructed. Many features of the Move programming language ensure the security of resources. In order to facilitate the community to build a good ecosystem, Starcoin has built Stdlib. This is a tool module that integrates common modules, protocol modules, and block consensus modules. Developers can use it to easily define Token, NFT and other applications, and they can also use it for on-chain governance, which is convenient for building a stable community. It even includes a general mining module. If some incentive feature needs to be added to the project, it can be implemented very conveniently. This general module gives developers great convenience, enabling them to focus on ecology construction. The Move language brings a more secure smart contract environment to Starcoin, and Stdlib is the cornerstone of ecology development. It is foreseeable that a more complete and reliable ecology space will be built on Starcoin.

![1640831743862](https://tva1.sinaimg.cn/large/008i3skNly1gy8c6zlze8j30d006jjsc.jpg)

When Facebook released Libra in 2019, the Move language as part of it is full of hope, so in 2021, Starcoin is gradually realizing the future we expect.
