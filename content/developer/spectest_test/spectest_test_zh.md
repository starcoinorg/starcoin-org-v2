---
title: spectest Test使用指南
weight: 20
---

spectest Test使用指南

<!--more-->

## Funtional Test

spectest Test是一个Move的测试工具。

* 查看[介绍](https://www.diem.com/en-us/blog/how-to-use-the-end-to-end-tests-framework-in-move/)
* 查看[例子](https://github.com/starcoinorg/guide-to-move-package-manager)
* 查看[源代码](https://github.com/starcoinorg/starcoin/tree/master/vm/move-package-manager)



## 使用指南

### 初始化账户信息
```
USAGE:
    task init [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --block-number <block-number>       block number to read state from. default to latest block number
        --addresses <named-addresses>...
    -n, --network <network>                 genesis with the network
        --public-keys <public-keys>...
        --rpc <rpc>                         use remote starcoin rpc as initial state
```
可以声明测试的初始状态，可以从新的区块链开始，也可以链接远程rpc节点指定区块高度作为测试环境  
```
//# init -n dev

//# init -n test --addresses alice=0xAA

//# init -n barnard

//# init --rpc http://main.seed.starcoin.org:9850 --block-number 100000
```


### Directive  block

```
task-block 0.1.0

USAGE:
    task block [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --author <author>
        --number <number>
        --timestamp <timestamp>
        --uncles <uncles>
```
block 命令可以在测试中产生一个新块，同时可以按需添加区块参数如：生成时间等  


**例子：**  
```
//# block

//# block --author alice

//# block --timestamp 100000000

//# block --uncles 10
```


### Directive  faucet

```
task-faucet 0.1.0

USAGE:
    task faucet [OPTIONS] --addr <address>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --addr <address>
        --amount <initial-balance>     [default: 100000000000]
        --public-key <public-key>
```

水龙头可以自动创建一个地址或指定一个地址,同时给这个账户一些STC  
如果地址是命名地址，它将自动生成原始地址（和公钥）并将其分配给命名地址 
**例子：**  
```
//# faucet --addr bob

//# faucet --addr alice --amount 0

//# faucet --addr tom --amount 10000000000000

```

### Directive  publish

```
task-publish 0.1.0
Starcoin-specific arguments for the publish command

USAGE:
    task publish [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --gas-budget <gas-budget>
    -k, --public-key <public-key>
        --syntax <syntax>
```

publish 可以将模块发布到区块链，方便进行测试

--gas-budget 可以指定事务的最大 gas    
**例子：**  
```
//# publish
module alice::Holder {
    use StarcoinFramework::Signer;

    struct Hold<T> has key, store {
        x: T
    }

    public fun hold<T: store>(account: &signer, x: T) {
        move_to(account, Hold<T>{x})
    }

    public fun get<T: store>(account: &signer): T
    acquires Hold {
        let Hold {x} = move_from<Hold<T>>(Signer::address_of(account));
        x
    }
}

//# publish
module Dummy::DummyModule {}

```

### Directive  run

```
task-run 0.1.0
Starcoin-specifc arguments for the run command,

USAGE:
    task run [FLAGS] [OPTIONS] [--] [NAME]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information
    -v, --verbose    print detailed outputs

OPTIONS:
        --args <args>...
        --gas-budget <gas-budget>
    -k, --public-key <public-key>
        --signers <signers>...
        --syntax <syntax>
        --type-args <type-args>...

ARGS:
    <NAME>
```
run 可以执行一段Script函数，也可以执行指定函数名 run [NAME] 执行普通函数

--signers 可以指定交易发起人，如果需要其他的参数可以使用 --type-args  --args  
**例子：**  
```
//# run --signers alice
script {
use StarcoinFramework::STC::{STC};
use StarcoinFramework::Token;
use StarcoinFramework::Account;
fun main(account: signer) {
    let coin = Account::withdraw<STC>(&account, 0);
    Token::destroy_zero(coin);
}
}

//# run --signers alice --type-args 0x1::DummyToken::DummyToken 0x1::Account::accept_token
```

### Directive  view

```
task-view 0.1.0

USAGE:
    task view --address <address> --resource <resource>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --address <address>
        --resource <resource>
```
用来查看任何地址的任何资源  
**例子：**  
```
//# view --address alice --resource 01::Account::Account

//# view --address StarcoinFramework --resource 0x1::Config::Config<0x1::VMConfig::VMConfig>
```

### Directive print-bytecode

```
task-print-bytecode 0.1.0
Translates the given Move IR module or script into bytecode, then prints a textual representation of that bytecode

USAGE:
    task print-bytecode [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --input <input>    The kind of input: either a script, or a module [default: script]
```
可以打印给定模块或脚本的字节码  

## Test Expectation
每个测试都应该有一个相应的期望文件，其中包含规范测试中每个指令的预期输出  
移动包管理器会将规范测试的测试结果与期望文件进行比较。  
如果有不同的输出，则规范测试失败。  
您可以通过在首次运行时提供参数来生成预期的文件。  
但是您必须检查生成的输出是否真的是测试的预期输出。
**例子：**  
```
mpm spectest

mpm spectest --ub
```

## 示例

1. [basic-coin](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/basic-coin/)
2. [coin-swap](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/coin-swap/)
3. [my-token](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/my-token/)
4. [my-counter](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/my-counter/)
5. [simple-nft](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/simple-nft/) A NFT example