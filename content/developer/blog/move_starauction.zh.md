---
title: Starauction源码分析
weight: 7
---

## starauction

starauction是首届Starcoin & Move黑客松的一个参数项目，由Mars&Earth团队提交。starauction是一个去中心化竞拍项目，使用Move开发，包括「拍卖人」和「买受人」两种角色。拍卖人创建拍卖并抵押标的物，并等待开拍。有人参与竞拍并达到起拍价且拍卖时间到则拍卖成功，否则拍卖失败。

starauction是一个通用的竞拍协议。这里我们通过对合约源码进行分析，来学习一下如何使用Move实现一个通用的竞拍协议。下图是starauction的一个整体设计：

![move_starauction](https://tva1.sinaimg.cn/large/008i3skNly1guaic5fwpmj60az04lt8q02.jpg)

从上图我们来整体了解一下starauction的设计:

 1. 核心数据结构:

* Auction

2. 核心函数:

* create
* deposit
* bid

「拍卖人」通过create函数创建Auction，并且通过deposit将要竞拍的东西放进去；而任何「买受人」都可以在Auction过期之前通过bid出价竞拍。



## 数据结构

1. Auction

Auction是starauction项目最核心的数据结构，定义如下：

~~~Move
struct Auction<ObjectiveTokenT, BidTokenType> has key {
        start_time: u64,// 开始时间
        end_time: u64,// 结束时间
        start_price: u128,// 起拍价
        reserve_price: u128,//保留价
        increments_price: u128,//加价幅度
        hammer_price: u128,//一口价
        hammer_locked: bool,//一口价标志

        seller: Option::Option<address>,//拍卖人地址
        seller_deposit: Token::Token<BidTokenType>,//拍卖人保证金
        seller_objective: Token::Token<ObjectiveTokenT>,//拍卖物品

        buyer: Option::Option<address>,//买受人地址
        buyer_bid_reserve: Token::Token<BidTokenType>,//出价

        auction_created_events: Event::EventHandle<AuctionCreatedEvent>,//创建Auction事件
        auction_bid_events: Event::EventHandle<AuctionBidedEvent>,//出价事件
        auction_completed_events: Event::EventHandle<AuctionCompletedEvent>,//竞拍结束事件
        auction_passed_events: Event::EventHandle<AuctionPassedEvent>,//竞拍通过事件
    }
~~~

分析一下Auction的定义：

* 有两个泛型参数ObjectiveTokenT和BidTokenType，可以进行任何类型的竞拍
* 只有key的ability，意味着不能drop和copy，可以被检索
* 包含了AuctionCreatedEvent、AuctionBidedEvent、AuctionCompletedEvent、AuctionPassedEvent等事件

2. Auc

~~~Move
struct Auc has copy, drop, store {}
~~~

Auc是Token协议中的一个Token元数据，Token<Auc>才是真正的Token，所以Auc可以是copy和drop的。



## 核心Function定义

starauction是function比较多，这里我们只关注最核心的函数：

1. create函数

   ~~~Move
   public fun create<ObjectiveTokenT: copy + drop + store,
                         BidTokenType: copy + drop + store>(account: &signer,
                                                            start_time: u64,
                                                            end_time: u64,
                                                            start_price: u128,
                                                            reserve_price: u128,
                                                            increments_price: u128,
                                                            hammer_price: u128)
   ~~~

   这是创建Auction的函数，任何人都可以创建，拍卖创建者和拍卖者可以不是同一个人：

   * 函数可见性是public
   * 泛型编程，支持所有类型的通用协议
   * 数据存储在调用当前函数的账号下，所以是分散存储

2. deposit函数

   ~~~Move
   public fun deposit<ObjectiveTokenT: copy + drop + store, BidTokenType: copy + drop + store>()
   ~~~

   deposit函数用于抵押拍品，任何人都可以抵押拍品，抵押之后的这个人会成为该场拍卖的出售方。

   * 函数可见性是public
   * 泛型编程，支持所有类型的通用协议

3. bid函数

   ~~~Move
   public fun bid<ObjectiveTokenT: copy + drop + store,
                      BidTokenType: copy + drop + store>(account: &signer,
                                                         creator: address,
                                                         bid_price: u128) acquires Auction
   ~~~

   出价函数，任何人都可以参与竞价，除了抵押拍品的人。

   * 函数可见性是public
   * 泛型编程，支持所有类型的通用协议
   * acquires表示使用了当前合约定义的Auction

4. 其他函数

   * destroy：销毁掉一个Auction
   * hammer_buy：一口价，用户可以一口价，直接买断
   * completed：完成，清理resource



## 思考**&**总结

starauction是一个功能相对比较完整的竞拍协议。我们来总结一下合约代码实现上的优缺点。

1. 优点：
   * Auction没有drop的ability，不会丢失
   * Auction没有copy的ability，不能被拷贝，不会产生无限增发等漏洞
   * Auction数据分散存储在每个调用create函数的用户下
   * 泛型编程，设计了通用的竞拍协议，支持任何类型
   * 定义了完整的Event，方便链下监听
   * 竞拍功能相对比较完整，比如一口价等等
2. 可以改进的地方：
   * 增加形式化验证
   * 支持非Token类的拍卖物品

总的来说，starauction合约比较完整，在设计上巧妙地应用了Move的优势，感兴趣的可以[查看完整代码](https://github.com/starcoinorg/starauction-core)。