---
title: Starcoin标准NFT协议应用实战
weight: 8
---

## Starcoin的标准NFT协议

```
* 本文由Starcoin社区原创
```

Starcoin使用Move作为智能合约语言，并且巧妙地运用Move语言的优点，定义了一套安全的、可扩展的标准NFT协议，开箱即用，简洁高效。跟以太坊的NFT协议对比，Starcoin的标准NFT协议有更加丰富的特性。Starcoin的标准NFT协议正在一些场景逐步落地，例如CyberRare、IdentifierNFT等，这里介绍另一个应用场景。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvnvu7qelyj613k0boaay02.jpg" alt="cyber_rare" style="zoom:30%;" />

我们想象一下这样的场景。比如某NFT平台周年庆祝活动，回馈老用户，一批老用户能领取到纪念版NFT。这种情况通常的做法是将这批老用户的Address提交到链上。但是如果Address很多，这么处理会面临一些问题：

* 受到单个交易大小的限制；
* 容易出现大数组相关的问题，遍历大数组查找Address，可能导致Gas费激增，如果Gas超出最大限制，数组后面的Address就领不到NFT；

类似的场景还很多，比如空投活动等等。Starcoin针对这种场景，在标准的NFT协议之上，巧妙地设计了一个MerkleNFT模块，能够非常轻松地解决了上面遇到的问题。我们一起深入到源码了解一下MerkleNFT模块。



## MerkleNFT原理分析

MerkleNFT是基于Starcoin标准NFT协议设计的一个有意思的应用，巧用了MerkleTree和标准NFT协议。

1. MerkleTree

我们先来简单了解一下MerkleTree：

![starcoin_nft_merkle](https://tva1.sinaimg.cn/large/008i3skNly1gvo5f6rsthj609q06xglu02.jpg)

上图是一个典型的MerkleTree的例子。了解比特币区块结构的应该知道，区块头有一个Merkle Root，记录了区块交易的Root。如果要验证一个交易是否在区块中，只需要使用交易和交易的Proof构造出MerkleRoot，如果跟区块的MerkleRoot相同，则证明交易存在区块中。

2. MerkleNFT

MerkleNFT也是使用了这样一个MerkleTree。如上图所示，叶子节点换成账户的Address，MerkleRoot是Hash12345678。如果要证明Address3在MerkleTree上，Proof是(Address4、Hash12、Hash5678)。

在前面假设的某NFT平台周年庆中，NFT的领取流程如下：

1). 链下先生成一个MerkleTree，叶子节点是所有老用户的Address；

2). 然后只需要把MerkleTree的Merkle Root以及NFT信息提交到链上，保存到MerkleNFT合约中；

3). 链下把每个Address对应的Proof分发到用户手上；

4). 用户拿着Proof调用MerkleNFT合约领取属于自己的纪念版NFT；

以上是MerkleNFT合约的原理和整体流程，这么做只需要提交MerkleRoot到链上，既不会受到交易大小的限制，也不容易出现大数组问题，非常的便捷。



## MerkleNFT源码分析

前面我们了解了MerkleNFT的核心原理和巧妙设计，我们继续深入到MerkleNFT的源代码，来了解一下MerkleNFT合约的Move实现。

~~~Move
public fun verify(proof: &vector<vector<u8>>, root: &vector<u8>, leaf: vector<u8>): bool
~~~

以上是MerkleProof模块中，校验Proof的verify函数。MerkleProof的功能很明确，主要逻辑是组装用户提交的proof和leaf节点，然后判断跟提交的root是否相等。

跟NFT相关的逻辑在MerkleNFTDistributor模块中。

~~~Move
    struct MerkleNFTDistribution<NFTMeta: copy + store + drop> has key {
        merkle_root: vector<u8>,
        claimed_bitmap: vector<u128>,
    }
    
    public fun register<NFTMeta: copy + store + drop, Info: copy + store + drop>(signer: &signer, merkle_root: vector<u8>, leafs: u64, info: Info, meta: Metadata): MintCapability<NFTMeta>
    
    public fun mint_with_cap<NFTMeta: copy + store + drop, NFTBody: store, Info: copy + store + drop>(sender: &signer, cap:&mut MintCapability<NFTMeta>, creator: address, index: u64, base_meta: Metadata, type_meta: NFTMeta, body: NFTBody, merkle_proof:vector<vector<u8>>): NFT<NFTMeta, NFTBody>
        acquires MerkleNFTDistribution
~~~

MerkleNFTDistributor逻辑也比较简洁，在标准NFT协议实现NFT注册和mint功能：

* MerkleNFTDistribution没有copy和drop的ability，有良好的安全性，最重要的作用是存储Merkle Root等数据；
* register函数调用了NFT协议的register注册NFT的元数据；
* mint_with_cap函数的作用是mint用户需要的NFT，也是调用了NFT协议的函数，这里需要格外注意的是，用户需要传递merkle_proof等MerkleTree相关的参数，会调用MerkleProof模块的verify进行校验，只有校验通过，才能mint成功；

MerkleProof模块和MerkleNFTDistributor模块是MerkleNFT的核心实现，整个逻辑很清晰、简洁，设计上巧用了MerkleTree，降低了逻辑复杂度，是NFT协议很有意思的一个应用场景。感兴趣的可以查看[完整源码](https://github.com/starcoinorg/starcoin/blob/master/vm/stdlib/sources/MerkleNFT.move)。



## **GenesisNFT**源码分析

MerkleNFT是面向泛型编程的通用应用，Starcoin在Stdlib的GenesisNFT模块中用到了。

GenesisNFT模块是Starcoin反馈主网上线前在Proxima挖矿的老用户而设计的合约。任何在Proxima高度为 310000，hash为0x0f2fdd39d11dc3d25f21d05078783d476ff98ca4035320e5932bb3938af0e827(这是Starcoin主网启动的父hash)前挖过块的老用户，都可以通过GenesisNFT获取自己的Starcoin纪念版NFT。

~~~Move
public(script) fun mint(sender: signer, index: u64, merkle_proof:vector<vector<u8>>)
~~~

以上是GenesisNFTScripts模块中的mint函数，是script可见性，任何用户都可以发起这个交易，但是只有MerkleProof合法的用户才能拿到属于自己的纪念版NFT。感兴趣的可以查看[完整源码](https://github.com/starcoinorg/starcoin/blob/master/vm/stdlib/sources/GenesisNFT.move)。



## 总结

Starcoin的NFT协议是一套非常完善的工具，有良好的安全性和可扩展性，可以预见，未来会有非常大的发展空间。MerkleNFT和GenesisNFT巧妙地将MerkleTree与NFT协议结合，轻松解决了大数组等疑难问题，相信在NFT空投等场景下会有非常大的作用。

