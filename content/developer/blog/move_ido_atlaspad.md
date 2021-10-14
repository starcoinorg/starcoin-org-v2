---
title: Atlaspad
weight: 3
---

## Atlaspad

~~~
* By Starcoin Community
~~~

Atlaspad is a fascinating project at the first Hackathon competition, it is designed and implemented by an international team. It’s the first IDO platform in the Starcoin ecosystem.IDO is an evolution in the DeFi ecosystem, it is built to raise capital for the DeFi project. Atlaspad is an IDO protocol built on Startcoin, it’s implemented in Move.

In this chapter, we will guide you to build an IDO platform in Move by analyzing Atlaspad source code.

![move_ido](https://tva1.sinaimg.cn/large/008i3skNly1gtzuaq31qij60is08zaas02.jpg)

Atlaspad Diagram：

1. Three Roles：

* IDO platform
* Raising capital project
* General User

2. Core Data Structure：

* Offering
* Staking
* Staking Token,Paid Token, Offering Token



## Core Data Structure

1. Offering

~~~Move
struct Offering<StakingTokenType: store, PaidTokenType: store, OfferingTokenType: store> has key, store {
   	offering_tokens: Token::Token<OfferingTokenType>,
    offering_token_total_amount: u128,
    exchange_rate: u128,
    personal_staking_token_amount_limit: u128,
    state: u8,
    offering_addr: address,
    staking_token_amount: u128,
    offering_token_exchanged_amount: u128,
    version: u128,
    offering_created_event: Event::EventHandle<OfferingCreatedEvent>,
    offering_update_event: Event::EventHandle<OfferingUpdateEvent>,
}
~~~

2. Staking

~~~Move
struct Staking<StakingTokenType: store, PaidTokenType: store, OfferingTokenType: store> has key, store {
        staking_tokens: Token::Token<StakingTokenType>,
        staking_token_amount: u128,
        is_pay_off: bool,
        version: u128,
        token_staking_event: Event::EventHandle<TokenStakingEvent>,
        token_exchange_event: Event::EventHandle<TokenExchangeEvent>,
    }
~~~

From Offering to Stacking, you will get benefits of this design, for example，security：

* Offering does not have drop ability, so it cannot be dropped
* Offering and Stacking do not have copy ability, so they cannot be copied, so prevent unlimited money creation
* Offering and Stacking are a whole,they can be modified in this contract, out of this contract, they can only be stored, not modified.



## Function Definition

1. One module named DummyToken in Atlaaspad has registered some Token instances, and observes Starcoin Toten protocol(We assume there are no Staking Token,Paid Token, Offering Token).

2. `create` function

   The IDO platform will construct one Offering instance with offering_tokens,exchange_rate,state, etc. This Offering will be stored in the current user’s account.

3. `state_change` function

   Only OWNER_ADDRESS can call this function to modify the state of Offering. Offering has 5 states:

   * OFFERING_PENDING
   * OFFERING_OPENING
   * OFFERING_STAKING
   * OFFERING_UNSTAKING
   * OFFERING_CLOSED

4. `staking` function

   General user can call this function. User call ‘stacking’ function to stack or append StackingToken when Offering’s state is OEEERING_OPENING. One Stacking will be stored in the user's account, each different Offering only stores one Staking in the user's account.

5. `exchange` function

   General users can call this function. Users call the ‘exchange’ function to exchange currency when Offering’s state is OEEERING_STAKING. You need to pay PaidToken and will obtain OfferingToken. 

6. `unstaking` function

   General user can call this function to unstake when Offering’s state is OEEERING_OPENING, OEEERING_STAKING,OEEERING_UNSTAKING. This is a promise that users can retrieve their StakingToken at any time.



## Retrospective

1. What Atlaspad have done better：
   * Reliability: Offering and Staking do not have drop and copy ability.
   * Staking data is distributed stored in the user's own account, to prevent big array problems, and set clear ownership.
   * Generic programming: Staking Token,Paid Token, Offering Token
   * Observe Token protocol of Stdlib to define DummyToken module
   * IDO is new and has powerful functionality
   * Use Event to define state change event, it’s easily to listen off-chain
   * Generic, one account can have multiple Offering or Staking
2. Which part Atlaspad need to further optimize：
   * Script is more convenient for offline function call
   * Support formal verification, use mathematical method to prove this contract is secure

Click [here](https://github.com/xfhxfh1212/initial-dex-offering) to learn more about Atlaspad.