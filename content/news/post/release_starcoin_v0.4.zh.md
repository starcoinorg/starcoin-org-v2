+++
title = "Starcoin 区块链发布 v0.4 版本"
date = "2020-08-06"
summary = "Starcoin 区块链发布 v0.4 版本，主要包括模块重构以及基本类型和协议的稳定化。之后一个月，Starcoin 区块链将开启为期一个月的不删档公测。欢迎下载 Starcoin 加入 Proxima 测试网络进行测试。"
author = "jolestar"
tags = [
    "Release",
    "Starcoin"
]
archives="2020"
+++

Starcoin 区块链发布 v0.4 版本，主要包括模块重构以及基本类型和协议的稳定化。之后一个月，Starcoin 区块链将开启为期一个月的不删档公测。欢迎[下载](https://github.com/starcoinorg/starcoin/releases/) Starcoin 加入 Proxima 测试网络进行测试。 

## 主要更新

1. 重构以及稳定化基本数据类型，Block，Transaction 等。
2. 交易中增加 ChainID 用于区分不同网络的交易。
3. 交易中增加 Gas TokenCode, 为未来支持任意 Token 作为 Gas 做准备。 
4. 完善交易的过期机制。
5. 重构以及稳定化 Stdlib。
6. 重构 VM 以及 VM 的错误处理。
7. 修复 Token 合约的 Token 类型判断 bug，统一使用 TokenCode 来标记 Token 类型，比如: 0x1::STC::STC。
8. 清理以及稳定化 P2P 网络消息。
9. 重构以及完善 Fast Sync。
10. 修复叔块的若干 Bug。
11. 重构 cli，将 wallet 命令重命名为 account，实现了 account 的 off-chain 数据存储和检索。
12. 引入 Move prover，为 Stdlib 实现形式化证明做准备。
13. 提升 Stdlib 单元测试覆盖率到 80%。
14. 重构以及完善集成测试框架。
15. 重构以及稳定化节点配置

## 依赖升级

1. move-vm bump to 9eadc565466d3db3a2b6b4f38c3fea78dcddc372 (July 29) .
2. rust tool chain bump to 1.45.0.

更多详细的信息请参看 [release milestone](https://github.com/starcoinorg/starcoin/milestone/9) 。
