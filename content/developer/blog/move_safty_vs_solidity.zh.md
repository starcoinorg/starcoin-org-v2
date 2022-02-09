---
title: Move轻松避免Solidity无限增发的漏洞，让DeFi更安全
weight: 47
---

~~~
* 本文由Starcoin社区原创
~~~


近日，跨链协议Wormhole遭到黑客攻击，损失价值3.2亿美元的12万枚wETH。安全问题再次敲响了警钟，如何才能安全地DeFi是行业内所有人都应该重点关注的问题。

由于DeFi场景是建立在去信任的情况下的，所以代码开源是一种常态。金融场景下将代码开源，等于把很多的钱放在所有人的面前，那么，安全就更加重要了。一旦出现漏洞，很可能是毁灭性的，例如比较常见的无限增发漏洞。

基于安全的考虑，Starcoin选择使用专门针对金融场景而设计的Move作为智能合约语言。Move提倡面向资源编程，让DeFi更安全可靠。本文将深入分析无限增发的真实案例，讲述为什么面向资源编程更加安全。



## 无限增发案例分析

无限增发漏洞的真实原因可能是多种多样的，例如权限被盗、溢出等等，都可能引起无限增发的漏洞。无限增发的结果是导致Token被黑客任意增发，价格归零，用户损失惨重。

这里分析一个加减法导致无限增发的真实案例，感受一下安全的难度，如图所示：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gz2gacqvi0j30v80eqdh1.jpg" alt="transfer_mint" style="zoom:50%;" />

这是使用Solidity实现的一个ERC20的转账逻辑，from用户给to用户转value数量的Token，主要的过程：

1. 从map中取出from的balance，赋值给oldFromVal变量；
2. 从map中取出to的balance，赋值给oldToVal变量；
3. 判断oldFromVal大于value；
4. oldToVal + value并且赋值给newToVal；
5. oldFromVal - value并且赋值给newFromVal；
6. 将newFromVal设置成from的新balance；
7. 将newToVal设置成to的新balance；

上面整个修改balance的过程，在中心化的金融场景下是很常见的扣款逻辑，但是有个前提，不能给自己转账。就是这么一个简单的加减逻辑，如果from和to是同一个账户就有问题了，newToVal的值覆盖了newFromVal的值，等于没从from账户减掉value，反而加了value，最终导致了无限增发。

了解了上面这种形式的无限增发漏洞的原理，解决办法当然有很多，例如增加一个from不能等于to的判断。但是这种解决办法，本质上是完全依赖合约开发者来保证安全，一方面提高了对合约开发者的要求，另一方面增加了安全门槛。



## 面向资源编程的Move

Move是专门为金融场景设计的智能合约语言，提供了另一种思路，能够轻松解决类似上面这种安全问题。Move语言在不增加开发者的安全负担的情况下，避免很多常见的安全风险。

在Move中，设计了一种资源类型。如果一个数据结构被声明为Resource类型，那意味着这个数据结构的instance都将受到严格保护，全局唯一，并且不能随便拷贝和修改。

以上面无限增发的例子为例，from和to用户的balance都同时存在oldVal和newVal，本质上是对数字的拷贝，这是导致漏洞的根源，任何小的失误都可能导致这几个拷贝之后的数字变量错误。在Move中将Balance和Token都声明为Resource类型，即便from和to是同一个账户：

* 同一时间，Balance只能有一个instance或者mutable的reference，那意味着如果from和to是同一个账户将会报错
* Token是受保护的类型，不能随便加减，必须先从from账户取出来，然后move到to账户下，即便from和to是同一个账户，Token是从自己账户取出又转回自己账户去了，总量是不变的

![move_resource](https://tva1.sinaimg.cn/large/008i3skNly1gz2hcm5z22j306d048t8n.jpg)



## Move的Ability

Move的资源类型是专门为金融场景设计的，是对现实中价值的一个更贴切的抽象。Move通过Ability的特性来表达不同的类型，例如资源类型。

Move设计了4种类型的Ability，分别是Copy、Drop、Key和Store，如图所示：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gz2hd4ubfyj30oi0gm3yw.jpg" alt="move_ability" style="zoom:30%;" />

* Copy：指定Struct的instance可以被拷贝，如果Struct没有Copy的ability，则不能拷贝；
* Drop：指定Struct的instance可以被丢弃，如果Struct没有Drop的ability，则只能明确的通过函数销毁；
* Key：指定Struct的instance是否有检索的ability
* Store：指定Struct的instance能否保存到账户下

所以，资源类型的struct定义如下，不能Copy和Drop，能够检索和存储：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gz2iwzb2eij30ms02sdfr.jpg" alt="move_resource_struct" style="zoom:50%;" />

在Move中，能够通过4种Ability轻松设计出自己想要的数据结构，并且会从VM层面保障Ability。



## Move的转账例子

介绍了Move的面向资源及实现方式，接下来看一下Move如何通过Ability来实现安全的ERC20转账：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gz2hdifb96j30oq05u74w.jpg" alt="move_transfer" style="zoom:50%;" />

这里需要注意的是：

1. Token是资源类型，不能Copy和Drop，避免了凭空消失进入黑洞的异常情况，也避免了通过Copy实现增发的异常情况；
2. Token作为资源，只能将所有权从一个账户move到另一个账户，如图第7步和第9步，总量不变；



## Solidity与Move对比

在DeFi场景中，Token是在基本的数据。从上面的例子中，能够看到Solidity和Move的不同，如图所示：

* Solidity中把Token当成一个普通数字进行加减乘除，在传输的过程中很容易出现安全问题
* Move中，把Token当成一种资源类型处理，从VM层面保障Token不可复制、不能丢弃、传输过程中不能修改，保障了Token的安全可靠，让DeFi更加放心

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gz2hdu49hmj30i209a0sv.jpg" alt="solidity_vs_move" style="zoom:50%;" />

交易的本质是所有权的转移。在Move中，保证资源类型本身安全可靠，同时，保障资源类型的所有权明确、完整，不仅仅能避免类似于无限增发的漏洞，还能避免其他常见的安全隐患。既减低了开发者的安全门槛，也降低了资源的安全风险。