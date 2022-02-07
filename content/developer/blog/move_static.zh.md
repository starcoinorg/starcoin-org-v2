---
title: Solidity动态调用可导致严重的安全漏洞，Move走纯静态之路
weight: 46
---

~~~
* 本文由Starcoin社区原创
~~~

区块链时代，一切皆透明的时代，所有的代码开源，所有的数据公开。对行业来说，这既是进步，也意味着更大的挑战。

当开源遇到DeFi的野蛮生长，各种各样的安全漏洞频频发生，也引来了不少外界的质疑。

抛开所有的赞誉和质疑，背后需要思考这样一个问题，虽然没有绝对的安全，但是如何能降低开发者的安全门槛，从而让链上资产更安全可靠呢？本文通过分析一些真实案例的方式，在一定范围内反思这个问题。

目前的DeFi场景下，比较常用的智能合约语言是Solidity。Solidity有一个非常重要、看上去很完美的特性：动态调用。动态调用其实是一把双刃剑，有很好的扩展性，同时也带来了很大的安全隐患。这里从安全的角度，来分析一些由动态调用引发的真实的安全漏洞，从而来理解一下，为什么Move要设计成一门纯静态的语言。



## fallback & DoS攻击

DoS攻击（Denial of Service），也就是拒绝服务攻击。智能合约场景下，有多种形式的DoS攻击，例如由大数组引起的DoS攻击，真实的案例有GovernMental的漏洞。这里讲一个由动态调用引起的DoS攻击案例——KotET的竞拍争夺王位的游戏。

KotET的游戏合约逻辑其实很简单，通过出价的方式，出价最高的人竞拍成为“国王”。假设当前的“国王”是A用户，如果B用户出更多的ETH，合约会自动把A用户出的ETH退回给A，同时把A的“国王”身份给B用户，这样B就成了新的“国王”。

很简单的逻辑，看上去似乎并没有什么不妥。但是，Ethereum有两种类型的账户：外部账户EOA(Externally Owned Account)和合约账户CA(Contract Account)。KotET的逻辑用EOA账户的确没啥问题，换成CA就可能存在安全隐患了。为什么呢？

了解Solidity的可能知道，Solidity合约有个payable的fallback函数。fallback函数有两个作用：

* 接收ETH的时候触发fallback函数
* 调用合约函数没有找到的时候，触发fallback函数

fallback函数可以是空函数，什么都不做，也可以加上自己想要的逻辑。

回到KotET的游戏合约，当合约把A用户的ETH还给A用户的时候，如果A用户是CA账户，就会调用触发fallback函数的逻辑。所以黑客作为合约账户，只要在fallback函数中加上有问题的代码，就能发起攻击：

~~~
function() external payable {
	  revert();
}
~~~

上面是fallback函数的一个实现，revert()让整个交易回滚，可以导致后面的人没法再从黑客用户手里抢走“国王”的身份了，这就是KotET漏洞的DoS攻击原理。



## fallback & Re-Entrancy 重入漏洞

著名的TheDAO经历的重入漏洞，直接导致了一次Ethereum的硬分叉。下图是TheDAO事件的一个原理图：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyd9o20zjvj315a0mi414.jpg" alt="solidity_fallback_TheDAO" style="zoom:30%;" />

1. splitDAO函数会把质押的ETH退还给用户，在退还前会做一些账户余额的判断
2. 退还ETH，转账到黑客的CA合约账户，触发fallback函数
3. 黑客在攻击合约的fallback中再次调用了TheDAO的splitDAO函数，形成了递归调用，这是黑客攻击成功的关键点之一，每次调用都是一次ETH转账
4. 由于合约转账在改用户余额的前面，而递归调用又只执行到转账操作，所以第1步的余额判断形同虚设，一直能通过，这是黑客攻击成功的另一个关键点
5. 受到Gas limit的限制，黑客在单个交易的gas费超过上限前退出递归调用，修改自己的余额

下图是TheDAO攻击的一个大概的调用栈：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gydaqo53iij30tw0faab6.jpg" alt="图片来自网上" style="zoom:35%;" />

合约账户CA(Contract Account)和fallback函数在前面已经介绍过。在TheDAO事件中，黑客利用fallback函数，巧妙构造了一个循环调用，这是攻击成功的一个关键要素。



## delegatecall & ATN事件

上面两次攻击都跟fallback函数有关，是不是禁止fallback函数就可以了？接下来看另外一个真实的事件——ATN的漏洞。

以太坊的ERC223协议针对ERC20协议做了一些升级，在transfer和transferFrom两个函数中，都增加了_custom_fallback字段。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gydclu5xu4j30cs052glp.jpg" alt="solidity_erc223" style="zoom:50%;" />

在ATN的ERC223协议实现中，通过delegatecall的方式回调_custom_fallback指定的函数，用于转账结束之后做一些自定义的处理逻辑：

~~~
receiving.call.value(0)(byte4(keccak256(_custom_fallback))
~~~

黑客在交易中将_custom_fallback指定为ATN合约依赖的DSAuth库的setOwner函数，成功获得了ATN的超管权限。通过delegatecall窃取了超管权限，是整个ATN攻击成功的关键。



## 不安全的动态调用

前面的3个例子，虽然是通过不同的技巧进行攻击，背后缺都有动态调用的影子。事实上，Solidity的很多真实安全事故背后都有动态调用的影子，比如Poly Network的攻击事件。

![solidity_poly](https://tva1.sinaimg.cn/large/008i3skNly1gydc23viw8j31cc02w0t6.jpg)

动态调用的确有很好的灵活性，但是对安全来说，也带来了极大的挑战。要掌握好这把双刃剑，对合约开发人员有极高的要求。

一方面，Solidity的外部调用只关心接口，不关心具体实现，也就是说，合约可以调用一个未来才实现的合约，增加了很多不确定性。另一方面，Solidity有两种形式的外部调用注入方式，理解起来比较困难：

* call：普通调用，执行上下文是外部合约的上下文，会更改调用者为实际调用者。

* delegatecall ：代理调用，执行上下文是本地合约上下文，传入的参数会影响本地的数值。

所以，合约开发者在调用外部合约的时候，要考虑很多的因素：

<img src="/Users/dqm/Desktop/内容/文章/安全/动态调用/img/solidity_call.jpg" alt="solidity_call" style="zoom:50%;" />

* 转账的时候有没有判断返回结果？
* 调用外部合约的时候gas如何传递？
* 函数调用的时候sender到底是谁？
* 合约修改了谁的数据？
* 会不会造成递归调用？
* 有没有可能窃取权限？
* 调用的参数会不会被自动忽略？

动态调用需要考虑的因素还有很多很多，这无疑给合约开发者带来了非常大的负担，变相提高了开发者的门槛，同时，也给合约安全带来了更多的安全隐患和挑战。因为动态调用的不确定性，产生了太多太多的安全漏洞了。



## 纯静态语言Move

由于动态调用的不确定性，不仅仅提高了开发者的门槛，更是给链上资产的安全带来了极大的挑战。所以，Move在设计的时候，吸取了这些漏洞的经验教训，选择了一条完全不同、纯静态的道路，从语言层面彻底解决这个安全隐患。这样不仅仅是降低了合约的开发难度，更重要的是让链上资产更加安全。

Move是纯静态智能合约语言，在提高合约安全性的同时，通过面向泛型编程来保证合约的扩展性。可以说，Solidity动态调用产生的那些安全问题，在Move合约中将不会出现，例如Move不能构造出递归调用。

除了纯静态的特点，Move有更多的安全特性。这些安全特性，会在Move的这个安全系列文章中，以最佳实践的方式逐一进行介绍，欢迎大家持续关注。



