---
title: Deploy Move Contract
weight: 2
---

This article guides you on how to compile and deploy a Move contract to the starcoin blockchain.
<!--more-->

Move is a new programming language developed to provide a safe and programmable foundation for the [Diem Blockchain](https://github.com/deim/diem).
Starcoin Blockchain also support Move language to write smart contract.


First start a dev network as described in [Run/Join Network](../setup/runnetwork), and get some coins, say `1000000000`.

Then, let contracting!

1. create a simple module, say: `MyCounter`.

```move
module MyCounter {

     use StarcoinFramework::Signer;

     struct Counter has key, store {
        value:u64,
     }
     public fun init(account: &signer){
        move_to(account, Counter{value:0});
     }
     public fun incr(account: &signer) acquires Counter {
        let counter = borrow_global_mut<Counter>(Signer::address_of(account));
        counter.value = counter.value + 1;
     }

     public(script) fun init_counter(account: signer){
        Self::init(&account)
     }

     public(script) fun incr_counter(account: signer)  acquires Counter {
        Self::incr(&account)
     }

}
```

the source file at [my-counter](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/my-counter)

2. compile the module.

Change the address of the module:  
- edit `Move.toml`
- MyCounter = "0xABCDE" to MyCounter = "0xb19b07b76f00a8df445368a91c0547cc"

In  console, run:  

```bash
$ mpm release

Packaging Modules:
         0xb19b07b76f00a8df445368a91c0547cc::MyCounter
Release done: release/my_counter.v0.0.1.blob, package hash: 0xa7e3c02c102c85708c6fa8c9f84064d09cf530b9581278aa92568d67131c3b6d
```

It will compile the module, you will get the binary package  
3. import  0xb19b07b76f00a8df445368a91c0547cc account.

```bash
starcoin% account import -i 0x05c9d09cd06a49e99efd0308c64bfdfb57409e10bc9e2a57cb4330cd946b4e83 -p my-pass 
{
  "ok": {
    "address": "0xb19b07b76f00a8df445368a91c0547cc",
    "is_default": false,
    "is_readonly": false,
    "public_key": "0x7932502fa3f8c9bc9c9bb994f718b9bd90e58a6cdb145e24769560d3c96254d2",
    "receipt_identifier": "stc1pkxds0dm0qz5d73zndz53cp28esyfj4ue"
  }
}
```

4. deploy module
get devnet test coin
```bash
dev get-coin 0xb19b07b76f00a8df445368a91c0547cc
```
unlock the account 
```bash
account unlock 0xb19b07b76f00a8df445368a91c0547cc -p my-pass
```
```bash
starcoin% dev deploy /guide-to-move-package-manager/my-counter/release/my_counter.v0.0.1.blob -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0xeb055894f0c4440608246825c238a36683a8a0ad57144e905a12398a02ce806b submitted.
{
  "ok": {
    "dry_run_output": {
      "events": [],
      "explained_status": "Executed",
      "gas_used": "7800",
      "status": "Executed",
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "json": {
                "fee": {
                  "value": 292331
                }
              },
              "raw": "0xeb750400000000000000000000000000"
            }
          }
        },
  .....
  ....
}
```

5. call init_counter script function to init resource

```bash
starcoin% account execute-function --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::init_counter -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0x0f67bab5ee5ceeb9c2fe4ffeed9ab6b79f2869e922862ec40dba8aa7787709b1 submitted.
{
  "ok": {
    "dry_run_output": {
      "events": [],
      "explained_status": "Executed",
      "gas_used": "11667",
      "status": "Executed",
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "json": {
                "fee": {
                  "value": 23334
                }
              },
              "raw": "0x265b0000000000000000000000000000"
            }
          }
        },
  .....
  .....
}

```

6. show resource

```bash
starcoin% state get resource 0xb19b07b76f00a8df445368a91c0547cc 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
{
  "ok": {
    "json": {
      "value": 0
    },
    "raw": "0x0000000000000000"
  }
}
```

7. call incr_counter to increment counter

```bash
starcoin% account execute-function --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::incr_counter -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0x7e8d6189c144c7640cbd79617247c0e242f52df6d60c74c29250492077b1b690 submitted.
{
  "ok": {
    "dry_run_output": {
      "events": [],
      "explained_status": "Executed",
      "gas_used": "17231",
      "status": "Executed",
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "json": {
                "fee": {
                  "value": 34462
                }
              },
              "raw": "0x9e860000000000000000000000000000"
            }
          }
        },
    ......
    ......
}
```

8. show resource again

```bash
starcoin% state get resource 0xb19b07b76f00a8df445368a91c0547cc 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
{
  "ok": {
    "json": {
      "value": 1
    },
    "raw": "0x0100000000000000"
  }
}
```

You can see the counter's value is 1 now.

9. Use another account to init and incr counter again.

Say the new account address is 0x0da41daaa9dbd912647c765025a12e5a

```bash
starcoin% account execute-function -s 0x0da41daaa9dbd912647c765025a12e5a  --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::init_counter -b
starcoin% contract get resource 0x0da41daaa9dbd912647c765025a12e5a 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
starcoin% account execute-function -s 0x0da41daaa9dbd912647c765025a12e5a  --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::incr_counter -b
starcoin% contract get resource 0x0da41daaa9dbd912647c765025a12e5a 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
```