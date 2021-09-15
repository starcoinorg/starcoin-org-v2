---
title: Move开发实战
weight: 5
---

# Move开发实战
```
* 本文由Starcoin社区原创 作者:WGB 根据Starcoin & Move直播课《Move开发实战》整理。
```
&emsp;&emsp;Move 编程语言最早出现在 Facebook 的 Diem 区块链项目中，它是面向数字资产编程的智能合约语言，Move具有多种特性，涉及安全、开发效率等方面。  
&emsp;&emsp;如果想要完整的开发一个Move语言的项目，个人觉得要了解Move项目的开发流程，相对于其他语言的项目来说，Move语言的基本流程都比较相似，都有开发、单元测试、集成测试、本地发布与调用、链上部署与调用等等。但由于合约编程语言的不同，开发工具与每一项具体步骤也不同，所以对于希望开发Move项目和希望了解Move语言开发的开发者或关注者来说，可以通过本篇《Move项目的开发实战》来了解和熟悉Move项目的开发，需要注意Move语言的开发暂时需要使用类unix系统进行开发，推荐使用MacOS或者ubuntu20.04进行开发。如果没有Mac，可以使用虚拟机下的ubuntu进行开发。  



## 一、新建Move项目

&emsp;&emsp;开发项目的第一个步骤就是创建一个新的项目，这个过程可以自己创建项目的树状目录，也可以通过使用 move-cli 进行创建。move-cli是官方推出的一个move的开发工具，有创建、编译、测试等功能，可以从官方的[github](https://github.com/starcoinorg/starcoin/)下载move-cli，也可以通过下载完整的starcoin包后在解压包内找到move-cli，还可以通过clone后自行编译编译的方式获取。  

**直接下载：**

![move-cli下载](https://tva1.sinaimg.cn/large/008i3skNly1guh3u62zrmj60uk0a0ab202.jpg)

### 1. 使用move-cli创建项目
&emsp;&emsp;在下载好move-cli后，可以通过命令创建新的项目，对于move-cli的其他命令可以通过--help 来查看具体功能，随后我们也会在项目过程中使用它们中的一部分。  

**创建 hello_world 项目**
```shell
move scaffold hello_world
```
**创建的目录结构：**
```shell
执行:
    tree hello_world
结果:
    hello_world/
    ├── args.txt
    ├── src
    │   ├── modules
    │   └── scripts
    └── tests
```
- src下的modules存放的就是要写的合约代码，scripts存放的是写的脚本代码



## 二、开发与调试

### 1. hello world 
&emsp;&emsp;在创建好目录后就可以在src目录下写脚本和模块，可以在scripts目录中创建一个hello_world.move，并在里面填写代码,代码的含义是在屏幕打印 hello world 的 十进制 ascii 码 vector，这主要是暂时在Move中未支持string类型，这项支持已经在社区中有一些进度，可以等待后续的更新。  

#### (1) hello_world.move
```move
script {
        use 0x1::Debug;
        fun main() {
            Debug::print(&b"hello world");
        }
}
```
**代码示例：**  

![hello_world_move](https://tva1.sinaimg.cn/large/008i3skNly1guh3vlx041j60an034t8p02.jpg)

#### (2)执行验证
```shell
执行：
    move run src/scripts/hello_world.move 
结果：
    [debug] (&) [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
```

**执行示例：**  

![执行_hello_world_move](https://tva1.sinaimg.cn/large/008i3skNly1guh3vvfb5hj60jk011jrl02.jpg)


### 2. 编译
&emsp;&emsp;在上一小节的hello world 中使用的是script脚本的方式，但是在Move合约项目中的核心还是module模块，通过module模块中的函数和脚本组合可以实现多种多样的功能。通过对模块的编译，可以将模块部署到区块链中使用，在编译之前也可以通过check功能进行语法检查，以便减少开发中遗漏的问题。  

#### (1) 编写Test.move代码
&emsp;&emsp;首先，在src/modules下编写一个Test.move，在其中实现一个自定义的Struct以及创建、修改和销毁Struct函数。  

```move
address 0x2{
module Test {
    use 0x1::Signer;

    struct Resource  has key { i: u64 }

    public fun publish(account: &signer) {
        move_to(account, Resource { i: 10 })
    }

    public fun write(account: &signer, i: u64) acquires Resource {
        borrow_global_mut<Resource>(Signer::address_of(account)).i = i;
    }

    public fun unpublish(account: &signer) acquires Resource {
        let Resource { i: _ } = move_from(Signer::address_of(account));
    }
    public fun value_of(addr: address):u64 acquires Resource{
        borrow_global<Resource>(addr).i
    }

}
}
```
#### (2) check 编译
&emsp;&emsp;对于编写的Move代码，可能在编写的过程中忘记一些符号或着变量的使用。所以可以通过move check命令对代码的语法进行检查编译，如果语法出现错误就会在屏幕中显示，如果语法没有错误则不会打印任何信息。  

&emsp;&emsp;在move check时默认使用的是stdlib标准库中的库代码，如果想要依赖于链上的已有合约代码，可以通过使用--mode starcoin --starcoin-rpc http://main.seed.starcoin.org:9850 等选项进行链上依赖检查。具体的选项和功能可以使用move check --help 来查看。  

**执行check：**
```shell
执行：    
    move check src/modules/Test.move
结果：
    
```
**执行本地check示例:**  

![本地check](https://tva1.sinaimg.cn/large/008i3skNly1guh3w4lz6rj60i70133yl02.jpg)

**链上check：**
```shell   
move check  \
            --mode starcoin \
            --starcoin-rpc http://main.seed.starcoin.org:9850 \
            --block-number 1000000 \
            src/modules/Test.move

```
**执行链上check示例:**  

![链上check](https://tva1.sinaimg.cn/large/008i3skNly1guh3wd214jj60gp037gm002.jpg)



## 三、单元测试

&emsp;&emsp;在Move开发过程中通过check检查没有语法错误后，依然不能掉以轻心，因为代码中的错误不只有语法错误，更多的是业务逻辑的错误和代码编写中的逻辑错误，对于这些错误，可以使用功能强大的单元测试来针对小范围的代码进行测试。  

### 1. 编写module代码
&emsp;&emsp;编写MyModule.move代码进行单元测试，将需要测试的代码用类似宏的方式标记，对于需要测试的项目用 `#[test]` ,如果不关心代码中的assert的中止码可以使用`[expected_failure]`跳过，对于只需要在测试下的函数可以使用`#[test]`,对于需要传递参数的函数可以通过`#[test(a = @0x1, b = @0x2)]`传递参数。

```move
address 0x2{
module MyModule {

    struct MyCoin has key { value: u64 }

    public fun make_sure_non_zero_coin(coin: MyCoin): MyCoin {
        assert(coin.value > 0, 0);
        coin
    }

    public fun has_coin(addr: address): bool {
        exists<MyCoin>(addr)
    }
    
    #[test]
    fun make_sure_non_zero_coin_passes() {
        let coin = MyCoin { value: 1 };
        let MyCoin { value: _ } = make_sure_non_zero_coin(coin);
    }
    #[test]
    // Or #[expected_failure] if we don't care about the abort code
    #[expected_failure(abort_code = 0)]
    fun make_sure_zero_coin_fails() {
        let coin = MyCoin { value: 0 };
        let MyCoin { value: _ } = make_sure_non_zero_coin(coin);
    }
    #[test_only] // test only helper function
    fun publish_coin(account: &signer) {
        move_to(account, MyCoin { value: 1 })
    }
    #[test(a = @0x1, b = @0x2)]
    fun test_has_coin(a: signer, b: signer) {
        publish_coin(&a);
        publish_coin(&b);
        assert(has_coin(@0x1), 0);
        assert(has_coin(@0x2), 1);
        assert(!has_coin(@0x3), 1);
    }
}
}
```
### 2. 执行单元测试
&emsp;&emsp;在编写测试代码后，可以通过move unit-test 来测试代码，测试的结果会在终端进行打印，如果测试通过会打印出PASS。在测试时也可以通过不同的选项来查看测试的信息，如： move unit-test -l src/modules/Mymodule.move 可以查看测试项，move unit-test -s src/modules/Mymodule.move 可以在做测试时统计时间等，更多选项与功能可以通过move unit-test --help来查看和使用。  

#### (1)执行单元测试
```shell
执行：
    move unit-test src/modules/Mymodule.move
结果：
    Running Move unit tests
    [ PASS    ] 0x2::MyModule::make_sure_non_zero_coin_passes
    [ PASS    ] 0x2::MyModule::make_sure_zero_coin_fails
    [ PASS    ] 0x2::MyModule::test_has_coin
    Test result: OK. Total tests: 3; passed: 3; failed: 0
```
**测试结果：**  

![单元测试](https://tva1.sinaimg.cn/large/008i3skNly1guh3woey49j60kb03jgmi02.jpg)

#### (2)查看测试项

```shell
执行：
    move unit-test -l src/modules/Mymodule.move
结果：
    0x2::MyModule::make_sure_non_zero_coin_passes: test
    0x2::MyModule::make_sure_zero_coin_fails: test
    0x2::MyModule::test_has_coin: test
```
**测试结果：**  

![查看单元测试项](https://tva1.sinaimg.cn/large/008i3skNly1guh3ww64haj60kx024jrv02.jpg)

#### (3)带有统计的单元测试
```shell
执行：
    move unit-test -s src/modules/Mymodule.move
结果：
    Running Move unit tests
    [ PASS    ] 0x2::MyModule::make_sure_non_zero_coin_passes
    [ PASS    ] 0x2::MyModule::make_sure_zero_coin_fails
    [ PASS    ] 0x2::MyModule::test_has_coin

    Test Statistics:

    ┌───────────────────────────────────────────────┬────────────┬───────────────────────────┐
    │                   Test Name                   │    Time    │   Instructions Executed   │
    ├───────────────────────────────────────────────┼────────────┼───────────────────────────┤
    │ 0x2::MyModule::make_sure_non_zero_coin_passes │   0.000    │             1             │
    ├───────────────────────────────────────────────┼────────────┼───────────────────────────┤
    │ 0x2::MyModule::make_sure_zero_coin_fails      │   0.000    │             1             │
    ├───────────────────────────────────────────────┼────────────┼───────────────────────────┤
    │ 0x2::MyModule::test_has_coin                  │   0.000    │             1             │
    └───────────────────────────────────────────────┴────────────┴───────────────────────────┘

```
**测试结果：**  

![带统计的单元测试](https://tva1.sinaimg.cn/large/008i3skNly1guh3x3p8kdj60mo0a0ac102.jpg)



## 四、功能（集成）测试

&emsp;&emsp;单元测试只适用于小范围的测试，当整个需要进行复杂测试时，则需要通过功能测试来详细的测试，功能测试相对于单元测试增加了区块链测试，可以通过定义账号、定义区块的生成以及交易的产生等等来测试项目代码。
### 1.功能测试的组成
功能测试可以分为个板块：
- 全局配置
- 新区块的生成
- 区块的交易
- 执行的交易代码
#### (1) 全局配置
可以指定全局的账户等等  
格式为：
>- //! account: alice, 100000000000,77
>- `//! account: <name> <address> <amount> <sequence-number>`  

#### (2) 新区块的生成
可以在测试中生成区块并指定打包人、区块号和生成时间等等
格式为:  
&emsp;&emsp;//! block-prologue  
&emsp;&emsp;//! author: alice  
&emsp;&emsp;//! block-number: 1  
&emsp;&emsp;//! block-time: 10000  

#### (3) 区块的交易
可以生成区块的交易并指定发起人、参数、gas费等等  
格式为:  
&emsp;&emsp;//! new-transaction  
&emsp;&emsp;//! sender:alice  
&emsp;&emsp;//! args: 10u64  
&emsp;&emsp;//! max-gas: 7700000  
&emsp;&emsp;//! sequence-number:77  
&emsp;&emsp;//! gas-price: 1  

#### (4) 执行的交易代码
可以指定发起交易所执行的代码
格式为:  
&emsp;&emsp;script {  
&emsp;&emsp;&emsp;&emsp;use 0x2::Test;  
&emsp;&emsp;&emsp;&emsp;use 0x1::Signer;  
&emsp;&emsp;&emsp;&emsp;fun main(account: signer, expected: u64){   
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Test::publish(&account);  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;assert(Test::value_of(Signer::address_of(&account)) == expected, 100);  
&emsp;&emsp;&emsp;&emsp;}  
&emsp;&emsp;}  
### 2.功能测试示例
指定三个账户并分别设置不同的配置，生成新的区块，并生成新的交易来测试
```move
//! account: alice, 10000000000000, 77
//! account: bob, 0x3
//! account: tom,10000000000

//! block-prologue
//! author: alice
//! block-number: 1
//! block-time: 10000

//! new-transaction
//! sender:alice
//! args: 10u64
//! max-gas: 7700000
//! sequence-number:77
//! gas-price: 1

script {
    use 0x2::Test;
    use 0x1::Signer;
    fun main(account: signer, expected: u64){
        Test::publish(&account);
        assert(Test::value_of(Signer::address_of(&account)) == expected, 100);
    }
}

//! block-prologue
//! author: alice
//! block-number: 2
//! block-time: 20000

```


## 五、合约的本地发布和调用

&emsp;&emsp;代码测试后，可以通过move-cli去部署代码，因为在链上部署调用对于测试开发环境比较麻烦，所以优先本地测试调用合约。
### 1.publish 编译并本地部署
&emsp;&emsp;通过check检查编译后的代码就可以通过publish编译生成字节码文件，使用move publish 就可以对代码编译字节码，代码编译后的字节码文件默认存放在当前文件夹的storage中。  

&emsp;&emsp;publish的编译与check的检查编译类似，在成功以后不会有输出结果，不同的是publish会在hello_world/storage/0x00000000000000000000000000000002/modules目录中生成字节码文件Test.mv，publish和check一样可以使用stdlib或链上的合约进行操作，选项与check相同，可以通过move publish --help 进行查看具体的选项与功能。 

**执行publish：**
```shell
执行：
    move publish src/modules/Test.move
结果：

```
**执行结果：**

![执行publish](https://tva1.sinaimg.cn/large/008i3skNly1guh3xk79mmj60iz01g3yn02.jpg)

### 2. 查看字节码文件
&emsp;&emsp;在通过publish编译出module的字节码后，所有的字节码将在storage/0x00000000000000000000000000000002/modules下产生，如果在调用过程中出现异常，可以通过move view  命令来分析字节码查错
```shell
执行：
    move view Test.mv
结果：
    module 2.Test {
        struct Resource has key {
            i: u64
        }

        public publish() {
            0: MoveLoc[0](Arg0: &signer)
            1: LdU64(10)
            2: Pack[0](Resource)
            3: MoveTo[0](Resource)
            4: Ret
        }
        public unpublish() {
            0: MoveLoc[0](Arg0: &signer)
            1: Call[3](address_of(&signer): address)
            2: MoveFrom[0](Resource)
            3: Unpack[0](Resource)
            4: Pop
            5: Ret
        }
        public write() {
            0: CopyLoc[1](Arg1: u64)
            1: MoveLoc[0](Arg0: &signer)
            2: Call[3](address_of(&signer): address)
            3: MutBorrowGlobal[0](Resource)
            4: MutBorrowField[0](Resource.i: u64)
            5: WriteRef
            6: Ret
        }
    }   
```
**查看字节码的部分结果:**

![view查看字节码](https://tva1.sinaimg.cn/large/008i3skNly1guh3xs1qx0j60r30b8dhd02.jpg)

### 3. 本地调用
&emsp;&emsp;通过本地的部署后，可以通过写script脚本来调用module代码，以测试和验证module代码
#### (1) 编写脚本代码
&emsp;&emsp;在src/script/下编写publish_resource.move，调用0x2::Test模块下的函数并打印返回值
```move
script {
    use 0x2::Test;
    use 0x1::Debug;
    use 0x1::Signer;
    fun main(account: signer) {
        Test::publish(&account);
        Debug::print(&Test::value_of(Signer::address_of(&account)));
    }
}
```
#### (2) 执行脚本
&emsp;&emsp;执行脚本以调用Test模块中的函数，在调用时通过move run 调用脚本并指定发起者
```shell
执行：
    move run src/scripts/publish_resource.move --signers 0x12345
结果：
    [debug] 10
```
**执行本地脚本:**

![执行move本地脚本](https://tva1.sinaimg.cn/large/008i3skNly1guh3y2t57oj60p801tt8v02.jpg)

#### (3) view 查看区块链结果
&emsp;&emsp;在本地调用之后，既可以通过区块链方式查看结果，也可以通过move view方式来查看。
```shell
执行：
    move view storage/0x00000000000000000000000000012345/resources/0x00000000000000000000000000000002::Test::Resource.bcs
结果：
    key 0x00000000000000000000000000000002::Test::Resource {
        i: 10
    }   
```
**查看本地调用的资源:**

![view查看本地调用的资源](https://tva1.sinaimg.cn/large/008i3skNly1guh3y9cc6qj60l903jmxw02.jpg)



## 六、合约的链上部署和调用

&emsp;&emsp;在本地部署测试之后就可以通过dev网络进行链上的部署测试，可以通过starcoin的启动一个dev网络，并使用默认账户进行链上部署和调用合约
### 1. 启动节点
```shell
启动dev节点
执行：
    starcoin -n dev console
结果：
    starcoin% 
```
### 2. 账户管理
#### (1)查看账户
查看账户的地址，方便修改module的address
```shell
执行：
    starcoin% account show

结果：
    {
        "ok": {
            "account": {
            "address": "0xe1fb7f08be5427c9230e7eea99ce21a7",
            "is_default": true,
            "is_readonly": false,
            "public_key": "0xdaa5325889979bf533659448ebca82a13d379c574fe7e9af0b9e06e70c6d971b",
            "receipt_identifier": "stc1pu8ah7z972snujgcw0m4fnn3p5ulvfsv9"
            },
            "auth_key": "0x31c2ab0ea48eff7623eaa5608d96e4f5e1fb7f08be5427c9230e7eea99ce21a7",
            "sequence_number": null,
            "balances": {}
        }
    }
```
**查看账户结果:**

![查看账户](https://tva1.sinaimg.cn/large/008i3skNly1guh3yippy2j60me095jt002.jpg)

#### (2)获得STC
&emsp;&emsp;获得一些STC用作部署和调用的gas费
```shell
执行:
    starcoin% dev get-coin

结果:
    txn 0x0ee2eca20d4158b390be31f3fecaeac9d177f05d2e3e9ea489c83cc453ee0c20 submitted.
    {
    "ok": {
        "block_hash": "0x99ffac9baafb80348cd69952de20309c134e84f60316ea16d974b1a8b0c5b85c",
        "block_number": "7",
        "transaction_hash": "0x0ee2eca20d4158b390be31f3fecaeac9d177f05d2e3e9ea489c83cc453ee0c20",
        "transaction_index": 1,
        "state_root_hash": "0x5f8beedeb725c9dd434b200969aa7820b2c65bd3abda1860c7b4c2d5310f5ac9",
        "event_root_hash": "0xdba2769b4e1f4c9170a8ad7b27268debfcabba0bf0e998f2d8fd2e78c0faf252",
        "gas_used": "119769",
        "status": "Executed"
    }
    }
```
**获得STC结果：**

![获得stc](https://tva1.sinaimg.cn/large/008i3skNly1guh3yr4gpfj60ne07nabv02.jpg)

#### (3)解锁账户
&emsp;&emsp;解锁账户以便交易可以签名发出
```shell
执行:
    starcoin% account unlock

结果:
    {
        "ok": {
            "address": "0xe1fb7f08be5427c9230e7eea99ce21a7",
            "is_default": true,
            "is_readonly": false,
            "public_key": "0xdaa5325889979bf533659448ebca82a13d379c574fe7e9af0b9e06e70c6d971b",
            "receipt_identifier": "stc1pu8ah7z972snujgcw0m4fnn3p5ulvfsv9"
        }
    }
```
**解锁账户结果:**

![解锁账户](https://tva1.sinaimg.cn/large/008i3skNly1guh3yymm4vj60lu05h0tl02.jpg)


### 3.修改module模块address
&emsp;&emsp;修改address 以便可以在链上部署
```move
address 0xe1fb7f08be5427c9230e7eea99ce21a7{
module Test {
    use 0x1::Signer;

    struct Resource  has key { i: u64 }

    public fun publish(account: &signer) {
        move_to(account, Resource { i: 10 })
    }

    public fun write(account: &signer, i: u64) acquires Resource {
        borrow_global_mut<Resource>(Signer::address_of(account)).i = i;
    }

    public fun unpublish(account: &signer) acquires Resource {
        let Resource { i: _ } = move_from(Signer::address_of(account));
  }
    public fun value_of(addr: address):u64 acquires Resource{
        borrow_global<Resource>(addr).i
    }
}
module TestScript {
    use 0xe1fb7f08be5427c9230e7eea99ce21a7::Test;

    public (script) fun publish(account: signer) {
        Test::publish(&account);
    }

    public (script)fun write(account: signer, i: u64) {
        Test::write(&account,i);
    }

    public (script)fun unpublish(account: signer){
        Test::unpublish(&account);
    }
    public (script)fun value_of(addr: address):u64 {
        Test::value_of(addr)
    }
}
}
```
### 4. 编译部署
#### (1)编译为字节码
&emsp;&emsp;部署时需要使用字节码文件部署，所以先编译为字节码文件
```shell
执行:
    move publish
结果:

```
#### (2)在dev网络下部署
&emsp;&emsp;在dev下部署module的字节码，节省成本方便开发
```shell
执行:
    starcoin% dev deploy /home/wgb/code/starcoin/hello_world/storage/0xe1fb7f08be5427c9230e7eea99ce21a7/modules/Test.mv -b
    dev deploy /home/wgb/code/starcoin/hello_world/storage/0xe1fb7f08be5427c9230e7eea99ce21a7/modules/TestScript.mv -b
结果:
    生成新的区块交易
```
### 5. 调用
#### (1) 调用脚本
&emsp;&emsp;调用publish 脚本测试module代码
```shell
执行:
    starcoin% account execute-function --function 0xe1fb7f08be5427c9230e7eea99ce21a7::TestScript::publish
结果:
    生成新的交易
```
#### (2) 查看资源
&emsp;&emsp;在执行脚本后可以查看资源是否已经被创建，用来验证脚本和module的可用性
```shell
执行:
    starcoin% state get resource 0xe1fb7f08be5427c9230e7eea99ce21a7 0xe1fb7f08be5427c9230e7eea99ce21a7::Test::Resource
结果:
    {
        "ok": {
                "raw": "0x0a00000000000000",
                "json": {
                "i": 10
            }
        }
    }
```
**查看链上资源结果：**

![查看view资源](https://tva1.sinaimg.cn/large/008i3skNly1guh3z7ypm8j60st052aak02.jpg)

#### (3) 调用带参数的脚本
&emsp;&emsp;可以通过带参数的脚本对资源进行修改，以修改链上的状态
```shell
执行:
    starcoin% account execute-function --function 0xe1fb7f08be5427c9230e7eea99ce21a7::TestScript::write --arg 20u64
结果:
    生成新的交易
```
#### (4) 查看修改后的资源
&emsp;&emsp;通过查看资源的变化来测试修改的效果
```shell
执行:
    starcoin% state get resource 0xe1fb7f08be5427c9230e7eea99ce21a7 0xe1fb7f08be5427c9230e7eea99ce21a7::Test::Resource
结果:
    {
        "ok": {
                "raw": "0x0a00000000000000",
                "json": {
                "i": 20
            }
        }
    }
```
**查看链上资源修改结果：**  

![查看链上资源修改结果](https://tva1.sinaimg.cn/large/008i3skNly1guh3zfgnv6j60ss051aak02.jpg)



## 七、常见的错误

&emsp;&emsp;在整个项目开发的过程中基本都会遇到一些错误，他们可能发生在编译中，在执行时等等，可以对这些错误进行分类，以便能更好的处理这些问题
### 1. 编译期错误
&emsp;&emsp;在编写代码时，可能由于疏忽会出现一些语法问题、引用问题,这些问题都是在编译期存在的问题，可以通过move check检测出来。  

错误示例：
- 语法错误
- 类型错误
- acquire 错误
- 引用错误

### 2. 链接时错误
&emsp;&emsp;在部署和publish时可能出现链接错误，这些问题大多不会遇到，通过设置依赖、或合约sender等可以解决。  

错误示例：
- 引用module 不存在
- 引用的 function 参数不匹配
- 合约 sender 不匹配

### 3. 运行时错误
&emsp;&emsp;运行时的错误是在链上执行时的错误，这些问题需要在编码时做出全面的判断，或者在dev测试时发现问题后及时修补代码等。  

错误示例：
- 合约中 abort 
- gas 费不够
- 交易序列号过期
- 交易过期
- 参数类型不匹配



# Q & A

对Move语言的开发，社区的反响也比较强烈，开发者和关注者也提出了一些问题，在此对这些问题进行解答
1. 已经部署到链上的合约怎样进行更新？
- 对于接口没有变动的合约可以进行直接更新，也可以托管到Dao模块中，通过自发行的Token进行去中心化治理 ，还可以通过设置合约的不可更新让合约固定版本
2. 怎么通过 指定seed 链接区块链？
- 可以通过starcoin --help 查看 seed的用法，就可以通过指定seed
3. 调用线上module 必须要使用高度么？
- 是的，必须要指定高度，必须从那个高度分叉出来
4. 现在的move有合约模板么？
- 现在move的生态还比较早期，所以合约较少，需要大家和社区的努力
