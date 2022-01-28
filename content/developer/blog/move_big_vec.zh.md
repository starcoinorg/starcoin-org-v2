---
title: Move是如何解决Solidity大数组的安全隐患
weight: 3
---

~~~
* 本文由Starcoin社区原创
~~~

Ethereum开创性地引入了智能合约，在区块链的发展历程上，是一个非常重要的里程碑。智能合约让区块链有更好的表达能力，为DeFi时代奠定了坚实的基础。

从智能合约诞生至今，可选择的智能合约语言不多，比较常见的有Solidity、Move、ink等等。其中，时间最长、最常用的要数Solidity。因为Solidity是最早的智能合约语言，所以在设计之初，并没有可以借鉴的实践经验，尤其是安全方面的宝贵经验。所以，随着区块链的高速发展，Solidity的一些缺陷也逐渐暴露出来。

这里，我们分析历史上真实发生的智能合约DoS攻击事件，来了解一下Solidity和Move存储方面的不同，同时，探讨一下针对大数组的合理解决方案。



## 针对大数组的DoS攻击原理

DoS攻击是拒绝服务攻击。区块链领域，有多种形式的DoS攻击，例如矿工的DoS攻击、通过revert发动DoS。本文主要是分析针对数组引发的DoS攻击。

数组引发的DoS攻击原理，如图所示：

* 使用合约的所有用户往同一个数组中写数据，日积月累，成了大数组
* 在合约的逻辑中，存在遍历数组的情况，尤其是在关键逻辑中遍历了数组
* 单个交易有gas限制，大数组的遍历耗费的gas很可能超过gas limit，最终导致逻辑没法往下执行

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gy78c3xaz7j316s0kqdhd.jpg" alt="solidity_dos" style="zoom:33%;" />

以上是智能合约的DoS攻击原理，这里有3个关键的点：

* 用数组集中存储数据，导致大数组
* 遍历大数组
* 单个交易的gas limit

其中，gas limit是固定的，所以，合约开发者需要注意大数组和遍历这两种情况。



## 真实的DoS攻击事件

现实中发生过真实的针对大数组的DoS攻击，例如[GovernMental的安全漏洞](https://www.reddit.com/r/ethereum/comments/4ghzhv/governmentals_1100_eth_jackpot_payout_is_stuck/)。

~~~
creditorAddresses = new address[](0);
creditorAmounts = new uint[](0);
~~~

GovernMental的合约中用了2个数组存储所有用户数据，同时在合约中存在数组遍历操作，最终导致操作超过gas limit。

下图DistributeTokens合约也是大数组的一个合约例子。investorTokens变量是一个uint[]，存放了所有用户的数据。distribute函数通过遍历investorTokens数组，将合约中锁定的token分发给用户。这本来是一个很正常的逻辑。但是当investorTokens数组非常大，distribute消耗的gas可能超过gas limit，这就会导致distribute函数不能执行完成，导致investorTokens锁定的token不能分发成功，最终让用户遭受损失。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gy79ggin6nj31060jggng.jpg" alt="sol_dos_for" style="zoom:33%;" />



## 分散存储的Move

大数组本质上是数据集中存储的问题，Solidity的数据被集中存储在定义的合约下，而Move的数据能够跨合约、跨账户，所以Move的数据可以分散存储。针对集中存储的问题，Move能够轻松的缓解这类安全隐患，将数据分散存储到每个用户自己的账户下。分散存储的好处很多，除了避免大数组的DoS攻击，即便合约出现了安全漏洞，也可以避免所有用户一起遭受损失。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gy7a7y8zmaj30n60c9gmc.jpg" alt="starcoin_account_example" style="zoom:50%;" />



## 避免批量操作

在Move的体系中，能够分散存储的数据，尽量分散存储，如果不能分散存储，那么下面这些方案能够轻松避免大数组：

* 避免批量操作，让每个用户自己主动触发操作
* 链上+链下
* 其他方案，例如泛型、链表等等

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gy7akc0l4tj30sa0g0gmg.jpg" alt="move_dos" style="zoom:50%;" />

上文中DistributeTokens合约的distribute函数就是一个很典型的批量操作，针对这种情况，一个非常合理的优化方案是让每个用户自己发起交易，主动去取出锁定的Token，从而避免遍历数组的批量操作。



## 链上与链下结合

针对数组，还有一种避免gas limit的简单方案是链上与链下结合，分段操作。

链上数据是确定的，所以，链下可以根据多种方式，对链上数据进行处理，典型的方式有：

* 链下订阅链上事件，将链上数据隐射到链下
* 链下对链上数据进行分析，提取数组列表

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gy7b97xfjij31640fwgmr.jpg" alt="onchain_offchain" style="zoom:30%;" />

有了跟链上一致的数据，然后将链下数据分段，通过传参到链上进行处理，从而避免Gas的限制。

在Move合约中，还有一些方式能够避免大数据的安全隐患，例如通过泛型的方式避免使用数组。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gy7c367bmhj316a0gq40a.jpg" alt="move_generic" style="zoom:33%;" />



## 更安全的Move

针对大数据的安全隐患，对比Solidity，Move有更多的处理方案，本质上的区别在于：

> Move数据能够跨合约、跨账户，分散存储到不同账户下

事实上，Move还有很多针对金融场景设计的安全特性，让合约更安全，从而更好的保证用户的数字资产的安全。