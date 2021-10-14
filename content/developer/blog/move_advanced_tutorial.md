---
title: Advanced Move & NFT Protocol
weight: 3
---

## Advanced Move & NFT Protocol

```
* This article was created by the Starcoin community. Author:WGB
```

### Starcoin介绍
TODO

### NFT
NFT stands for non-fungible token, it defines one kind of interface regulation in which interaction and transaction of cryptocurrency are unsplittable and unique. To fungible tokens,such as BTC,ETH,STC,etc. Each fungible token does not have its own code,and can be splitted, such as a one-dollar coin, there is no unique code on it, only generic value. But NFT is unsplittable, one NFT one unique cod, same value but different code. Example: Nyan Cat, $500000

<img src="https://tva1.sinaimg.cn/large/008i3skNly1guadm872ehg60d807s3z802.gif" alt="NFT1" style="zoom:50%;" />

### Starcoin & NFT
Move was born for digital assets, and is used to write smart contracts on Starcoin. With the Starcoin platform and move, digital assets such as NFT can be transferred and stored fast and securely. Digital assets, started from BTC, then experienced a long time development, to Ethereum and other public blockchain, in this process, there are many brilliant project, such as CryptoKitties, Decentraland, etc, especially CryptoKitties, it caused Ethereum network critical congestion, this also means that NFT has high market requirements. Move has three features: Struct, Ability and Generic, with these features, it’s easy to define NFT type, uniqueness of NFT, and to write generic NFT code.


## CoreMove
### 1. Struct
You can use struct to custom type which can contain complex data(or no data). Struct is quite similar to structure in other programming languages.Define variable as key-value type and store value, so we can create our own NFT,Token as struct.

#### (1) Struct Demo
We will create two structs: Empty and MyStruct. There are basic type and some custom struct type: STC,Empty

```move
1    address 0x2 {
2        module StructExample1 {
3            use 0x1::STC::STC;
4
5            struct Empty{}
6
7            struct MyStruct {
8                address_field: address,
9                bool_field: bool,
10                u64_field: u64,
11                vec_field: vector<u8>,
12                inner_field: Empty,
13                coins: STC,
14            }
15        }
16    }
```

#### (2)  Struct and Function
Most time custom type is used as storage unit , we need to find some methods to control struct, in Move, we can use function to control struct. Here is one example to show how to create, transfer, and destroy one NFT. In this example, each struct has its own construct and destructure function, so to custom type in the two struct, we should follow its own regulation to construct and destructure.
```move
1    address 0x2 {
2        module StructExample2 {
3            use 0x1::STC::STC;
4            use 0x1::Vector;
5            use 0x1::Token::{Self, Token};
6    
7            struct Empty{}
8    
9            struct MyStruct {
10                address_field: address,
11                bool_field: bool,
12                u64_field: u64,
13                vec_field: vector<u8>,
14                inner_field: Empty,
15                coins: Token<STC>,
16            }
17    
18            fun new_empty() : Empty {
19                Empty {}
20            }
21    
22            fun destroy_empty(empty: Empty) {
23                let Empty{} = empty;
24            }
25    
26            public fun new_struct() : MyStruct {
27                MyStruct {
28                    address_field: 0x1,
29                    bool_field: true,
30                    u64_field: 1000000,
31                    vec_field: Vector::empty(),
32                    inner_field: Self::new_empty(),
33                    coins: Token::zero<STC>(),
34                }
35            }
36    
37            public fun destroy_struct(my: MyStruct) {
38                let MyStruct {
39                    address_field: _,
40                    bool_field: _,
41                    u64_field: _,
42                    vec_field: _,
43                    inner_field: empty,
44                    coins: coins,
45                } = my;
46    
47                Self::destroy_empty(empty);
48                Token::destroy_zero(coins);
49            }
50        }
51    }
```

#### (3) Struct, Function and Module
Struct and function must work together, a module is like a factory, you can create a struct in this factory, and use function to control the struct.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1guadmq8s09j615z0e5gnh02.jpg" alt="st_Fun_Mod" style="zoom:30%;" />

### 2. Ability  
Move has similar grammar functionality with Rust, it's a reliable and strongly typed blockchain programming language, and we can use the ability to manage type authority.
- Copy - value can be copied (or cloned by value).
- Drop  - value can be *dropped* by the end of scope.
- Key   - value can be *used as a key* for global storage operations.
- Store  :value can be *stored* inside global storage.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1guadnapfjyj611e0brmy502.jpg" alt="ability" style="zoom:30%;" />

Limit type ability to make code simple but still security. For example, one NFT cannot be copied if it does not have copy ability. Same to cryptocurrency in a wallet, there will be zero values if it can be copied,dropped. So set type ability can solve some insecure issues, but developer is a key element for security. 

#### (1) Copy Demo
Some struct really need copy ability, such as one application which stores address book, address information is needed to be copied to publish to others. Here is an example to show two struct, one has copy ability, but another does not have.
- Define two struct, CopyStruct has copy ability
- AS MoveStruct does not have copy ability, so the original struct will be destroyed when you destructure his struct, but for CopyStruct, only the copied struct will be destroyed.
```move
1    address 0x2 {
2        module AbilityExample2 {
3            use 0x1::Debug;
4    
5            struct CopyStruct has copy {value:u64}
6            struct MoveStruct {value:u64}
7    
8            public fun new_copy_struct() : CopyStruct {
9                CopyStruct {value:100}
10            }
11    
12            public fun destroy_copy_struct(copy_struct: CopyStruct) {
13                let CopyStruct{value:_} = copy_struct;
14            }
15    
16            public fun new_move_struct() : MoveStruct {
17                MoveStruct {value:200}
18            }
19    
20            public fun destroy_move_struct(move_struct: MoveStruct) {
21                let MoveStruct {value:_} = move_struct;
22            }
23    
24            public fun test() {
25                let copy_struct = Self::new_copy_struct();
26                let move_struct = Self::new_move_struct();
27                Self::destroy_copy_struct(copy copy_struct);
28                //Self::destroy_move_struct(copy move_struct);
29                Self::destroy_move_struct(move_struct);
30                Debug::print(&copy_struct.value);
31                //Debug::print(&move_struct.value);
32                Self::destroy_copy_struct(copy_struct);
33            }
34        }
35    }
```

#### (2) Drop Demo
For general types, you can destroy them by `_`, but for custom types, we need functions to destroy them. In Move, you can set one custom type to have drop ability, so that you can destroy it by `_`.

- In MyStruct, Empty has drop ability, at line 51, we directly use `_` to destroy Empty without calling this function: destroy_empty.
```move
1    address 0x2 {
2        module AbilityExample1 {
3            use 0x1::STC::STC;
4            use 0x1::Vector;
5            use 0x1::Token::{Self, Token};
6
7            struct Empty has drop {}
8
9            struct MyStruct {
10                address_field: address,
11                bool_field: bool,
12                u64_field: u64,
13                    vec_field: vector<u8>,
14                inner_field: Empty,
15                coins: Token<STC>,
16            }
17
18            fun new_empty() : Empty {
19                Empty {}
20            }
21
22            fun destroy_empty(empty: Empty) {
23                let Empty{} = empty;
24            }
25
26            public fun new_struct() : MyStruct {
27                MyStruct {
28                    address_field: 0x1,
29                        bool_field: true,
30                        u64_field: 1000000,
31                        vec_field: Vector::empty(),
32                        inner_field: Self::new_empty(),
33                        coins: Token::zero<STC>(),
34                }
35            }
36
37            public fun destroy_struct(my: MyStruct) {
38                let MyStruct {
39                    address_field: _,
40                    bool_field: _,
41                    u64_field: _,
42                    vec_field: _,
43                    inner_field: empty,
44                    coins: coins,
45                } = my;
46
47                Self::destroy_empty(empty);
48                Token::destroy_zero(coins);
49            }
50
51            public fun destroy_struct_v2(my: MyStruct) {
52                let MyStruct {
53                    address_field: _,
54                    bool_field: _,
55                    u64_field: _,
56                    vec_field: _,
57                    inner_field: _,
58                    coins: coins,
59                } = my;
60
61                Token::destroy_zero(coins);
62            }
63        }
64    }
```

### 3. Generic
To implement one NFT has different types but with the same functionality, we need to write lots of similar code, this will cause redundancy. But in Move, you can write a single function, which can be used for any type，this can improve code efficiency and reduce code logic errors.

#### (1) Generic Struct

We will create a generic struct which can support different inner types, you do not need to define a duplicate struct when you want to use u8, u6 type.

First, let’s create a Box which will hold the u64 value.
```move
struct Box{
    value:u64
}
```
Then we will create another Box which will hold the u8 value.

But if we want to create another Box with different values, should we do the same just like creating a u64 and u8 Box? How do we make it easier? Use Generics.

```move
struct Box{
    value:u8
}

**Define a struct with generic**
>Just pass generic parameter, you can create any Box you need
​```move
struct Box<T>{
    value:T
}
```

#### (2) Struct ability in generics
You can use generics and ability at the same time to define a struct in Move.The below code segment shows how to define a generic struct, you can pass generics to get a general struct, and add ability to type.
**Example:**

```move
struct Box<T1:copy + drop ,T2:copy + drop + store> has copy,drop{
    contents_1: T1,
    contents_2: T2,
}
```

#### (3) Struct, Ability,Function,Generics
With struct,generics,ability and function, to write NFT general frames, to implement some functionalities,which can not be copied,custom defined arbitrarily.

In the below code segment, you need to pass generic type to this function(create_box) , or pass generic type to this constructor(Box). There are multiple generic parameters, you can pass only one in the constructor, the left parameter you can pass to the function(create_box) when you create a Box struct. 
**Example:**

```move
1    address 0x2{
2        module Box2{
3        
4            struct Box<T1:copy + drop, T2:copy + drop + store> has copy,drop {
5                contents_1: T1,
6                contents_2: T2,
7            }
8    
9    
10            fun create_box<T1:copy + drop, T2:copy + drop + store>(val_1:T1,    val_2:T2):Box<T1, T2> {
11                Box {contents_1:val_1, contents_2:val_2}
12            }
13    
14            public(script) fun create_bool_box<T2:copy + drop + store>(val_2:T2) {
15                let _ = Self::create_box<bool, T2>(false, val_2);
16            }
17    
18            public(script) fun create_bool_u64_box() {
19                let _ = Self::create_box<bool, u64>(false, 100);
20            }
21        }
22    }
```

### 4. Hello World
Move does not have string type, but with struct, ability, generics, we still can print string.
- Line 5 and 9, define AnyWordEvent and EventHolder type using struct 
- Line 5 and 9, add ability to the two struct type
- Line 16, use Generic to pass EventHolder to call borrow_global_mut function
```move
1    address 0x2{
2        module HelloWorld{
3            use 0x1::Signer;
4            use 0x1::Event;
5            struct AnyWordEvent has drop,store {
6                words:vector<u8>,
7            }
8
9            struct EventHolder has key{
10                any_word_events:Event::EventHandle<AnyWordEvent>,
11            }
12
13            public (script) fun hello_world(account: &signer) acquires EventHolder {
14                let addr = Signer::address_of(account);
15                let hello_world = x"68656c6c6f20776f726c64";  // hello world
16                let holder = borrow_global_mut<EventHolder>(addr);
17                Event::emit_event<AnyWordEvent>(&mut holder.any_word_events, AnyWordEvent{words:hello_world});
18            }
19        }
20    }
```



## General smart contract

### 1. Vector
Vector is a module in the stand library, its functionality is like Vector in C++. You can implement some functionalities using Vector,such as, save all NFTs in your own account, to view and manage NFTs.

**General function：** 

|Function signature|Description|
|----|----|
|public fun empty\<Element\>():vector\<Element\>;|Create one empty vector of type|
|public fun pop_back\<Element\>(v: &mut vector\<Element\>):Element;|Pop an element from the end of vector|
|public fun push_back\<Element\>(v: &mut vector\<Element\>,e:Element);|Push element to the end of the vector|
|public fun length\<Element\>(v: &vector\<Element\>):u64;|Get length of a vector|
|public fun is_empty\<Element\>(v: &vector\<Element\>):bool;|Check if the vector is empty|
|public fun contains\<Element\>(v: &vector\<Element\>,e:&Element):bool;|Check if the vector contains given element|
|public fun index_of\<Element\>(v: &vector\<Element\>,e:&Element):(bool,u64);|View the index of the given element in the vector|
|public fun remove\<Element\>(v: &mut vector\<Element\>,i:u64):Element;|Remove one element in given index|

### 2. Event
Event is a module in standard library, it’s used to notify the wallet, then the wallet could notify the user and frontend applications, for example: when merchandise NFTs, event can notify buyers that NFTs are received. 

**General function:**

|Function Signature|Description|
|----|----|
|public fun new_event_handle\<T: drop + store\>(account: &signer):EventHandle\<T\> acquires EventHandleGenerator{}|Define a new event|
|public fun emit_event\<T: drop + store\>(handle_ref: &mut EventHandle\<T\>,msg: T):{} |Emit an event|

### 3. Error
Smart contracts execution will be aborted when errors occur on blockchain. In compiling, you can return an error code if the real result is not the same as expected. Error code can be included in the returned message from blockchain, so that the frontend application can make a decision to give feedback to the user.  For example, when a user buys one NFT, if the entered amount is less than the price of the NFT, we can use assert to check the comparison and if this meets this condition, the application will exit to protect this transaction.

**General Function:**

|Function Signature|Description|
|----|----|
|assert(false,1000)|The first argument is true, will continue executing, otherwise, will exit and send error code|
|abort(10000)|Directly exit and send error code|

<img src="https://tva1.sinaimg.cn/large/008i3skNly1guadolwl2hj60u00f0aae02.jpg" alt="NFT图" style="zoom:33%;" />



## NFT Protocol

Next, we will demonstrate how to use Move to define the NFT protocol.

### 1. NFT Protocol V1 
In the below code segment, we implement two functionalities: initialize and mint  NFT.

* Line 6: Define NFT struct
* Line 8: Define UniqIdList struct to store NFT
* Line 12: Initialize UniqIdList to receive and store NFT
* Line 16: First, this function will use assert to make a decision to receive this NFT or not, if the NFT can not be received, exit and return error code, to guarantee that NFT can not be received by the account which is illegal. 

```move
1    address 0x2 {
2        module NFTExample1 {
3            use 0x1::Signer;
4            use 0x1::Vector;
5    
6            struct NFT has key, store { name: vector<u8> }
7    
8            struct UniqIdList has key, store {
9                data: vector<vector<u8>>
10            }
11    
12            public fun initialize(account: &signer) {
13                move_to(account, UniqIdList {data: Vector::empty<vector<u8>>()});
14            }
15    
16            public fun new(account: &signer, name: vector<u8>): NFT acquires UniqIdList {
17                let account_address = Signer::address_of(account);
18                let exist = Vector::contains<vector<u8>>(&borrow_global<UniqIdList>(account_address).data, &name);
19                assert(!exist, 1);
20                let id_list = borrow_global_mut<UniqIdList>(account_address);
21                Vector::push_back<vector<u8>>(&mut id_list.data, copy name);
22                NFT { name }
23            }
24        }
25    }
```

### 2. NFT Protocol V2
Use struct to construct NFT, but you will need to rewrite the code if you need another type of NFT, generics can solve this issue.

* Line 6: Define generic NFT struct
* Line 8: Define generic UniqIdList struct
* Line 12: Initialize UniqIdList with vector<u8>
* Line 16: Generic struct and function will be returned and called

Now this code segment is not completed, but it can be used to test multiple NFT with some scope.

```move
1    address 0x2 {
2        module NFTExample2 {
3            use 0x1::Signer;
4            use 0x1::Vector;
5    
6            struct NFT<T: store> has key, store { name: T }
7    
8            struct UniqIdList<T: store> has key, store {
9                data: vector<T>
10            }
11    
12            public fun initialize(account: &signer) {
13                move_to(account, UniqIdList {data: Vector::empty<vector<u8>>()});
14            }
15    
16            public fun new(account: &signer, name: vector<u8>): NFT<vector<u8>> acquires UniqIdList {
17                let account_address = Signer::address_of(account);
18                let exist = Vector::contains<vector<u8>>(&borrow_global<UniqIdList<vector<u8>>> (account_address).data, &name);
19                assert(!exist, 1);
20                let id_list = borrow_global_mut<UniqIdList<vector<u8>>>(account_address);
21                Vector::push_back<vector<u8>>(&mut id_list.data, copy name);
22                NFT { name }
23            }
24        }
25    }
```

### 3. NFT Protocol V3
In the above code segment, we used generic parameters in the `new` and `initialize` functions. We need to modify these two functions if we prefer to make this frame complete. 

Use generic to decorate `new` and `initialize` to make these two functions could be applied to more multiple NFT tests.

```move
1    address 0x2 {
2        module NFTExample3 {
3            use 0x1::Signer;
4            use 0x1::Vector;
5
6            struct NFT<T: store> has key, store { name: T }
7
8            struct UniqIdList<T: store> has key, store {
9                data: vector<T>
10           }
11
12           public fun initialize<T: store>(account: &signer) {
13               move_to(account, UniqIdList {data: Vector::empty<T>()});
14           }
15
16           public fun new<T: store + copy>(account: &signer, name: T): NFT<T> acquires UniqIdList {
17               let account_address = Signer::address_of(account);
18               let exist = Vector::contains<T>(&borrow_global<UniqIdList<T>>(account_address).data, &name);
19               assert(!exist, 1);
20               let id_list = borrow_global_mut<UniqIdList<T>>(account_address);
21            Vector::push_back<T>(&mut id_list.data, copy name);
22               NFT { name }
23           }
24       }
25   }
```

### 4. NFT Protocol V4
We can add events to this NFT protocol, so that we can add notify functionality. This code segment is relatively completed, but you still can add other functionalities,such as, transfer, destroy, work with frontend, and make beautiful NFT.
```move
1    address 0x2 {
2        module NFTExample4 {
3            use 0x1::Vector;
4            use 0x1::Event;
5
6            struct NFT<T: store> has key, store { name: T }
7
8            struct UniqIdList<T: store + drop> has key, store {
9                data: vector<T>,
10               nft_events: Event::EventHandle<NFTEvent<T>>,
11           }
12
13           struct NFTEvent<T: store + drop> has drop, store {
14               name: T,
15           }
16
17           public fun initialize<T: store + drop>(account: &signer) {
18               move_to(account, UniqIdList {data: Vector::empty<T>(), nft_events: Event::new_event_handle<NFTEvent<T>>(account)});
19           }
20
21           public fun new<T: store + copy + drop>(_account: &signer, account_address:address, name: T): NFT<T> acquires UniqIdList {
22               let exist = Vector::contains<T>(&borrow_global<UniqIdList<T>>(account_address).data, &name);
23               assert(!exist, 1);
24               let id_list = borrow_global_mut<UniqIdList<T>>(account_address);
25               Vector::push_back<T>(&mut id_list.data, copy name);
26               let new_name = copy name;
27               Event::emit_event(&mut id_list.nft_events, NFTEvent { name:new_name });
28               NFT { name }
29           }
30       }
31   }
```



## Q & A

1. Only WithdrawEvent and DepositEvent in vote smart contract, is there any difference with move as you just mentioned? Does this mean a move to vote smart contract?
- Answer: Yes, key feature in Move is transfer, Tokens you used to vote will be transferred to the corresponding smart contract. 
2.  Is there a standard which is similar to ERC20 in Move?
- Answer: Yes, but not in Move, there is similar ERC20 protocol in stdlib of Starcoin. Eth in Ethereum and tokens in ERC20 protocol have different authority, but tokens of Starcoin, the authority is the same.
3. Does Move has exceptions, and does Move can catch exceptions? How do Move handle expected exceptions?
- Answer: Move can catch exceptions, such as lost transactions, or transactions were returned in output.
4. Is generic ability the same with definition, or just subset? 
- Answer: Ability of generic variables can be different with whole struct, can have more ability than whole struct. 
