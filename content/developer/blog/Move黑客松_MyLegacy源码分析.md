---
title: MyLegacy
weight: 1
---

## MyLegacy

~~~
* By Starcoin Community
~~~

MyLegacy is a Asset-Management project on Starcoin,it implements secure storage, linearly unlock in batches,etc. Besides asset inheritance, it’s also suitable in many other regular scenarios, such as: settle project funds in instalment,pay for quarterly bonus or annual bonus,etc. Open and transparent payment and settlement on blockchain are imaginative, especially in trustless distributed systems.

Let’s take a close look at MyLegacy’s overall design, we can learn how Move manages assets securely by analyzing MyLegacy’s source code.

![](https://tva1.sinaimg.cn/large/008i3skNly1gu87emy3tfj60ev05m3yl02.jpg)

In Figure 1, there are two core Sturct in the contract：

* Legacy
* Payment

And two key function：

* init_legacy
* redeem



## Struct Definition 

Next, let’s have a look core data structure

1. Legacy

~~~Move
struct Legacy has key, store {
		payer: address,
		payee: address,
		total_value:u64,
		times:u64,
		freq:u64,
		unpaid: vector<Payment>,
}
~~~

Legacy  Struct only can be used as a key(indexed) and stored,cannot be copied and dropped.

2. Payment

~~~Move
struct Payment has key, store {
		id: u64,
		value: u64,
		balance: Token<STC>,
		time_lock: u64,
}
~~~

Payment  Struct only can be used as a key(indexed) and stored,cannot be copied and dropped too.

This design is intent on achieving greater security:：

* We do not need to worry about losing money during transactions as Legacy and Payment cannot be dropped.
* You cannot do unsecure money creation because Legacy and Payment cannot be copied from one instance to a new instance.
* Legacy or Payment is a whole, can only be modified by functions in this contract, other contracts can only store.

All these secure features we mentioned above, you do not need to explore deeply, Move will handle this.



## Function Definition

1. init_legacy

~~~Move
public(script) fun init_legacy(account: signer, payee: address, total_value: u64, times: u64, freq: u64)
~~~

The above code segment is init_legacy function signature, this function will initialize Legacy according to arguments passed into this function. Legacy will be stored in the current user account as a resource.

* Script Visibility: This function cannot be accessed by other functions, it’s only one transaction.
* No return values
* payee: The address you are used to redeem STC.
* total_value: Total STC
* times: Current number of payments
* Number of STC in each payment: total_value / times
* freq: Interval between payments in freq seconds. 

2. redeem

~~~Move
public(script) fun redeem(account: signer, payer: address) acquires Legacy
~~~

The above code segment is redeem function signature, it’s used to redeem payment.

* Script Visibility: This function cannot be accessed by other functions, it’s only one transaction.
* No return values
* payer: Can be default address who create Legacy, and also can be the address you pass into when you construct Legacy.
* acquires: This is the struct you should define and use in current contract, here is Legacy
* How many payments can you redeem: (current time - last redeem time) / freq, the last redeem time is the time you construct Legacy if this is your first to do redeem



## Retrospective

This contract is not complex itself, but it can cover many scenarios.

From this contract perspective, let’s have a look what we have done better, which part we need to further optimize:

1. What MyLegacy have done better：

* Data is distributed and stored in the initial Legacy user account, there is no big array problem.
* You cannot drop and copy Payment or Legacy, so it’s secure.
* Function visibility, only init_legacy and redeem are exposed.
* Full functionality.

2. Which part MyLegacy need to need to further optimize

* To support any type Token by generic programming, to make a general protocol.
* To support formal verification, use mathematical method to prove this contract is secure
* To clean out Legacy that does not have payment when do redeem
* One account can only have one legacy
* Data redundancy, times and freq are equal to 0



## Conclusion

MyLegacy is a secure and reliable Asset-Management project, you can imagine more scenarios even though it's called MyLegacy.

Only about 100 lines of code have achieved complex business logic and at the same time to keep security, click [source code](https://github.com/WestXu/mylegacy/blob/master/module/MyLegacy.move) to check whole codes.