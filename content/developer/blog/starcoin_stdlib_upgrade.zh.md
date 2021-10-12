---
title: Starcoin的stdlib升级和Dao链上治理
weight: 9
---

```
* 本文由Starcoin社区原创 作者:WGB，根据「去中心化的Stdlib升级——Starcoin vs ETH」的直播整理。
```

&emsp;&emsp;Starcoin 与其他公链不同，Starcoin把的共识、区块设置、区块奖励、账号定义、Token定义、NFT协议等预先定义在stdlib中，以便升级维护统一管理。stdlib是存在于链上的合约库，所以starcoin 可以不使用硬编码来实现区块奖励、区块算法、共识等定义，同时stdlib也可以通过Dao链上治理的方式进行升级或修复。



## 智能合约：Starcoin vs ETH

1. 智能合约所使用的语言 
|项目|区别|
|----|----|
|ETH|以太坊的智能合约一般使用solidity语言编写(无标准库)|
|Starcoin|Starcoin使用move语言编写。 在move语言中分module和script，有stdlib(官方的标准库)|

**以太坊：**
&emsp;&emsp;以太坊的合约大多时使用solidity编写，在编写过程中如ERC20等协议的代币需要编写时自己实现，没有stdllib标准库。  

**Starcoin:**  
&emsp;&emsp;Starcoin的合约使用move语言编写，move语言有module和script的概念，module大多用来编写基础代码，通过script来组合调用。在Starcoin中有stdlib，内置实现了ERC20、NFT、Dao等协议，同时move语言支持范型，可以方便的创建出不同的Token以及其他功能。



2. 智能合约的调用与存储
|项目|区别|
|----|----|
|ETH|以太坊调用智能合约是 **合约地址** + **方法** + **数据**|
|Starcoin|Starcoin调用智能合约是 通过 **拥有者地址** + **模块** + **方法** + **数据**|

**以太坊：**
&emsp;&emsp;**以太坊**分为合约地址与非合约地址，合约需要放在合约地址，所以在调用合约时需要通过合约的地址来找到合约。如果合约升级，在不使用Proxy contract (代理合约)等方法时，需要改变合约地址才能使用新的合约。

**Starcoin:**    
&emsp;&emsp;**Starcoin**的合约以及其他资源(Token、NFT ...)是存储在账户地址，所以在调用合约时需要通过**拥有者地址**+**模块** 来找到合约。如果合约升级，不会影响调用合约的地址和模块名称。



## 智能合约升级：Starcoin vs ETH

|项目|区别|
|----|----|
|ETH|合约升级意味着新的合约地址 **约等于** 一个新的合约 需要修改合约地址才能访问新的合约|
|Starcoin|合约升级不影响合约调用依然使用老合约的**拥有者地址** + **模块** + **方法** + **数据**方法就可以调用新合约|

**以太坊：**  
&emsp;&emsp;以太坊上的合约需要升级但不希望更改调用的地址时可以使用Proxy contract (代理合约)，访问代理合约的地址，由代理合约提供新合约的地址。  

**Starcoin：**
&emsp;&emsp;Starcoin的合约需要升级时Dao去中心化社区投票、Two-phase (两阶段提交)来解决，在升级后就可以使用原地址调用新合约。



## 合约升级方案：Starcoin VS ETH  

&emsp;&emsp;Starcoin的stdlib合约存在于链上，采用Dao去中心化的管理，社区可通过投票操作来决定合约升级计划的部署等。  
&emsp;&emsp;代码提交是采用两阶段提交：先提交升级计划，再提交更新代码。  
整个流程分为七个阶段，如图所示：

1. PENDING
2. ACTIVE
3. AGREED
4. QUEUED
5. EXECTABLE
6. ETRACTED
7. Upgrade complete

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvcjr15ke2j60p10g575o02.jpg" alt="合约升级流程" style="zoom:70%;" />

### 1. PENDING 
&emsp;&emsp;在coder 修改代码后向Dao提交一个升级的proposal txn，整个流程进入PENDING状态。设置有一段时间使社区对该项议题讨论和了解后进入下一个阶段。  
### 2. ACTIVE
&emsp;&emsp;在上个阶段的结束后，进入ACTIVE阶段，在这个阶段需要社区的人员进行投票，在到达设置的规定时间后转为下个阶段。  
### 3. AGREED
&emsp;&emsp;在上个阶段到达规定时间后，流程进入到AGREED阶段，在这个阶段中会对投票结果进行统计，如果超过预定占比，则视为升级计划被Dao社区允许，在发起公示后，可以进行下一个阶段。
### 4.QUEUED
&emsp;&emsp;在上个阶段的投票结果统计后，流程进入由发起公示后到公示期，这个阶段主要是展示发起人和proposal的信息等，当公示期过去之后进入下个阶段。
### 5.EXECTABLE  
&emsp;&emsp;在上个阶段的公示期时间结束后，流程进入到可以升级合约的Two-phase（两阶段提交）的第一个阶段，提交合约代码升级计划。在提交完合约升级计划后即可进入下一个阶段。
### 6.ETRACTED
&emsp;&emsp;在上个阶段的提交合约升级计划后，流程进入到升级合约的Two-phase（两阶段提交）的第二个阶段，在此阶段可以提交修复或升级合约的代码，在提交完成后即可进入下个阶段。
### 7.Upgrade complete
&emsp;&emsp;在上个阶段的代码提交后，整个合约升级流程结束，在此之后可以使用新的合约代码进行操作。



## 合约升级实操

### 1. 编写stdlib中的代码
此处以stdlib中的**DummyToken.move**为例，增加一个Mymint函数和Mymint脚本。功能为定值造100个DummyToken。  

**DummyToken.move下的 DummyToken Module ：**
```Move
  /// Anyone can mint DummyToken, amount should < 10000
    public fun mint(_account: &signer, amount: u128) : Token<DummyToken> acquires SharedMintCapability{
        assert(amount <= 10000, Errors::invalid_argument(EMINT_TOO_MUCH));
        let cap = borrow_global<SharedMintCapability>(token_address());
        Token::mint_with_capability(&cap.cap, amount)
    }

    // 在此增加新的函数 
    public fun Mymint(_account: &signer) : Token<DummyToken> acquires SharedMintCapability{
        let cap = borrow_global<SharedMintCapability>(token_address());
        Token::mint_with_capability(&cap.cap, 100)
    }

    /// Return the token address.
    public fun token_address(): address {
        Token::token_address<DummyToken>()
    }
```
**DummyToken.move下的 DummyTokenScripts Module ：**
```move
    public(script) fun mint(sender: signer, amount: u128){
        let token = DummyToken::mint(&sender, amount);
        let sender_addr = Signer::address_of(&sender);
        if(Account::is_accept_token<DummyToken>(sender_addr)){
            Account::do_accept_token<DummyToken>(&sender);
        };
        Account::deposit(sender_addr, token);
    }

    //在此增加新的脚本函数
    public(script) fun Mymint(sender:signer){
        let token = DummyToken::Mymint(&sender);
        let sender_addr = Signer::address_of(&sender);
        if(Account::is_accept_token<DummyToken>(sender_addr)){
            Account::do_accept_token<DummyToken>(&sender);
        };
        Account::deposit(sender_addr, token);
    }
```


### 2. 准备编译好的二进制的Module

在Starcoin 命令行中执行命令，分两步编译、打包出二进制的 Module
**编译：**
```shell
执行：
    dev compile -s 0x1 path/to/DummyToken.move

结果：
    {
        "ok": [
            "path/to/DummyToken.mv",
            "path/to/DummyTokenScripts.mv"
        ]
    }

```
**打包：**
```shell
执行：
    dev package -n MymintUpgrade -o storage path/to/DummyToken*

结果：
    {
        "ok": {
            "file": "path/to/storage/MymintUpgrade.blob",
            "package_hash": "0x6e54935144115233c9decb255d3bcd5f14c7b9d82c968c5f3a0cb1b14f18bce8"
        }
    }
```



### 3. 准备账号以及余额

**准备账号：**
需要两个账号：
   1. coder账号：&emsp;&emsp;&emsp;用来提交计划和提交代码等  
   2. 投票代表账号：&emsp;&emsp;用来投票 

使用密钥导入或使用account create 创建账号即可
**准备余额：**

1. coder账号需要一定的STC作为提案和升级等操作的GAS费。
2. 投票代表账号需要大量的STC作为投票的票数。
使用命令行 account unlock **账户地址** 解锁账户
**获取STC方法：**
```shell
默认账户获取：
    dev get-coin -v 6000000STC
转账方式：
    account transfer -s 0x0000000000000000000000000a550c18 -r <账号收款识别码> -v 60000000000000000 -b
```


### 4. 提交提案 进入 PENDING

```shell
提交提案：
    dev module-proposal -s <account address> -m <module path> -v <version> -e false
```
- -m 表示升级包的路径；  
- -v 表示新的版本号；  
- -e 表示是否跳过 module 兼容性检查强制升级，false 表示不跳过兼容性检查，缺省不跳过。



### 5. 查询提案的状态

**查看提议id:**
```shell
dev call --function 0x1::Dao::proposal_info -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address>
```
**查看提议状态:**
```shell
    dev call --function 0x1::Dao::proposal_state -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address> --arg <proposal_id>
结果:
    {
        "ok": [
            <state_num>
        ]
    }

```


### 6. 等待社区议论 进入 ACTIVE  

在PENDING状态下经过一段时间进入投票期,在dev下可以通过sleep方式加快区块链时间进入下个阶段。
**加速进入：**
```shell
加速时间：
    dev sleep -t 3600000
生成块（生效时间）：
    dev gen-block
```
**查看提案状态：**
```shell
执行：
    dev call --function 0x1::Dao::proposal_state -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address> --arg <proposal_id>
结果：
    {
        "ok": [
            2
        ]
    }
转为ACTIVE状态
```


### 7. 社区投票 进入 AGREED

用投票代表账号参与投票后等待投票时间结束后，流程进入AGREED阶段
```shell
投票：
    account execute-function -s <account address> --function 0x1::DaoVoteScripts::cast_vote -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address> --arg <proposal_id> --arg true --arg 59000000000000000u128
```


### 8. AGREED的提议放入更新队列 进入QUEUED

在进入AGREED 以后，任何人都可以将状态为 AGREED 的提议放入更新队列。
```shell
dev module-queue -s <account address> -a <proposal address> -i <proposal_id>
```


### 9. 公示期等待 进入EXECTABLE

公示期的等待时间过去之后，就可以进入执行阶段。dev下可以通过命令加速此阶段
**加速进入：**
```shell
加速时间：
    dev sleep -t 3600000
生成块（生效时间）：
    dev gen-block
```


### 10. 提交升级计划  进入ETRACTED

这一步是可执行阶段，可以执行升级计划。
```shell
dev module-plan -i <proposal_id> -a <proposal address>  -s <account address>
```


### 11. 提交代码 进入Upgrade complete

在这一步中Dao流程已经结束，两阶段提交流程进入最后一阶段
**代码模块提交：**
```shell
dev module_exe -m path/to/storage/MymintUpgrade.blob -s <account address>
```


### 12. 完成合约升级流程

至此已经完成整个合约升级过程



### 13. 升级的验证

可以执行DummyTokenScripts模块中的 Mymint函数来校验是否升级成功
```shell
执行获取DummyToken 100个：
    account execute-function --function 0x1::DummyTokenScripts::Mymint -b -s <account address>
查看DummyToken：
    account show <account address>
结果：
    "balances": {
      "0x00000000000000000000000000000001::DummyToken::DummyToken": 100,
      "0x00000000000000000000000000000001::STC::STC": 9999645054
    }
```

