+++
title = "Starcoin 区块链发布 v0.7 版本"
date = "2020-10-27"
summary = "Starcoin 区块链发布 v0.7 版本，在上个版本已经稳定运行了一个多月的基础上，对Chain、共识、Stdlib、Network等模块持续优化，增加CNR共识算法，调整时间精度，提升Spec形式化验证覆盖率到90%以上。欢迎下载 Starcoin 加入 Proxima 测试网络进行测试。"
author = "suoyuan"
tags = [
    "Release",
    "Starcoin"
]
archives="2020"
+++

Starcoin 区块链发布 v0.7 版本，在上个版本已经稳定运行了一个多月的基础上，对Chain、共识、Stdlib、Network等模块持续优化，增加了CNR共识算法，调整时间精度，提升Spec形式化验证覆盖率到90%以上。欢迎[下载](https://github.com/starcoinorg/starcoin/releases/) Starcoin 加入 Proxima 测试网络进行测试。

## 主要更新

1. [break] 改进了Stdlib事件相关的处理，和 account deposit处理。
2.  Refactor json-rpc，用Mutex RpcClientInner代替RefCell，并将jsonrpc提升到15.1.0。
3. [break] Refactor timeService和相关模块引用基于时间的更新，修改stdlib时间戳为毫秒。
4. [break] 进一步完善Stdlib Spec verify、Account、ConsensusConfig、Authenticator、Dao等模块。
5. 重构共识，实现cryptonight的新算法，为修改策略更新共识配置。
6. [break]升级Move-vm，做一些清理。
7. 实现新的network rpc api和BlockAccumulatorSyncTask。
8. 增强和优化累加器，从Libra移植InMemoryAccumulator，以及相关存储的重构。
9. 增强association_account使用多密钥地址和账户支持多密钥。
10. 重构miner模块，修改miner客户端删除共识策略。
11. [break]删除scaling factor，改进dao相关功能和事件，修改Config脚本和TransactionTimeoutConfig。  
12. [break] 更新CNR共识的genesis配置，修正hash rate信息。
13. [break] 重构Stdlib错误代码。
14. 重构chain和network模块，修复GetBlockStateByHash错误，为chain增加测试非执行的apply用例，并增加验证叔块的测试用例。
15. 优化stest模块错误信息报告，修改节点启动错误处理，增加工具解释移动中止错误代码。
16. 修复了 PoW 难度计算窗口的一个 bug。
17. 每个 epoch 根据上个 epoch 的 block gas_used 平均值以及出块目标时间，动态调整下个 epoch 的 block gas limit。



## 依赖升级

1. move-vm bump to 6e0b5f3be37f586f8bf9cb5e534ea138705b1e6f (October 16) .

更多详细的信息请参看 [release](https://github.com/starcoinorg/starcoin/releases/tag/v0.7.0) 。
