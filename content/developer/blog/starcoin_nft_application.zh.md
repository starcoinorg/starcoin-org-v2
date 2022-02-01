---
title: Starcoin标准NFT协议的场景分析及落地实践
weight: 18
---

```
* 本文由Starcoin社区原创
```

## Starcoin的标准NFT协议

前面我们了解了NFT协议的发展历程，NFT的特性已经由「独一无二」和「不可分割」逐渐的演变成了「稀缺性」和「可组合」。对比以太坊的NFT协议，Starcoin充分发挥Move在NFT场景的优势，设计了兼具安全性和可扩展等特性的标准NFT协议。通过深入剖析IdentifierNFT和MerkleNFT两个模块的巧妙设计，对Starcoin标准NFT协议的应用场景进行了初步讨论。

NFT的价值正在很多领域凸显出来，常见的比如游戏、社交、音视频、电商等等，业内已经有很多的实践：

* 艺术类，例如艺术品、收藏品等
* 版权类，例如音乐、影视等
* 游戏，例如卡牌类游戏、游戏道具等
* 电商类，例如潮玩、盲盒、手办等
* 元宇宙
* 金融，例如NFT流动性、拍卖、DNFT等
* 粉丝经济，例如NBA等
* 身份标识，例如朋克头像、虚拟身份、DID、NameService等

接下来，我们从上面的场景中，选择有代表性的NFT场景，进一步探讨Starcoin标准NFT协议在这些场景的应用。



## NFT游戏道具

讨论NFT的应用场景，就不得不说NFT与游戏。NFT在链游中应用很广泛。链游甚至在很大程度上促进了底层NFT协议的发展。游戏道具跟NFT有很多相似之处，例如彰显个性、价值承载，还有一个非常重要的原因，游戏道具完全由二进制表达出来，是NFT的一个最典型、最完美的应用场景。所以，我们通过一个简单的卡牌游戏，介绍Starcoin标准NFT协议在游戏方面的应用。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw32r19jlsj30ey0b4jrg.jpg" alt="starcoin_nft_cards" style="zoom:50%;" />

下面的Card模块对L1Card和L2Card的定义：

~~~Move
    struct L1CardMeta has copy, store, drop{
        gene: u64,
    }
    struct L2CardMeta has copy, store, drop{
        gene: u64,
    }

    struct L1Card has store {}
    struct L2Card has store {
        first: L1Card,
        second: L1Card,
    }
    
    public fun init(sender: &signer)
    
    public fun mint_l1(_sender: &signer): NFT<L1CardMeta, L1Card> acquires L1CardMintCapability
    
    public fun mint_l2(_sender: &signer, first: NFT<L1CardMeta, L1Card>, second: NFT<L1CardMeta, L1Card>): NFT<L2CardMeta,L2Card> acquires L1CardBurnCapability, L2CardMintCapability
~~~

这里我们不讨论L1Card和L2Card代表什么样的卡牌，也不讨论卡牌的游戏逻辑，而是分析作为NFT卡牌，设计上的优点：

* L1CardMeta和L2CardMeta保存元数据，不需要严格保证安全，可以复制、丢弃
* L1Card类型是一个最简单的NFT
* L2Card类型是包含2个组合L1Card的组合型NFT
* 作为NFT，L1Card和L2Card都只能存储、不能复制、不能凭空丢弃（这是虚拟机保证的，并不需要额外开发）
* 灵活的权限控制，将Mint权限和Brun权限分开
* init函数调用了Starcoin标准NFT协议中的NFT::register_v2函数注册L1Card和L2Card这两种类型的NFT
* mint_l1函数和mint_l2函数都调用了Starcoin标准NFT协议中的NFT::mint_with_cap_v2函数mint真正的NFT

Starcoin标准NFT协议设计非常简洁高效，开箱即用。例子中，NFT的卡牌游戏，只调用了协议的NFT::register_v2和NFT::mint_with_cap_v2两个函数，非常轻松地把NFT和游戏结合起来了。整个合约不到100行代码，在保障NFT安全的基础上，实现了NFT的灵活组合。感兴趣的可以查看[完整代码](https://github.com/starcoinorg/starcoin/blob/master/vm/transactional-tests/tests/testsuite/nft/nft_card.move)。

Starcoin标准NFT协议通过Move的泛型，拥有了灵活的可堆叠性，也支持批量操作，可以非常轻松地应用在游戏场景。



## NFT作为会员身份

NFT作为虚拟身份的标识，在社交等领域也有非常广泛的应用，例如非常火爆的加密朋克和ENS等等。实际上，Starcoin在标准NFT协议之上，针对身份标识场景专门封装了一套通用的IdentifierNFT协议。我们在介绍Starcoin标准NFT协议的时候也介绍过IdentifierNFT模块。IdentifierNFT协议能应用在任何唯一标识的场景，包括但不限于NameService场景（ENS），这里我们介绍另一个IdentifierNFT作为NFT会员身份的应用案例。

~~~Move
		struct XMembership has copy, store, drop{
    		join_time: u64,
    		end_time: u64,
		}

		struct XMembershipBody has store{
        fee: Token<STC>,
    }
    
    public fun init(sender: &signer)
    
    public fun join(sender: &signer, fee: u128) acquires XMembershipMintCapability, XMembershipInfo
    
    public fun quit(sender: &signer) acquires XMembershipBurnCapability
    
    public fun do_membership_action(sender: &signer) acquires XMembershipBurnCapability
~~~

这里聚焦NFT作为会员身份的逻辑：

* XMembership作为NFT的元数据，保存了会员的开始时间以及结束时间，不需要严格保证安全，可以复制和丢弃
* XMembershipBody是真正的会员凭证，里面包含了会员费，必须严格保障安全，不可以复制，也不会凭空消失，是一个典型的NFT
* init函数调用NFT::register_v2注册NFT类型
* join函数用于申请会员，并且调用了NFT::mint_with_cap_v2铸造会员NFT凭证，再调用IdentifierNFT::grant将会员NFT凭证发放给sender
* quit函数调用IdentifierNFT::revoke收回会员NFT凭证，并通过NFT::burn_with_cap销毁NFT
* do_membership_action调用IdentifierNFT::is_owns判断用户的会员身份

以上是使用NFT作为会员标识的例子，里面既使用了Starcoin的标准NFT协议，也运用了IdentifierNFT模块。虽然只有大概100行代码，从初始化NFT开始，到铸造、使用以及销毁NFT，覆盖了整个NFT的生命周期。合约逻辑简单清晰，更重要的是保障了NFT和Token的安全，感兴趣的可以查看[完整合约代码](https://github.com/starcoinorg/starcoin/blob/master/vm/transactional-tests/tests/testsuite/nft/identifier_nft.move)。

NFT作为虚拟身份的场景还有很多，Starcoin未来会推出更多的应用。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gwb9k9ju6lj30ma0diq3i.jpg" alt="starcoin_nft_vip" style="zoom:30%;" />



## NFT作为购物凭证

NFT在电商场景也被广泛应用，例如盲盒、潮玩等等。我们从另一个电商角度，将NFT作为购物凭证，来介绍Starcoin标准NFT协议在电商场景的应用案例。我们想想一下预售、购买电子券、门票等场景，用户线上使用Token购买商品的NFT，然后用NFT去消费或者兑换实物。

~~~Move
    struct BoxMiner has copy, store, drop{
        price: u128,
    }

    struct BoxMinerBody has store{}

		public fun init(sender: &signer, total_supply:u64, price: u128)
		
		public fun mint(sender: &signer): NFT<BoxMiner, BoxMinerBody> acquires BoxMinerMintCapability, NFTInfo
~~~

以上是BoxMiner模块的主要逻辑：

* BoxMiner是商品的元数据，不需要严格保障安全
* BoxMinerBody是给用户的凭证，必须保障安全，不能复制和丢弃
* init函数是初始化函数，调用NFT::register_v2注册BoxMiner的NFT类型
* mint函数用于用户购买NFT，调用NFT::mint_with_cap_v2铸造NFT

整个合约大概50行，既实现了完整的业务逻辑，又保障了NFT的安全可靠，感兴趣的可以查看[完整合约代码](https://github.com/starcoinorg/starcoin/blob/master/vm/transactional-tests/tests/testsuite/nft/nft_boxminer.move)。

电商场景对资产安全的要求更严格。Move正是为金融场景打造的高安全性的智能合约语言。Starcoin标准NFT协议正是通过Move实现，这种得天独厚的安全性，让Starcoin标准NFT协议特别适合电商场景。



## 总结

Move在NFT场景具有天生的优势，Resource类型跟NFT非常地接近，同时，泛型编程让NFT可随意组合。Starcoin标准NFT协议灵活运用了Move的优势，拥有比以太坊的NFT协议更强大的功能和安全性，更加适合NFT的各种场景。

