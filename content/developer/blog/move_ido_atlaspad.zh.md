---
title: Atlaspad源码分析
weight: 3
---

## Atlaspad

~~~
* 本文由Starcoin社区原创
~~~

Atlaspad是首届Move黑客松中非常有意思的一个项目，由国际化的参赛团队设计完成，也是Starcoin生态中首个IDO（Initial DeFi Offering）平台。IDO是DeFi领域一个很前沿，也很受用户欢迎的方向，旨在帮助DeFi项目募集资金。Atlaspad是一个构建在Starcoin之上的通用IDO协议，使用智能合约Move实现。

这里我们通过对合约源码进行分析，来学习一下如何使用Move实现一个安全地的IDO平台。我们先来看一 下Atlaspad项目的整体设计图：

![move_ido](https://tva1.sinaimg.cn/large/008i3skNly1gtzuaq31qij60is08zaas02.jpg)

从上图我们可以得到的信息：

1. 从流程上有3个角色：

* IDO平台
* 募资Project
* 普通用户

2. 核心数据结构：

* Offering
* Staking
* 涉及到3种类型的StakingToken、PaidToken、OfferingToken

IDO平台业务相对复杂一些，具体的执行流程，核心函数，后面再介绍。



## 核心数据结构

1. Offering发行

~~~Move
struct Offering<StakingTokenType: store, PaidTokenType: store, OfferingTokenType: store> has key, store {
   	offering_tokens: Token::Token<OfferingTokenType>,// 募资Token
    offering_token_total_amount: u128,// 总量
    exchange_rate: u128,// 汇率
    personal_staking_token_amount_limit: u128,// 单用户限量
    state: u8,// 状态
    offering_addr: address,// 地址
    staking_token_amount: u128,// 质押总量
    offering_token_exchanged_amount: u128,// 已兑换总量
    version: u128,// 版本
    offering_created_event: Event::EventHandle<OfferingCreatedEvent>,// 创建Offering事件
    offering_update_event: Event::EventHandle<OfferingUpdateEvent>,// 更新Offering事件
}
~~~

2. Staking质押

~~~Move
struct Staking<StakingTokenType: store, PaidTokenType: store, OfferingTokenType: store> has key, store {
        staking_tokens: Token::Token<StakingTokenType>,// 质押Token
        staking_token_amount: u128,// 质押总量
        is_pay_off: bool,// 是否已经支付
        version: u128,// 版本
        token_staking_event: Event::EventHandle<TokenStakingEvent>,// 质押事件
        token_exchange_event: Event::EventHandle<TokenExchangeEvent>,// 兑换事件
    }
~~~

从Offering和Staking这么设计有很多安全方面的好处：

* Offering和Staking都没有drop的ability，不会凭空丢失；
* Offering和Staking都没有copy的ability，不能通过复制增发，避免无限增发等漏洞；
* Offering或者Staking是一个完整的整体，只能通过合约的function进行修改，合约外部只能存储，不能修改



## 操作流程

1. Atlaspad的实现中，有一个DummyToken的module，注册了一些Token例子，遵循Starcoin的Token协议（这里假设有StakingToken、 PaidToken、OfferingToken）。

2. create函数

   IDO平台会初始化一个Offering，设置募资数量、汇率、OFFERING_PENDING状态等等，并把当前Offering保存在当前账号下；

3. state_change函数

   这是修改Offering状态的函数，只能OWNER_ADDRESS调用。Offering总共有5种状态：

   * OFFERING_PENDING
   * OFFERING_OPENING
   * OFFERING_STAKING
   * OFFERING_UNSTAKING
   * OFFERING_CLOSED

4. staking函数

   质押函数，用户调用的函数。在OFFERING_OPENING状态下，用户通过staking函数，质押StakingToken，或者追加质押，进行认购操作。这步操作将会在用户的账号下保存一个Staking，每个不同的Offering只会在用户账号下保存一个Staking。

5. exchange函数

   换汇函数，用户调用的函数。在OFFERING_STAKING状态下，进行换汇操作，这里需要支付PaidToken，将会得到OfferingToken。

6. unstaking函数

   解除质押，用户调用的函数。在OFFERING_OPENING、OFFERING_STAKING、OFFERING_UNSTAKING这3种状态下都能解除质押。这是对用户的一个保护或者说是用户的一个权力，可以随时解除质押，把自己的StakingToken取回来。

以上是Atlaspad涉及到的主要链上合约流程，主要逻辑在Offering模块中，大概400行。



## 思考&总结

我们从合约的⻆度来分析一下优缺点。

1. 优点：
   * Offering和Staking都没有drop和copy的ability，安全可靠
   * Staking数据分散存储到用户自己的账号，既避免了大数组的问题，也明确了Staking的所有权
   * 泛型编程，StakingToken、 PaidToken、OfferingToken都是泛型参数，灵活通用
   * 使用Stdlib的Token协议定义了DummyToken的module
   * IDO是前沿赛道，产品功能完整，合约代码相对比较大
   * 使用Event规范定义状态改变事件，方便链下监听
   * 使用了泛型，同一个账号下可以同时有多个Offering或者Staking
2. 进一步优化：
   * 链下调用的函数可见性是public的，使用script更方便
   * 支持形式化验证，通过数学方式证明合约的安全性

Atlaspad是使用Move实现的首个IDO平台，很好的利用了Move的特性，非常得有意思，感兴趣的可以通过[这里](https://github.com/xfhxfh1212/initial-dex-offering)查看完整代码。