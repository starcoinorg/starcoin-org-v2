---
title: 深度实战，手把手教会您使用Starcoin的DAO更新链上配置
weight: 39
---

```
* 本文由Starcoin社区原创
```

本文主要面向的读者为对Move和Starcoin有一定的了解，并且有一定的DeFi开发基础，若读者刚接触Starcoin和move，请移步[Move开发实战](https://starcoin.org/zh/developer/blog/move_development/)。本文主要介绍使用公链Starcoin来实现分布式去中心化的投票来进行链上治理，读完本文你可以：

1. 了解Starcoin如何实现去中心化投票
2. 了解如何使用Starcoin的原生二层语言Move实现一个去中心化的投票以达成共识，来实现某些自定义、特定的动作。
3. 了解基于Move特性的DAO在Starcoin中是如何实现的。



## 背景

DAO的全称为Decentralized Autonomous Organization，即去中心化自治组织。
其抽象的表述即一群人中的某一人提出了一个共识，这个共识通常是去中心化的、透明的、不受到任何中心化机构的影响，且利用区块链来验证，该共识在大家统一后执行既定行为。
具象化的表达即在DeFi中的一类智能合约，这类智能合约可以管理另外一些智能合约的行为模式（例如配置、升级等），通常由某一账户提出提案，由一部分利益相关者参与投票。



## Starcoin DAO流程

Starcoin中的DAO治理可以流程可以由以下一张图来概括：

![f5e8e3fb015a4a7c40d10193f1e3080d.png](https://tva1.sinaimg.cn/large/008i3skNly1gyl1t29buhj31bf0u0gpa.jpg)



### 角色（Role）

该流程中共有如下几个角色， DAO项目发起方（Coder）、DAO中参与提案的人（Everyone）、矿工（Miner）、任何人（Anyone），除此之外，还有一个提案（Proposal）的概念。

* Coder：项目发起方，即提案发起者，主要的作用是发起提案和维护该提案的部分执行逻辑代码（即这个提案具体做什么事情是由项目方来确定的）。目前stdlib库提供了配置修改与合约升级两种预置的提案类别以供上层合约调用使用。
* Everyone：项目参与方，提案的投票参与者，若超过X%（X为一个配置的值），则提案被同意，进入执行流程，否则被系统拒绝；
* Miner：执行合约的矿工。
* Anyone：任何人，这里特指链上的所有用户。



### 提案（Proposal）

除此之外，还有一个提案（Proposal）的概念，一个提案代表了整个发起、投票、执行的过程，其包含以下状态：

* PEDDING，投票等待阶段。Proposal 被提交到链上后，需要有一段时间来给所有未来参与的投票的人或者社区来讨论这个提案。
* ACTIVE，投票激活阶段。在这个时间段，任何人均可在该提案下投出同意或者拒绝票。
* AGREED，投票同意阶段。若在ACTIVE阶段投同意票的比率达到X%，则会自动到达该阶段。
* QUEUED，投票结果公示期阶段。可以在这个阶段来查询投票的结果、发起人和Proposal信息。
* EXECUTEABLE，可执行阶段。在该阶段可以对合约的动作进行执行操作，由于区块链的合约的被动性，需要有一个人来驱动提案执行，这个人可以是任何人。
* EXCTRACTED，已执行阶段，该状态主要是用以区分提案是否被执行过。由于DAO在Move合约的实现中在代码层被抽象成一个Proposal，提案时会把需要被执行的动作作为一个结构放入到合约进行流程管理，当需要被执行时会将该结构提取出来执行对应的动作，提完之后的状态即对应EXCTRACTED，该部分会在代码分析章节中详细讨论。



## 实战

本章主要介绍如何从头使用Move来实现DAO的相关代码，以及自己发布一个测试的治理币来参与DAO的治理投票，并在Starcoin的本地环境来部署和测试合约，关于如何使用DAO进行合约升级，可参考[Starcoin的stdlib升级和Dao链上治理](https://starcoin.org/zh/developer/blog/starcoin_stdlib_upgrade/)。


###  场景假设
例如我们已经在Starcoin中发布了一个项目，该项目中有个特定的值需要被从初始的0修改为100，我们使用DAO投票流程来进行修改，其成功后需要读取出这个值为100。下面就来实际演练一下如何通过写代码在本地环境模拟以实现对应的需求。

### 环境准备

这里以mac OS 系统为例，下载 [Starcoin build package](https://github.com/starcoinorg/starcoin/releases)对应平台最新版本，放在本地任意目录，需要将bin目录下的路径加入到PATH环境变量路径下， 执行命令查看版本号均可正确打印说明安装成功。

```bash
% export PATH=$PATH:~/Downloads/starcoin-artifacts
% starcoin --version 
starcoin 1.9.0-rc.2 (build:v1.9.0-rc.2-2-g2fb4113cc)

% move --version
move 1.9.0-rc.2
```

### 代码编写


使用```move scaffold```命令新建工程 mock-swap-config（代码参考[star-dao-mock](https://github.com/9191stc/star-dao-mock)）

```shell
% move scaffold mock-swap-config
% ls -R mock-swap-config
args.txt	src		tests

mock-swap-config/src:
modules	scripts

mock-swap-config/src/modules:

mock-swap-config/src
```

这样工程就搭建好了，我们需要使用IDE来打开这个目录，这里推荐使用Intellij的IDEA或者是
CLion。
首先我们需要发布一个代币以支持我们的合约进行DAO投票，我们取名为STD。其次需要写一个配置管理的合约和一个处理提案（Proposal）提交和执行的合约。添加以下文件，其中`SWP.move`为治理代币，`MockSwapConfig.move`为模拟的Swap配置，`MockSwapProposal.move` 为模拟的Swap提案处理合约。

```shell
# 在src/modules目录下添加文件：
./src/module/STD.move
./src/module/MockModuleConfig.move
./src/module/MockModuleDaoProposal.move
./src/module/MockModuleDaoProposalScript.move
```

STD.move文件相关代码：
```rust

//{
//    "ok": {
//        "account": "0xcccf61268df4d021405ef5d4041cb6d3",
//        "private_key": "0xb518999b30451faeb590ff71af971b2a674511bb4b73a17d9d3eeadce727b1b4"
//    }
//}

address 0xcccf61268df4d021405ef5d4041cb6d3 {
/// STD is a governance token of Starcoin blockchain DAPP.
/// It uses apis defined in the `Token` module.
module STD {
    use 0x1::Token;
    use 0x1::Account;
    use 0x1::Signer;
    use 0x1::Dao;

    /// STD token marker.
    struct STD has copy, drop, store {}

    /// precision of STD token.
    const PRECISION: u8 = 9;

    const ERROR_NOT_GENESIS_ACCOUNT: u64 = 10001;

    /// STD initialization.
    public fun init(account: &signer) {
        Token::register_token<STD>(account, PRECISION);
        Account::do_accept_token<STD>(account);

        Dao::plugin<STD>(
            account,
            100,
            1000000,
            10,
            100,
        );
    }

    // Mint function, block ability of mint and burn after execution
    public fun mint(account: &signer, amount: u128) {
        let token = Token::mint<STD>(account, amount);
        Account::deposit_to_self<STD>(account, token);
    }

    /// Returns true if `TokenType` is `STD::STD`
    public fun is_std<TokenType: store>(): bool {
        Token::is_same_token<STD, TokenType>()
    }

    spec is_abc {
    }

    public fun assert_genesis_address(account : &signer) {
        assert(Signer::address_of(account) == token_address(), ERROR_NOT_GENESIS_ACCOUNT);
    }

    /// Return STD token address.
    public fun token_address(): address {
        Token::token_address<STD>()
    }

    spec token_address {
    }

    /// Return STD precision.
    public fun precision(): u8 {
        PRECISION
    }

    spec precision {
    }
}
}
```
注意，文件头部的json对象为从starcoin节点中导出的密钥对，我们可以在starcoin控制台使用`account create`命令来生成密钥对，也可以直接导入现有的这个密钥对。


MockSwapConfig.move的相关代码，该合约主要用于模拟配置的管理，在Starcoin的stdlib库中有相应的配置类`0x1::Config`可实现通用的配置管理与事件发布，本文为了达到演示效果自定义了一个简单的配置管理合约，该合约主要是提供了初始、修改、查询操作。其中修改配置的能力被托管给ParameterModifyCapability`，以便在需要的时候对配置进行修改。
```rust
address 0xcccf61268df4d021405ef5d4041cb6d3 {

module MockModuleConfig {
    use 0x1::Token;
    use 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD;

    struct ParameterModifyCapability has key, store {}

    struct MockConfig has key, store {
        mock_config_val: u128,
    }

    public fun init(signer: &signer, mock_config_val: u128) : ParameterModifyCapability {
        move_to(signer, MockConfig {
            mock_config_val
        });
        ParameterModifyCapability {}
    }

    public fun modify(_cap: &ParameterModifyCapability, val: u128) acquires MockConfig {
        let addr = Token::token_address<STD>();
        let conf = borrow_global_mut<MockConfig>(addr);
        conf.mock_config_val = val;
    }

    public fun query(): u128 acquires MockConfig {
        let addr = Token::token_address<STD>();
        let conf = borrow_global_mut<MockConfig>(addr);
        conf.mock_config_val
    }
}
}
```

MockModuleDaoProposal.move 相关代码，该部分代码主要是声明了
```rust

address 0xcccf61268df4d021405ef5d4041cb6d3 {

module MockModuleDaoProposal {
    use 0x1::Dao;
    use 0x1::Token;
    use 0x1::Signer;
    use 0x1::Errors;
    use 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD;
    use 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleConfig::{ParameterModifyCapability, Self};

    const ERR_NOT_AUTHORIZED: u64 = 101;

    struct MockModuleDaoProposalCapWrap has key, store {
        cap: ParameterModifyCapability,
    }

    struct MockModuleDaoProposalAction has copy, drop, store {
        mock_config_val: u128,
    }

    /// Add dao of mock module proposal action
    public fun plugin(account: &signer, cap: ParameterModifyCapability) {
        let token_issuer = Token::token_address<STD>();
        assert(Signer::address_of(account) == token_issuer, Errors::requires_address(ERR_NOT_AUTHORIZED));

        move_to(account, MockModuleDaoProposalCapWrap { cap })
    }

    /// Start a proposal
    public fun submit_proposal(
        signer: &signer,
        mock_config_val: u128,
        exec_delay: u64) {
        Dao::propose<STD, MockModuleDaoProposalAction>(
            signer,
            MockModuleDaoProposalAction { mock_config_val },
            exec_delay,
        );
    }

    public fun proposal_state(account: address, proposal_id: u64): u8 {
        Dao::proposal_state<STD, MockModuleDaoProposalAction>(account, proposal_id)
    }

    /// Perform propose after propose has completed
    public fun execute_proposal(proposer_address: address,
                                proposal_id: u64) acquires MockModuleDaoProposalCapWrap {
        let MockModuleDaoProposalAction { mock_config_val } =
            Dao::extract_proposal_action<STD, MockModuleDaoProposalAction>(proposer_address, proposal_id);
        let wrap = borrow_global_mut<MockModuleDaoProposalCapWrap>(proposer_address);
        MockModuleConfig::modify(&wrap.cap, mock_config_val);
    }
}
}
```

MockModuleDaoProposalScript 为整体的合约提供了业务操作入口函数。

```rust

address 0xcccf61268df4d021405ef5d4041cb6d3 {

module MockModuleDaoProposalScript {

    use 0x1::Signer;
    use 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleConfig;
    use 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal;
    use 0xcccf61268df4d021405ef5d4041cb6d3::STD;

    /// demostrate for publish token and initialize dao environment
    public(script) fun init(signer: signer, mint_amount: u128) {
        assert(Signer::address_of(&signer) == @0xcccf61268df4d021405ef5d4041cb6d3, 101);

        STD::init(&signer);
        STD::mint(&signer, mint_amount);

        let cap = MockModuleConfig::init(&signer, 0);
        MockModuleDaoProposal::plugin(&signer, cap);
    }

    public(script) fun proposal(signer: signer,
                                mock_config_val: u128,
                                exec_delay: u64) {
        MockModuleDaoProposal::submit_proposal(
            &signer,
            mock_config_val,
            exec_delay);
    }

    public(script) fun execute_proposal(proposer_address: address,
                                        proposal_id: u64) {
        MockModuleDaoProposal::execute_proposal(
            proposer_address,
            proposal_id);
    }

    public fun query(): u128 {
        MockModuleConfig::query()
    }
}
}
```



### 本地部署

先在工程目录下使用Move命令编译合约代码，并且将其打包发布到本地目录，执行该命令后会在工程根下生成新的文件夹./build/，其下生成对应的二进制文件，方便稍后打包部署使用，另外`move check` 命令会检查当前工程下所有的module是否有语法错误，若有则会输出错误信息

```shell
% move clean
% move check
% move publish
```

将starcoin的二进制包配置好后，打开命令行，输入以下命令，则会输出信息并启动本地节点，并启动节点控制台

```shell
% starcoin -n dev console

# 启动控制台
...
...
2021-12-28T21:03:19.197119+08:00 INFO - Service starcoin_rpc_server::service::RpcService start.
2021-12-28T21:03:19.197147+08:00 INFO - starcoin_rpc_server::service::RpcService service actor started
2021-12-28T21:03:19.201689+08:00 INFO - ChainWater actor started
2021-12-28T21:03:19.225381+08:00 INFO - Start console, disable stderr output.
starcoin% 
```

由于我们的合约在编写的时候，需要在文件的最外层来包一个address地址来代表当前合约是属于哪个账户，所以只能是由该账户来进行部署。找到上面`STD.move`中文件头注释中的账号的密钥对中的私钥导入到节点的钱包中，并设置为默认账号。设置完成后使用`dev get-coin`命令为账户分配STC代币，有了STC代币才能进行合约部署。关于控制台的命令的说明可以使用help子命令进行查询

````shell
# 导入账户
starcoin% account import -i 0xb518999b30451faeb590ff71af971b2a674511bb4b73a17d9d3eeadce727b1b4
{
  "ok": {
    "address": "0xcccf61268df4d021405ef5d4041cb6d3",
    "is_default": false,
    "is_readonly": false,
    "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
    "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
  }
}
# 设置默认账户
starcoin% account default 0xcccf61268df4d021405ef5d4041cb6d3
{
  "ok": {
    "address": "0xcccf61268df4d021405ef5d4041cb6d3",
    "is_default": true,
    "is_readonly": false,
    "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
    "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
  }
}

# 获取STC代币
starcoin% dev get-coin 0xcccf61268df4d021405ef5d4041cb6d3
txn 0x9b417212b682f95b30950401d213de93d341016948e7562b5633b94e80663041 submitted.
{
  "ok": {
    "block_hash": "0xbdec81f4d6f85bfbfa26ac650017cab231f93c500cc49160849b3b2abeb2a97c",
    "block_number": "1",
    "transaction_hash": "0x9b417212b682f95b30950401d213de93d341016948e7562b5633b94e80663041",
    "transaction_index": 1,
    "transaction_global_index": "2",
    "state_root_hash": "0xeb5895db7b3078c34c0c795c2bd784d7ecf8ee7fa6f5869e4382ce53c8fa8d5d",
    "event_root_hash": "0x174b2db93b42b3bd41a3fc8161fad642af80ffa0fb272768697855935a0617a4",
    "gas_used": "119871",
    "status": "Executed"
  }
}

# 使用该命令查看当前账户下的STC额度
starcoin% account show 
{
  "ok": {
    "account": {
      "address": "0xcccf61268df4d021405ef5d4041cb6d3",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
      "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
    },
    "auth_key": "0x01cf8ea9221db5f76052aa283709eceecccf61268df4d021405ef5d4041cb6d3",
    "sequence_number": 0,
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 1000000000
    }
  }


````

可在控制台中通过以下命令对工程文件进行打包，我们指定在 ./build/目录下输出一个叫packaged.blob的打包文件。

```shell
starcoin% dev package -o ./build -n packaged ./storage/0xcccf61268df4d021405ef5d4041cb6d3/
{
  "ok": {
    "file": "./build/packaged.blob", # 文件名
    "package_hash": "0xb60a270a0314c75baf04d135079075c1eea6dc468693be4c28cc0247eb86f641" #打包的hash值
  }
}
```

我们可以直接进行部署，若返回的信息中dry_run状态为Executed则表示部署完成（这里篇幅所限，省略了一些信息）
```shell
starcoin% dev deploy ./build/packaged.blob -b
Use package address (0xcccf61268df4d021405ef5d4041cb6d3) as transaction sender
txn 0xeadb0391b1a76b7b485d0bae5b865e00cc96d6aab7b238cb87489b78412fcb25 submitted.
{
  "ok": {
    "raw_txn": {
      "sender": "0xcccf61268df4d021405ef5d4041cb6d3",
      "sequence_number": "0",
      "payload":[
      		...
          ],
          "init_script": null
        }
      },
      "max_gas_amount": "10000000",
      "gas_unit_price": "1",
      "gas_token_code": "0x1::STC::STC",
      "expiration_timestamp_secs": "3608",
      "chain_id": 254
    },
    "raw_txn_hex": "...",
    "dry_run_output": {
      "explained_status": "Executed",
      "events": [],
      "gas_used": "20304",
      "status": "Executed", # 表示交易执行成功的状态
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "raw": "0x8f230200000000000000000000000000",
              "json": {
                "fee": {
                  "value": 140175
                }
              }
            }
          }
        }
        ...
```

### 流程模拟



##### 初始化

到此我们把所有合约部署到本地节点环境了。为了简化流程，我们把一些必要的初始化条件放到了`MockModuleDaoProposalScript::init`中，其接收一个代币发行额度的参数。该函数注册和发行了STD，并且将STD注册为DAO流程的一种治理币。假设我们发行STD总额度为$10^8$枚，由于其精度为9，则共需要发行$10^8\times 9$ 个单位。另外，我们需要看一下我们所关注的配置是否被正确的初始化为0。

```shell
starcoin% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::init --arg 100000000000000000u128 -b

# 输出信息，同上
...

# 查看一下是否注册发行成功
starcoin% account show
{
  "ok": {
    "account": {
      "address": "0xcccf61268df4d021405ef5d4041cb6d3",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
      "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
    },
    "auth_key": "0x01cf8ea9221db5f76052aa283709eceecccf61268df4d021405ef5d4041cb6d3",
    "sequence_number": 2,
    "balances": {
      "0xcccf61268df4d021405ef5d4041cb6d3::STD::STD": 100000000000000000, # 可以看到注册的STD已经被放入到当前账户中
      "0x00000000000000000000000000000001::STC::STC": 20999669436
    }
  }
}

# 查看一下配置是否为0
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::query
{
  "ok": [
    0
  ]
}
```

##### 发起提案

按照第一小节的流程描述，首先我们需要发起一个提案，这里为了简化流程，我们设定Coder、Everyone、和Anyone均为当前账户`0xcccf61268df4d021405ef5d4041cb6d3` ，然后使用`dev sleep -t 86400000`加快epoch流逝。

```shell
# 发起提案，调用MockModuleDaoProposalScript::proposal，提案号为0号
% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::proposal --arg 100u128 --arg 0u64
# 输出略
...

# 查看一下提案的状态，这里每个状态在代码里面对应一个数值，关于提案状态对应数值部分参考代码分析小节部分
% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    1
  ]
}

% dev sleep -t 86400
% dev gen-block
...

# 再次查看对应的提案状态，进入ACTIVE状态
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    2
  ]
}

```

##### 投票

进入ACTIVE状态，开始进行投票。使用当前账户投同意票，这里为简化流程保证票数同意通过，我们投$9\times 10^7$个，占总发行量的90%（关于设置提案通过票数百分比，在代码分析的小结讨论）

```shell
% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0x1::DaoVoteScripts::cast_vote -t 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD -t 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::MockModuleDaoProposalAction --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0 --arg true --arg 90000000000000000u128 -b

...

% dev sleep -t 86400000
% dev gen-block
...

# 再次查看对应的提案状态，进入AGREED状态
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    4
  ]
}

```

##### 放入队列

进入AGREED状态，进入公示阶段

```shell
starcoin% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0x1::Dao::queue_proposal_action -t 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD -t 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::MockModuleDaoProposalAction --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64 -b

# 再次查看对应的提案状态，进入QUEUED状态
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    5
  ]
}

# 需要等待一段时间，测试节点执行该命令可模拟时间加速
starcoin% dev sleep -t 86400000
starcoin% dev gen-block

# 再次查看对应的提案状态，进入EXECUTABLE状态
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    6
  ]
}


```

##### 执行

Anyone 执行提案的动作

```shell
# 执行提案
starcoin% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::execute_proposal --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0 -b

# 再次查看对应的提案状态，进入EXTRACTED状态
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    7
  ]
}

```

##### 查看最终状态
最终我们完成了所有的流程，再一次查看最终的值，发现已经修改成100。

```shell
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::query
{
  "ok": [
    100
  ]
}

```



## 代码分析

上一节我们主要实战编写了一个可部署并进行实操的工程，并使用Starcoin stdlib中的DAO.move模块来实现链上治理修改配置。本篇则简要讨论上一小节中的一些代码实现，以及其依赖Starcoin的DAO的一些实现逻辑。

我们知道Starcoin不同于Ethereum，其存储模型为账户Resource模式，即废弃合约账号，将所有的数据存储到账户的路径下（参考[Starcoin白皮书](https://starcoin.org/zh/developer/sips/sip-2/)，[Starcoin合约账户详解](https://starcoin.org/zh/developer/blog/starcoin_contract_account/)）。由于去掉了合约账户，回顾本文第二小节描述的流程，我们需要考虑如下问题：

1. 提案的流程以及相关的状态数据应该存储在哪里？如何确保其不被篡改？
2. 每个投票人的质押的代币应该存储在哪里？质押的资金是否安全？
3. 如何才能保证提案通过后动作才能被执行？

带着上述的问题，我们来看Starcoin中的合约代码如何实现的。

### Dao.move

`Dao.move`文件在stdlib库中，在工程根目录下执行move check之后，就可以在`build/package/starcoin/source_files/`目录下找到该文件，主要实现了上面第二小节描述的流程。这里由于各个状态的作用之前已经讨论过，这里不再过多介绍。

```rust
    /// Proposal state
    const PENDING: u8 = 1;
    const ACTIVE: u8 = 2;
    const DEFEATED: u8 = 3;
    const AGREED: u8 = 4;
    const QUEUED: u8 = 5;
    const EXECUTABLE: u8 = 6;
    const EXTRACTED: u8 = 7;
```



下面是合约的几个核心的数据结构体定义，后续的所有的操作都围绕这几个结构展开讨论。

```rust

		/// Configuration of the `Token`'s DAO.
    struct DaoConfig<TokenT: copy + drop + store> has copy, drop, store {
        /// after proposal created, how long use should wait before he can vote.
        voting_delay: u64,
        /// how long the voting window is.
        voting_period: u64,
        /// the quorum rate to agree on the proposal.
        /// if 50% votes needed, then the voting_quorum_rate should be 50.
        /// it should between (0, 100].
        voting_quorum_rate: u8,
        /// how long the proposal should wait before it can be executed.
        min_action_delay: u64,
    }

    /// Proposal data struct.
    struct Proposal<Token: store, Action: store> has key {
        /// id of the proposal
        id: u64,
        /// creator of the proposal
        proposer: address,
        /// when voting begins.
        start_time: u64,
        /// when voting ends.
        end_time: u64,
        /// count of votes for agree.
        for_votes: u128,
        /// count of votes for againest.
        against_votes: u128,
        /// executable after this time.
        eta: u64,
        /// after how long, the agreed proposal can be executed.
        action_delay: u64,
        /// how many votes to reach to make the proposal pass.
        quorum_votes: u128,
        /// proposal action.
        action: Option::Option<Action>,
    }

    /// User vote info.
    struct Vote<TokenT: store> has key {
        /// vote for the proposal under the `proposer`.
        proposer: address,
        /// proposal id.
        id: u64,
        /// how many tokens to stake.
        stake: Token::Token<TokenT>,
        /// vote for or vote against.
        agree: bool,
    }

```

1. Starcoin允许不同的代币作为DAO的治理币，`DaoConfig<TokenT>`即实现了一个全局的代币Dao配置，若自身发行的代币需要支持DAO治理，则需要对这个结构进行注册操作，该结构包含以下几个字段
    * voting_delay，proposal被创建之后需要等待的时间才能被投票，即PEDDING状态的持续时间
    * voting_period，投票的窗口期；
    * voting_quorum_rate，投票的通过百分比，$0 < voting\_quorum\_rate \le 100$。
    * min_action_delay，公示期持续时间
```rust
/// Plugin method of the module.
    /// Should be called by token issuer.
    public fun plugin<TokenT: copy + drop + store>(signer: &signer) {
        let token_issuer = Token::token_address<TokenT>();
        assert(Signer::address_of(signer) == token_issuer, Errors::requires_address(ERR_NOT_AUTHORIZED));
        let dao_config_modify_cap = Config::extract_modify_config_capability<
            Dao::DaoConfig<TokenT>,
        >(signer);
        assert(Config::account_address(&dao_config_modify_cap) == token_issuer, Errors::requires_address(ERR_NOT_AUTHORIZED));
        let cap = DaoConfigModifyCapability { cap: dao_config_modify_cap };
        move_to(signer, cap);
    }
```
该结构会在调用`Dao::plugin<TokenT>`方法被构造，随后将构造好的结构通过`Config::publish_new_config`发布。注意该方法只能由Token的发布者调用，通常调用的时机为初始化阶段。除了Dao::Config，还有一个DaoGlobalInfo用来保存当前治理代币的全局信息，包含几个事件和唯一id的流水号。注意这里会把DaoGlobalInfo的信息放入到Token的发布者中去，即Token发布者（也可称作项目发行方），才有能力来改变这些全局配置。
0x1::Config存储该配置到当前账户后，会生一个capabilidty 来代表对该配置的修改权限并托管到了当前合约中，方便需要时取出来使用。Move里的Capability是权限的一个抽象，比如铸造权限MintCapability。


2. Proposal为其提案的结构，其定义`Proposal<Token: store, Action: store>`Action表示需要被定义的动作结构，该结构由外界定义，在发起提案时调用Dao::proposal的时候将该结构锁到提案中，并在EXECUTABLE可执行阶段可被取出。很显然代码中记录了一些时间信息和提案提出者信息之外，还有当前提案通过后的动作结构。这里可以把类型参数看做是一对pair，即单个Token可以定义不同的Action。该结构还存储了当前提案有多少票同意，有多少票拒绝。

Proposal结构的主要处理的函数为：
```rust
		/// propose a proposal.
    /// `action`: the actual action to execute.
    /// `action_delay`: the delay to execute after the proposal is agreed
    public fun propose<TokenT: copy + drop + store, ActionT: copy + drop + store>(
        signer: &signer,
        action: ActionT,
        action_delay: u64,
    ) acquires DaoGlobalInfo {
        if (action_delay == 0) {
            action_delay = min_action_delay<TokenT>();
        } else {
            assert(action_delay >= min_action_delay<TokenT>(), Errors::invalid_argument(ERR_ACTION_DELAY_TOO_SMALL));
        };
        let proposal_id = generate_next_proposal_id<TokenT>();
        let proposer = Signer::address_of(signer);
        let start_time = Timestamp::now_milliseconds() + voting_delay<TokenT>();
        let quorum_votes = quorum_votes<TokenT>();
        let proposal = Proposal<TokenT, ActionT> {
            id: proposal_id,
            proposer,
            start_time,
            end_time: start_time + voting_period<TokenT>(),
            for_votes: 0,
            against_votes: 0,
            eta: 0,
            action_delay,
            quorum_votes: quorum_votes,
            action: Option::some(action),
        };
        move_to(signer, proposal);
        // emit event
        let gov_info = borrow_global_mut<DaoGlobalInfo<TokenT>>(Token::token_address<TokenT>());
        Event::emit_event(
            &mut gov_info.proposal_create_event,
            ProposalCreatedEvent { proposal_id, proposer },
        );
    }
```

上述代码中，首先会根据全局的配置来构造一个Proposal的结构，将一些状态的持续时间等配置信息读取出来并放到了结构中。第30行把proposal move给了当前签名的用户，意味着当前哪个用户发起的提案就由哪个用户来存储这些信息。根据move合约资源与代码分离的特性，其他的合约不能访问当前合约中的数据，除非当前合约代码授权或者更改合约代码。这样就把Proposal的信息锁在了当前签名用户的Dao.move合约下。而以太坊的做法是使用合约的特性来约束用户，这样就对合约的编写者提出了较高的要求，而且极易产生bug导致资源泄露；另外一个好处就是数据隔离，不同的用户所提出的提案存储在不同的用户下，数据不会相互影响。

这里也就回答上面的第一个问题即“提案的流程以及相关的状态数据应该存储在哪里？如何确保其不被篡改？”，答案是提流程和相关的状态数据存储锁在提案者的资源路径下。

3. `Vote<TokenT: store>`为用户的投票信息，相关的投票用户在进行投票操作时会构造Vote结构将其存入到投票用户的资源路径下，同时会将当前用户质押的代币质押到Vote结构中，这里即回答第二个问题，将代币质押在DAO.move下的Vote结构中，若当前合约不提供提取操作的函数则任何其他合约无法取出当前用户质押的代币。之后会将同意/拒绝数量统计到Proposal中。

```rust
    fun do_cast_vote<TokenT: copy + drop + store, ActionT: copy + drop + store>(proposal: &mut Proposal<TokenT, ActionT>, vote: &mut Vote<TokenT>, stake: Token::Token<TokenT>) {
        let stake_value = Token::value(&stake);
        Token::deposit(&mut vote.stake, stake);
        if (vote.agree) {
            proposal.for_votes = proposal.for_votes + stake_value;
        } else {
            proposal.against_votes = proposal.against_votes + stake_value;
        };
    }
```

上述还有一个问题即状态的判定，如下函数中，通过Proposal中的时间和投票参数来进行状态判定，代码比较明显，此处不再做过多讨论，读者可自行参考和阅读。
```rust
    fun do_proposal_state<TokenT: copy + drop + store, ActionT: copy + drop + store>(
        proposal: &Proposal<TokenT, ActionT>,
        current_time: u64,
    ): u8 {
        if (current_time < proposal.start_time) {
            // Pending
            PENDING
        } else if (current_time <= proposal.end_time) {
            // Active
            ACTIVE
        } else if (proposal.for_votes <= proposal.against_votes ||
            proposal.for_votes < proposal.quorum_votes) {
            // Defeated
            DEFEATED
        } else if (proposal.eta == 0) {
            // Agreed.
            AGREED
        } else if (current_time < proposal.eta) {
            // Queued, waiting to execute
            QUEUED
        } else if (Option::is_some(&proposal.action)) {
            EXECUTABLE
        } else {
            EXTRACTED
        }
    }
```
上述讲解了Dao.move一些比较重要的结构和函数，还有其余的一些代码读者可以自行阅读。

### mock-swap-config工程
前面主要讨论了一下Dao.move的实现。显然Dao.move实现了一个抽象的投票流程功能，具体要做什么样投票，需要开发者自己去实现。而我们的工程例子就是示范了如何使用Dao.move。
工程中`MockModuleConfig.move`、`MockModuleDaoProposal.move`、`MockModuleDaoProposalScript.move`、 `STD.move`分别实现了配置、提案、提案入口、治理币的功能

#### MockModuleDaoProposal.move

（完整代码见前一小节部署合约部分）

该合约一共提供了4个函数分别为`plugin`、`submit_proposal`、`proposal_state`、`execute_proposal`，`plugin`则是在STD初始化时被调用，在plugin函数中将STD作为治理币注册到全局Dao中，并且`ParameterModifyCapability`则是作为配置的修改权限托管到当前合约中。参考上述代码注意我们还定义了`MockModuleDaoProposalCapWrap`和`MockModuleDaoProposalAction`这两个结构，前者主要是为了配置合约托管过来的修改权限，而后者主要是为了定义当前我们的合约需要执行的动作，在这里只定义了一个u128整型的的值来记录我们通过投票后需要修改的目标值。

`submit_proposal`则调用了Dao的发起提案，将我们定义好的`MockModuleDaoProposalAction`作为将要执行的动作的模板参数传入。
再来看`execute_proposal`，我们在最开始的时候是需要通过Dao来获取当前提案动作的，如果提案不在正确的状态，则会报错退出。当我们正确的提取到了提案的动作中的值，则可以取出托管在当前合约的MockModuleDaoProposalCapWrap结构下的MockModuleConfig合约的修改权限来对值进行修改，以达到修改配置的目的。当然链上执行该动作时，是不需要任何签名者的身份的。



## 总结

本文在第一部分讨论了Starcoin的Dao的核心流程与状态，让读者有一个整体的印象。第二部分则讨论如何编写并部署了一个自定义Dao的工程，并将其部署到本地测试环境然后演示了一遍流程。在最后的部分着重讨论了一下Dao.move的核心逻辑的代码实现，然后再讨论了工程中最重要的上层应用合约`MockModuleDaoProposal.move`。在stdlib中还有一部分升级代码和配置修改投票代码，也是基于Dao.move来实现的上层应用。读者后续可以自己阅读。



## 参考资料

- https://starcoin.org/zh/developer/blog/starcoin_dao_1/ Starcoin与DAO时代的碰撞
- [https://starcoin.org/zh/developer/blog/starcoin\_stdlib\_upgrade/](https://starcoin.org/zh/developer/blog/starcoin_stdlib_upgrade/) Starcoin的stdlib升级和Dao链上治理
- [https://starcoin.org/zh/developer/blog/starcoin\_contract\_account/](https://starcoin.org/zh/developer/blog/starcoin_contract_account/) Starcoin合约账户详解