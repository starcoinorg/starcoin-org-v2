---
title: RedPackage源码分析
weight: 8
---

## RedPackage

~~~
* 本文由Starcoin社区原创
~~~

RedPackage是首届Move黑客松中，由虫洞工作室设计的一个很好玩、很实用的工具。通过Move智能合约定义一个安全可靠的SHIBA，并针对SHIBA设计了有意思的红包逻辑，发布到Starcoin链上，为大家提供一个链上拼手气的红包功能。RedPackage是一个通用的协议，可以使用任何有store能力的struct作为红包数据。

这里我们通过对合约源码进行分析，来学习一下如何使用Move实现一个通用的红包协议。下图是RedPackage的一个整体设计：

![move_ red_package](https://tva1.sinaimg.cn/large/008i3skNly1gu6xrv4ms2j60iz05l0su02.jpg)

从上图我们看到RedPackage设计比较简洁：

1. 核心数据结构：
   * RedPackage
2. 核心函数：
   * create
   * claim

「红包发起人」通过create函数创建一个RebPackage，并且将数据分成多份，保存到当前账号下。用户通过claim函数领取红包。接下来我们深入分析一下源码。



## 数据结构

RedPackage的设计比较简洁，有4个数据结构，我们一个一个看。

1. RedPackage红包

   ~~~Move
   struct RedPackage<TokenType: store> has store {
       merkle_root: vector<u8>,// 红包id
       tokens: Token::Token<TokenType>,// 红包
       leafs: vector<u128>,// 每份红包数量
       claimed: vector<address>,// 领取红包的address
   }
   ~~~

   RedPackage存储了红包包含的所有数据，主要的逻辑都在其中：

   * RedPackage没有drop的ability，不会凭空丢失
   * RedPackage没有copy的ability，不会出现被拷贝而无限增发等漏洞

2. SHIBA

   ~~~Move
   struct SHIBA has copy, drop, store {}
   ~~~

   这是一个普通的struct，但是通过Token协议注册成了有意义的资源，感兴趣的可以去了解一下Starcoin的Token协议。

3. SharedMintCapability

   ~~~Move
   struct SharedMintCapability has key, store {
       cap: Token::MintCapability<SHIBA>,
   }
   ~~~

   SharedMintCapability代表了SHIBA的Mint权限。

4. SharedBurnCapability

   ~~~Move
   struct SharedBurnCapability has key, store {
       cap: Token::BurnCapability<SHIBA>,
   }
   ~~~

   SharedBurnCapability代表了SHIBA的Burn权限。



## function定义

1. create函数

   ~~~Move
   public fun create<TokenType: store>(account: &signer, merkle_root: vector<u8>,
                                           token_amount: u128, leafs: vector<u128>)
   ~~~

   create函数是红包初始化的入口，会生成RedPackage放到「红包发起人」账号下：

   * create是泛型函数，这是一个可扩展的设计，任何有store的ability的struct，都能调用
   * create的可见性是public的，所以需要格外定义script调用
   * 这里需要说明的是，红包的随机逻辑不在合约里

2. claim函数

   ~~~Move
   public fun claim<TokenType: store>(account: &signer, owner_address: address, merkle_root: vector<u8>)
   ~~~

   claim函数是用户领取红包的入口，用户指定「红包发起人」的地址和红包id来领取红包。



## Capability

Capability在Starcoin的Stdlib中代表「权限」。

在中心化的系统中，用户有没有某个权限，通常是通过一个bool型字段来判断。在真实的场景中，「权限」通常是某个人或者某类人所拥有，可以认为是一种稀缺的「资源」。Move是面向资源编程的。所以，在Move中会用一个「资源」类型的Struct来代表「权限」。这是一种有意思的编程范式，在Starcoin的Stdlib中很常见。参看更多关于Capability的[详情](https://starcoin.org/zh/developer/stdlib/stdlib/)。

在RedPackage中，SharedMintCapability代表了SHIBA的Mint权限，SharedBurnCapability代表了SHIBA的Burn权限。



## 思考&总结

RedPackage项目非常地实用，从合约实现细节来说，代码相对比较简洁。我们来总结一下合约代码实现上的优缺点。

1. 优点：
   * 面向泛型编程，是一个通用的红包协议
   * RedPackage的定义安全可靠，既不能drop，也不能copy
   * SHIBA使用了Stdlib中的Token协议
   * Mint和Burn都设计成了Capability
   * 工具非常实用，功能很齐全
   * 每个账号下可以同时存储多种类型的红包
2. 进一步优化：
   * create和claim函数都建议使用public(script)可见性
   * 关键数据状态变更应该定义Event，方便链下监听
   * 通过Oracle协议，把随机的逻辑放到链上

总的来说，RedPackage在设计上巧妙地应用了Move的优势，例如RedPackage和Capability等等，感兴趣的可以[查看完整代码](https://github.com/reilost/meteor/tree/main/meteor-contract/src/modules)。

