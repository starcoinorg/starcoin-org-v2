---
title: 通过治理机制修改链上配置
weight: 7
---

关于链上治理的介绍请参看 [去中心化组织治理](../key_concepts/dao_governance/), 这是一个例子，演示如何通过 cli 修改链上配置。

<!--more-->

下面我们看一个修改 PublishOption 的例子。

## 修改 PublishOption 的配置：

1.把 PublishOption 修改为 Open 状态 (缺省是Locked)，发起投票。

``` bash
# 解锁节点账号，用节点账号发起提案。注意：以下用到的账户（0xc95f6a6f3845f09395a422b2f9959a97）都需要替换成自己的账户。
account unlock 0xc95f6a6f3845f09395a422b2f9959a97
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::OnChainConfigScripts::propose_update_txn_publish_option --arg true true 0
```
提案发起后，用户需要等待公示期过后才能开始投票。
可以使用如下命令查看提案信息。

``` bash
dev call --function 0x1::Dao::proposal_info -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption> --arg 0xc95f6a6f3845f09395a422b2f9959a97
```

返回结果包含了五个值，依次是：proposal_id，投票开始时间，投票结束时间，赞成票数，反对票数。
``` json
{
  "ok": [
    0,
    72240,
    3672240,
    0,
    0
  ]
}
```

2.用户投票

投票的用户需要 balance 不能为 0，可以通过挖矿或者其他账户转账的方式获得。
``` shell
# 解锁投票用户
account unlock 0xf941b3d2461e780a0e4f8cc374822fe8
account execute-function -s 0xf941b3d2461e780a0e4f8cc374822fe8 --function 0x1::DaoVoteScripts::cast_vote -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption> --arg 0xc95f6a6f3845f09395a422b2f9959a97 --arg 0 --arg true --arg 2000000000000000u128
```
投票完成，需要等待投票期结束。注意，第一个参数 0 表示 proposal id 是 0。第二个参数 true 表示赞成，第三个参数是投的 token 数量。

3.执行提案

执行提案前，可以通过以下命令查看提案状态：

``` bash
dev call --function 0x1::Dao::proposal_state -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption> --arg 0xc95f6a6f3845f09395a422b2f9959a97 0
```
返回：（如果返回结果是 4，说明提案通过，其他提案状态可以参考标准库文档）
注意： Dao的提案通过后的执行脚本都一样，需要注意proposal_id参数，当前示例是0

放入待执行对列：

``` bash
# 用节点账号将通过后的提案入队列
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::Dao::queue_proposal_action -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption> --arg 0xc95f6a6f3845f09395a422b2f9959a97 --arg 0
```
检查提案状态，待执行公示期过后：
``` bash
#必须由提案提交者发起交易执行提案。（这里有点坑，命令里节省了proposer参数，导致必须由提案提交者发起交易）
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::OnChainConfigScripts::execute_on_chain_config_proposal -t 0x1::TransactionPublishOption::TransactionPublishOption --arg 0

```

4.取回质押的 Token

``` bash
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function  0x1::DaoVoteScripts::unstake_vote -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption> --arg 0xc95f6a6f3845f09395a422b2f9959a97 0
```


5.最后清理掉完成的提案，验证参数是否正确
``` bash
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::Dao::destroy_terminated_proposal -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption> --arg 0xc95f6a6f3845f09395a422b2f9959a97 0
```

恭喜你，整个修改流程就完成了。

下面我们看一个修改 Consensus 配置的例子。

## 修改 Consensus 的配置：

1.把 base_reward_per_block 设为新的值，发起投票。

``` bash
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::OnChainConfigScripts::propose_update_consensus_config --arg 500 10000 10000000000u128 10 240 24 5000 60000 2 50000000 3u8 0
```
提案发起后，用户需要等待公示期过后才能开始投票。
可以使用如下命令查看提案信息。

``` bash
dev call --function 0x1::Dao::proposal_info -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::ConsensusConfig::ConsensusConfig> --arg 0xc95f6a6f3845f09395a422b2f9959a97
```

2.用户投票

投票的用户需要 balance 不能为 0，可以通过挖矿或者其他账户转账的方式获得。
``` shell
account execute-function -s 0xf941b3d2461e780a0e4f8cc374822fe8 --function 0x1::DaoVoteScripts::cast_vote -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::ConsensusConfig::ConsensusConfig> --arg 0xc95f6a6f3845f09395a422b2f9959a97 --arg 1 --arg true --arg 2000000000000000u128
```
投票完成，需要等待投票期结束。注意，第一个参数 1 表示 proposal id 是 1。第二个参数 true 表示赞成，第三个参数是投的 token 数量。

3.执行提案

执行提案前，可以通过以下命令查看提案状态：

``` bash
dev call --function 0x1::Dao::proposal_state -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::ConsensusConfig::ConsensusConfig> --arg 0xc95f6a6f3845f09395a422b2f9959a97 1
```
返回：（如果返回结果是 4，说明提案通过，其他提案状态可以参考标准库文档）
注意： Dao的提案通过后的执行脚本都一样，需要注意proposal_id参数，当前示例是1

放入待执行对列：

``` bash
# 用节点账号将通过后的提案入队列
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::Dao::queue_proposal_action -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::ConsensusConfig::ConsensusConfig> --arg 0xc95f6a6f3845f09395a422b2f9959a97 1
```
检查提案状态，待执行公示期过后：
``` bash
#必须由提案提交者发起交易执行提案。
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::OnChainConfigScripts::execute_on_chain_config_proposal -t 0x1::ConsensusConfig::ConsensusConfig --arg 1
```

4.取回质押的 Token

``` bash
account execute-function -s 0xf941b3d2461e780a0e4f8cc374822fe8 --function 0x1::DaoVoteScripts::unstake_vote -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::ConsensusConfig::ConsensusConfig> --arg 0xc95f6a6f3845f09395a422b2f9959a97 --arg 1
```


5.最后清理掉完成的提案，验证参数是否正确
``` bash
account execute-function -s 0xc95f6a6f3845f09395a422b2f9959a97 --function 0x1::Dao::destroy_terminated_proposal -t 0x1::STC::STC -t 0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::ConsensusConfig::ConsensusConfig> --arg 0xc95f6a6f3845f09395a422b2f9959a97 1
```
