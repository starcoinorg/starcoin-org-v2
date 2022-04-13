+++
title = "Move examples"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
author = "Tim"

+++

<br />

Move examples

<!--more-->


## HelloWorld



1. Define an Event



```move

struct AnyWordEvent has drop, store {

words: vector,

}
```


2. Define a Holder

```move

struct EventHolder has key {

any_word_events: Event::EventHandle,

}

```



3. Generate a Hello World event in the function



```move

let hello_world = x"68656c6c6f20776f726c64"; //hello world

let holder = borrow_global_mut(addr);

Event::emit_event(&mut holder.any_word_events, AnyWordEvent { words:hello_world });

```



The complete code





```move

module Hello {

    use StarcoinFramework::Signer;

    use StarcoinFramework::Event;



    struct AnyWordEvent has drop, store {

        words: vector,

    }



    struct EventHolder has key {

        any_word_events: Event::EventHandle,

    }



    public(script) fun hello(account: signer) acquires EventHolder {

        let _account = &account;

        let addr = Signer::address_of(_account);

        if (! exists(copy addr)){

            move_to(_account, EventHolder {

            any_word_events: Event::new_event_handle(_account),

            });

        };

        let hello_world = x"68656c6c6f20776f726c64"; //hello world

        let holder = borrow_global_mut(addr);

        Event::emit_event(&mut holder.any_word_events, AnyWordEvent { words:hello_world });

    }

}

```


## Stdlib Introduction to the whole

Stdlib is a very important feature of Starcoin. It contains some basic modules, common modules, blocks and consensus related modules.



1. Basic modules:

1. Account: Account module;

2. Token: asset module, which defines the Token specification;

3. STC: STC is the original asset of Starcoin and an implementation of Token;

4. Timestamp: Timestamp module, which takes the Block time as the on-chain time;

5. Event: Event processing module;

6. Math module;

7. Errors: Exception processing module;

8. Vector: array module;



2. Common modules are as follows:

1. Config: configuration module, such as block reward module RewardConfig, VMConfig, etc., stores various configuration files on the chain for convenient adjustment in the future;

2. DAO: On-chain governance module;

3. Twophase: two-phase update Module;



3. Block and consensus related modules:

1. Genesis.

2. Block metadata;

3. The Epoch was Epoch.



Here are some simple examples of Stdlib operations that are commonly used.

## Account basic operation

1. Create account

```move

let auth_key = x"91e941f5bc09a285705c092dd654b94a7a8e385f898968d4ecfba49609a13461";

let account_address = Account::create_account(auth_key);

```



2. Get authentication key with address

```move

let auth_key = Account::authentication_key(account_address);

```

3. Get address from authentication key

```move

let auth_key = x"91e941f5bc09a285705c092dd654b94a7a8e385f898968d4ecfba49609a13461";

let expected_address = Authenticator::derived_address(auth_key);

```


6. Get balance



```move

let balance = Account::balance(account_address);
```



7. Get sequence number

```move

let sequence_number = Account::sequence_number(account_address);

```



8. Deposit

```move

let coin = Token::mint(&account, 100);

Account::deposit(account_address, coin);

```

9. Determine whether a descriptive Capability is proxied

```move

let is_delegated = Account::delegated_withdraw_capability(account_address);

```

10. Gets the address of the corresponding descriptive Capability

```move

let with_cap = Account::extract_withdraw_capability(&account);

let account_address = Account::withdraw_capability_address(&with_cap);

```


Capability allows you to operate your account

In Starcoin, any modification of the account, such as transfer, updating key and so on, requires the permission to operate the account. A Capability can be understood as an abstraction of a "permission" in a Move, and a different type of operation corresponds to a different type of Capability, such as a mintCapability, a descriptive Capability, and so on. To do something with a Capability, there are usually three steps:



1. Get the corresponding Capability: extract_xxx_capability

2. Do it

3. Store Capability: Restore_XXX_Capability



Here are some examples of using Capability to manipulate accounts (and, by the same token, update permissions for other modules) :

1. Change authentication key

```move

let rot_cap = Account::extract_key_rotation_capability(&account); //1. get capability

Account::rotate_authentication_key_with_capability(&rot_cap, x"123abc"); //2. change key

Account::restore_key_rotation_capability(rot_cap); //3. restore capability

```
2. Pay from capability

```move

let with_cap = Account::extract_withdraw_capability(&account); //1. get capability

Account::pay_from_capability(&with_cap, payee, 10000, x""); //2. pay from capability

Account::restore_withdraw_capability(with_cap); //3. restore capability

```



These are two typical examples, and a more descriptive account operation is a: withdrawing _with_capability and so on.


## Multiple ways to transfer contracts



1. peer_to_peer

```move

TransferScripts::peer_to_peer_v2(account, payee, amount);

```

2. peer_to_peer_with_metadata

```move

TransferScripts::peer_to_peer_with_metadata_v2(account, payee, amount, metadata);

```

3. Batch transfer of different amounts

```move

TransferScripts::batch_peer_to_peer_v2(account, payeees, amounts);

```
## Sign multiple accounts



1. Create one multi-signed account for each 3 accounts

```move

let pubkey1 = x"c48b687a1dd8265101b33df6ae0b6825234e3f28df9ecb38fb286cf76dae919d";

let pubkey2 = x"4b2a60883383be0ba24ed79aa5a6c9379728099a7b0c57edcec193a14ea5fce2";

let pubkey3 = x"323285d3d4b0f19482730c5f481d9f745c2927d73c231bad47859d9b2f7376f1";


let keys = Vector::empty>();

Vector::push_back(&mut keys, pubkey1);

Vector::push_back(&mut keys, pubkey2);

Vector::push_back(&mut keys, pubkey3);

let t = Authenticator::create_multi_ed25519(copy keys, 1);

t = Authenticator::create_multi_ed25519(copy keys, 2);

t = Authenticator::create_multi_ed25519(copy keys, 3);

let auth_key = Authenticator::multi_ed25519_authentication_key(&t);

```
2. Get the address of the oversigned account

```move

let account_address = Authenticator::derived_address(auth_key);

```
Example # # Token  

1. Publish the Token process

`Struct myToken has copy, drop, store {} `

`register Token: Token::register_token< myToken >(account,3); `

`Accept Token: Account::accept_token< myToken >(& Account); `

`Let tokens = Token::mint< myToken >(&account, total); `

`Deposit_to_self < myToken >(& Account, tokens); `


The complete code

```move

module MyToken {

    use StarcoinFramework::Token;
    use StarcoinFramework::Account;

    struct MyToken has copy, drop, store { }

    public(script) fun init(account: signer) {

        let _account = &account;
        Token::register_token(_account, 3);
        Account::do_accept_token(_account);

    }

    public(script) fun mint(account: signer, amount: u128) {

        let _account = &account;

        let token = Token::mint(_account, amount);

        Account::deposit_to_self(_account, token)

    }

}

```


2. Turn the Token
'1. Accept Token: Account::accept_token< myToken >(& Account); `

'2. Forward Token: Account::pay_from< myToken >(& Account, payee, amount); `

## Contract hosting

1. The coder account deploys a contract and hosts the contract to the DAO
```move

module MyToken {

    use StarcoinFramework::Token;
    use StarcoinFramework::Account;
    use StarcoinFramework::Dao;

    struct MyToken has copy, drop, store { }

        public(script) fun init(account: signer) {

            let _account = &account;    
            Token::register_token(_account, 3);
            Account::do_accept_token(_account);
            Dao::plugin(_account, 60 * 1000, 60 * 60 * 1000, 4, 60 * 60 * 1000);

        }

        public(script) fun mint(account: signer, amount: u128) {

            let _account = &account;  
            let token = Token::mint(_account, amount);
            Account::deposit_to_self(_account, token)

        }

}

```

2. Modify the DAO configuration of the MyToken module

```move

script {

    use StarcoinFramework::Dao;
    use {{coder}}::MyToken::MyToken;
    use StarcoinFramework::Config;

    fun set_dao_config(signer: signer) {

        let cap = Config::extract_modify_config_capability>(

            &signer

        );
        Dao::set_voting_delay(&mut cap, 30 * 1000);
        Dao::set_voting_period(&mut cap, 30 * 30 * 1000);
        Dao::set_voting_quorum_rate(&mut cap, 50);
        Dao::set_min_action_delay(&mut cap, 30 * 30 * 1000);
        Config::restore_modify_config_capability(cap);
    }

}

```

3. Upgrade your contract

! [DAO](https://tva1.sinaimg.cn/large/008i3skNgy1gqxxyln2yxj30p10g5myz.jpg)

```