---
title: Purchase源码分析
weight: 11
---

## Purchase

~~~
* 本文由Starcoin社区原创
~~~

Purchase是首届Starcoin & Move黑客松的一个参赛项目，由TopYD团队提交。Purchase是在完全没有信任的场景下，双方通过链上质押的方式进行安全的交易。如果一方欺诈，将罚没其质押的Token，以此来保证双方的交易顺利、安全的进行下去。

这里我们通过对合约源码进行分析，来学习一下Move如何实现一个简单的交易协议。我们先来看一 下Purchase项目的整体设计图：

![move_purchase](https://tva1.sinaimg.cn/large/008i3skNly1gug7xlve6mj60d303374a02.jpg)

从上图我们可以看到Purchase的数据结构和主要流程：

1. 数据结构
   * Market
   * Goods
2. 核心流程
   * publish函数
   * order函数
   * done函数

Purchase的实现上，可以在Market里面买卖各种各样的Goods，通过publish、order、done完成一次顺利的交易。



## 数据结构

我们来看一下Purchase核心的数据结构：

1. Market市场

~~~Move
struct Market<Info: copy + drop + store> has key, store {
    goods_center: vector<Goods<Info>>,//商品列表
}
~~~

2. Goods商品

~~~Move
struct Goods<Info: copy + drop + store> has store {
    state: u8,// 状态
    info: Info,//商品信息
    seller: address,//卖方地址
    price: u128,//价格
    s_deposit: Option<Token<STC>>,//买方质押
    buyer: Option<address>,//买方
    b_deposit: Option<Token<STC>>,//卖方质押+支付
}
~~~

Market和Goods的定义有以下优点：

* 没有drop的ability，Market的instance不能被丢弃或者凭空消失
* 没有copy的ability，Market不能通过instance拷贝成多个instance，不会增发
* Market可以被存储和检索，Goods只能被存储
* Info是泛型，可以接收任何有copy + drop + store的ability的Struct



## 核心函数

Purchase主要的流程包括3个核心的函数：

1. publish函数

   ~~~Move
   public fun publish<Info: copy + drop + store>(account: &signer, market_address: address, s_deposit: Token<STC>, info:Info): u64 acquires Market
   ~~~

   publish是用于发布商品信息的函数，任何人都能发布商品。

2. order函数

   ~~~Move
   public fun order<Info: copy + drop + store>(account: &signer, market_address: address, goods_id: u64, b_deposit: Token<STC>) acquires Market 
   ~~~

   order函数用于用户下单。

3. done函数

   ~~~Move
   public fun done<Info: copy + drop + store>(account: &signer, market_address: address, goods_id: u64):Token<STC>  acquires Market 
   ~~~

   订单完成，进行结算，这步会把双方质押的Token退还。

上面这3个函数，设计上基本相同：

* public函数可见性
* 泛型编程，实现通用的协议
* acquires表示当前函数使用了当前合约定义的Struct



## 总结&思考

合约功能相对比较简单，我们从代码的⻆度来分析一下优缺点。

1. 优点：
   * Struct的定义安全可靠，既不会凭空消失，也不能被拷贝
   * 泛型编程，实现通用的协议
   * 功能上通过双方质押的方式，保障非信任的场景下顺利交易
2. 可以改进的地方：
   * Market使用了vector，容易引发大数组的安全问题
   * 将数据分散到每个用户自己的账号下
   * 支持形式化验证，通过数学方式证明合约的安全性
   * 如果交易不顺利，应该提供一种Proof的方式避免损失

Purchase在设计上比较简洁通用，感兴趣的可以通过[这里](https://gitlab.com/mingzhena/Purchase/-/tree/main/public/src/modules)查看完整代码。

