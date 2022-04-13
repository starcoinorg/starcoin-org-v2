---
title: First Transaction
weight: 3
---

This article guides you on how to execute your first transaction on the starcoin blockchain.
Before that, I recommend you read tech-related articles to get some idea of the basic concepts of starcoin.
<!--more-->

## Prerequisite

Let's say you've run up a starcoin dev node locally.

## A few steps to submit a transaction

- Start the CLI console and connect to the starcoin node，detail document at [Use starcoin console](../console).
- Create two accounts: Alice,Bob，detail step see [Account manager](../account_manager).
- Mint money into Alice's account.
- Submit transfer transaction: Alice send money to Bob.

### Create an account

After connecting to the node, let's first create two accounts. Here we assume that both accounts have been created successfully, 
Alice is the default account with the address 0xfa635e304e0c1accf59e6ed211998158 and Bob's address is 0x76a12ea4a733de0fae0cf329083d1952  .

### Use Faucet to top up your account

 In dev environment, faucet can be used to mint accounts. faucet only exists in dev and test net to make it easier for developers developing and testing dapps.

 Let's do it!.

 ``` bash
starcoin% dev get-coin -v 100STC
```

`dev get-coin` will mint some coins the default account, and if the account does not exist on the chain, it will creates the account first and then transfers a specified (with `-v`) number of coins to the account.
The output of the command is the transaction data  issued by the FAUCET account (address `0000000000000000000000000A550C18`).

Wait a few seconds and then check your account information again.

```bash
starcoin%  account show 0xfa635e304e0c1accf59e6ed211998158
{
  "ok": {
    "account": {
      "address": "0xfa635e304e0c1accf59e6ed211998158",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0xcf6af68573e8cc232e99aeb11ba2786c8e3f94d90108b1239c36154cd1a75788",
      "receipt_identifier": "stc1plf34uvzwpsdveav7dmfprxvptqrzyhqp"
    },
    "auth_key": "0x5007518ade0231dd0ebb785ba3cc3ecffa635e304e0c1accf59e6ed211998158",
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 100000000000
    },
    "sequence_number": 0
  }
}
```

Now, `balances`  is filled.



### Submit Transaction

First you need to unlock Alice's account and authorize node to sign the transaction using Alice's private key.

```` bash
account unlock -p my-pass 1d8133a0c1a07366de459fb08d28d2a6
````

where `-p my-pass` is the password that was needed when creating the account, if the default account's init password is empty.

Once the account is unlocked, execute the following command.

```bash
starcoin% account execute-function --function 0x1::TransferScripts::peer_to_peer_v2 -t 0x1::STC::STC --arg 0x76a12ea4a733de0fae0cf329083d1952 --arg 10000u128 -s 0xfa635e304e0c1accf59e6ed211998158
```

- `-s 0xfa635e304e0c1accf59e6ed211998158`: is Alice's account address.
- `-r 0x76a12ea4a733de0fae0cf329083d1952`: is Bob's account address.

> If, Bob's account does not yet exist on the chain, the transfer transaction will automatically create Bob's account on the chain.


At this point, the transaction has been submitted to the chain.
You still need to wait a few seconds (in the dev environment, maybe longer in test env) to let the transaction included the chain.
Then check Bob's account information again:.


``` bash
starcoin% account show 0x76a12ea4a733de0fae0cf329083d1952
{
  "ok": {
    "account": {
      "address": "0x76a12ea4a733de0fae0cf329083d1952",
      "is_default": false,
      "is_readonly": false,
      "public_key": "0xabd226b1b90b0e969d1db3f937d600006f4c5db342ef3f8bc49a555e9c2fea2b",
      "receipt_identifier": "stc1pw6sjaf98x00qltsv7v5ss0ge2gnl9jpv"
    },
    "auth_key": "0x891410477b6abc7c95bb8eff9cdcf9af76a12ea4a733de0fae0cf329083d1952",
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 10000
    },
    "sequence_number": 0
  }
}
```

Bob has the money now!

