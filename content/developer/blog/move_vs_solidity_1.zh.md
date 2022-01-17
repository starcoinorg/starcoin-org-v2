---
title: Move与Solidity全方位对比
weight: 35
---

~~~
* 本文由Starcoin社区原创
~~~

## 智能合约和合约编程语言

Solidity是当前应用非常广泛的一门智能合约编程语言，尽管在直观性和安全性方面存在缺陷，但它在整个以太坊中的用途灵活性已导致社区迅速和广泛采用。
Move是一种新的编程语言，为Facebook的Diem区块链提供安全、可编程的基础。

从区块链的角度来看，智能合约是一组数字化的承诺，包括关于合约执行者履行这些承诺时达成的协议。区块链技术给我们提供了一个去中心化的、不可篡改的、高度可靠的系统，而在这个系统中智能合约有着至关重要的作用。



## Solidity和Move的显著特性

与其他智能合约语言相比，Solidity的显著特征是

- 支持多重继承以及 C3 线性化
- 提供灵活的接口抽象和动态调用能力
- 丰富的数据类型支持

然而，在带来灵活性的同时，也造成了Solidity在安全性和状态爆炸上的巨大问题。

作为全新一代的合约语言，Move以新的理念试图解决这些问题，Move的典型特点包括

- 一等公民资产
- 通过数据而不是行为进行抽象，没有接口，没有动态调用
- 对受保护的资源使用数据可见性和有限的可变性，没有继承性



## 数据结构

Solidity它是一种面向对象的高级语言，其灵感来自JavaScript、C++ 和 Python等编程语言，也因此提供了丰富的基础类型和复杂数据类型，除了基础的整形、无符号整形、字符串、 枚举、布尔和数组外，还有动态数组、Mappings的良好支持。

Move的设计和实现很大程度参考了Rust，同样有丰富的基础类型和数组。在复杂类型方面，由于在语言设计阶段就考虑到状态爆炸问题，而Mapping就是导致的根源，因此对Mapping的支持还处在早期，重点是解决分片和状态所有权的问题。同时由于社区还处在建设期，Diem官方暂未支持U256大数类型，不过Starcoin官方已经提供了U256的实现，社区项目可以直接基于Starcoin官方的stdlib构建复杂的Defi项目。



## 存储模型

Solidity Account 模型



![img](https://tva1.sinaimg.cn/large/008i3skNly1gygfcsak6aj30lq0kwmy0.jpg)

Move Account 模型



![img](https://tva1.sinaimg.cn/large/008i3skNly1gygfcszieaj30xo0jqjss.jpg)

Move是一个双层双MerkleAccumulator结构，状态数据存储在用户状态空间，不会导致状态爆炸。也正因为如此，在解决状态分片和状态所有权的问题后，才会有通用的Mapping支持。



## 可扩展性与确定性

Solidity基于接口机制，为程序的设计带来了强大的扩展性，却很难约束接口的实现。同时通过动态调用，满足不同合约间的相互调用。

Move则是基于泛型和Resource提供了另一种实现，这样的机制下，既保证了行为的确定性，也具备足够的扩展性.



## Solidity vs Move about security


![img](https://tva1.sinaimg.cn/large/008i3skNly1gygfctgxkaj31co0hiq4e.jpg)

Solidity基于接口机制和动态调用在带来强大扩展性的同时，也带来很大的安全问题，诸如无限增发、Token丢失、Delegatecall漏洞等，持续出现过大量的攻击事件和漏洞。

Move 通过省略某些特性限制了语言的表达能力，主要是动态调度和通用指针，基于Ability+Resource设计了一套资源管理特性，确保不可能在Move中复制或隐式丢弃任何资源。语言和VM层面的保障，将极大降低Move生态开发人员处理漏洞的代价和成本。
