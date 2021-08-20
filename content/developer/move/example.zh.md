+++
title = "Move 示例"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
author = "Tim"
+++

<br />


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
    use 0x1::Signer;
    use 0x1::Event;

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



## Stdlib整体介绍

Stdlib是Starcoin非常重要的一个特性，包含了一些基本模块、常用模块、区块和共识相关的模块。

1. 基础模块：
   1. Account：账号模块；
   2. Token：资产模块，定义了Token规范；
   3. STC：STC是Starcoin的原始资产，是Token的一个实现；
   4. Timestamp：时间戳模块，取Block的时间作为链上时间；
   5. Event：事件处理模块；
   6. Math：数学运算模块；
   7. Errors：异常处理模块；
   8. Vector：数组模块；

2. 常用模块如下：
   1. Config：配置模块，例如区块奖励模块RewardConfig、VMConfig等等，将各种配置文件存储到链上，方便未来调整；
   2. Dao：链上治理模块；
   3. TwoPhase：两阶段更新Module；

3. 区块和共识相关模块：
   1. Genesis：创世交易；
   2. Block：区块元数据；
   3. Epoch：周期；

下面通过一些简单的案例，介绍一下Stdlib常用的操作。



## 账号基本操作

1. Create account
```move
let auth_key = x"91e941f5bc09a285705c092dd654b94a7a8e385f898968d4ecfba49609a13461";
let account_address = Account::create_account<STC>(auth_key);
```

2. Get authentication key with address

~~~move
let auth_key = Account::authentication_key(account_address);
~~~

3. Get address from authentication key

```move
let auth_key = x"91e941f5bc09a285705c092dd654b94a7a8e385f898968d4ecfba49609a13461";
let expected_address = Authenticator::derived_address(auth_key);
```

6. Get balance

```move
let balance = Account::balance<STC>(account_address);
```

7. Get sequence number

```move
let sequence_number = Account::sequence_number(account_address);
```

8. Deposit

```move
let coin = Token::mint<STC>(&account, 100);
Account::deposit(account_address, coin);
```

9. 判断WithdrawCapability是否被代理

```move
let is_delegated = Account::delegated_withdraw_capability(account_address);
```

10. 获取对应WithdrawCapability的address

```move
let with_cap = Account::extract_withdraw_capability(&account);
let account_address = Account::withdraw_capability_address(&with_cap);
```



## 账号操作权限Capability

在Starcoin里，针对账号的任何修改，例如转账、更新key等等，都需要有操作账号的权限。Capability可以理解为Move里对「权限」的一个抽象，不同类型的操作对应不同类型的Capability，例如MintCapability、WithdrawCapability等等。使用Capability做相应的操作，通常有3步：

1. 获取对应的Capability：extract_xxx_capability
2. 进行操作
3. 存储Capability：restore_xxx_capability

下面是使用Capability操作账号的一些例子(以此类推，其他的Module的更新权限也可以这么设计)：

1. Change authentication key

```move
let rot_cap = Account::extract_key_rotation_capability(&account);//1. get capability
Account::rotate_authentication_key_with_capability(&rot_cap, x"123abc");//2. change key
Account::restore_key_rotation_capability(rot_cap);//3. restore capability
```

2. Pay from capability

```move
let with_cap = Account::extract_withdraw_capability(&account);//1. get capability
Account::pay_from_capability<STC>(&with_cap, payee, 10000, x"");//2. pay from capability
Account::restore_withdraw_capability(with_cap);//3. restore capability
```

上面是两个典型的例子，其他更多类似的账号操作还有：withdraw_with_capability等等。



## 合约转账的多种方式

1. peer_to_peer
```move
TransferScripts::peer_to_peer<STC>(account, payee, payee_auth_key, amount);
```

2. peer_to_peer_with_metadata

```move
TransferScripts::peer_to_peer_with_metadata<STC>(account, payee, payee_auth_key, amount, metadata);
```

3. 批量转账不同amount

~~~move
TransferScripts::batch_peer_to_peer<STC>(account, payeees, payee_auth_keys, amounts);
~~~

4. 批量转账相同amount
~~~move
TransferScripts::peer_to_peer_batch<STC>(account, payeees, payee_auth_keys, amount);
~~~



## 多签账号

1. 3个账号创建1个多签账号

```move
let pubkey1 = x"c48b687a1dd8265101b33df6ae0b6825234e3f28df9ecb38fb286cf76dae919d";
let pubkey2 = x"4b2a60883383be0ba24ed79aa5a6c9379728099a7b0c57edcec193a14ea5fce2";
let pubkey3 = x"323285d3d4b0f19482730c5f481d9f745c2927d73c231bad47859d9b2f7376f1";

let keys = Vector::empty<vector<u8>>();
Vector::push_back(&mut keys, pubkey1);
Vector::push_back(&mut keys, pubkey2);
Vector::push_back(&mut keys, pubkey3);

let t = Authenticator::create_multi_ed25519(copy keys, 1);
t = Authenticator::create_multi_ed25519(copy keys, 2);
t = Authenticator::create_multi_ed25519(copy keys, 3);
let auth_key = Authenticator::multi_ed25519_authentication_key(&t);
```

2. 获取多签账号地址

```move
let account_address = Authenticator::derived_address(auth_key);
```



## Token例子

1. 发布Token流程
    <img src="./move_samples/TokenSample.png" alt="TokenSample" style="zoom:95%;" align=left />
`1. 定义Token：struct MyToken has copy, drop, store { }`



`2. 注册Token：Token::register_token<MyToken>(account,3);`



`3. 接收Token：Account::accept_token<MyToken>(&account);`



`4. 挖Token：let tokens = Token::mint<MyToken>(&account, total);`



`5. 保存Token：Account::deposit_to_self<MyToken>(&account, tokens);`



完整代码

```move
module MyToken {
     use 0x1::Token;
     use 0x1::Account;

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



2. 转Token
<img src="./move_samples/TokenTransfer.png" alt="TokenSample" style="zoom:100%;" align=left />

`1. 接收Token：Account::accept_token<MyToken>(&account);`





`2. 转发Token：Account::pay_from<MyToken>(&account, payee, amount);`







## 合约托管

1. coder账户部署一个合约，并且将合约托管给Dao

~~~move
module MyToken {
     use 0x1::Token;
     use 0x1::Account;
     use 0x1::Dao;

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
    use 0x1::Dao;
    use {{coder}}::MyToken::MyToken;
    use 0x1::Config;

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
