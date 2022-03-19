---
title: 深度对比|ERC20与Starcoin的Token协议
weight: 19
---

```
* 本文由Starcoin社区原创
```



## Ethereum的ETH和ERC20

Ethereum开创性地使用了Account模型，并且设计了两种类型的账户：外部账户EOA(Externally Owned Account)和合约账户CA(Contract Account)。这两种类型的账户区别很大，最重要的区别是：能不能存储合约代码。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw4119di3vj312o0l6myl.jpg" alt="ethereum_account" style="zoom:33%;" />

外部账户不能存储代码，而合约账户可以存储代码。这种设计本质上是将ETH当成一等公民！外部账户EOA的Balance只能存储ETH。合约账户则用来保存合约代码，同时，集中存储合约产生的所有数据。以ERC20协议的Token为例，我们假设是ERC20Token。用户拥有的ERC20Token其实并不在自己的EOA账户下（EOA账户只能保存ETH），而是在ERC20Token合约账户中，记录一行Address和数量的映射关系（如图，黑色加粗虚线部分）。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw42kguzwuj30j707t0ta.jpg" alt="ethereum_account_token" style="zoom:67%;" />

从上面的对比，我们看到一些问题：

* Ethereum将Token分成地位不对等的两类Token，功能特性有差别
* ETH是一等公民，而ERC20的Token只是普通数据
* 用户持有ERC20的Token其实并不在用户自己的账户下，而是在别人的合约账户下
* ERC20的Token被“囚禁”在实现的合约里，不能跨合约使用



## Starcoin的Token协议

Starcoin虽然使用了Account模型，并且也区分外部账户EOA(Externally Owned Account)和合约账户CA(Contract Account)，但是跟Ethereum的账户不同。Starcoin的两种账户相对统一，唯一的区别是，合约账户没有签名权SignerCapability，其他的特性完全一样，比如都能够存储数据和合约代码，等等。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw43q501eij30bz08z3yq.jpg" alt="starcoin_account_token" style="zoom:70%;" />

Starcoin的Token跟Ethereum的Token也不一样：

* Starcoin有一套统一的Token协议，所有的Token都通过协议定义，包括Starcoin经济模型的STC
* Starcoin只有一种类型的Token，所有的Token在功能特性上完全对等
* 任何账户可以保存任何类型的Token，用户自己的Token保存在自己的账户下，拥有明确的所有权
* 任何账户都可以注册新的Token
* Starcoin的Token是一种Resource类型，Move虚拟机会保证Token不能拷贝，也不能凭空消失，避免无限增发或者进入黑洞等安全问题，拥有强大的安全性
* Starcoin的Token可以自由组合嵌套成为新的Token
* Starcoin的Token可以当成其他任何合约的数据来应用
* Starcoin有一套灵活、精细的Token权限管理和释放方式
* 官方实现，代码可复用

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw4413mziqj30n60c9gmc.jpg" alt="starcoin_account_example" style="zoom:50%;" />



## Token协议源码解析

Starcoin的Token协议弥补Ethereum的ETH和ERC20的不足。我们深入到源码，了解一下Token协议的实现。

~~~
    /// The token has a `TokenType` color that tells us what token the
    /// `value` inside represents.
    struct Token<TokenType> has store {
        value: u128,
    }
    
    /// Token information.
    struct TokenInfo<TokenType> has key {
        /// The total value for the token represented by
        /// `TokenType`. Mutable.
        total_value: u128,
        /// The scaling factor for the coin (i.e. the amount to divide by
        /// to get to the human-readable representation for this currency).
        /// e.g. 10^6 for `Coin1`
        scaling_factor: u128,
        /// event stream for minting
        mint_events: Event::EventHandle<MintEvent>,
        /// event stream for burning
        burn_events: Event::EventHandle<BurnEvent>,
    }
~~~

Starcoin的Token协议中，最核心的是Token和TokenInfo：

* Token是真正的资产（value表示数量），有极高的安全要求，所以必须是不能复制和不能丢弃的类型
* TokenInfo保存了Token元数据（scaling_factor表示精度）和市场流通（total_value表示总量）等数据，也不能出差错，所以同样不能复制和不能丢弃

~~~Move
    /// Token Code which identify a unique Token.
    struct TokenCode has copy, drop, store {
        /// address who define the module contains the Token Type.
        addr: address,
        /// module which contains the Token Type.
        module_name: vector<u8>,
        /// name of the token. may nested if the token is a instantiated generic token type.
        name: vector<u8>,
    }
~~~

TokenCode是区别不同Token的唯一方式，只有addr、module_name、name这3个属性都完全相等的时候，才表示同一种Token。

~~~Move
    /// Register the type `TokenType` as a Token and got MintCapability and BurnCapability.
    public fun register_token<TokenType: store>(
        account: &signer,
        precision: u8,
    )
    
    /// Return `amount` tokens.
    /// Fails if the sender does not have a published MintCapability.
    public fun mint<TokenType: store>(account: &signer, amount: u128): Token<TokenType> acquires TokenInfo, MintCapability
    
    /// Burn some tokens of `signer`.
    public fun burn<TokenType: store>(account: &signer, tokens: Token<TokenType>) acquires TokenInfo, BurnCapability
    
    public fun withdraw<TokenType: store>(
        token: &mut Token<TokenType>,
        value: u128,
    ): Token<TokenType>
    
    public fun deposit<TokenType: store>(token: &mut Token<TokenType>, check: Token<TokenType>)
~~~

上面的函数覆盖了整个Token的生命周期：注册、铸造、销毁、充值、提款。

Starcoin的Token协议重复发挥了Move的优势，设计了安全的Token类型和TokenInfo类型，通过泛型参数的方式，保证Token可自由组合、协议可扩展，点击查看[完整代码](https://github.com/starcoinorg/starcoin-framework/tree/main/sources/Token.move)。



## STC源码解析

Token协议的第一个应用是Starcoin的STC。STC是Starcoin网络的原生Token，发行账号是 0x1 这个创世账号。在Starcoin的经济模型中，STC作为区块奖励，起到了保护网络安全的重要作用。同时也用于支付交易Gas、链上治理和状态付费。更多信息参看[Starcoin的经济白皮书](https://starcoin.org/zh/overview/economy_whitepaper/)。

![starcoin_ecosystem](https://tva1.sinaimg.cn/large/008i3skNly1gw49l596tnj30dt077gm1.jpg)

~~~Move
    /// STC token marker.
    struct STC has copy, drop, store { }

    /// precision of STC token.
    const PRECISION: u8 = 9;
~~~

这是STC的部分元数据：

* STC代表TokenType。
* PRECISION表示精度

STC的完整TokenCode是0x1::STC::STC，分别对应addr、module_name、name这3个属性。定义好了STC，只需要调用Token协议进行操作：

* 注册STC：Token::register_token，由于STC的特殊行，只能在创世交易中使用0x1账户注册

* 铸造STC：Token::mint，在创世交易中铸造，同时把所有STC托管到Treasury中锁定
* 共享销毁权：把BurnCapability存放在SharedBurnCapability中，任何人可以使用

STC是一种通过Starcoin的Token协议定义的Token，跟其他Token一样，继承了Token协议的所有功能，查看[完整代码](https://github.com/starcoinorg/starcoin-framework/tree/main/sources/STC.move)。



## 自定义一个MyToken

因为Token协议是官方已经实现的合约，在Starcoin定义一个自己的Token是非常容易的（STC的合约也非常简洁）。只需要定义一个MyToken的类型，然后调用Token协议的register_token函数进行注册，就可以通过Token协议的mint函数去铸造MyToken了。

~~~Move
1   module MyToken {
2       use 0x1::Token;
3       use 0x1::Account;
4
5       struct MyToken has copy, drop, store { }
6
7       public(script) fun init(account: signer) {
8           let _account = &account;
9           Token::register_token(_account, 3);
10          Account::do_accept_token(_account);
11      }
12
13      public(script) fun mint(account: signer, amount: u128) {
14          let _account = &account;
15          let token = Token::mint(_account, amount);
16          Account::deposit_to_self(_account, token)
17      }
18  }
~~~

上面只是一个简单、可跑通的例子。如果要给MyToken赋予一定的价值，还需要去实现自身的业务逻辑。



## 总结

Starcoin拥有统一的Token协议，任何账户都可以使用跟STC完全一样的方式，通过Token协议定义自己的资产。Token能够以任何形式存储在任何账户中，也可以跨合约表达不同的业务逻辑，应对任何形式的业务场景。在所有的场景中，Token具有天生的安全性，Move虚拟机会保障Token不可以复制和不可丢弃，并且只能调用Token协议提供的函数进行有限的修改。

