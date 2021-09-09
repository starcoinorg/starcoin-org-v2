---
title: Move精髓&动手设计NFT协议
weight: 3
---

# Move精髓&动手设计NFT协议

```
* 本文由Starcoin社区原创 作者:WGB
```
1. Starcoin
>智能合约编程语言，虚拟机，以及合约标准库是去中心化金融基础设施的核心部分，如何安全、便捷的在智能合约中表达资产，是区块链智能合约领域一直在研究的方向。   
Starcoin 选择面向数字资产的智能编程语言Move，以及虚拟机，并提供了丰富的合约标准库。   
Move 编程语言最早出现在 Facebook 的 Diem 区块链项目中，作为一种面向数字资产的智能合约编程语言，Move 具有 Resource 作为一等公民、灵活、安全、可验证等特性。这些特性和 Starcoin 的智能合约编程语言设计理念极为契合，因此 Starcoin 选择 Move 做为其智能合约的首选编程语言。  
Move语言具有其他区块链语言不具备的特点，利用这些特点可以简单、高效、安全的生成合约代码，快速有效的开发全新的区块链应用。  

![区块链](./img/move_course/1/区块链图2.jpg)

2. NFT
>NFT的全称是Non-Fungible Tokens，中文常被翻译成`"不可同质化代币/不可替代代币"`，它定义了一种生态中不可分割的、具有唯一性的代币交互和流通的接口规范。对于同质化货币Fungible Token 就是常见的各种Token，例如：BTC、ETH、STC等等，同质化货币的每一个币都可以被拆分，每个币没有他的编号，像是日常生活中的钢镚1元、5毛等，上面没有固定的编号只有通用的面值。而NFT一般来说是不可拆分的，每个NFT都有它的固定编号来标识它，可以理解为纸币，上面有编号，虽然面值相同但是编号不会相同。

例如：下面这个gif就是价值50万美元的Nyan Cat  

![50万美元的《 Nyan Cat（彩虹猫）》](./img/move_course/1/NFT1.gif)

3. Starcoin 与 NFT
>Starcoin所使用的智能合约编程语言是专为数字资产而生的Move，数字资产以BTC为起点，中间经历了漫长的发展过程，到现在中间从产生了以太坊，波场等多条公链。由此也诞生出许多优秀的项目，如:CryptoKitties、Decentraland等，其中CryptoKitties在上线过后一度堵死以太坊网络，由此可以窥探到NFT的市场需求。Starcoin 正是为数字资产而来，使用Move的特性可以让NFT等数字资产在Starcoin这条公链中简单、安全、快速的转移或保存。Move语言的三大特性Struct、Ability和 Generic 可以帮助NFT在Starcoin 部署，可以方便的自定义NFT的类型、定义NFT的唯一性和编写通用的NFT的代码。


## 一、Move语言的三大精髓
### 1. Struct
>&emsp;&emsp;Move语言在语法上简洁明了，在内置支持的类型上比较精简，但不因此失去灵活性，可以通过Struct 的特性，创建自定义的类型，它既可以可以包含复杂的数据，也可以不包含任何数据。Struct类似其他编程语言中的结构体，可以通过key-value的形式定义字段并存储内容。由此我们可以方便的通过Struct创建自己的NFT、Token以及其他的数据类型。  
#### (1)Struct 演示
>&emsp;&emsp;可以用一段代码来演示Struct，分别创建两个Struct：Empty和MyStruct，Empty为空，MyStruct包含多个基本类型和几个自定义的Struct类型：STC、Empty。

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
#### (2)Struct与Function的配合
>&emsp;&emsp;在自定义类型的时候，大多使用的情况是做存储的单元，这时就需要使用有效的手段来操作Struct，在Move中可以使用Function对Struct进行操作，比如创建一个NFT的Struct后，通过函数来打造、转移、销毁NFT等等。可以使用代码来展示如何操作Struct的创建与销毁。在这段代码里两个Strcut都有各自的创建和销毁函数，对于Struct中的自定义类型的创建与销毁需要遵循自定义类型的设计进行操作。
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
#### Struct、Function和Module的关系
>&emsp;&emsp;Struct和Function相辅相成，如果缺少了一个,另一个的存在也毫无意义， Module像是整个的工厂，可以创建修改销毁内部的Struct，Struct 像是原料，Function是操作原料的工具，可以在工厂(Module)中使用工具(function)来对原料(Struct)进行操控，最后生成可用的instance。

![关系图](./img/st_Fun_Mod.png)

### 2. Ability  
>&emsp;&emsp;Move语言实现了与rust类似的语法功能，是可靠的强类型区块链编程语言，在类型的权限控制上可以使用Ability特性的限制符，来控制不同类型的功能可以对资产的权限进行细致的控制：
>- Copy :表示该值是否可以被复制
>- Drop :表示该值是否可以在作用域结束时可以被丢弃
>- Key  :表示该值是否可以作为键值对全局状态进行访问
>- Store  :表示该值是否可以被存储到全局状态   

![Ability能力](./img/move_course/1/ability.png)

>&emsp;&emsp;通过在合约中对自定义类型的能力通过Ability进行限制，可以使程序变得简洁又不失安全性，例如定义一个NFT的类型，如果不赋予它Copy的能力，那么就可以保证NFT不能被随意的复制，提升了安全性。相同的概念还可以用钱的概念理解，在钱包中的钱如果可以随便复制、丢弃，就会让钱变得的毫无价值，所以通过对自定义类型的能力赋予，就可以一定程度上防止不安全的情况出现，当然，安全性最重要的影响因素是程序的制作者。
#### (1)Copy 的演示
>虽然有一些例子中的Struct不应该被赋予Copy的能力，但是仍然有一部分的Struct需要Copy的能力，例如需要保存通讯录信息的应用就需要通信人的信息需要复制多份进行分发。通过代码可以直观的看到有Copy能力的Struct和没有Copy能力的Struct在功能上的区别。
>- 定义两个Struct，其中CopyStruct带有Copy能力
>- 在销毁创建的两个Struct时，由于MoveStruct没有Copy的能力所以被销毁了本体，而CopyStruct在销毁了复制体后，本体依然存在
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
#### (2)Drop 的演示
>&emsp;&emsp;对于普通的类型销毁时可以通过 `"_"` 的方式进行销毁，但是自定义的类型变量在销毁时需要通过销毁函数来进行销毁，Move中的Ability提供了Drop以便自定义类型在销毁时也可以通过 `"_"` 进行销毁。通过代码可以清晰地了解此项能力。
>
>- 在销毁MyStruct时，内部的Empty已经被赋予了Drop的能力，在第51行的销毁函数中直接使用`"_"` 对Empty类型的变量进行销毁，而无需调用Empty的销毁函数
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

![区块链图](./img/move_course/1/区块链图5.jpeg)

### 3. Generic
>&emsp;&emsp;编写其他合约语言代码时，对于不同的NFT类型可能进行相同的处理时需要大量编写类似的代码，做了许多重复性工作，又例如为创建一个NFT通用的框架时，需要处理不同的类型，又需要大量重复类似的代码。Move语言在设计时通过Generic特性处理大量重复性工作，Generic类似其他编程语言中的泛型编程，可以实现通过单个函数的编写，应用于多种类型的功能，可以大幅度减少代码的重复性，提高编码效率，同时减少代码逻辑清晰更容易检查到错误的出现，避免上线后的损失。

#### (1)Struct 泛型的演示

>&emsp;&emsp;通过Struct创建泛型可以让一个Struct同时支持多种的内部类型，当需要使用u8、u64等类型时就不需要重复Struct。  

比如定义一个Box里面存有u64类型的变量：
```move
struct Box{
    value:u64
}
```
如果要再定义一个带有u8类型的变量的Box:
```move
struct Box{
    value:u8
}

**只需要定义一个带有Struct泛型的Box:**
>只需要传入泛型就可以完成 Box<u8> 和 Box<u64>
​```move
struct Box<T>{
    value:T
}
```
#### (2)Struct泛型+Ability
>如果使用了泛型，也可以同时使用Ability，使在使用泛型的后仍旧不失去安全性。

>这段代码展示了使用泛型的Box的定义，可以传入泛型生成实际的Struct ，传入的类型也可以加上Ability进行限制，以便精准的操控各个数据类型的能力，大大提升了灵活性，这也是Move语言适合新时代区块链NFT的重要特性。
**代码示例:**
```move
struct Box<T1:copy + drop ,T2:copy + drop + store> has copy,drop{
    contents_1: T1,
    contents_2: T2,
}
```
#### (3)Struct泛型+Ability+Function
>通过Struct、泛型和Ability的结合，再通过Function就可以实现通过这两个特性的结合，编写NFT通用框架，可以实现不可随意复制的，自定义任意类型的NFT铸造交易销毁等功能。

>在这段代码中通过函数创建Box时需要指定泛型，可以在函数中直接指定，也可以通过传参方式传入泛型，有多个泛型参数时也可以传入单个泛型，剩余在函数中指定。通过Struct泛型+Ability+Function的有机结合，可以让Move语言的合约有着极为强大的灵活性与安全性，借助这些功能可以轻松地移植其他区块链项目，实现快速上线、安全上线。
**代码示例:**
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
## 使用Move语言特性的 helloWorld 代码示例
>&emsp;&emsp;Move语言的三大精髓通过代码可以更为直观的展现出来，这段代码可以打印hello world字符串，但是在Move没有String类型，所以第15行通过hello world的16进制来输出字符。在这段代码中使用了Move的三个特性分别为：
>- 第5行和第9行通过Strcut定义了自定义类型的AnyWordEvent和EventHolder  
>- 第5行和第9行通过Ability修饰了两个自定义类型  
>- 在第16行使用Generic传入EventHolder类型来调用borrow_global_mut函数
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
![区块链](./img/move_course/1/区块链图3.jpeg)

## 二、常用合约
### 1. Vector
>Vector是在标准库中的一个Module,作用可以理解为C++中的Vector，可以使用Vector来实现NFT陈列室功能，保存所有的NFT在自己的账户下，可以方便的进行查看和管理，也可以使用它存入自定义的其他类型的Struct。

**常用函数：** 

|函数名|描述|
|----|----|
|public fun empty\<Element\>():vector\<Element\>;|创建一个空的vector|
|public fun pop_back\<Element\>(v: &mut vector\<Element\>):Element;|返回最后一个值的引用|
|public fun push_back\<Element\>(v: &mut vector\<Element\>,e:Element);|插入一个值|
|public fun length\<Element\>(v: &vector\<Element\>):u64;|返回vector的长度|
|public fun is_empty\<Element\>(v: &vector\<Element\>):bool;|判断vector是否为空|
|public fun contains\<Element\>(v: &vector\<Element\>,e:&Element):bool;|判断是否包含一个元素|
|public fun index_of\<Element\>(v: &vector\<Element\>,e:&Element):(bool,u64);|查看元素在vector中的位置|
|public fun remove\<Element\>(v: &mut vector\<Element\>,i:u64):Element;|删除vector中指定位置的元素|

### 2. Event
>Event 是标准库中的一个Module，作用是可以通知钱包，使钱包可以通知用户或在前端做其他的一些应用，例如NFT交易时，可以通知购买者已经收到NFT等等。  

**常用函数:**

|函数名|描述|
|----|----|
|public fun new_event_handle\<T: drop + store\>(account: &signer):EventHandle\<T\> acquires EventHandleGenerator{}|定义一个新的Event|
|public fun emit_event\<T: drop + store\>(handle_ref: &mut EventHandle\<T\>,msg: T):{} |发送Event|

### 3. Error
>当区块链执行判断出错时中断合约，在编码过程中如果数值不符合预期可以通过这种方式进行判断，并返回错误代码，错误代码可以展示在区块链的回复消息中，以便前端进行判断并反馈用户。例如：购买NFT时，输入的金额小于NFT的价格时可以通过assert判断大小并退出程序，来保证交易安全可靠。

**常用:**
|函数|描述|
|----|----|
|assert(false,1000)|第一个参数判断为真时可以执行后续，为假则退出并发送错误码|
|abort(10000)|直接退出，并发送错误码|

![NFT图](./img/move_course/1/NFT图.jpeg)

## 三、NFT协议的实现
>通过Move语言的三大特性和常用的合约module进行配合，可以非常轻松地创建NFT协议，我们可以以渐进式的方式进行NFT协议的编写。
### 1.NFT协议 V1
>在这段代码中实现了NFT的初始化和铸造，在第6行和第8行分别创建自己的NFT和NFT列表用来存放NFT，在第12行初始化NFT的列表以便可以接收和保存NFT，在第16行的铸造NFT函数中先判断是否可以接收NFT，如果不能则通过assert的判断直接退出并返回错误代码，保证NFT不会被不可接收的账户接收。这段代码实现了非常简单的NFT协议，可以通过其他的特性和功能进行完善。
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

### 2. NFT协议 V2
>通过Strcut可创建自己的NFT，但是如果需要创建其他类型的NFT就需要重新写代码，所以可以使用泛型编程的思想来重新构建NFT代码，在6行和8行定义带有泛型的NFT和NFT列表，在第12行定义初始化vector`<u8>`类型的NFT列表，在16行的函数的返回值和内部调用函数时使用的都是带有泛型的struct和函数，现在这个代码可以称作不完全的NFT框架，可以适合小范围测试的多个NFT。
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

### 3.NFT协议V3
>在上段代码中的new函数和initialize函数没有使用泛型参数，如果需要完成NFT的框架，就需要对这两个函数进行修改，在以下代码中把new函数和initialize函数也使用泛型进行修饰，使该NFT协议的灵活性大大提升，可以试用于多种不同的NFT测试。
```move
address 0x2 {
    module NFTExample3 {
        use 0x1::Signer;
        use 0x1::Vector;

        struct NFT<T: store> has key, store { name: T }

        struct UniqIdList<T: store> has key, store {
            data: vector<T>
        }

        public fun initialize<T: store>(account: &signer) {
            move_to(account, UniqIdList {data: Vector::empty<T>()});
        }

        public fun new<T: store + copy>(account: &signer, name: T): NFT<T> acquires UniqIdList {
            let account_address = Signer::address_of(account);
            let exist = Vector::contains<T>(&borrow_global<UniqIdList<T>>(account_address).data, &name);
            assert(!exist, 1);
            let id_list = borrow_global_mut<UniqIdList<T>>(account_address);
            Vector::push_back<T>(&mut id_list.data, copy name);
            NFT { name }
        }
    }
}
```
### 4.NFT协议V4
>通过对NFT协议的完善，可以在协议中增加Event，用来增加通知的功能可以在钱包中通知NFT的铸造通知。这段代码可以说是比较完整的简单NFT协议，可以再增加移动、销毁等功能，并增加图片显示等，配合前端应用可以制作出精美的NFT。
```move
address 0x2 {
    module NFTExample4 {
        use 0x1::Vector;
        use 0x1::Event;

        struct NFT<T: store> has key, store { name: T }

        struct UniqIdList<T: store + drop> has key, store {
            data: vector<T>,
            nft_events: Event::EventHandle<NFTEvent<T>>,
        }

        struct NFTEvent<T: store + drop> has drop, store {
            name: T,
        }

        public fun initialize<T: store + drop>(account: &signer) {
            move_to(account, UniqIdList {data: Vector::empty<T>(), nft_events: Event::new_event_handle<NFTEvent<T>>(account)});
        }

        public fun new<T: store + copy + drop>(_account: &signer, account_address:address, name: T): NFT<T> acquires UniqIdList {
            let exist = Vector::contains<T>(&borrow_global<UniqIdList<T>>(account_address).data, &name);
            assert(!exist, 1);
            let id_list = borrow_global_mut<UniqIdList<T>>(account_address);
            Vector::push_back<T>(&mut id_list.data, copy name);
            let new_name = copy name;
            Event::emit_event(&mut id_list.nft_events, NFTEvent { name:new_name });
            NFT { name }
        }
    }
}
```

![区块链](./img/move_course/1/区块链图4.jpeg)

## 四、问答环节
>在Starcoin的社区中有许多的开发者或关注者也在提出各种各样的问题，对于这些问题也有可靠的回答。
1. 投票时候币只有WithdrawEvent但是没有DepositEvent，这和老师刚讲的钱只能move有什么区别呢？ 是move到vote合约的意思吗？
- 答：对，Move的语义就是转移，在投票时所投的Token就是通过Move转移到投票合约中
2. move上有类似ERC20这样的标准吗
- 答：有的，但是不是Move中的，是Starcoin的stdlib中定义的类似ERC20的协议。但是在以太坊上的eth和ERC20的协议的Token的权限有所不同，但是Starcoin上的Token都是一样的。
3. Move有自定义异常和异常捕获吗？发现预期的异常得能处理吧
- 答：可以的，比如交易丢掉或者回返在output中
4. 泛型后面ability是要和定义的一样，还是子集就行
- 答：泛型字段的里的泛型可以和整体的Struct不完全相同，可以大于等于整体
