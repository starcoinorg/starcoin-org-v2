---
title: RedPackage Source Code Analysis 
weight: 8
---

~~~
By Starcoin community
~~~

## RedPackage

RedPackage is a exciting and practical tool designed by 'wormhole' studio of first Starcoin&Move hackathon. Use Move smart contract to define a secure and reliable SHIBA, and designed an interesting lucky red packet logical, published on Starcoin, provided a function to try our luck on the blockchain. RedPackage is a general protocol, you can use any struct which has store ability as red packet data. 

>P.S. what is red packet?
>Wikipedia  https://en.wikipedia.org/wiki/Red_envelope. 
>Red packet in china is a monetary gift given during holidays, especially in spring festival. It's represent good luck and happiness. It's popular to share one red packet with others, got most money from this red packet means you are the luckiest one!!!!!!

We will learn how to implement a general red packet protocol by analysing RedPackage 's source code. The below figure is the whole design of RedPackage :

![move_ red_package](https://tva1.sinaimg.cn/large/008i3skNly1gu6xrv4ms2j60iz05l0su02.jpg)

From the above figure, let's have a look the design:
1. Core Data
	* RedPackage
2. Core Function
   * create
   * claim

Initiator of the red packet create a RedPackage by calling "create" funciton, and <u>split these data into many pieces</u>, save in the current account. User can claim red packet by calling "claim" function.



## Data Structure

RedPackage's design is simple, there are four data structure, let's have a look one by one:

1. RedPackage

   Auction is the core data structure of RedPackage, here is the definition of auction:

   ```Move
   struct RedPackage<TokenType: store> has store {
       merkle_root: vector<u8>,// red packet id
       tokens: Token::Token<TokenType>,// red packet
       leafs: vector<u128>,// quantity of each red packet
       claimed: vector<address>,// claim address
   }
   ```

   All red packet data are stored in RedPackage, all main logic also in the RedPackage 

   * It does not have drop ability, can not be dropped
   * It does not have copy ability,  so can not be copied, so do not need to worry about unlimited additional issuance

2. SHIBA

   ```Move
   struct SHIBA has copy, drop, store {}
   ```

   This is a normal strcut,  but it's a meaningful resource after being registered by Token protocol, if you are interested in these,please check Starcoin's Token protocol

3. SharedMintCapability

   ```Move
   struct SharedMintCapability has key, store {
       cap: Token::MintCapability<SHIBA>,
   }
   ```

4. SharedBurnCapability

   ```Move
   struct SharedBurnCapability has key, store {
       cap: Token::BurnCapability<SHIBA>,
   }
   ```

   SharedBurnCapability represents that SHIBA has Burn authority.



## Core function definition

There are many functions in RedPackage, but we only concern the core functions

1. create

   ```Move
   public fun create<ObjectiveTokenT: copy + drop + store,
                         BidTokenType: copy + drop + store>(account: &signer,
                                                            start_time: u64,
                                                            end_time: u64,
                                                            start_price: u128,
                                                            reserve_price: u128,
                                                            increments_price: u128,
                                                            hammer_price: u128)
   ```

   "create" function is the entrance to initiate a red packet, will store RedPackage in the initiator's account  

   * Generic programming, this is a scalable design, any struct with store ability can call this function

   * Function visibility is public, <u>so need to define script to call this function</u>

   * Red packet's random logic does not exist in this contract

2. claim

   ```Move
   public fun claim<TokenType: store>(account: &signer, owner_address: address, merkle_root: vector<u8>)
   ```

   This function is used to claim red packet, user need to specify the imitator's address and id to claim red packet. 



## Capability

Capability represents authority in stdlib of Starcoin.

In centralized system, we usually use a bool variable to decide one user has authority or not. In real scenario, authority is owned by one specific person or one specific certain type of person, it's a rare resource. Move is resource-oriented programming, so, we will use a resource type struct to represent authority. This is an interesting programming paradigm, it's common in Starcoin's stdlib. More capability,check [this link](https://starcoin.org/zh/developer/stdlib/stdlib/).

In RedPackage,SharedMintCapability represents SHIBA's Mint's authority，SharedBurnCapability represents SHIBA's Burn's authoriy.



## Summary

RedPackage is quite practical project. Let's take a look at the advantages and disadvantage in the perspective of code.

1. Advantages

   * Generic programming, designed general protocol, support all types

   * RedPackage does not have copy and drop ability, so it's secure and reliable

   * SHIBA used Token protocol of stdlib

   * Mint and Burn are designed to have capability

   * Fully functionalities

   * Each account can store different type red packet

   

2. Disadvantages

   * "create" and "claim" function should use public visibility

   * Should define Events to monitor key data state change 

   * Put random logic on chain by Oracle protocol

In conclusion, RedPackage takes the advantage of Move,such as, Capabililty of RedPackage, please check [full code](https://github.com/reilost/meteor/tree/main/meteor-contract/src/modules). 