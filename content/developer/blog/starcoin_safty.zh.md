---
title: Starcoin注重安全的设计理念
weight: 21
---

~~~
* 本文由Starcoin社区原创
~~~

Starcoin的愿景是新一代分层的智能合约与分布式金融网络。简而言之，Starcoin提供了一个了通用的平台，允许开发人员利用Move安全地构建自己的应用，并提供一个可互操作的网络，将各种不同的应用链接起来，形成一整套完整的生态。再通过二层将链上数据与现实场景打通，提升用户体验，触达真实的用户，最终让用户感受到区块链的便捷，享受到区块链带来的红利。

本文将聚焦在Starcoin的安全属性上，这是Starcoin重点设计的一个方面，通过在不同层面上的安全设计，让用户能够轻松玩转Starcoin与DeFi。我们先介绍Starcoin的安全性。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gx6f5948owj31em0ncdht.jpg" alt="starcoin_safety" style="zoom:25%;" />



## 增强的Starcoin共识

了解区块链的都知道，Bitcoin一个非常大的亮点就是通过算法的方式，保障了人与人之间的基本信任。这就是我们所说的PoW共识，可以理解为是一种算法信用体系，是Bitcoin的基石。Starcoin也对比其他PoS等中心化或者半中心化的共识方案，坚定地选择了PoW，保障Starcoin网络在去中心化的情况下是安全的。同时，为了解决中本聪共识算法的一些局限性，进一步加固一层的安全性，Starcoin对共识进行了一些非常有意思的优化。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gx67mdtql5j30uz0buwfm.jpg" alt="starcoin_consensus" style="zoom:33%;" />

Starcoin 共识是一种中本聪共识的增强版本。为了加快出块速度和降低交易确认时间，引入了叔块率等运行期数据，能够较低延时地探测出网络拥塞状况，自动地对出块时间、难度、出块奖励进行动态调整，从而最大限度地利用网络，尽量避免网络带来的不确定性风险，同时，减少用户等待时间，提升用户体验。当全网算力发生大的波动时，难度值能够快速做出反应，起到保护Starcoin网络的作用。



## 链上治理为升级护航

合约即法律，合约自由升级，一直是区块链领域争议比较多的问题。一方面遇到问题必须升级合约，另一方面在没有信任的情况下随便升级合约反而可能产生问题。

Starcoin力图从这种”能“与”不能“的困境中，探索一条新的路径，通过链上治理，社区投票的方式，来监督性地升级合约。既解决了遇到问题必须升级的极端情况，也增加了透明性和安全性。在受社区用户监督的情况下，合理地升级合约，更好地保障用户的利益不受损失。



## 可验证的双MerkleAccumulator

MerkleAccumulator，是Starcoin一个非常核心的数据结构，用于提供区块和交易的证明，保障主链上的区块和交易随时随地都可以进行校验，让数据可以安全地使用。

MerkleAccumulator的特点是叶子节点可以从左到右不断增累加，然后构建成一个树形的MerkleAccumulator，最后将Root节点的哈希保存到区块中。使用MerkleAccumulator的好处是可以非常轻松地证明一个区块或者交易是否在链上，例如，图中叶子节点B的Proof是CAD。Starcoin巧妙地设计了两个MerkleAccumulator，分别为区块和交易提供证明，对应BlockHeader的block_accumulator_root和txn_accumulator_root，这就是Starcoin的“双MerkleAccumulator”。

![starcoin_merkle_accumulator_proof](https://tva1.sinaimg.cn/large/008i3skNly1gx6fqycrz0j30br06smx9.jpg)



## 构建安全的二层基石

Starcoin生态不仅有一层，也设计了二层。一层专注链本身的能力，二层作为生态重要的一环，承载着链接真实的生活场景，以及提升用户体验的重要作用，是Starcoin对外扩展的通道。

Starcoin着力寻找一种算法信用的方案，在一层和二层之间搭建一座安全的桥梁，让数据能够在两层之间安全、自由、便捷地流通。同时，以一层为基石，给二层提供一种安全、公正的仲裁能力，来进一步保障用户数据的安全。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxk1nuctnxj30p20bcjs5.jpg" alt="starcoin_bridge" style="zoom:45%;" />



## 为DeFi而生的智能合约语言Move

在DeFi时代，层出不穷的安全漏洞一直困扰着整个行业。为了更好地支撑链的能力，打造安全流畅的生态环境，Starcoin 将智能合约的安全作为重要设计目标之一。

智能合约语言Move是专为金融场景设计的一门语言。设计者们从历史上真实的智能合约安全事故中充分总结经验和教训，将Move设计成面向资源编程的语言，极大的提升了智能合约语言的安全性。

1. 自底向上的静态类型系统；
2. 资源不可复制或者隐式丢弃；
3. 资源按用户存储，重新定义链、合约、用户三方的数据操作权限；
4. 引入形式化验证技术，通过数学原理来证明合约的安全性；

Move有非常多的优点，因此Starcoin选择Move作为智能合约语言。Move的这些安全特性，能够解放开发者，让开发者无需过多地关注安全的情况下，最大限度地减少安全问题，让DeFi更安全。关于Move如何解决常见的安全漏洞，我们以后找机会逐个聊。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gx6hmjjdvvj30my0c2t93.jpg" alt="starcoin_resource_vs_info" style="zoom:50%;" />



## 安全的设计理念

作为一个通用的公链平台，Starcoin从设计之初，就把安全提到一个非常重要的高度，并且针对安全的理念做了很多方面的思考和设计。只有把安全做到了足够的高度，把基础打牢固，才能支撑起一片欣欣向荣的未来生态。

Starcoin拥抱安全，让DeFi更放心，让财富自由地畅想。