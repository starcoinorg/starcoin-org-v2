---
title: Account management
weight: 2
---

The Starcoin node has a built-in decentralized wallet that allows users to manage their accounts through account api and commands.

<!--more-->

When the node starts, a default account is automatically created with an empty password. The default can be changed via account commands. The following commands require a connection to the console, see [Using the starcoin console](../console). 1.


1. Create account 

```bash
starcoin% account create -p my-pass
{
  "ok": {
    "address": "0x8771ab46ae92feef64749b9feaeede9b",
    "is_default": false,
    "is_readonly": false,
    "public_key": "0x50b42d796fd9bceafc5d146aedc1083b36d8ac3bafcebb5a9532a02d9b0f6dbb",
    "receipt_identifier": "stc1psac6k34wjtlw7er5nw074mk7nvv4gv6j"
  }
}
```

2. Show account 

```bash
starcoin% account show 0x8771ab46ae92feef64749b9feaeede9b
{
  "ok": {
    "account": {
      "address": "0x8771ab46ae92feef64749b9feaeede9b",
      "is_default": false,
      "is_readonly": false,
      "public_key": "0x50b42d796fd9bceafc5d146aedc1083b36d8ac3bafcebb5a9532a02d9b0f6dbb",
      "receipt_identifier": "stc1psac6k34wjtlw7er5nw074mk7nvv4gv6j"
    },
    "auth_key": "0x047647886667905740b3e671854954b18771ab46ae92feef64749b9feaeede9b",
    "balances": {},
    "sequence_number": null
  }
}
```

- address is the address of the account.
- is_default Indicates whether the account is the default account. Many commands that require an account address parameter, if user not passed it, the command will use the default account address. If the node has enable the miner client, the default account will also be used for miner client.
- public_key is the public key corresponding to the address of the account.
- auth_key is the authentication key.

> Note that creating an account only creates a pair of keys in the starcoin node, and does not update the state of the chain. So balance and sequence_number are still empty at this point. All the above information is public information. 


3. List accounts

```bash
starcoin% account list
```

4. View or change the default account 

To view the default account address.

```bash
starcoin% account default
```
Set 0x8771ab46ae92feef64749b9feaeede9b to the default address.
```bash
starcoin% account default 0x8771ab46ae92feef64749b9feaeede9b
```

5. Export and import accounts

In order to avoid losing your assets due to disk corruption and other reasons, it is important to backup your private key.

Execute the following command: 
```bash
starcoin% account export 0x8771ab46ae92feef64749b9feaeede9b -p my-pass
```
to export the private key of 0x8771ab46ae92feef64749b9feaeede9b.

Execute the following command:

```bash
starcoin% account import -i <private-key> -p my-pass 0x8771ab46ae92feef64749b9feaeede9b
```

This will import the 0x8771ab46ae92feef64749b9feaeede9b account. This command can also be used to import the account to a different node and used to do node migration.

6. Import readonly accounts


If you do not want to host the private key in the node wallet, but just want to view the account, or use the account as a mining account, you can import the read-only account with the public key:

```bash
starcoin% account import-readonly -i <public-key>  
```

Then set the account as the default account.


7. Remove account

```bash
starcoin% account remove 0x8771ab46ae92feef64749b9feaeede9b -p my-pass
```

If it is a read-only account, you do not need to pass the -p parameter. Deleting an account only deletes the account from the node wallet and does not affect the account on the chain.