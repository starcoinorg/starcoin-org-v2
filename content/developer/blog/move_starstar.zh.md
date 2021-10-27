---
title: StarStar源码分析
weight: 17
---

~~~
* 本文由Starcoin社区原创
~~~

StarStar是首届Starcoin & Move黑客松的一个参赛项目，由StarStar团队提交。StarStar是一个工具类项目，类似GitStar，通过在公链上实现点赞的功能，让用户能够对不同类型的项目进行投票，评选出自己喜欢的项目，并最终形成排行榜。所有用户能够根据排行榜非常直观地了解到优质项目的整体情况。

这里我们通过对合约源码进行分析，来学习一下StarStar工具的设计与实现。我们先来看一 下StarStar项目的整体设计图：

![move_star](https://tva1.sinaimg.cn/large/008i3skNly1gujcbkr752j60kc03rgls02.jpg)

从上图我们可以看到StarStar的数据结构和主要流程：

1. 数据结构
   * StarInfo
   * CategoryAccountCounter
2. 核心流程
   * register_item函数
   * star函数
   * unstar函数

StarStar的实现上，先通过register_item注册某个类型的StarInfo，比如NFT类的StarInfo。然后从NFT类型的所有StarInfo中，用户通过star函数给自己感兴趣的StarInfo投票。根据投票结构，对NFT类的所有StarInfo进行排序。



## 核心数据结构

我们来看一下StarStar核心的数据结构：

1. StarInfo

~~~
struct StarInfo<CategoryT: copy+store+drop> has key,store,drop {
    item_address: address,//项目地址
    counter: u64,//总的票数
    updated_at: u64,//创建事件
}
~~~

项目相关的信息，比如address、类型CategoryT、总的票数counter等等。

2. CategoryAccountCounter

~~~
struct CategoryAccountCounter<CategoryT: copy+store+drop> has key,store {
		counter: u64 //投出去的票数
}
~~~

用户针对某个CategoryT类型投出去的票数，目前每个CategoryT只能投1票。

我们来分析一下StarInfo和CategoryAccountCounter的定义有哪些优点：

* 面向泛型编程，可以随时增加新的类别，可扩展
* CategoryAccountCounter没有copy的ability，不能复制，所以没法凭空增加票数，安全可靠



## 核心函数

StarStar主要的流程包括3个核心的函数：

1. register_item函数

   ~~~Move
   public fun register_item<CategoryT: store+copy+drop>(account: &signer, item_address: address)
   ~~~

   注册某个类型的StarInfo，只能合约的Owner调用。

2. star函数

   ~~~Move
   public fun star<CategoryT: copy+store+drop>(account: &signer, item_address: address) : bool acquires CategoryAccountCounter
   ~~~

   点赞函数，给自己感兴趣的StarInfo投票。

3. unstar函数

   ~~~Move
   public fun unstar<CategoryT: copy+store+drop>(account: &signer, item_address: address) : bool acquires CategoryAccountCounter
   ~~~

   取消点赞函数。

上面这3个函数，设计上基本相同：

* public函数可见性
* 泛型编程，实现通用的协议
* acquires表示当前函数borrow了当前合约定义的Struct



## 总结&思考

合约功能相对比较简单，我们从代码的⻆度来分析一下优缺点。

1. 优点

* Struct的定义安全可靠，不能被拷贝
* 泛型编程，实现通用的协议，能增加新的类型，扩展性好
* 功能比较完善，非常实用的一个工具，通过排行榜用户帮用户甄别优质项目
* 点赞数据分散存储到用户自己的账号下

2. 改进

* CategoryAccountCounter的Struct应该有一个address，方便互查
* 支持形式化验证，通过数学方式证明合约的安全性
* 如果能跟DID、OAuth协议等技术结合起来，用户在star的时候能关注官方微博等，会更有想象空间

StarStar在设计上比较简洁通用，感兴趣的可以通过[这里](https://github.com/muzixinly/starstar-core/blob/main/src/modules/StarStar.move)查看完整代码。

