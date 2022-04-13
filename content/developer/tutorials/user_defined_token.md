---
title: User Defined Token
weight: 1
---

This is a example for How to define user custom Token on starcoin blockchain.

<!--more-->

First, start a dev network as described in [Run/Join Network](../setup/runnetwork), and get some coins, say `1000000000`.

In this document, I will use `0xb19b07b76f00a8df445368a91c0547cc`, the default account address of my dev network, to represent the person who issues and send the new token. And I also created another account `0x831d51f0087596e6aa4e7b3b9c85f945` and transfer some STC to it. The account will be used to receive the token.  

the source file at [my-token](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/my-token)
# compile the module.

Change the address of the module:  
- edit `Move.toml`
- MyToken = "0xABCDE" to MyToken = "0xb19b07b76f00a8df445368a91c0547cc"

In  console, run:  

```bash
$ mpm release

Packaging Modules:
         0xb19b07b76f00a8df445368a91c0547cc::MyToken
Release done: release/my_token.v0.0.1.blob, package hash: 0xc3b9cf32499f4bdf0a38d57f7c7c66a6f4df69881a8980bcda2106782dce88ba
```

It will compile the module, you will get the binary package   

Import  0xb19b07b76f00a8df445368a91c0547cc account.
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

Then, unlock the  account and deploy MyToken module.

get devnet test coin
```bash
dev get-coin 0xb19b07b76f00a8df445368a91c0547cc
```

unlock the account 
```bash
starcoin% account unlock 0xb19b07b76f00a8df445368a91c0547cc -p my-pass
```
```bash
starcoin% dev deploy /guide-to-move-package-manager/my-token/release/my_token.v0.0.1.blob -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0x686964d6a4212f1e32e8626132e14dabffb034d6f3aec921e80a2e54726391b1 submitted.
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
                  "value": 25031
                }
              },
              "raw": "0xc7610000000000000000000000000000"
            }
          }
        },
  .....
  ....
}
```
# Execute script function

First, use the 0xb19b07b76f00a8df445368a91c0547cc account init module.

```bash
starcoin% account execute-function --function 0xb19b07b76f00a8df445368a91c0547cc::MyToken::init -s 0xb19b07b76f00a8df445368a91c0547cc --blocking
```

Second, use the 0xb19b07b76f00a8df445368a91c0547cc account mint some MyToken.
```bash
starcoin% account execute-function --function 0xb19b07b76f00a8df445368a91c0547cc::MyToken::mint --blocking --arg 1000000u128 -s 0xb19b07b76f00a8df445368a91c0547cc
```

Third, the second account accept the new Token. An account can accept the Token only if has adopted the Token.
```bash
starcoin% account accept_token -s 0x831d51f0087596e6aa4e7b3b9c85f945 0xb19b07b76f00a8df445368a91c0547cc::MyToken::MyToken --blocking
```

Fourth, the 0xb19b07b76f00a8df445368a91c0547cc account transfer 1000 MyToken to the default user.
```bash
starcoin%  account execute-function --function 0x1::TransferScripts::peer_to_peer_v2 -t 0xb19b07b76f00a8df445368a91c0547cc::MyToken::MyToken --arg 0x831d51f0087596e6aa4e7b3b9c85f945 --arg 10000u128 -s 0xb19b07b76f00a8df445368a91c0547cc
```

Last, show balances of second user.
```bash
starcoin% account show 0x831d51f0087596e6aa4e7b3b9c85f945
{
  "ok": {
    "account": {
      "address": "0x831d51f0087596e6aa4e7b3b9c85f945",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0x29894dafe73616f807ed48aef1978974122d790a62be767d115f396b422cbb75",
      "receipt_identifier": "stc1psvw4ruqgwktwd2jw0vaeep0eg5eac86k"
    },
    "auth_key": "0xedf8fad3eb73ab981793ca5b29b9f660831d51f0087596e6aa4e7b3b9c85f945",
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 100000533341,
      "0xb19b07b76f00a8df445368a91c0547cc::MyToken::MyToken": 10000
    },
    "sequence_number": 3
  }
}
```