---
title: Compared with Ethereum, what are the highlights of the Starcoin's standard NFT protocol?
weight: 16
---

```
* By Starcoin community 
```


## Ethereum's NFT

NFT, short for Non-Fungible Token. NFT became popular due to the DeFi explosion. This year, with the boom of Metaverse, NFT has become the most popular track in the blockchain field in 2021, has been applied in many fields. Many superstars have also joined, such as O'Neal, Jay Chou and so on. Apart from the hot market, we went deep into the back of NFT together, taking Starcoin and Ethereum's NFT as examples to find out.

NFT is a different concept proposed for FT. In its original definition, there are 2 very important characteristics:

- unique
- Indivisible

The most typical application is the ERC-721 protocol of Ethereum. From the original definition of NFT, it is easy to connect with some scenes, such as artworks and film and television works.

![星空](https://tva1.sinaimg.cn/large/008i3skNly1gvkl4guslhj607v069q3d02.jpg)

Soon, especially with the application of NFT in the game field, it was discovered that ERC-721 had some flaws in its design:

1. When using the transferFrom function to transfer an NFT from account A to account B, if account B cannot receive the NFT, it will cause the NFT to enter a black hole,and cannot be retrieved. So a safeTransferFrom function is added, which requires contract developers to pay special attention when calling the function.
2. Batch operation of NFT is not supported. Only one NFT can be transferred in one transaction, which is a big problem when the gas fee is getting higher or the network is congested.
   In order to solve the second problem of ERC-721, ERC-875 was proposed. At this time, although NFT can be transferred arbitrarily,but there is no connection between NFTs, they can only exist alone. Imagine this scenario in reality,suppose that the copyright of an article is an NFT,if many articles of a certain author are collected and published together, does it mean that the copyright of the published books is an NFT as a whole? In other words, NFT should be composable, NFT can be combined with other data to form a new NFT, and vice versa. New application scenarios gave birth to a new ERC-998 protocol, Composable NFT.

As mentioned earlier, NFT has unique characteristics. In fact, in many real scenarios, many valuable things are issued in limited quantities, and the amount is small, but it is not necessarily strictly unique. It is only very scarce. A limited edition supercar. This situation is especially common in the game industry, such as weapons, gems and other game items. In order to cover this type of NFT scenario, the ERC-1155 protocol, Semi-Fungible Token, was derived.

![erc_721_1155](https://tva1.sinaimg.cn/large/008i3skNly1gvknddsb9lj607v033dfr02.jpg)

The above content only introduces the main NFT protocol of Ethereum, and there are many others that have not been introduced. With the promotion and application of NFT in more fields, especially games and social fields, the characteristics of NFT have also undergone subtle changes, which can be summarized in the following two aspects:

- Scarcity, both personality and value
- Can be combined or stacked, focusing on fun and fluidity

NFT has developed from ERC-721 to ERC-1155 protocol. In fact, there are still many problems, so there are new NFT protocols, such as ERC-3664. With so many NFT protocols, there are certain thresholds for developers. Analyzing the entire protocol upgrade process, the problems can be summarized into two categories:

- Security of the protocol
- Scalability of the protocol

These two types of problems in Ethereum are well solved in Starcoin. Starcoin uses Move as a smart contract language, and Move is resource-oriented programming language and generic programming capabilities, with good security and scalability:

- Resource-oriented programming gives Move a unique advantage in NFT scenarios. Any Resource-type structure is born for NFT, which guarantees security from the virtual machine level.
- Generic programming,the Move structure can be combined arbitrarily, with very flexible scalability.


## Starcoin's standard NFT protocol

Earlier we introduced the development history and potential problems of the NFT protocol of Ethereum, and briefly introduced the natural advantages of Move in the NFT scenario. Next, we will focus on the NFT protocol designed by Starcoin using the Move language.

Starcoin's standard NFT protocol is implemented using Move, which includes the characteristics of Ethereum's NFT protocol:

1. Natural NFT: The Resource type of Move has its own NFT attributes, which cannot be copied, discarded, and indivisible;
2. Free combination: Combine any NFT into a new NFT, Combine any NFT with any non-NFT (including any types such as FT, basic data types, Struct, etc.) into new NFT
3. Batch operation
4. Any type NFT

![starcoin_nft_1](https://tva1.sinaimg.cn/large/008i3skNly1gvlv31k9t9j60zc0caaan02.jpg)

What Ethereum's NFT protocol can do, Starcoin's NFT protocol can easily do, and Starcoin's NFT protocol has many features that Ethereum does not have:

1. Good security: From the virtual machine level, it is guaranteed that NFT cannot be copied or dropped;
2. Clear ownership: NFTs are not stored centrally under contract accounts, but are stored decentralized under the accounts of NFT owners;
3. Customizable algorithm: On top of the standard NFT protocol, developers can customize the NFT's personalized algorithm such as synthesis and disassembly;
4. Official implementation: While defining the NFT protocol, Starcoin implements the protocol, which can be used directly;
5. The protocol is reusable: Ethereum needs to implement different implementations for different types of NFTs. The standard protocol of Starcoin makes the protocol reusable through generics;
6. Reasonable authority: Split the management authority of NFT to facilitate the management of NFT;
7. Free cross-contract: NFT can be moved to any other contract, stored as data of other contracts, and participate in logical calculations (Ethereum can only be stored in the contract defined by NFT);

It can be said that Starcoin's standard NFT protocol have richer features than Ethereum's NFT protocol , the code is simple and efficient, and has good scalability.


## Starcoin's standard NFT protocol

In the previous section, we compared the NFT protocol of Ethereum and the standard NFT protocol of Starcoin, and introduced the advantages of the standard NFT protocol of Starcoin. Next, we dive into the source code to take a closer look at the NFT protocol of the Starcoin standard library. The code is in the NFT.move of Stdlib.

Let's first look at the basic definition of NFT. The following is the definition of NFT and the main operating functions in the NFT module:

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

The above contains the core code of the NFT module. The logic is very concise and clear. It is the code related to NFT definition, casting, and destruction:

- Secure NFT: Without the ability of copy and drop, the Move virtual machine guarantees that the NFT cannot be copied, dropped, or modified, which is the most typical application scenario of the Resource type;
- Generic programming: Born with the characteristics of ERC-998 and ERC-1155, and can customize the logic of operating generic parameters, it has very good scalability.
- Separation of permissions: Split the permissions of Mint, Burn, and Update, and different permissions can be handed over to different accounts for management;

NFT castings can be stored separately or in batches through NFTGallery. Let's take a look at what logic the module of NFTGallery contains.

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

The above is the core code of the NFTGallery module, the main logic is the operation of receiving, transferring, depositing, and withdrawing NFT.

![starcoin_nft_2](https://tva1.sinaimg.cn/large/008i3skNly1gvlv49th05j60mc0ci3yv02.jpg)

In the past two years, NFT has experienced rapid development, and there may be applications of NFT in many fields:

- Art, such as artworks, collectibles, etc.
- Copyright, such as music, film and television, etc.
- Games, such as card games, game props, etc.
- E-commerce, such as blind box, figure, etc.
- Metaverse
- Finance, such as NFT liquidity, auction, DNFT, etc.
- Fan economy, such as NBA, etc.
- Identity identification, such as punk avatar, virtual identity, DID, NameService, etc.

NFT is used in more and more scenarios, becoming more and more fun and popular. Starcoin has built a solid foundation in the NFT field, and the ecosystem has already had NFT applications, such as Cyber Rare, and more NFT scenarios are gradually being constructed.

## Starcoin's IndentifierNFT

When discussing the possible application scenarios of Starcoin's NFT, there are uniquely identified categories, which include Name Service. The recently popular Ethereum's ENS (Ethereum Name Service) belongs to this scenario of NFT. The reason why Name Service is needed is for uniqueness,high recognition and easy distinction, and it can be simply analogized to Internet domain names. It can be said that the unique identifier is the NFT of a specific scene. Therefore, Starcoin designed an IdentifierNFT module specifically for this particular scenario based on the standard NFT protocol.

Starcoin's IdentifierNFT is a typical application of NFT. In addition to same function to Name Service, it can also be applied to other similar scenarios, so it has more functions than Ethereum's ENS and covers a wider range of scenarios. Let's take a closer look at the IdentifierNFT module.

~~~Move
struct IdentifierNFT<NFTMeta: copy + store + drop, NFTBody: store> has key {
        nft: Option<NFT<NFTMeta, NFTBody>>,
    }
    
    public fun accept<NFTMeta: copy + store + drop, NFTBody: store>(sender: &signer) 
    
    public fun grant<NFTMeta: copy + store + drop, NFTBody: store>(cap: &mut MintCapability<NFTMeta>, sender: &signer, nft: NFT<NFTMeta, NFTBody>) acquires IdentifierNFT
    
    public fun revoke<NFTMeta: copy + store + drop, NFTBody: store>(_cap: &mut BurnCapability<NFTMeta>, owner: address): NFT<NFTMeta, NFTBody>  acquires IdentifierNFT 
~~~

The function of IdentifierNFT is to set a batch of any type of NFT as the current account's identity. The above is the authorization and revocation operation of the IdentifierNFT structure. Here, the NFT is transferred to the IdentifierNFT contract, as the core data of the business logic, and finally saved to each user's own account. Name Service is just a typical application of IdentifierNFT, and there are more things that can be done, such as using encrypted punk NFT as a logo, blog address as a identifier, and so on.

Starcoin's IdentifierNFT module implements a very interesting NFT application scenario. Interested people can use IdentifierNFT to register for Starcoin Name Service, or refer to IdentifierNFT to implement other NFT applications based on Starcoin's standard NFT.

## Summarize

Move is a resource-oriented and generic programming smart contract language. Starcoin is the first permissionless public chain to use Move as a smart contract language. Starcoin cleverly used Move's advantages in NFT scenarios, using extremely concise code to design a complete and plentiful standard NFT protocol.

Starcoin's standard NFT protocol not only implements the functions of the Ethereum NFT protocol such as ERC-721, ERC-875, ERC-998, ERC-1155, but also has richer features, such as good security, customizable logic, reasonable permissions, simple use, cross-contracts, etc., are believed to bring a very large promotion effect to the NFT field.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvlv4tisr3j612i0cydgc02.jpg" alt="starcoin_nft_3" style="zoom:33%;" />
