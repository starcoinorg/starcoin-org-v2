+++
title = "Move 示例"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
author = "Tim"

+++

<br />

Move 示例

<!--more-->

## HelloWorld

1. 定义一个Event

~~~move
struct AnyWordEvent has drop, store {
    words: vector<u8>,
}
~~~


2. 定义一个Holder

~~~move
struct EventHolder has key {
    any_word_events: Event::EventHandle<AnyWordEvent>,
}
~~~

3. 在函数中生成hello world的event

~~~move
let hello_world = x"68656c6c6f20776f726c64";//hello world
let holder = borrow_global_mut<EventHolder>(addr);
Event::emit_event<AnyWordEvent>(&mut holder.any_word_events, AnyWordEvent { words:hello_world });
~~~

完整代码


~~~move
module Hello {
    use StarcoinFramework::Signer;
    use StarcoinFramework::Event;

    struct AnyWordEvent has drop, store {
        words: vector<u8>,
    }

    struct EventHolder has key {
        any_word_events: Event::EventHandle<AnyWordEvent>,
    }

    public(script) fun hello(account: signer) acquires EventHolder {
        let _account = &account;
        let addr = Signer::address_of(_account);
        if (!exists<EventHolder>(copy addr)){
            move_to(_account, EventHolder {
                any_word_events: Event::new_event_handle<AnyWordEvent>(_account),
            });
        };
        let hello_world = x"68656c6c6f20776f726c64";//hello world
        let holder = borrow_global_mut<EventHolder>(addr);
        Event::emit_event<AnyWordEvent>(&mut holder.any_word_events, AnyWordEvent { words:hello_world });
    }
}
~~~



## Token例子

1. 发布Token流程

`1. 定义Token：struct MyToken has copy, drop, store { }`

`2. 注册Token：Token::register_token<MyToken>(account,3);`

`3. 接收Token：Account::accept_token<MyToken>(&account);`

`4. 挖Token：let tokens = Token::mint<MyToken>(&account, total);`

`5. 保存Token：Account::deposit_to_self<MyToken>(&account, tokens);`

完整代码

```move
module MyToken {
     use StarcoinFramework::Token;
     use StarcoinFramework::Account;

     struct MyToken has copy, drop, store { }

     public(script) fun init(account: signer) {
         let _account = &account;
         Token::register_token<MyToken>(_account, 3);
         Account::do_accept_token<MyToken>(_account);
     }

     public(script) fun mint(account: signer, amount: u128) {
        let _account = &account;
        let token = Token::mint<MyToken>(_account, amount);
        Account::deposit_to_self<MyToken>(_account, token)
     }
}
```

2. 发送Token


`1. 接收Token：Account::accept_token<MyToken>(&account);`
`2. 转发Token：Account::pay_from<MyToken>(&account, payee, amount);`

## 合约托管

1. coder账户部署一个合约，并且将合约托管给Dao

~~~move
module MyToken {
     use StarcoinFramework::Token;
     use StarcoinFramework::Account;
     use StarcoinFramework::Dao;

     struct MyToken has copy, drop, store { }

     public(script) fun init(account: signer) {
         let _account = &account;
         Token::register_token<MyToken>(_account, 3);
         Account::do_accept_token<MyToken>(_account);
         Dao::plugin<MyToken>(_account, 60 * 1000, 60 * 60 * 1000, 4, 60 * 60 * 1000);
     }

     public(script) fun mint(account: signer, amount: u128) {
        let _account = &account;
        let token = Token::mint<MyToken>(_account, amount);
        Account::deposit_to_self<MyToken>(_account, token)
     }
}
~~~

2. 修改MyToken模块的Dao配置

~~~move
script {
    use StarcoinFramework::Dao;
    use {{coder}}::MyToken::MyToken;
    use StarcoinFramework::Config;

    fun set_dao_config(signer: signer) {
        let cap = Config::extract_modify_config_capability<Dao::DaoConfig<MyToken>>(
            &signer
        );

        Dao::set_voting_delay<MyToken>(&mut cap, 30 * 1000);
        Dao::set_voting_period<MyToken>(&mut cap, 30 * 30 * 1000);
        Dao::set_voting_quorum_rate<MyToken>(&mut cap, 50);
        Dao::set_min_action_delay<MyToken>(&mut cap, 30 * 30 * 1000);

        Config::restore_modify_config_capability(cap);
    }
}
~~~

3. 升级合约

![DAO](https://tva1.sinaimg.cn/large/008i3skNgy1gqxxyln2yxj30p10g5myz.jpg)
