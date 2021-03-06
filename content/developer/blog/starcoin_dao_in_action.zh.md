---
title: Starcoin投票背后的治理良方——链上治理DAO
weight: 34
---

```
* 本文由Starcoin社区原创
```

## Starcoin 公链

  Starcoin 是新一代的区块链公链基础设施，使用面向数字资产的智能合约编程语言Move， 有着独特的去中心化链上治理体系，从基础层、共识层、协议层、扩展层、应用层等多层面保障其安全性，全力保障主链和数字资产的安全。



## 链下治理与链上治理

  传统公链如比特币、以太坊等都通过链下治理的方式，经过了多年的验证证明了治理方式的有效性，但仍然暴露出一些问题，如社区意见不合造成硬叉、升级不及时造成硬叉等。

  Starcoin总结链下治理的缺点，结合区块链技术，发展出了独特的链上治理模式，改进了提案、投票、升级等方式，有着社区参与度高、共识强、升级安全等特点。



### 传统的链下治理

  对于区块链社区来说，做出改变区块链特性的决策过程可以称之为治理。通过合理的治理可以使区块链系统长期稳定的发展下去。但传统方式属于链下治理，一般流程为提出提案后社区内讨论完成后，通过开发者发布新的版本，最后由矿工对节点进行升级，在大多数时间里，这种治理模式运行较为正常，但是如果在社区内部存在分歧，导致矿工运行节点版本不同时，很可能产生硬分叉等问题。

  由此许多社区也在寻找不同的方式治理，如比特币治理提出了通过矿工运行节点的状态来判断同意升级的占比，可以通过运行矿工节点时所打包的交易中的几个数据位来判断是否同意升级。

这些方式都属于链下治理，是传统开源社区较为常用的治理模式。

通过观察比特币与以太坊的几次重大分歧，可以总结出社区治理中面临的两个困境：

1. 没有一个明确的指标来判断哪一种主张在社区中达成了多数的共识
2. 链下协商的协议在链上没有约束力 这些问题在链下很难真正解决，所以不如换一个思路，通过链上进行治理。



### Starcoin 的链上治理

  对于链上或链下治理来说，都存在着提案、投票、升级的过程，首先社区内的开发者和矿工可以评估提案的可行性、开发以及升级节点，提案后，随后由社区成员决定是否激活新特性以及何时激活，最后根据投票结果来确定升级情况。
  根据两种治理方式的共性、区块链的特性以及链的稳定，Starcoin提出了治理机制的设计原则:『技术创造可能，社区决定取舍』

  在开发以及升级阶段，开发者和矿工应该对提案保持技术中立态度，等升级完成，需要投票的阶段，再作为社区成员一起来行使价值观选择权，决定取舍。

Starcoin 的链上治理分为4个流程：

1. 提案者发起提案，当前发起提案没有准入限制，任何系统参与者都可以发起提案
2. 经过公示后，投票者进行投票，当前的投票机制是 Token 质押投票，票数与质押的 Token 数量成正比
3. 投票期过后，任何系统参与者都可以调用，决策合约进行提案决策
4. 决策通过后的提案，再次经过公示后，可由任意系统参与者提交执行

同时Starcoin对于链上治理也有几个重要的设计考量

- 治理制度可治理
    由于治理的复杂性，不可能从刚开始就建设出完美的治理制度，所以可以治理的治理制度也十分重要。
    Starcoin上的治理制度同样也存储于链上，可以通过链上治理的方式对治理制度进行去中心化改善，可以与时俱进不断更新。
- 治理制度可复用
    Starcon的链上治理内置在Starcoin的标准合约库中，在治理过程中不仅仅可以使用Starcoin原生的代币，整套治理系统也可以使用在不同的协议中，仅需将代币协议接入至Starcoin的治理合约即可。
    这可以使治理制度简单的复用至其他协议中，对协议进行可持续的升级与发展。



## 治理制度带来的优势

  区块链生态的发展速度较快，对于升级与改进的需求比较多，需要治理的地方也就越多，Starcoin的治理机制是将链本身的治理和合约协议的治理统一在一起，使得Starcoin能够服务更广泛的应用，并不断的自我演进，成为更加成熟、更具有价值的公链。

