+++
title = "Starcoin Move 合约标准库 v5 版升级投票开始"
date = "2021-06-08"
summary = " "
author = "jolestar"
tags = [
    "Starcoin"
]
archives="2021"
+++

Starcoin Move 合约标准库 v5 版升级投票开始。本次 Move 合约标准库（stdlib）升级是 Starcoin 主网上线以来第一次升级，主要包含以下特性：


1. 从国库提款的时候增加额度限制，最大数额不能超过投票通过阈值（当前流通量的 4%）。(https://github.com/starcoinorg/starcoin/pull/2566)
2. 实现了新的链上认证策略，简化初始化链上账号的复杂度。当前，如果账号在链上不存在时，需要同时传递该账号的 Authentication Key 进行账号初始化，使用复杂度较高。本次更新中，初始化账号的时候只需要 address，Authentication Key 直接使用 address。 address 的长度是 128 位，Authentication Key 的长度是 256 位，安全性虽然比 Authentication Key 有所降低，但 128 位的碰撞概率也足够低，可以保证安全。当新创建账号第一次发起交易的时候，会自动根据交易的 public key 生成 256 位的  Authentication Key 并更新到链上。(https://github.com/starcoinorg/starcoin/pull/2562)

## 升级提案信息

1. 升级包二进制：https://github.com/starcoinorg/starcoin/tree/master/vm/stdlib/compiled/5/4-5
2. Package 哈希：0x20d79acaca9c50d4cbf51a992e5de658dcecf39c1573244f7d850b4b47af56d360
3. 提案 id：0
4. 提案交易: https://explorer.starcoin.org/main/transactions/detail/0x0237dba2eb4ea5971f7fb53693acb91f6879bfa12db3c15f1a6281e1661d9ee0
5. 提案发起账号：0xb2aa52f94db4516c5beecef363af850a

## 升级流程

1. 从今天发起升级提案开始，进行为期 7 天的投票。
2. 7 天后如果投票通过，则进入公示期，公示期 1 天。如果未通过，则提案失败。
3. 公示期过后，任何人都可以发起升级合约交易（升级交易的 Package hash 必须等于提案中的 Package hash），将标准库的 v5 版本写入到链上。该升级交易执行后，新特性激活。由于新特性包含了硬分叉特性，届时尚未升级到 starcoin v1.2.0 版本的节点可能会和主网分叉。

请持币人在链上进行投票。投票时，会将当前账户的 STC 抵押到合约中，直到投票结束，当前投票周期为 7 天。期间主动退款则视为放弃投票。
**为了鼓励参与链上治理，未来会推出链上治理的激励措施。本次参与投票的用户会根据激励策略进行补偿。**

具体投票方法请参看：[Starcoin Move 合约标准库升级投票指南](https://github.com/starcoinorg/starcoin/discussions/2578)

关于 Starcoin 治理的更多信息请参看：

* [Starcoin 技术白皮书中的治理部分](https://developer.starcoin.org/zh/sips/sip-2/)
* [链上治理的生命周期](https://developer.starcoin.org/zh/key_concepts/dao_governance/)
* [通过治理机制修改 DAO 的设置](https://developer.starcoin.org/zh/cli/modify_dao_config/)