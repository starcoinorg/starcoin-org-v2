---
title: Starcoin's Standard NFT Protocol In Action
weight: 18
---

```
* By Starcoin cumminity
```



## Starcoin's Standard NFT Protocol

Earlier we have learned about the development process of the NFT protocol. The characteristics of NFT have gradually evolved from "unique" and "inseparable" to "scarcity" and "combinability." Compared with the NFT protocol of Ethereum, Starcoin full use the advantages of Move in the NFT scenario, and has designed a standard NFT protocol with both security and scalability. Through an in-depth analysis of the ingenious design of the IdentifierNFT and MerkleNFT modules, a preliminary discussion on the application scenarios of the Starcoin standard NFT protocol was carried out.

The value of NFT is being highlighted in many areas, such as games, social networking, audio and video, e-commerce, etc. There are already many practices in the industry:

- Art, such as artworks, collectibles, etc.
- Copyright, such as music, film and television, etc.
- Games, such as card games, game props, etc.
- E-commerce, such as blind box, figure, etc.
- Metaverse
- Finance, such as NFT liquidity, auction, DNFT, etc.
- Fan economy, such as NBA, etc.
- Identity identification, such as punk avatar, virtual identity, DID, NameService, etc.

Next, we select representative NFT application from the above applications to further discuss the application of the Starcoin standard NFT protocol in these scenarios.



## NFT Game Items

When discussing the application of NFT, we have to talk about NFT and games. NFT is widely used in games of chain . The chain game even promoted the development of the underlying NFT protocol to a large extent. There are many similarities between game items and NFT, such as highlighting individuality and carrying value. There is also a very important reason,game items are completely expressed in binary, which is the most typical and perfect application scenario of NFT. Therefore, we introduce an application of Starcoin standard NFT protocol in games through a simple card game.

![starcoin_nft_cards](https://tva1.sinaimg.cn/large/008i3skNly1gw32r19jlsj30ey0b4jrg.jpg)

In the  following, we define 1Card and 2Card in Card module

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

Here we don't discuss what kind of cards L1Card and L2Card represent, nor discuss the game logic of the cards, but analyze the advantages of the design as NFT cards:

- L1CardMeta and L2CardMeta save metadata, do not require strict security, and can be copied and dropped

- L1Card type is one of the simplest NFT
- L2Card type is a combined NFT that contains 2 combined L1Cards
- As NFT, both L1Card and L2Card can only be stored, cannot be copied, and cannot be dropped (this is guaranteed by the virtual machine and does not require additional development)
- Flexible authority control, separate Mint authority and Brun authority
- The function "init" calls the NFT::register_v2 function in the Starcoin standard NFT protocol to register the two types of NFTs, L1Card and L2Card.
- The mint_l1 function and mint_l2 function both call the NFT::mint_with_cap_v2 function in the Starcoin standard NFT protocol mint real NFT

The Starcoin standard NFT protocol design is very simple and efficient, and it can be used directly. In the example, the NFT card game only calls the two functions of the protocol, NFT::register_v2 and NFT::mint_with_cap_v2, which combines NFT with the game very easily. The entire contract is less than 100 lines of code. On the basis of ensuring the security of NFT, it implements the flexible combination of NFT. Those who interested can view [the complete code](https://github.com/starcoinorg/starcoin/blob/master/vm/transactional-tests/tests/testsuite/nft/nft_card.move).



## NFT as a Membership

NFT, as virtual identity, also has a very wide range of applications in social and other fields, such as the very popular cryptopunk and ENS. In fact, on top of the standard NFT protocol, Starcoin specifically encapsulates a set of universal IdentifierNFT protocol for the identity scenario. When we introduced the Starcoin standard NFT protocol, we also introduced the IdentifierNFT module. The IdentifierNFT protocol can be applied to any uniquely identified scenario, including but not limited to the NameService scenario (ENS). Here we introduce another application case of IdentifierNFT as an NFT membership.

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

Here we focus on the logic of NFT as a membership:

- XMembership, as the metadata of the NFT, saves the start time and end time of the member. It does not require strict security, and can be copied and dropped.

- XMembershipBody is a real membership certificate, which contains the membership fee. It must be strictly guaranteed for safety. It cannot be copied or dropped. It is a typical NFT.
- The init function calls NFT::register_v2 to register the NFT type
- The join function is used to apply for membership, and call NFT::mint_with_cap_v2 to cast member NFT credentials, and then call IdentifierNFT::grant to issue member NFT credentials to sender
- The quit function calls IdentifierNFT::revoke to recover the member’s NFT credentials, and destroys the NFT through NFT::burn_with_cap
- do_membership_action calls IdentifierNFT::is_owns to determine the user's membership

The above is an example of using NFT as a member ID, which uses both the standard NFT protocol of Starcoin and the IdentifierNFT module. Although there are only about 100 lines of code, from initializing the NFT to casting, using and destroying the NFT, it covers the entire NFT's life cycle. The contract logic is simple and clear. More importantly, it guarantees the security of NFT and Token. If you are interested, you can view [the complete contract code](https://github.com/starcoinorg/starcoin/blob/master/vm/transactional-tests/tests/testsuite/nft/identifier_nft.move).

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gwb9k9ju6lj30ma0diq3i.jpg" alt="starcoin_nft_vip" style="zoom:30%;" />



## NFT as Purchase Receipt

NFT is also widely used in e-commerce scenarios, such as blind box, and so on. From another e-commerce perspective, we use NFT as a shopping receipt to introduce the application cases of the Starcoin standard NFT protocol in e-commerce scenarios. Let's think about scenarios such as pre-sales, purchase of e-vouchers, tickets, etc. Users use Tokens to purchase NFTs of goods online, and then use NFTs to consume or exchange real objects.

~~~Move
struct BoxMiner has copy, store, drop{
        price: u128,
    }

    struct BoxMinerBody has store{}

		public fun init(sender: &signer, total_supply:u64, price: u128)
		
		public fun mint(sender: &signer): NFT<BoxMiner, BoxMinerBody> acquires BoxMinerMintCapability, NFTInfo
~~~

The above code segement is the main logic of the BoxMiner module:

- BoxMiner is the metadata of the product and does not require strict security
- BoxMinerBody is a credential for the user, which must be secured and cannot be copied or discarded
- The init function is the initialization function, calling NFT::register_v2 to register the NFT type of BoxMiner
- The mint function is used for users to purchase NFT, call NFT::mint_with_cap_v2 to cast NFT

The entire contract is about 50 lines, which not only implements the complete business logic, but also guarantees the safety and reliability of the NFT. If you are interested, you can view [the complete contract code](https://github.com/starcoinorg/starcoin/blob/master/vm/transactional-tests/tests/testsuite/nft/nft_boxminer.move).



## Summarize

Move has a natural advantage in NFT scenarios. Resource type is very close to NFT. At the same time, generic programming allows NFT to be combined arbitrarily. The Starcoin standard NFT protocol flexibly uses the advantages of Move, has more powerful functions and security than the Ethereum NFT protocol, and is more suitable for various scenarios of NFT.

