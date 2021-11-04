---
title: 对比以太坊，Starcoin标准NFT协议有哪些亮点？
weight: 16
---

```
* 本文由Starcoin社区原创
```

## 从以太坊的NFT说起

NFT，全称为Non-Fungible Token。NFT因DeFi热潮而流行起来，今年在元宇宙的推波助澜下，更是成为2021年度区块链领域最热门的赛道，在很多领域开花绽放。很多明星也纷纷加持，例如奥尼尔、周杰伦等等。在火爆的行情之余，我们一起深入到NFT的背后，以Starcoin和以太坊的NFT为例，对其一探究竟。

NFT是针对FT提出的不同概念，在其最初的定义中，有2个非常重要的特性：

* 独一无二
* 不可分割

最典型的体现是以太坊的ERC-721协议。从NFT的最初定义来看，很容易与现实的一些场景联系起来，比如艺术品、影视作品。

![星空](https://tva1.sinaimg.cn/large/008i3skNly1gvkl4guslhj607v069q3d02.jpg)

很快，尤其是随着NFT在游戏领域的应用，有人发现ERC-721在设计上有一些缺陷：

1. 使用transferFrom函数，把一个NFT从A账户转给B账户的时候，如果B账户不能接收NFT，将导致NFT进入黑洞，凭空消失，找不回来。所以增加了一个safeTransferFrom函数，这需要合约开发人员在调用函数的时候格外注意。
2. 不支持批量操作NFT。每次只能转一个NFT，在Gas费越来越高或者网络拥堵的情况下，这是个大问题。

为了解决ERC-721的第2个问题，提出了ERC-875。这时候，虽然NFT可以任意转移了。但是NFT之间没有任何联系，只能单独存在。设想一下现实中的这种场景，假设一篇文章的版权是一个NFT，如果把某个作家的很多文章收录起来，一起出版，是不是意味着出版的书籍的版权是一个整体的NFT呢？也就是说，NFT应该具备可组合性，NFT可以跟其他数据组合成新的NFT，反之亦然。新的应用场景催生出新的ERC-998协议，Composable NFT。

前面提到NFT具有独一无二的特性，事实上，在很多真实的场景中，很多有价值的东西采用限量发行，数量很少，但并不一定是严格的独一无二，只能说是非常的稀缺，比如限量版的超跑。这种情况，在游戏行业尤其常见，比如武器、宝石等等游戏道具。为了覆盖这种按类型的NFT场景，衍生出了ERC-1155协议，Semi-Fungible Token。

![erc_721_1155](https://tva1.sinaimg.cn/large/008i3skNly1gvknddsb9lj607v033dfr02.jpg)

上面只介绍了以太坊主要的NFT协议，还有很多没有介绍。随着NFT在更多领域的推广和落地，尤其是游戏和社交领域，NFT的特性也发生了潜移默化的变化，总结为以下两个方面：

* 稀缺性，兼具个性和价值
* 可组合或者可堆叠，注重趣味性和流动性

NFT从ERC-721发展到ERC-1155协议，缝缝补补，其实还是有很多的问题，所以后面还有新的NFT协议，比如ERC-3664。这么多的NFT协议，对开发者来说，有一定的门槛。分析整个协议升级的过程，问题可以归纳为两类：

* 协议的安全性
* 协议的可扩展性

以太坊存在的这两类问题，在Starcoin中被很好的解决。Starcoin使用Move作为智能合约语言，而Move具备面向资源编程和面向泛型编程的能力，有良好的安全性和可扩展性：

* 面向资源编程让Move在NFT场景具有独特的优势，任何Resource类型的结构体天生就是一个NFT，从虚拟机层面保障安全。
* 面向泛型编程，又让Move的结构体能够任意组合，有非常灵活的扩展性。



## Starcoin标准NFT协议

前面我们介绍了以太坊的NFT协议的发展历程以及潜在的问题，并且简单介绍了Move在NFT场景的天然优势。接下来，我们重点介绍一下Starcoin通过Move语言设计的NFT协议。

Starcoin的标准NFT协议使用Move实现，包括了以太坊的NFT协议的特点：

1. 天生的NFT：Move的Resource类型自带NFT属性，不可复制、不能丢弃、不可分割；

2. 可自由组合：
   * 任意NFT组合成新的NFT
   * 任意NFT与任意非NFT(包括FT、基本数据类型、Struct等任何类型)组合新的NFT

3. 批量操作
4. 按类型的NFT

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvlv31k9t9j60zc0caaan02.jpg" alt="starcoin_nft_1" style="zoom:30%;" />

以太坊的NFT协议能够做到的事情，Starcoin的NFT协议都能够轻松做到，并且，Starcoin的NFT协议还有很多以太坊没有的特性：

1. 良好的安全性：从虚拟机的层面保障NFT不可复制、不能凭空消失；
2. 明确的所有权：NFT并不集中存储在合约账户下，而是分散存储在NFT所有者的账户下；
3. 可自定义逻辑：在标准的NFT协议之上，开发者可以自定义合成和拆解等NFT的个性化逻辑；
4. 官方实现：Starcoin在定义NFT协议的同时，对协议进行了代码实现，开箱即用；
5. 协议可复用：针对不同类型的NFT，以太坊需要做不同的实现，Starcoin的标准协议通过泛型让协议可复用；
6. 合理的权限：拆分NFT的管理权限，方便NFT的管理；

可以说，Starcoin的标准NFT协议与以太坊的NFT协议有更丰富的特性，代码简洁高效，并且具备良好的扩展性。



## Starcoin的标准NFT协议

前面对比了以太坊的NFT协议和Starcoin标准NFT协议，并且介绍了Starcoin标准NFT协议的优点。接下来，我们深入到源码，来近距离看一下Starcoin标准库的NFT协议，代码都在Stdlib的NFT.move中。

先来看一下NFT的基本定义。以下是NFT的module中，NFT的定义和主要的操作函数：

~~~Move
		/// The info of NFT type
    struct NFTTypeInfoV2<NFTMeta: copy + store + drop> has key, store {
        register: address,
        counter: u64,
        meta: Metadata,
        mint_events: Event::EventHandle<MintEvent<NFTMeta>>,
        burn_events: Event::EventHandle<BurnEvent<NFTMeta>>,
    }
    
    /// The capability to mint the nft.
    struct MintCapability<NFTMeta: store> has key, store {}
    /// The Capability to burn the nft.
    struct BurnCapability<NFTMeta: store> has key, store {}
    /// The Capability to update the nft metadata.
    struct UpdateCapability<NFTMeta: store> has key, store {}
    
    public fun register_v2<NFTMeta: copy + store + drop>(sender: &signer, meta: Metadata)
    
    public fun mint_v2<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer, base_meta: Metadata, type_meta: NFTMeta, body: NFTBody): NFT<NFTMeta, NFTBody> acquires NFTTypeInfoV2, MintCapability
    
    public fun burn<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer, nft: NFT<NFTMeta, NFTBody>): NFTBody acquires NFTTypeInfoV2, BurnCapability
~~~

上面包含了NFT模块的核心代码，逻辑非常地简洁清晰，是NFT定义、铸造、销毁相关的代码：

* 安全的NFT：没有copy和drop的ability，Move虚拟机保障NFT不能复制、不能丢弃、不能修改，是Resource类型最典型的应用场景；
* 泛型编程：天生具备ERC-998和ERC-1155的特性，并且可以自定义操作泛型参数的逻辑，有非常好的扩展性。
* 权限分离：拆分Mint、Burn、Update的权限，不同的权限可以交给不同的账户进行管理；

NFT铸造出来，既可以单独存储，也可以通过NFTGallery批量存储。我们来看一下NFTGallery的module包含哪些逻辑。

~~~Move
    struct NFTGallery<NFTMeta: copy + store + drop, NFTBody: store> has key, store {
        withdraw_events: Event::EventHandle<WithdrawEvent<NFTMeta>>,
        deposit_events: Event::EventHandle<DepositEvent<NFTMeta>>,
        items: vector<NFT<NFTMeta, NFTBody>>,
    }
    
    public fun accept<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer)
    
    public fun transfer<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer, id: u64, receiver: address) acquires NFTGallery
    
    public fun deposit<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer, nft: NFT<NFTMeta, NFTBody>) acquires NFTGallery
    
    public fun withdraw<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer, id: u64): Option<NFT<NFTMeta, NFTBody>> acquires NFTGallery
    
~~~

上面是NFTGallery模块的核心代码，主要逻辑是对NFT的接收、转账、存款、取款等操作。

以上是NFT.move合约定义的标准NFT协议的核心逻辑，主要是定义了NFT的铸造、接收、转账、存款、取款、销毁等操作，这些逻辑在NFT和NFTGallery这2个module中。除了这2个模块之外，NFT.move还有一个IdentifierNFT的module也非常重要，这是一个很有意思的场景，我们在后面会详细讲。



## Starcoin的NFT场景讨论

前面介绍了Starcoin标准NFT协议的优势，并且深入到代码进行分析。这里在对Starcoin标准NFT协议可能的应用场景进行讨论。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvlv49th05j60mc0ci3yv02.jpg" alt="starcoin_nft_2" style="zoom:33%;" />

最近两年，NFT经历了高速的发展，很多领域都可能会有NFT的应用：

* 艺术类，例如艺术品、收藏品等
* 版权类，例如音乐、影视等
* 游戏，例如卡牌类游戏、游戏道具等
* 电商类，例如潮玩、盲盒、手办等
* 元宇宙
* 金融，例如NFT流动性、拍卖、DNFT等
* 粉丝经济，例如NBA等
* 身份标识，例如朋克头像、虚拟身份、DID、NameService等

NFT在越来越多的场景被应用，变得越来越好玩、越来越流行。Starcoin在NFT领域打造了坚实的基础，生态也已经有NFT应用入驻，例如Cyber Rare，更多NFT的场景在逐步建设中。



## Starcoin的IdentifierNFT实现

前面讨论Starcoin的NFT可能的应用场景时，有唯一标识的类别，里面包含了Name Service。最近比较火的以太坊的ENS（Ethereum Name Service）就属于NFT的这种场景。之所以要Name Service，是为了唯一性，独一无二，辨识度高，易区分，可以简单的类比互联网的域名。可以说，唯一标识是一个特定场景的NFT。因此，Starcoin基于标准NFT协议专门为这个特别的场景设计了一个IdentifierNFT模块。

Starcoin的IdentifierNFT是NFT的一个典型应用，除了能做Name Service，还可以应用到其他类似的场景下，所以功能上比以太坊的ENS更多，覆盖的场景也更广一些。我们来深入了解一下IdentifierNFT模块。

~~~Move
    struct IdentifierNFT<NFTMeta: copy + store + drop, NFTBody: store> has key {
        nft: Option<NFT<NFTMeta, NFTBody>>,
    }
    
    public fun accept<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer) 
    
    public fun grant<NFTMeta: copy + store + drop, NFTBody: store>(cap: &mut MintCapability<NFTMeta>, sender: &signer, nft: NFT<NFTMeta, NFTBody>) acquires IdentifierNFT
    
    public fun revoke<NFTMeta: copy + store + drop, NFTBody: store>(_cap: &mut BurnCapability<NFTMeta>, owner: address): NFT<NFTMeta, NFTBody>  acquires IdentifierNFT 
~~~

IdentifierNFT的作用是把一批任意类型的NFT设置成当前账号的标识，上面是对IdentifierNFT结构体的授权和撤销操作。Name Service只是IdentifierNFT的一个典型应用，还可以做更多的事情，比如把加密朋克的NFT当成标识、把博客地址当成标识等等。

Starcoin的IdentifierNFT模块实现了一个非常有意思的NFT应用场景，感兴趣的朋友可以使用IdentifierNFT注册Starcoin Name Service，也可以参考IdentifierNFT基于Starcoin的标准NFT实现其他的NFT应用。



## 总结

Move是面向资源和面向泛型编程的智能合约语言。Starcoin是首个使用Move作为智能合约语言的无许可公链。Starcoin巧妙地运用了Move在NFT场景的优势，使用极其简洁的代码量，设计出一套完整、功能丰富的标准NFT协议。

Starcoin的标准NFT协议不仅仅实现了ERC-721、ERC-875、ERC-998、ERC-1155等以太坊NFT协议的功能，而且有更丰富的特性，比如良好的安全性、可自定义逻辑、合理的权限、使用简单等等，相信会给NFT领域带来非常大的促进作用。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvlv4tisr3j612i0cydgc02.jpg" alt="starcoin_nft_3" style="zoom:33%;" />

