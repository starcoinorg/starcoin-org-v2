---
title: Stdlib使用指南
weight: 21
---

# Stdlib指南

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

2. 常用协议模块如下：
   1. Config：配置模块，例如区块奖励模块RewardConfig、VMConfig等等，将各种配置文件存储到链上，方便未来调整；
   2. Dao：链上治理模块；
   3. TwoPhase：两阶段更新Module；
   4. NFT协议
   5. Oracle协议

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



## Account

1. create_account_with_address

2. deposit_to_self

3. deposit

4. deposit_with_metadata

5. withdraw

6. withdraw_with_metadata



## BCS

1. 序列化 to_bytes

```
public fun to_bytes<MoveValue: store>(v: &MoveValue): vector<u8>
```

2. bytes反序列化为地址  to_address

```
public fun to_address(key_bytes: vector<u8>): address;
```



## BitOperators

1. Add

```
public fun and(x: u64, y: u64): u64
```

2. Or

```
public fun or(x: u64, y: u64): u64
```

3. Xor

```
public fun xor(x: u64, y: u64): u64
```

4. Not

```
public fun not(x: u64): u64 
```

5. Lshift

```
public fun lshift(x: u64, n: u8): u64 
```

6. Rshift

```
public fun rshift(x: u64, n: u8): u64
```



## Debug

1. 输出 print

```
public fun print<T: store>(x: &T);
```

2. 输出堆栈 print_stack_trace

```
 public fun print_stack_trace()
```



## Errors

### 通用的错误码

1. 错误码的实现如下,对定义了一些通用的 caregory,对具体的原因进行移位后相加得到了错误码

```
fun make(category: u8, reason: u64): u64 {

    (category as u64) + (reason << 8)

}
```

2. 状态异常 invalid_state

```
/// The system is in a state where the performed operation is not allowed. Example: call to a function only allowed

/// in genesis

const INVALID_STATE: u8 = 1;

public fun invalid_state(reason: u64): u64 
```

3. 需要地址 requires_address

```
/// The signer of a transaction does not have the expected address for this operation. Example: a call to a function

/// which publishes a resource under a particular address.

const REQUIRES_ADDRESS: u8 = 2;

public fun requires_address(reason: u64): u64 
```

4. 需要权限 requires_role

```
/// The signer of a transaction does not have the expected  role for this operation. Example: a call to a function

/// which requires the signer to have the role of treasury compliance.

const REQUIRES_ROLE: u8 = 3;

public fun requires_role(reason: u64): u64 
```

5. 需要能力 requires_capability

```
/// The signer of a transaction does not have a required capability.

const REQUIRES_CAPABILITY: u8 = 4;

public fun requires_capability(reason: u64): u64 
```

6. 资源尚未发布 not_published

```
/// A resource is required but not published. Example: access to non-existing resource.

const NOT_PUBLISHED: u8 = 5;

public fun not_published(reason: u64): u64 
```

7. 资源已经发布 already_published

```
/// Attempting to publish a resource that is already published. Example: calling an initialization function

/// twice.

const ALREADY_PUBLISHED: u8 = 6;

public fun already_published(reason: u64): u64 
```

8. 参数错误 invalid_argument

```
/// An argument provided to an operation is invalid. Example: a signing key has the wrong format.

const INVALID_ARGUMENT: u8 = 7;

public fun invalid_argument(reason: u64): u64
```

9. 超出限制 limit_exceeded

```
/// A limit on an amount, e.g. a currency, is exceeded. Example: withdrawal of money after account limits window

/// is exhausted.

const LIMIT_EXCEEDED: u8 = 8;

public fun limit_exceeded(reason: u64): u64
```

10. 内部错误 internal

```
/// An internal error (bug) has occurred.

const INTERNAL: u8 = 10;

public fun internal(reason: u64): u64
```

11. 已过时 deprecated

```
/// deprecated code

const DEPRECATED: u8 = 11;

public fun deprecated(reason: u64): u64 
```

### 自定义 custom

```
/// A custom error category for extension points.

const CUSTOM: u8 = 255;

public fun custom(reason: u64): u64 
```



## Event
1. 定义

   ~~~move
   struct DummyEvent {
       dummy: u128,
   }
   ~~~

2. 初始化

   ~~~move
   Event::new_event_handle<DummyEvent>(account);
   ~~~

3. 产生Event

   ~~~move
   Event::emit_event<DummyEvent>(
   		&mut account_ref.dummy_events,
   		DummyEvent {
   				dummy: value,
   		},
   );
   ~~~



## Token

1. 注册token register_token

```
public fun register_token<TokenType: store>(

    account: &signer,

    precision: u8,

)
```

2. 移除mint 权限 remove_mint_capability

```
public fun remove_mint_capability<TokenType: store>(signer: &signer): MintCapability<TokenType>
```

3. 增加mint权限

```
public fun add_mint_capability<TokenType: store>(signer: &signer, cap: MintCapability<TokenType>) 
```

4. 销毁mint权限 destroy_mint_capability

```
public fun destroy_mint_capability<TokenType: store>(cap: MintCapability<TokenType>)
```

5. 移除burn权限 remove_burn_capability

```
public fun remove_burn_capability<TokenType: store>(signer: &signer): BurnCapability<TokenType>
```

6. 增加burn权限 add_burn_capability

```
public fun add_burn_capability<TokenType: store>(signer: &signer, cap: BurnCapability<TokenType>) 
```

7. 销毁burn权限 destroy_burn_capability

```
public fun destroy_burn_capability<TokenType: store>(cap: BurnCapability<TokenType>) 
```

8. mint mint

如果发起方没有mint的权限会失败,没有权限的话应该使用 `mint_with_capability` 方法,如果有场景是需要在调用的时候进行mint,就需要在注册token的时候把`MintCapability` move_to到某个安全的address下.

```
public fun mint<TokenType: store>(account: &signer, amount: u128): Token<TokenType>
```

9. 使用权限mint  mint_with_capability

```
public fun mint_with_capability<TokenType: store>(

    _capability: &MintCapability<TokenType>,

    amount: u128,

): Token<TokenType> acquires TokenInfo
```

10. Burn

跟mint一样需要权限 参考 [MINT](https://westarlabs.feishu.cn/docs/doccnj4QI5iLcwCvbcntUgxKBhc#BPiXcc)

```
public fun burn<TokenType: store>(account: &signer, tokens: Token<TokenType>)
```

11. 使用权限burn burn_with_capability

```
public fun burn_with_capability<TokenType: store>(

    _capability: &BurnCapability<TokenType>,

    tokens: Token<TokenType>,

)
```

12. 创建价值为0的Token zero

```
public fun zero<TokenType: store>(): Token<TokenType>
```

13. 获取价值 value

```
public fun value<TokenType: store>(token: &Token<TokenType>): u128 
```

14. token分割

```
public fun split<TokenType: store>(

    token: Token<TokenType>,

    value: u128,

): (Token<TokenType>, Token<TokenType>) 
```

15. 提取 withdraw

```
public fun withdraw<TokenType: store>(

    token: &mut Token<TokenType>,

    value: u128,

): Token<TokenType> 
```

16. 合并 join

```
public fun join<TokenType: store>(

    token1: Token<TokenType>,

    token2: Token<TokenType>,

): Token<TokenType> 
```

17. 充值 deposit

```
public fun deposit<TokenType: store>(token: &mut Token<TokenType>, check: Token<TokenType>) 
```

18. 销毁为0的token  destroy_zero

```
public fun destroy_zero<TokenType: store>(token: Token<TokenType>) 
```

19. 获取市场流通总量 market_cap

```
public fun market_cap<TokenType: store>(): u128 acquires TokenInfo 
```

20. 是否注册在某个地址 is_registered_in

```
public fun is_registered_in<TokenType: store>(token_address: address): bool 
```

21. 是否同一个Token类型 is_same_token

```
public fun is_same_token<TokenType1: store, TokenType2: store>(): bool 
```

22. 获取Token的地址 token_address

```
public fun token_address<TokenType: store>(): address 
```

23. 获取Toke的code token_code

```
public fun token_code<TokenType: store>(): TokenCode
```

24. Token code的结构

```
/// Token Code which identify a unique Token.

struct TokenCode has copy, drop, store {

    /// address who define the module contains the Token Type.

    addr: address,

    /// module which contains the Token Type.

    module_name: vector<u8>,

    /// name of the token. may nested if the token is a instantiated generic token type.

    name: vector<u8>,

}
```

25. 获取精度信息 scaling_factor

```
public fun scaling_factor<TokenType: store>(): u128 acquires TokenInfo 
```



## Timestamp

1. 获取当前时间(秒)  now_seconds

```
public fun now_seconds(): u64 acquires CurrentTimeMilliseconds 
```

2. 获取当前时间(毫秒) now_milliseconds

```
public fun now_milliseconds(): u64 acquires CurrentTimeMilliseconds 
```



## Vector

1. 创建 empty

```
fun empty<Element>(): vector<Element>
```

2. 创建只有一个对象的vector  singleton

```
public fun singleton<Element>(e: Element): vector<Element> 
```

3. 反转 reverse

```
public fun reverse<Element>(v: &mut vector<Element>)
```

4. 获取长度 length

```
fun length<Element>(v: &vector<Element>): u64;
```

5. 借用一个不可操作对象 borrow

```
public fun borrow<Element>(v: &vector<Element>, i: u64): &Element;
```

6. 向尾部添加一个对象 push_back

```
public fun push_back<Element>(v: &mut vector<Element>, e: Element);
```

7. 借用一个可操作对象  borrow_mut

```
public fun borrow_mut<Element>(v: &mut vector<Element>, i: u64): &mut Element;
```

8. 从尾部获取一个对象  pop_back

```
native public fun pop_back<Element>(v: &mut vector<Element>): Element;
```

9. 销毁一个空 vector destroy_empty

```
/// Destroy the vector `v`.

/// Aborts if `v` is not empty.

native public fun destroy_empty<Element>(v: vector<Element>);
```

10. vector里两个位置的对象互换 swap

```
/// Swaps the elements at the `i`th and `j`th indices in the vector `v`.

/// Aborts if `i`or `j` is out of bounds.

native public fun swap<Element>(v: &mut vector<Element>, i: u64, j: u64);
```

11. 两个vector 拼接 append

```
public fun append<Element>(lhs: &mut vector<Element>, other: vector<Element>) 
```

12. 是否为空  is_empty

```
public fun is_empty<Element>(v: &vector<Element>): bool 
```

13. 是否包含元素 contains

```
public fun contains<Element>(v: &vector<Element>, e: &Element): bool 
```

14. 获取元素位置  index_of

如果不存在该元素会返回 (false,0) ,这里需要先判断bool,不能直接获取index拿来用

```
public fun index_of<Element>(v: &vector<Element>, e: &Element): (bool, u64) 
```

15. 移除某个位置的元素 remove

```
public fun remove<Element>(v: &mut vector<Element>, i: u64): Element
```

16. 交换并移除某个位置的元素 swap_remove

该操作会把 i 位置的元素与最后一个元素兑换位置,然后将原本 i 位置的元素移除

```
public fun swap_remove<Element>(v: &mut vector<Element>, i: u64): Element 
```

17. 拆分 split

将vector拆分成制定长度的多个vector

```
public fun split<Element: copy + drop + store>(v: &vector<Element>, sub_len: u64): vector<vector<Element>> 
```



## Option

该模块是作用是包装一个值对象，这个包装中的值对象可有可无。例如 let op = Option<u8>包装是一个u8的值，op中可以有一个u8值。但也有可能它是一个声明了u8类型封装，但是其包含的值为空的对象。

