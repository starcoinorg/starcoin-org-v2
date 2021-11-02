---
title: Starauction Source Code Analysis 
weight: 7
---

~~~
By Starcoin community 
~~~

## Starauction

Starauction is a competition project of first Starcoin&Move hackathon, submitted by Mars&Earth team. Starauction is a decentralized auction project, build in Move. There are two roles in Staracution, auctioneer and bidder. Auctioneer create auction and goods or service which is used to sell, then wait for to start bidding.  There are people to bid and there is no auction time left, this auction is successful, otherwise, the auction is fail.

Starauction is a general auction protocol, we will learn how to implement a general auction protocol by analysing Starauction's source code. The below figure is the whole design of Starauction:

![move_starauction](https://tva1.sinaimg.cn/large/008i3skNly1guaic5fwpmj60az04lt8q02.jpg)

From the above figure, let's have a look the design:

1. Core Data
   * auction
2. Core Function
   * create
   * deposit
   * bid



## Data Structure

1. Auction

   Auction is the core data structure of Starauction, here is the definition of auction:

   ```Move
   struct Auction<ObjectiveTokenT, BidTokenType> has key {
           start_time: u64,// start time 
           end_time: u64,// end time
           start_price: u128,// start price
           reserve_price: u128,//reserve price
           increments_price: u128,//increments price
           hammer_price: u128,//hammer price
           hammer_locked: bool,//hammer locked
   
           seller: Option::Option<address>,//auctioneer address
           seller_deposit: Token::Token<BidTokenType>,//auctioneer deposit
           seller_objective: Token::Token<ObjectiveTokenT>,//auctioneer objective
   
           buyer: Option::Option<address>,//bidder address
           buyer_bid_reserve: Token::Token<BidTokenType>,//bid reserve
   
           auction_created_events: Event::EventHandle<AuctionCreatedEvent>,//crete auction events
           auction_bid_events: Event::EventHandle<AuctionBidedEvent>,//bid events
           auction_completed_events: Event::EventHandle<AuctionCompletedEvent>,//auction complete events
           auction_passed_events: Event::EventHandle<AuctionPassedEvent>,//auction is passed events
       }
   ```

   Definition in auction:

   * Two generics parameters: ObjectiveToken and BidTokenType, can do any type auction
   * Only has key ability, this means it does not have drop and copy ability, can be indexed
   * Include AuctionCreatedEvent、AuctionBidedEvent、AuctionCompletedEvent、AuctionPassedEvent

2. Auc

   ```Move
   struct Auc has copy, drop, store {}
   ```

   Auc is Token meta data of Token protocol, Token is real Token,so Auc can be copied and dropped 



## Core function definition

There are many functions in Starauction, but we only concern the core functions

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

   This function is used to create Auction, anyone can create an auction, the creator of auction and auctioneer can be different person

   * Function visibility is public 

   * Generic programming, support all type general protocol

   * Data is stored in the account that called this function, so it's discrete storage

2. deposit

   ```Move
   public fun deposit<ObjectiveTokenT: copy + drop + store, BidTokenType: copy + drop + store>()
   ```

   This function is used to mortgage auction items, any one can mortgage auction items and this person will be the seller of these items.

   * Function visibility is public 

   * Generic programming, support all type general protocol

3. bid

   ```Move
   public fun bid<ObjectiveTokenT: copy + drop + store,
                      BidTokenType: copy + drop + store>(account: &signer,
                                                         creator: address,
                                                         bid_price: u128) acquires Auction
   ```

   Anyone except those who mortgages auction items can bid.

   * Function visibility is public 

   * Generic programming, support all type general protocol

   * 'acquires' means that the current contract's Auction

4. other function

   * destroy: destroy one Auction 

   * hammer_buy: hammer price, buyer can directly buy

   * completed: complete,clear out resource



## Summary

Starauction is a relatively completed auction protocol. Let's take a look at the advantages and disadvantage in the perspective of code.

1. Advantages

   * Auction does not have drop ability, so can not be dropped
   * Auction does not have copy ability, so can not be copied, so do not need to worry about unlimited additional issuance
   * Auction data are discrete stored in each account that called "create" function
   * Generic programming, designed general auction protocol, support all types
   * Defined completed Events, it's convenient for off-chain monitoring
   * Full auction function, such as hammer bidding
2. Disadvantages

   * No formal verification

   * Do not support non-Token auction items

In conclusion, Starauction contract is almost completed, and also take the advantage of Move, please check [full code](https://github.com/starcoinorg/starauction-core). 