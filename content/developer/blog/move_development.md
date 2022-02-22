---
title: Move In Action
weight: 5
---

```
* By Starcoin community.
```

Move’s first appearance is in the Diem project of Facebook, it’s next-generation programming language for smart contract, specially for digital assets and blockchain implementation, there are some unique features that are related to security, development efficiency in Move.

You need to know the Move applications development process if you want to build one Move application. Compared to Move to other project programming languages, there is no big difference, Move also has implementation, unit tests, integration tests,local development and call, on-chain development and call. Development tools and each process are not the same as different programming languages. For now, we recommend using MacOS or ubuntu20.04 to develop a Move application. You also can use ubuntu in Move VM to do development. In this document, we will guide you to do one Move application step by step.



## Create Move Project

As we all know the first step to build an application is creating a new project. You can create your own tree directory, an alternative way is to use move-cli. Move-cli is an official development tool with create, compile and test functionality, you can download from [github](https://github.com/starcoinorg/starcoin/), or find move-cli in unzipped Starcoin packages that download from github, or you can just clone this project and compile by yourself. 

**Directly download move-cli：**

![move-cli下载](https://tva1.sinaimg.cn/large/008i3skNly1gvbjouy2oyj60uk0a0ab202.jpg)

1. Create project directory using move-cli
Use the command line to create a project directory after you have downloaded move-cli. Check more commands using -help.

Command to create project:
```
move scaffold hello_world
```

 project directory:
```
Run this command: 
    tree hello_world
You should now have the following directory structure:
    hello_world/
    ├── args.txt
    ├── src
    │   ├── modules
    │   └── scripts
    └── tests
```

* Modules will be stored in src directory, script will be stored in scripts directory



## Develop and Test

1. Hello world

Add hello_word.move to scripts directory, write the following code in hello_word.move. This code segment can print decimal ascii vector of string ‘hello world’ on the screen. Move currently does not have string type.
  (1) hello_world.move

~~~
script {
    use 0x1::Debug;
    fun main() {
        Debug::print(&b"hello world");
    }
}
~~~

Code:

![hello_world_move](https://tva1.sinaimg.cn/large/008i3skNly1gvcnd9vbxdj60an034t8p02.jpg)

	(2)execute and verification

~~~
execute:  
	move run src/scripts/hello_world.move
result:
	[debug] (&) [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
~~~
Example:
![执行_hello_world_move](https://tva1.sinaimg.cn/large/008i3skNly1guh3vvfb5hj60jk011jrl02.jpg)



2. Compile

We use scripts in hello_word.move, but the module is core in the Move project. You can get a wider variety of functionalities with scripts and functions in modules. The modules can be deployed on the blockchain after they have been compiled. We suggest using the ‘check’ command to check grammar.

(1)Create Test.move

Create Test.move in src/modules, we will define,create,modify and destruct one custom structure.

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

(2)check

It’s inevitable we will make mistakes during development, such as symbols and variables. The ‘check’ command can help us check our grammar, and an error message will be printed on the screen if you have some errors. 

Stdlib library is default when running the move check command. Use -mode starcoin -starcon-rpc [http://main.seed.starcoin.org:9850](http://main.seed.starcoin.org:9850/) to check dependence if you need to depend on some smart contracts that have been deployed on the chain.Use move check --help to find more options and functionalities.

check command:

```shell
execute：    
    move check src/modules/Test.move
```

Example for locally check:

![本地check](https://tva1.sinaimg.cn/large/008i3skNly1gvetf8hod3j60i70130st02.jpg)

On-chain check command:

```shell   
move check  \
            --mode starcoin \
            --starcoin-rpc http://main.seed.starcoin.org:9850 \
            --block-number 1000000 \
            src/modules/Test.move
```

Example for on-chain check:

![链上check](https://tva1.sinaimg.cn/large/008i3skNly1gvetg4vpr8j60gp037gm002.jpg)



## Unit Tests

As we all know that unit tests are really important, `check` command can only help us check grammar errors,unit tests can help us check if we have done right, including logical errors.

1. Create unit test

`#[test]`Denotes this method is a test method and doesn't need to pass parameters.`#[test(arg1 = @0x1,arg2=@0x2 )]`Denotes this method is a test method and does need to pass parameters, put all parameters inside the brackets.`#[expected_failture]`Denotes that we don’t care about assert in this code.

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

2. Run unit test

Use move unit-test to run unit test, you will see PASS on the screen if you passed unit test, otherwise, you will see other messages on the screen.

* Find test options

~~~
move unit-test -l src/modules/Mymodule.move
~~~

* Count test time

~~~
move unit-test -s src/modules/Mymoudle.move
~~~

Run move unit-test -help to find more options.

(1) Run unit test

```shell
Execute：
    move unit-test src/modules/Mymodule.move
Result：
    Running Move unit tests
    [ PASS    ] 0x2::MyModule::make_sure_non_zero_coin_passes
    [ PASS    ] 0x2::MyModule::make_sure_zero_coin_fails
    [ PASS    ] 0x2::MyModule::test_has_coin
    Test result: OK. Total tests: 3; passed: 3; failed: 0
```

Check Test result:

![单元测试](https://tva1.sinaimg.cn/large/008i3skNly1gvetnd7xvgj60kb03jgmi02.jpg)

(2) Run unit test with count time

```shell
Execute：
    move unit-test -l src/modules/Mymodule.move
Result：
    0x2::MyModule::make_sure_non_zero_coin_passes: test
    0x2::MyModule::make_sure_zero_coin_fails: test
    0x2::MyModule::test_has_coin: test
```

Check Test result:

![查看单元测试项](https://tva1.sinaimg.cn/large/008i3skNly1gvetpnmcm9j60kx024jrv02.jpg)

(3)Run unit test with Statistics

```shell
Execute：
    move unit-test -s src/modules/Mymodule.move
Result：
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

Check Test result:

![带统计的单元测试](https://tva1.sinaimg.cn/large/008i3skNly1gvetr0c3kyj60mo0a0dht02.jpg)



## Integration Test

Integration tests can cover more complex test requirements. Blockchain test is included in integration test,but not in unit test. The whole project can be verified by defining account,block,transactions,etc.

1. Components of Integration Test

* Configuration
* New Block
* Transactions
* Transaction Code

(1) Configuration

Define user account, format:

>- //! account: alice, 100000000000,77
>- `//! account: <name> <address> <amount> <sequence-number>`  

(2) New Block

Specify block author,number,time,etc. Block time is the intervals that blocks are added to the chain.

Format is:

~~~
	//! block-prologue
	//! author: alice
	//! block-number: 1
	//! block-time: 10000
~~~

(3) Transactions

Specify sender,arguments, gas fee,etc.

Format is:

~~~
  //! new-transaction
  //! sender:alice
  //! args: 10u64
  //! max-gas: 7700000
  //! sequence-number:77
  //! gas-price: 1
~~~

(4) Transaction Code

Specify functions that are needed to be executed when a transaction is created.

Format is:

~~~
  script {
    use 0x2::Test;
    use 0x1::Signer;
    fun main(account: signer, expected: u64){
      Test::publish(&account);
      assert(Test::value_of(Signer::address_of(&account)) == expected, 100);
    }
  }
~~~

2. Example of Integration Test

Specify three accounts with different configurations, to create new blocks and transactions.

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



## Local deploy and call contract

We should test deployment and call of contracts in the local environment , as the on-chain environment is complex. Use move-cli command to deploy code after tests.

1. Compile using move publish command and deploy in local environment

Use check command to check compiled code, then use move publish command to compile to bytecode, after this step, you will get a bytecode file which is default stored in the storage of the current directory.

Compiling which uses the move publish command is similar to using check to compile, no results will be printed if compile successfully. The difference is use move publish command, test.mv will be stored in hello_world/storage/0x00000000000000000000000000000002/modules directory. Move publish commands also can use stdlib and on-chain contracts,options are the same with check command. Find more options and functions using the move publish -help command. 

Execute move publish:

```shell
move publish src/modules/Test.move
```

Result:

![执行publish](https://tva1.sinaimg.cn/large/008i3skNly1gvetz8ogedj60iz01g3yn02.jpg)

2. Check bytecode file

All bytecode files will be stored instorage/0x00000000000000000000000000000002/modules directory, use `move view` command to analyze bytecode, then find errors.

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

Check results:

![view查看字节码](https://tva1.sinaimg.cn/large/008i3skNly1gveu0uazsfj60r30b8abl02.jpg)

3. Local call

After local deployment, you can call module code with scripts, to test and verify module code.

(1) Write Scripts

Create publish_resource.move in src/script, call functions in 0x2::Test module, and print returned values.

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

(2) Execute Scripts 

Execute scripts to call functions in the test module, use move run command to specify sender. 

```shell
Execute：
    move run src/scripts/publish_resource.move --signers 0x12345
Result：
    [debug] 10
```

Example:

![执行move本地脚本](https://tva1.sinaimg.cn/large/008i3skNly1gveu69yuhsj60p801tt8v02.jpg)

(3) Check Results

After a local call, you can check results using the blockchain method or move view command.

```shell
Execute：
    move view storage/0x00000000000000000000000000012345/resources/0x00000000000000000000000000000002::Test::Resource.bcs
Resulte：
    key 0x00000000000000000000000000000002::Test::Resource {
        i: 10
    }   
```

Check local resource that have been used:

![view查看本地调用的资源](https://tva1.sinaimg.cn/large/008i3skNly1gveu7eqm6uj60l903jmxw02.jpg)



## On-chain deploy and call contract

After deployment and testing in a local environment, it’s time to deploy and test on- chain. Use starcoin command to launch dev network, and use default account to deploy and call contracts.

1. Launch a node

```shell
Launch a dev node
Execute：
    starcoin -n dev console
```

2. Manage account

(1) View account

View account address, so that we can modify address of the module

```shell
Execute：
    starcoin% account show

Result：
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

View account results:

![View account](https://tva1.sinaimg.cn/large/008i3skNly1gveuam90v6j60me095jt002.jpg)

(2) Obtain STC

Obtain some STC to pay gas fee when deploy and call contracts.

```shell
Execute:
    starcoin% dev get-coin

Result:
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

Result:

![get stc](https://tva1.sinaimg.cn/large/008i3skNly1gveubw55u0j60ne07nabv02.jpg)

(3) Unlock account 

Unlock account so that transactions can be signed and sent

```shell
Execute:
    starcoin% account unlock

Result:
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

Result:

![unlock accouont](https://tva1.sinaimg.cn/large/008i3skNly1gveud1ef9uj60lu05hwfc02.jpg)

3. Modify address of a module

Modify address so that on-chain deployment	

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

4. Compile and Deploy

(1)Compile to bytecode

As we need a bytecode file when deploying contracts, we need to compile to bytecode first.

```shell
move publish
```

(2)Deploy in dev network

Deploy bytecode in the dev network, this could save cost and it’s also convenient for development.

```shell
Execute:
    starcoin% dev deploy /home/wgb/code/starcoin/hello_world/storage/0xe1fb7f08be5427c9230e7eea99ce21a7/modules/Test.mv -b
    dev deploy /home/wgb/code/starcoin/hello_world/storage/0xe1fb7f08be5427c9230e7eea99ce21a7/modules/TestScript.mv -b
Result:
    new transaction.
```

5. Call

(1) Call scripts

Call publish script to test module code

```shell
Execute:
    starcoin% account execute-function --function 0xe1fb7f08be5427c9230e7eea99ce21a7::TestScript::publish
Result:
    new transaction
```

(2) View Resources

Check whether resources have been created after calling script, to verify script and module usability.

```shell
Execute:
    starcoin% state get resource 0xe1fb7f08be5427c9230e7eea99ce21a7 0xe1fb7f08be5427c9230e7eea99ce21a7::Test::Resource
Result:
    {
        "ok": {
                "raw": "0x0a00000000000000",
                "json": {
                "i": 10
            }
        }
    }
```

Check on-chain resources results:

![view resource](https://tva1.sinaimg.cn/large/008i3skNly1gveuhxhhvgj60st052aak02.jpg)

(3)Call scripts which need to pass parameters

You also can modify on-chain state by modify resources using scripts that need to pass parameters

```shell
Execute:
    starcoin% account execute-function --function 0xe1fb7f08be5427c9230e7eea99ce21a7::TestScript::write --arg 20u64
Result:
    new transaction
```

(4) View modified resource

Check changes of the resources, to view the result of modification. 

```shell
Execute:
    starcoin% state get resource 0xe1fb7f08be5427c9230e7eea99ce21a7 0xe1fb7f08be5427c9230e7eea99ce21a7::Test::Resource
Result:
    {
        "ok": {
                "raw": "0x0a00000000000000",
                "json": {
                "i": 20
            }
        }
    }
```

Check modification result on-chain:

![modification resource](https://tva1.sinaimg.cn/large/008i3skNly1gveujxgzhlj60ss051aak02.jpg)



## Common Errors

No one will say that no errors will occur during the whole development process, errors will exist during compiling, executing, etc. To categorize these errors will help us handle them better.

1. Compile time errors

You will ignore some grammar errors, reference errors, these errors will occur when you compile. Use move check command to find these errors.
Example of errors:

* Grammar error
* Type error
* Acquire error
* Reference error

2. Deploy and publish errors

Errors will occur when you deploy and publish contracts, it’s rare to encounter these errors, by setting dependence or contract sender, you can solve these errors.

Example of errors:

* Referenced module does not exist
* Referenced function parameter mismatch
* Contract sender mismatch

3. Runtime errors

Running errors will occur when you execute code on-chain. To avoid these errors, you need to make a comprehensive judgment before developing, or fix code in time when doing dev tests.

Example of errors:

* Abort in contracts
* Not enough gas
* Transaction serial number expired
* Transaction expired
* Parameters type mismatch



## Q&A

Move language has obtained strong feedback, developers and followers also post some questions. I will try to answer these questions, if you find something wrong, please let me kown.

1. How to update deployed contracts on blockchain? 

Answer: You can directly update some smart contract that their interface has never been modified, or you can let DAO module to handle, such as to implement decentralized governance by self-issued tokens. You also can set that one smart contract can not be updated. 

2. How to access blockchain by specifying seed? 

Answer: You can specify seed, or find more options using starcoin -help 

3. Is block number necessary in case to call an on-chain module?

Answer: Yes, you must specify a block number, we start to fork from this number.

4. Is there any smart contracts template in Move?

Answer: Unfortunately, there is no such template in Move now, but we can work together to make this come ture.



