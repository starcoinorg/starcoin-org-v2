---
title: Move and Solidity Full Range Features Comparison 
weight: 35
---

~~~
* By Starcoin community
~~~



## Smart Contract and Contract Programming Language

Solidity is currently widely used smart contract programming language, and despite its shortcomings in intuitiveness and security, its flexibility of use throughout Ethereum has led to rapid and widespread adoption by the community. Move is a new programming language that provides a secure, programmable foundation for Facebook's Diem blockchain.

From a blockchain perspective, a smart contract is a set of digital promises, including agreements how executor of the contract fulfilled  those promises. Blockchain technology provides us with a decentralized, immutable, and highly reliable system, in which smart contracts play a vital role.

## Significant Features of Solidity and Move

The distinguishing features of Solidity compared to other smart contract languages are:

- Support for multiple inheritance and C3 linearization     

- Provide flexible interface abstraction and dynamic calling capability     

- Rich data type support

However, while bringing flexibility, it also makes huge problems with Solidity in terms of security and state explosion.

As a new generation of contract language, Move tries to solve these problems with new design ideas. The typical features of Move include:

- First-class citizen assets     
- Abstraction through data instead of behavior, no interfaces, no dynamic calls     
- Use data visibility and limited mutability to protected resources, no inheritance

## Data Structure

Solidity is an object-oriented high-level language inspired by programming languages such as JavaScript, C++ and Python, and therefore provides a large number of basic types and complex data types, in addition to basic integers, unsigned integers, strings, enumerations , booleans and arrays, can also support for dynamic arrays, Mappings.

The design and implementation of Move is largely refer to Rust, and it also has a lot of basic types and arrays. In terms of complex types, since the state explosion problem was considered in the language design stage, and Mapping is the underlying cause of this problem, the support for Mapping is still in the early stage, and the important point is solving the problems of fragments and state ownership. At the same time, because the community is still in the building period, Diem officially does not support the U256 large number type, but Starcoin official has provided the implementation of U256, and community projects can build complex Defi projects directly based on Starcoin's official stdlib. 

## Storage Model 

Solidity Account Model 

![img](https://tva1.sinaimg.cn/large/008i3skNly1gygfcsak6aj30lq0kwmy0.jpg)

Move Account Model

![img](https://tva1.sinaimg.cn/large/008i3skNly1gygfcszieaj30xo0jqjss.jpg)

Move is a double-layer and double MerkleAccumulator structure, the state data is stored in the user state space, and will not cause state explosion. Because of this, after solving the problems of state fragments and ownership, there will be general Mapping support.

## Extensibility and Deterministic

Solidity is based on the interface mechanism, which brings powerful extensibility to the design of the program, but it is difficult to constrain the implementation of the interface. At the same time, through dynamic call to implement interaction between different contracts.

Move provides another implementation based on generics and Resource. Under such a mechanism, it not only ensures the certainty of behavior, but also has sufficient extensibility. 

## Security: Move and Solidity

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyl4xttw7ej314s0ewwfs.jpg" alt="image-20220121113143405" style="zoom:50%;" />

Solidity based on the interface mechanism and dynamic call not only brings strong extensibility , but also brings large security problems, such as unlimited additional issuance, Token loss, Delegatecall vulnerability, etc., and there have been a large number of attack events and vulnerabilities.

Move limits the expressiveness of the language by getting rid of some features, mainly dynamic call and general-purpose pointers. To design a set of resource management features based on Ability+Resource, to ensure that it is impossible to copy or implicitly drop any resources in Move. The guarantees at the language and VM levels will greatly reduce the cost and cost for the Move ecosystem developers to deal with vulnerabilities. 

