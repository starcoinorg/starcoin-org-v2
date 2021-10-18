---
title: Starcoin完美实现「代码即法律」
weight: 12
---

## 合约能否升级？

~~~
* 本文由Starcoin社区原创
~~~

我们崇尚「code is law」，代码即法律，是不是意味着合约不能升级？

我们先看一下目前的智能合约的现状。

最近两年DeFi异常火爆，可以说智能合约提供了最强大的支撑。但是，快速发展的背后，层出不穷的安全问题也一直在困扰我们，比如TheDAO攻击、PolyNetwork攻击事件等等，这在很大程度上也限制了整个行业的发展。当然，这些安全漏洞的产生因素是多方面的，即便是中心化场，开发者和业务人员也没法保证合约完全没有Bug，何况是去中心化场景。鉴于种种原因，以太坊最后总结出了一套合约升级的方案，我们后面会再分析。

接下来从法律的角度来进行分析。

事实上，现实中的各国的法律也不是一成不变的。随着时代的变迁，新的事物出现，新的认知被普遍接受，而旧的事物也应该被洗涤，所以，法律也要不断地完善，才能符合时代的要求，为社会所拥护。当然，我们也知道法律是不应该朝令夕改的。所以，法律只要在一定的约束下，遵循一定的章程，并达到普遍的共识，法律也是可以进一步完善的。

代码即法律，既然法律能够在一定的约束下不断地完善，那合约是不是也应该在一定的约束下允许升级呢？答案是肯定的。「code is law」的关键并不是「合约不能升级」，而是「在什么样的约束下合约能够升级」。



## Starcoion的合约升级

Starcoin是崇尚「code is law」的。关于合约升级，Starcoin做了非常多的探索。

首先，Starcoin的账号模型设计上支持合约升级；

第二，Stdlib内置了多种合约升级的策略（其中也包括禁止升级的策略），供用户自由选择；

第三，Stdlib包含了完备的DAO链上治理功能，跟合约升级策略能够非常方便的组合，起到约束的作用；

Starcoin拥有灵活的合约升级特性，并将选择权交给用户。下面我们深入介绍一下Starcoin针对合约升级所做的设计。



### 更先进的账号模型

虽然Starcoin和Ethereum的账号都是采用Account模型，但是Starcoin的账号模型更先进，设计上存在非常大的差异：

1. Starcoin只有一种账号，Ethereum区分普通账号和合约账号。
2. Starcoin的数据是分散存储的，具有明确的所有权；
3. Starcoin的账号区分数据区和代码区；
4. Starcoin的合约是支持升级的，Ethereum的合约一旦部署，不能再升级；

当然还有很多其他的不同，我们这里主要介绍合约代码存储的不同，如下图所示：

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gupbkpeqzsj60rk0bsq3d02.jpg" alt="eth vs starcoin" style="zoom:60%;" />

1. Ethereum合约代码的存储和查询

Ethereum的合约代码在存储的时候会先计算代码的hash，将代码hash(也就是图中的code_hash)作为唯一索引，通过code_hash映射到真正的合约代码。所以在加载代码的时候，需要使用code_hash查找代码。

2. Starcoin合约代码的存储和查询

Starcoin有一个ModuleId的数据结构，存储了账号的address和Identifier(也就是模块名称)，然后对ModuleId进行hash计算(也就是图中的ModuleId hash)，并作为唯一索引，映射到真正的合约代码。所以在加载代码的时候，需要使用ModuleId hash查找代码。

以上是对Starcoin和Ethereum的合约代码存储的分析。那么对合约升级有什么样的影响呢？

1. Ethereum：如果合约升级，将导致code_hash变更，旧的code_hash不能映射到更新后的代码，也就是说合约一旦部署，不能再做任何更新；所以Ethereum社区通常通过Proxy的方案，部署一个新的合约，达到”升级“的效果，并不是在旧的代码上进行修改；
2. Starcoin：只要保证ModuleId不变(也就是address和模块名称Identifier不变)，那么ModuleId hash就不会变，实际代码可以更新；

代码存储的不同，最终将导致合约升级方案的不同，Starcoin的有更好的合约升级特性。



### 以太坊的Proxy合约升级方案

前面介绍了以太坊的合约代码存储，这里介绍一下以太坊的Proxy合约升级方案的原理。

合约开发者，在Real Contract前面部署一个Proxy Contract。Proxy Contract的作用，可以简单的理解为存储了Real Contract的code_hash。旧的合约(图中的Before upgrading contract)需要两步完成升级：

1. 先部署一个新的合约(图中Latest real contract)；
2. 更新Proxy Contract的数据(可以理解为将code_hash设置成新合约的code_hash)，见图中红色部分

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvj81n8tcmj60ws0bcmxl02.jpg" alt="2" style="zoom:50%;" />

本质上，以太坊并不是升级合约，而是通过部署新的合约，达到”合约升级“的效果。



### Starcoin的两阶段更新

与以太坊的Proxy合约升级方案不一样，Starcoin是真正的合约升级。为了更好的实现合约升级，Starcoin支持多种合约升级策略，将选择权留给用户：

1. STRATEGY_ARBITRARY：随便更新
2. STRATEGY_TWO_PHASE：两阶段更新TwoPhaseUpgrade
3. STRATEGY_NEW_MODULE：只能新增Module，不能修改Module
4. STRATEGY_FREEZE：冻结，不允许更新合约

这里有几个需要格外说明的地方：

1. Starcoin的合约更新策略是账号级别的。一旦用户设置某个策略，该策略将作用于当前账号下的所有合约。

2. Starcoin的合约升级策略，从STRATEGY_ARBITRARY到STRATEGY_FREEZE是由低到高，限制越来越严格。只允许从低的策略往高的策略设置，不允许反过来。
3. 默认合约升级策略是STRATEGY_ARBITRARY。

TwoPhaseUpgrade是Starcoin的升级协议中非常有意思的一个策略，下面我们重点介绍一下这个策略，如图所示。

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gupblxtzp5j60py0ikaaj02.jpg" alt="two phase" style="zoom:60%;" />

TwoPhaseUpgrade升级合约包含以下步骤：

1. 先提交更新计划的交易(图中upgrade plan txn)
2. 等一定数量的区块之后，提交合约更新的交易(图中code txn)，交易执行之后，新的合约代码将覆盖旧的合约代码

这种合约升级方式包括两步，所以称为「两阶段更新」。其中，等待的区块，可以理解为对更新的合约进行公示。这里需要说明的是，TwoPhaseUpgrade的合约升级方式，是一种社区治理的常用方式，公布Roadmap，确定更新日期，最后用新的版本替换旧的版本。



### DAO & TwoPhaseUpgrade

前面我们讲「code is law」的时候提到，合约应该在一定的约束下允许升级，而升级的结果应该代表了大部分人的意愿。Starcoin提供了4种合约升级策略，究竟选择哪种策略，选择权在合约的Owner手中。那么，Starcoin通过什么样的方式对合约的Owner进行约束从而代表大部分人的意愿呢？答案是DAO。

Starcoin有完备的链上治理DAO：

1. 提交Proposal，进入PENDING状态；
2. 等待一段时间，用于社区了解Proposal，然后进入ACTIVE状态；
3. 从Proposal变成ACTIVE状态开始，一段时间属于社区vote投票阶段；
4. 当投票达到阈值之后，Proposal变成AGREED状态；
5. 投票通过的提议进入更新队列，变成QUEUE状态排队；
6. 最后进入公示阶段，公示期过去进入EXECTABLE状态；

Starcoin正是通过投票的方式，链上治理，达到普遍的共识。投票通过之后，再进入最后的合约升级的阶段。Starcoin鼓励用户将合约托管给DAO管理。

Starcoin的DAO与TwoPhaseUpgrade完美地阐释了一个公平开放的社区治理流程。Starcoin的Stdlib也使用了DAO+TwoPhaseUpgrade的方式进行治理，整个Stdlib的升级过程如下图所示，这里可以查看[Starcoin如何升级Stdlib](https://starcoin.org/zh/developer/blog/starcoin_stdlib_upgrade/)。

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gupbnleomtj60mc0tyjt802.jpg" alt="starcoin stdlib upgrade" style="zoom:60%;" />



## 总结

Starcoin设计了更先进的账号模型，支持了多种合约升级策略，并且将选择权交给用户。同时，Starcoin也提供了非常完备的DAO链上治理，尊重社区的共识。通过DAO与合约升级组合的方式，对合约升级进行约束，既保证了合约可以升级，又保障合约不能随便升级，完美地解决了「code is law」面临的问题。可以说，Starcoin是目前唯一完美实现「code is law」的公链。

