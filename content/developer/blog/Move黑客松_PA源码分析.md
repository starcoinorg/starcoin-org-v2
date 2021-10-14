---
title: P(A)
weight: 2
---

## P(A)

~~~
* By Starcoin Community
~~~

From functional integrity, project completion and other perspectives, P(A) is a brilliant NFT project. P(A) has taken advantage of Move and was designed by MemeX.

We will develop one simple NFT using Move in this chapter by analyzing P(A) source code. 

![move_nft](https://tva1.sinaimg.cn/large/008i3skNly1gu167dvaaoj60hi07m0t602.jpg)

P(A) Design Diagram：

1. Next, let’s have a look core data structure：
* NFT
* NFT_Info
* Market
2. And two key function：

* init_market
* mint

From a logic perspective, the owner of this contract can call ‘init_market’ to initialize one Market, and the general user can call ‘mint’ to buy NFT.



## Struct Definition 

There are many data structures in P(A): Art,NFT,UniqList,NFT_INFO,MARKET. 

![move_nft_2](https://tva1.sinaimg.cn/large/008i3skNgy1gu2fl5297hj60ii05w74c02.jpg)

1. Art

   ~~~Move
   struct Art has store, copy, drop {
       prob_a: u8,
       prob_b: u8,
       param_1: vector<u64>,
       param_2: vector<u64>
   }
   ~~~

   This metadata is used to render NFT, there is no key ability, this means that you can copy,drop and store.

2. NFT

   ~~~Move
   struct NFT has store {
       id: u8,
       next_nft_id: u8,
       next_nft_owner: address,
       data: Art,
       sell_status: bool,
       price: u128,
   }
   ~~~

   This is one NFT, it only has store ability,this means that it cannot be copied and dropped. It utilizes Move VM to guarantee integrity and uniqueness of NFT. 

3. UniqList

   ~~~Move
   struct UniqList has key {
   		data: vector<NFT>
   }
   ~~~

   We use arrays here, but you do not need to worry about big array issues, as every user’s NFT is stored in their own account, so does not affect other accounts.

4. NFT_INFO

   ~~~Move
   struct NFT_INFO has store, drop {
       id: u8,
       next_nft_id: u8,
       next_nft_owner: address,
       data: Art,
       price: u128,
   }
   ~~~

   This is NFT information after NFT has been created, it’s used to display information. Art is a little bit redundant.

5. Market

   ~~~Move
   struct MARKET has key {
       head: address,
       cur_num: u8,
       min_price: u128,
       market_nft_info: vector<NFT_INFO>
   }
   ~~~

   All NFT’s data has been stored here. There may be big array issues, but as P(A) has 100 NFT limitations, so do not need to worry.



## Function Definition

1. init_market

   ~~~Move
   public(script) fun init_market(account: signer)
   ~~~

   This is where to initialize a contract, create a Market in the owner of this contract. This function’s visibility is public.

2. mint

   ~~~Move
   public(script) fun mint(account: signer, amount: u128) acquires UniqList, MARKET
   ~~~

   This is where you buy NFT, and visibility is public. Acquires mean that it needs to use UniqLst and Market which are defined in the current Module.



## Retrospective

This contract is not complex itself, but it can cover many scenarios.
From an implementation perspective, P(A)’s code is concise, and utilizes Move’s natural advantage in NFT scenarios, this can help to omit some unnecessary secure inspection, such as preventing NFT losing. 

1. What P(A) have done better：
   * NFT is the hottest ticket now, while Move has the natural advantage to implement NFT.
   * Use Move’s ability to define Struct, make data more secure
   * There is not unnecessary entry to be exposed
   * Avoid big array problem as all NFT data have been stored in there user’s account
   * Linked data structure makes it easily tracked.
2. Which part P(A) need to need to further optimize：
   * Art cannot be copied and dropped, it’s high risk to create same NFT
   * Key data state should be defined as Event, to make it can be listened easily off-chain 
   * Array of Market should be consider to be stored off-chain, to avoid big array issue 
   * Case style, redundancy,etc.
   * More functionality, such as NFT transfer

In conclusion, P(A) is a great attempt in NFT. Click [source code](https://github.com/liuxieric123/nft_move_starcoin/tree/main/dev/nft_dev/src/modules) to check more.

