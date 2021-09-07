## MyLegacy

MyLegacy是一个构建在Starcoin公链上的Asset-Management项目，实现了资产的安全存储、分批线性解锁等能力。整个业务模型除了财产继承，其实在很多其他常见的场景都很适合，例如分期结算项目资金、支付季度奖或者年终奖等等。尤其是在缺乏信任支撑的分布式场景，通过链上公开透明地逐步分期支付或者结算，是一个非常具有想象力的方向。

这里我们通过对合约源码进行分析，来学习一下如何使用Move安全地实现资产的管理。我们先来看一下MyLegacy项目的整体设计图：
![BlockHeader](/img/move_hackathon_1/hks_ mylegacy.png)

从上图可以看出，整个合约有 2 个核心的Struct：

* Legacy
* Payment

以及 2 个关键的function：

* init_legacy
* redeem



## Struct定义

接下来，我们分析一下MyLegacy的核心数据结构。

1. Legacy遗产

~~~Move
struct Legacy has key, store {
		payer: address,// 委托人
		payee: address,// 受益人
		total_value:u64,// 总的金额
		times:u64,// 总的释放次数
		freq:u64,// 释放周期
		unpaid: vector<Payment>,// 线性释放的款项
}
~~~

先看一下这个Legacy的struct，有key和store的ability，那意味着，Legacy只能索引和存储，不能被drop和copy。

2. Payment款项

~~~Move
struct Payment has key, store {
		id: u64,// 唯一标识
		value: u64,// 值
		balance: Token<STC>,// STC
		time_lock: u64,// 时间锁，STC释放时间
}
~~~

Payment的struct跟Legacy一样，也只能索引和存储，不能被drop和copy。

Legacy和Payment这么设计有很多安全方面的好处：

* Legacy或者Payment不能在传输的过程中凭空丢掉，不会产生「丢币」的问题
* Legacy或者Payment也不能拷贝，任何时候都不能从一个Legacy实例生成另一个Legacy实例，意味着没法通过拷贝进行「不安全的增发」
* Legacy或者Payment是一个完整的整体，只能通过合约的function进行修改，合约外部只能存储，不能修改

上面提到的这些安全特性，并不需要开发者特别注意，Move帮助开发者自动处理了。



## function定义

1. init_legacy函数

~~~Move
public(script) fun init_legacy(account: signer, payee: address, total_value: u64, times: u64, freq: u64)
~~~

上面是init_legacy函数的签名，这个函数根据参数初始化Legacy信息，Legacy会作为资源存储安全地在当前用户的账号下。有几个地方说明一下：

* script函数可见性：这个函数只能当成交易执行，不能被其他函数调用
* 函数没有返回值
* payee指定能赎回STC的地址，total_value表示总的STC个数，times表示当前Legacy包含的Payment个数，每个Payment的STC个数：total_value/times，Payment之间时间间隔是freq秒

2. redeem函数

~~~Move
public(script) fun redeem(account: signer, payer: address) acquires Legacy
~~~

以上是redeem函数的签名，这个函数用于赎回Payment。这里简单说明一下：

* 也是script函数可见性
* 函数也没有返回值
* payer可以是创建Legacy的账号地址，也可以是创建Legacy的时候指定的payee
* acquires：设置当前函数使用到、并且在当前合约中定义的struct，这里是Legacy
* 具体能取出多少Payment：（当前时间 — 上次赎回时间）/ freq，如果第一次取，上次赎回时间=初始化Legacy时间



## 思考

合约本身不复杂，但是覆盖的场景很多。

我们从合约的角度来分析一下优缺点。

1. 合约设计上的优点：

* 数据分散在「初始化Legacy」的账号下，没有大数组问题
* Payment和Legacy都没有drop和copy的ability，安全可靠
* 函数可见性管理得很好，只暴露了init_legacy和redeem这两个入口
* 功能完整

2. 合约可以进一步优化的地方：

* 可以通过泛型支持任何类型的Token，实现成一种更通用的协议；
* 支持形式化验证，通过数学方式证明合约的安全性；
* redeem的时候可以释放掉没有Payment的Legacy
* 同一个账号下只能同时有一笔Legacy
* 还有一些细节，例如times和freq为0，冗余数据的存储



## 总结

MyLegacy是Starcoin公链上的一个安全可靠的Asset-Management项目，虽然叫MyLegacy，但是可以想象的场景很广泛，比如分期结算项目资金等等。

合约总共100多行，既实现了复杂业务逻辑，又有了很好的安全性，这里查看[完整代码](https://github.com/WestXu/mylegacy/blob/master/module/MyLegacy.move)。

