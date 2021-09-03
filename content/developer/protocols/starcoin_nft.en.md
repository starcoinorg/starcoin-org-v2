+++
title = "NFT Protocol"
date = "2021-08-20"
summary = "Starcoin' s Standard NFT Protocol... "
archives="2020"
author = "Starcoin"

+++

Starcoin' s Standard NFT Protocol

<!--more-->

NFT, fully known as Non-Fungible Token, is being gradually explored as a frontier area of blockchain. Especially in the last two years, more and more forces have joined the NFT ecosystem, and more and more NFT scenarios are being landed and popularized. starcoin is a new generation of public chain infrastructure that uses Move as a smart contract language tailored specifically for DeFi scenarios and linear logic. As the first public chain using the Move smart contract language, Starcoin has inherent and unique advantages in the unique and indivisible NFT scenario, helping developers to easily build secure and reliable NFT applications.



## Ⅰ. Resource-oriented programming

As Starcoin's smart contract language, Move is the first smart contract language that distinguishes between "resource type" and "normal type", and is also the first smart contract language with many enhancements specifically for financial scenarios. Resource types have the following characteristics.

1. non-copyable: while ordinary types can be copied at will (for example, copying a value of type u64), Move has a powerful type system that ensures that resources cannot be copied at any time (for example, the NFT of a resource type cannot be copied). It can be said that "non-replicability" is an important feature necessary for resources with financial properties and is the key to avoid many security vulnerabilities.
2. clear ownership: at the end of the transaction, the resource belongs to the specific account (personal account or multi-signature account), must be clear, there will be no resources disappearing in thin air and other situations.
3. transfer semantics: ownership of the resource cannot be replicated and can only be securely transferred from one account to another when manipulating ownership of the resource.
4. out-of-the-box security: Move's resource type, which not only enhances contract security but is developer-friendly and out-of-the-box.

The move is resource-oriented programming, NFT is a perfect scenario for the resource type.



## II. the secure NFT protocol

In Ethernet's ERC721 protocol, transferFrom is defined.

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

The 2nd _to parameter of transferFrom, corresponding to an address that cannot receive NFT, will result in the loss of NFT, which is a great security risk.

Based on Move's resource type, Starcoin defines a secure standard NFT protocol that nicely provides the following features for NFT: 1.

1. uniqueness, identifying different NFTs.
2. non-replicable, guaranteeing unique NFTs.
3. not disappearing into thin air.
4. indivisible, safeguarding the integrity of the NFT.
5. if the receiving account cannot process the NFT, the transaction will be rolled back, ensuring that the NFT will not be lost.

The protocol is a very strong guarantee that the NFT is safe and secure throughout its life cycle.



## III. Combinable NFT protocols

Starcoin standard NFT protocol, implemented through generic programming, is naturally combinable: 1.

1. multiple NFT of any type can be combined into a new NFT.
2. the ability to combine multiple structures of any type into an NFT
3. the ability to combine multiple NFTs of arbitrary type and multiple structures of arbitrary type into new NFTs.

This natural combinability makes NFT freer.



## Ⅳ. low-cost construction of any type of NFT products

Starcoin provides a standard NFT protocol to guarantee the security of NFT and, at the same time, greatly reduces the development costs for developers.

1. through the way of generic programming, to ensure the scalability of the NFT protocol. developers through generic parameters can easily define any type of NFT, such as card games class NFT or virtual world NFT.
2. standard NFT protocol is simple to rely on.

Standard NFT protocols are developer-friendly, developers only need to focus on business, adding business layer logic on top of the NFT protocol to build a complete NFT product at low cost.



## V. NFT can operate in bulk

In the same transaction can operate multiple NFT, reduce the cost of operation and enhance the user experience.



## Ⅵ. more NFT protocols

For NFT scenarios, Starcoin will consider providing richer NFT-related protocols on top of the standard NFT protocols, for example, the NFT20 protocol to improve NFT liquidity, the INO protocol to focus on the first-time issuance, and so on.



## Ⅶ. Standard NFT Protocol

Standard NFT Protocol

* https://github.com/starcoinorg/starcoin/blob/master/vm/stdlib/modules/NFT.move

* https://github.com/starcoinorg/starcoin/blob/master/vm/stdlib/modules/MerkleNFT.move

[SIP22](https://github.com/starcoinorg/sips/blob/master/sip-22/index.zh.md)