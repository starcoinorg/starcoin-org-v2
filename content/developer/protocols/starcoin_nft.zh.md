+++
title = "NFT 协议"
date = "2021-08-20"
summary = "Starcoin标准NFT协议... "
archives="2021"
author = "Starcoin"

+++

## Starcoin标准NFT协议

NFT全称为Non-Fungible Token，作为区块链的前沿领域，它的价值正在被逐步发掘出来。尤其最近两年，越来越多的力量加入到NFT生态，越来越多的NFT场景被落地并流行起来。Starcoin是新一代的公链基础设施，使用了专门为DeFi场景定制的、线性逻辑的Move作为智能合约语言。作为首个使用Move智能合约语言的公链，在独一无二且不可分割的NFT场景下，Starcoin具有天生的、独特的优势，能够帮助开发者轻松地构建安全可靠的NFT应用。



## 一、面向资源编程

作为Starcoin的智能合约语言，Move是首个区分「资源类型」和「普通类型」的智能合约语言，也是首个专门为金融场景做了很多增强的智能合约语言。资源类型有以下特点：

1. 不可复制：普通类型可以任意复制（例如，拷贝一个u64类型的值），Move有强大的类型系统，保证资源在任何时候都不可以复制（例如，不能复制资源类型的NFT）。可以说，“不可复制”是具有金融属性的资源所必备的一个重要特性，是避免很多安全漏洞的关键所在；
2. 明确的所有权：在交易结束时，资源具体属于哪个账户（个人账户或者多签账户）所有，必须明确，不会出现资源凭空消失等其他情况；
3. 转移语义：资源的所有权不可复制，在操作资源的所有权时，只能从一个账户安全地转移给另一个账户；
4. 开箱即用的安全性：Move的资源类型，不但提升了合约安全性，而且对开发者友好，开箱即用；

Move是面向资源编程的，NFT正是资源类型的一个完美场景。



## 二、安全的NFT协议

在以太坊的ERC721协议中，定义了transferFrom：

```
function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
```

transferFrom的第2个_to参数，对应的地址如果不能接收NFT，将导致NFT丢失，存在很大的安全隐患。

基于Move的资源类型，Starcoin定义了一套安全的标准NFT协议，很好地为NFT提供了以下特点：

1. 独一无二，标识不同的NFT；
2. 不可复制，保障NFT唯一；
3. 不会凭空消失；
4. 不可分割，保障NFT的完整性；
5. 如果接收账号不能处理NFT，交易将会回滚，确保NFT不会丢失；

该协议非常有力地保障了NFT在它的整个生命周期中安全可靠。



## 三、可组合的NFT协议

Starcoin标准的NFT协议，通过泛型编程实现，天然具备可组合性：

1. 可以将多个任意类型的NFT组合成新的NFT；
2. 可以将多个任意类型的结构体组合成NFT；
3. 可以将多个任意类型的NFT和多个任意类型的结构体组合成新的NFT；

这种天然的可组合性，让NFT更自由。



## 四、低成本构建任意类型的NFT产品

Starcoin提供标准NFT协议，保障NFT的安全性，同时，也极大程度降低了开发者的开发成本：

1. 通过泛型编程的方式，保障了NFT协议的扩展性。开发者通过泛型参数，可以轻松地定义任意类型的NFT，例如卡牌游戏类的NFT或者虚拟世界的NFT；
2. 标准NFT协议简单可以依赖。

标准的NFT协议对开发者友好，开发者只需要关注业务，在NFT协议之上增加业务层逻辑，低成本构建完整的NFT产品。



## 五、NFT可批量操作

在同一个交易中可操作多个NFT，降低操作的成本，提升用户体验。



## 六、更多NFT协议

针对NFT场景，Starcoin在提供标准NFT协议的基础上，将会考虑提供更丰富的NFT相关的协议，例如，提高NFT流动性的NFT20协议、专注首次发行的INO协议等等。



## 七、标准NFT协议

标准NFT协议

* https://github.com/starcoinorg/starcoin-framework/tree/main/sources/NFT.move

* https://github.com/starcoinorg/starcoin-framework/tree/main/sources/MerkleNFT.move

[SIP22](https://github.com/starcoinorg/sips/blob/master/sip-22/index.zh.md)