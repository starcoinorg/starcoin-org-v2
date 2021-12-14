---
title: Source Code Analysis: Purchase 
weight: 11
---

## Purchase

~~~
* By Starcoin community
~~~



Purchase is a competition project of first Starcoin&Move hackathon,submitted by the TopYD team. Purchase is an application where both parties conduct secure transactions through on-chain pledges where there is no trust at all. If one party cheats, the pledged Token will be punished to ensure the smooth and safe progress of the transaction between the two parties.

Here we analyze the source code of the contract to learn how Move implements a simple transaction protocol. Let's take a look at the overall design of the Purchase project:

![move_purchase](https://tva1.sinaimg.cn/large/008i3skNly1gug7xlve6mj60d303374a02.jpg)

From the above figure, we can see the data structure and main process of Purchase:

1. Data Structure
   - Market
   - Goods
2. Core Process
   - publish function
   - order function
   - done function

Implementation of Purchase,you can buy and sell various Goods in the Market, and complete a smooth transaction through publish, order, and done.



## Data Structure

Let's take a look at the core data structure of Purchase:

1. Market
~~~Move
struct Market<Info: copy + drop + store> has key, store {
    goods_center: vector<Goods<Info>>,//List of Goods
}
~~~

2. Goods

~~~Move
   struct Goods<Info: copy + drop + store> has store {
       state: u8,// State
       info: Info,//Goods information
       seller: address,//Seller's address
       price: u128,//Price
       s_deposit: Option<Token<STC>>,//Buyer pledge
       buyer: Option<address>,//Buyer
       b_deposit: Option<Token<STC>>,//Seller pledge and pay
   }
~~~

The definition of Market and Goods has the following advantages:

- Without the ability of drop, Market instance cannot be discarded
- Without the ability to copy, Market cannot be copied into multiple instances through instance, and will not be wrong issued 
- Market can be stored and retrieved, Goods can only be stored
- Info is generic and can receive any Struct with copy + drop + store ability



## Core Function

The main process of Purchase includes 3 core functions:

1. publish function

~~~Move
   public fun publish<Info: copy + drop + store>(account: &signer, market_address: address, s_deposit: Token<STC>, info:Info): u64 acquires Market
~~~

   This function is used to publish goods information, anyone can publish goods.

2. order function

~~~Move
   public fun order<Info: copy + drop + store>(account: &signer, market_address: address, goods_id: u64, b_deposit: Token<STC>) acquires Market 
~~~

   This function is used to place order.

3. done function

~~~Move
   public fun done<Info: copy + drop + store>(account: &signer, market_address: address, goods_id: u64):Token<STC>  acquires Market 
~~~

   After the order is completed, the settlement is carried out. In this step, the Token pledged by both parties will be returned.

   The above three functions are basically the same in design:

   - public visibility
   - Generic programming to implement a common protocol
   - acquires means that the current function uses the Struct defined by the current contract



## Conclusion

Function of the contract is simple. Let's analyze the advantages and disadvantages from the code level.

### Advantage:

- The definition of Struct is safe and reliable. It will neither be dropped nor be copied
- Generic programming to implement a common protocol
- From the perspective of  function, the two parties pledged can ensure smooth transactions in non-trusted scenarios

### What can be improved:

- Market uses vector, which can easily cause security problems for large arrays

- Distribute data to each user's own account

- Support formal verification and prove the security of the contract through mathematics

- If the transaction is not smooth, a Proof method should be provided to avoid losses

  

Purchase is relatively simple and versatile in design, and those interested can view the complete code here.