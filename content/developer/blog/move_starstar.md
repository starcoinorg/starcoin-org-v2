---
title: Source Code Analysis, Star
weight: 17
---

~~~
* By Starcoin community
~~~



Star is a competition project of first Starcoin&Move hackathon,submitted by the Star team.

Star is a tool project, similar to GitStar. By implementing a function which you can give a like on the public chain, users can vote on different types of projects, select their favourite projects, and finally form a ranking list. All users can intuitively understand the overall situation of high-quality projects based on the rankings.

Here we analyze the source code of the contract to learn how Move implements a simple transaction protocol. Let's take a look at the overall design of the Purchase project:

![move_star](https://tva1.sinaimg.cn/large/008i3skNly1gujcbkr752j60kc03rgls02.jpg)

From the above figure, we can see the data structure and main process of StarStar:

1. Data Structure
   - StarInfo
   - CategoryAccountCounter
2. Core Process
   - register_item function
   - star function
   - unstar function

In the implementation of StarStar, first register a certain type of StarInfo through register_item, such as the StarInfo of the NFT class. Then from all StarInfo of the NFT type, the user votes for his interested StarInfo through the star function. According to the voting structure, sort all StarInfo of the NFT class.



## Data Structure

Let's take a look at the core data structure of StarStar:

1. StarInfo

~~~Move
   struct StarInfo<CategoryT: copy+store+drop> has key,store,drop {
       item_address: address,//Project's address
       counter: u64,//Total number of votes
       updated_at: u64,//Create Eveent
   }
~~~

   Project-related information, such as address, type CategoryT, total number of votes, counter, etc.

2. CategoryAccountCounter

~~~Move
   struct CategoryAccountCounter<CategoryT: copy+store+drop> has key,store {
   		counter: u64 //Number of votes
   }
~~~

The number of votes that users vote for a CategoryT type. Currently, each CategoryT can only can vote once.

Let's analyze the advantages of the definition of StarInfo and CategoryAccountCounter:

- Generic programming, new categories can be added at any time, extensible
- CategoryAccountCounter has no copyability and cannot be copied, so there is no way to increase the number of votes arbitrarily. It is safe and reliable.



## Core Function

The main process of Purchase includes 3 core functions:

1. register_item function

 ~~~Move
   public fun register_item<CategoryT: store+copy+drop>(account: &signer, item_address: address)
 ~~~

   Registering a certain type of StarInfo,  can only be called by the owner of the contract.

2. star function

~~~Move
   public fun star<CategoryT: copy+store+drop>(account: &signer, item_address: address) : bool acquires CategoryAccountCounter
~~~

   Give a like function,vote for the StarInfo you are interested in.

3. unstar function

~~~Move
   public fun unstar<CategoryT: copy+store+drop>(account: &signer, item_address: address) : bool acquires CategoryAccountCounter
~~~

   Cancel the like.

   The above three functions are basically same in design:

   - public visibility
   - Generic programming to implement common protocol
   - acquires means that the current function borrows the Struct defined by the current contract



## Summarize

Function of the contract is simple. Let's analyze the advantages and disadvantages from the code level.

### Advantage:

- The definition of Struct is safe and reliable and cannot be copied
- Generic programming, implement a common protocol, can add new types, good scalability
- A relatively complete function, a very practical tool, through the ranking list to help users identify high-quality projects
- Data is distributed and stored in the user's own account

### What can be improved:

- The Struct of CategoryAccountCounter should have an address to facilitate cross-checking
- Support formal verification and prove the security of the contract through mathematics
- If it can be combined with DID, OAuth protocol and other technologies, there will be more imagination.

StarStar is relatively simple and universal in design. Those interested can view the complete code here.