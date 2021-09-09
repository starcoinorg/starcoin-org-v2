---
title: P(A)源码分析
weight: 2
---

## P(A)

~~~
* 本文由Starcoin社区原创
~~~

P(A)是首届Move黑客松NFT赛道的一个项目，由MemeX团队设计的。本届黑客松有多个NFT项目，从功能完整性、项目完成度、创意性、展示度等多个方面综合考虑，P(A)是一个不错的NFT项目。NFT是目前非常热门的一个赛道，而Move在NFT领域有很大的优势。P(A)使用Move实现，可以说很好地结合了Move的特性。

这里我们通过对合约源码进行分析，来学习一下如何使用Move实现一个简单的NFT。我们先来看 一 下P(A)项目的整体设计图:

![move_nft](https://tva1.sinaimg.cn/large/008i3skNly1gu167dvaaoj60hi07m0t602.jpg)

从上面的图中可以看出一些重要的信息：

1. 核心的数据结构：
* NFT
* NFT_Info
* Market
2. 核心函数：

* init_market
* mint

从逻辑上来说，简单直接，合约Owner通过init_market初始化一个Market，普通用户可以mint来购买NFT。接下来我们深入分析一下源码。



## 核心数据结构

P(A)包含多个数据结构：Art、NFT、UniqList、NFT_INFO、MARKET，之间的关系如下图所示：

![move_nft_2](https://tva1.sinaimg.cn/large/008i3skNgy1gu2fl5297hj60ii05w74c02.jpg)

1. Art

   ~~~Move
   struct Art has store, copy, drop {
       prob_a: u8,
       prob_b: u8,
       param_1: vector<u64>,
       param_2: vector<u64>
   }
   ~~~

   这是NFT渲染需要用到的元数据信息，没有key的ability，意味着能拷贝、能丢弃、能存储。这里建议NFT的元数据不能拷贝和丢弃。

2. NFT

   ~~~Move
   struct NFT has store {
       id: u8,// 唯一标识
       next_nft_id: u8,// 通过链表的形式把NFT标识串起来，方便追踪
       next_nft_owner: address,// 通过链表的形式把address串起来，方便追踪
       data: Art,// NFT元数据
       sell_status: bool,// 状态
       price: u128,// 价格
   }
   ~~~

   这是NFT具体数据，只有存储的能力，意味着不能拷贝和丢弃。非常方便的发挥了Move的优势，利用虚拟机保障NFT的完整性、唯一性等等。

3. UniqList

   ~~~Move
   struct UniqList has key {
   		data: vector<NFT> // 存储用户拥有的NFT列表
   }
   ~~~

   UniqList虽然使用了数组，但是这里不用担心大数组的问题，因为每个用户的NFT是存储在自己的账号下的，并不会影响到所有的用户。

4. NFT_INFO

   ~~~Move
   struct NFT_INFO has store, drop {
       id: u8,// NFT标识
       next_nft_id: u8,
       next_nft_owner: address,
       data: Art,
       price: u128,// 价格
   }
   ~~~

   这是NFT生成之后的信息，用于展示。有NFT的id了，Art在这里有点冗余。

5. Market

   ~~~Move
   struct MARKET has key {
       head: address,
       cur_num: u8,// 当前数量
       min_price: u128,// 最小价格
       market_nft_info: vector<NFT_INFO>// 所有的NFT信息
   }
   ~~~

   这里存放了所有的NFT信息。看上去有大数组的问题，因为P(A)限制了最多只能生成100个NFT，所以这里也不用担心。但是，类似这种列表展示数据，建议通过Event的方式，在链下聚合。



## **Function**定义

1. init_market函数

   ~~~Move
   public(script) fun init_market(account: signer)
   ~~~

   这是合约初始化入口，在合约的Owner账号下初始化一个Market。函数使用了public(script)可见性。

2. mint函数

   ~~~Move
   public(script) fun mint(account: signer, amount: u128) acquires UniqList, MARKET
   ~~~

   这是用户购买NFT的入口，也是public(script) 可见性。acquires表示使用到了当前Module定义的UniqList和MARKET两个数据结构。



## 思考&总结

P(A)项目从合约实现细节来说，代码相对比较简洁，充分利用了Move在NFT场景的优势，省去了很多不必要的安全检查，比如防止NFT丢失等等。我们来总结一下合约代码实现上的优缺点。

1. 优点：
   * NFT是一个热门的方向，也是Move发挥优势的一个典型应用场景
   * 部分Struct在定义的时候巧妙应用了Move的ability来保证安全可靠，例如NFT，不能拷贝和丢弃
   * 函数都是public(script) 可见性，没有暴露多余的入口
   * NFT数据分散存储在用户自己的账号下，NFT本身不会出现大数组的问题
   * 使用了链表的设计，方便追踪
2. 可以进一步优化：
   * NFT内部数据Art也应该不能拷贝和丢弃，避免产生相同的内容的NFT
   * 关键数据状态变更应该定义Event，方便链下监听
   * Market的数组可以考虑链下存储，避免可能存在的大数组问题
   * 部分细节优化，例如Struct名称大小写风格统一、冗余数据等等
   * 可以增加更丰富的功能，比如NFT的转账等等

总的来说，P(A)巧妙地应用了Move的优势，在NFT的方向上做了很好的尝试，[这里](https://github.com/liuxieric123/nft_move_starcoin/tree/main/dev/nft_dev/src/modules)查看完整代码。

