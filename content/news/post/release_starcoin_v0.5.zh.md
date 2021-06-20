+++
title = "Starcoin 区块链发布 v0.5 版本"
date = "2020-09-20"
summary = "Starcoin 区块链发布 v0.5 版本，在上个版本稳定运行了一个多月（没有删档， 部署了六个测试节点，区块数据已经达到30多万）的基础上，对区块、Genesis、Stalib等模块做重大重构，实现了新的Service Registry框架，并增加了新的共识算法。欢迎下载 Starcoin 加入 Proxima 测试网络进行测试。"
author = "suoyuan"
tags = [
    "Release",
    "Starcoin"
]
archives="2020"
+++

Starcoin 区块链发布 v0.5 版本，在上个版本已经稳定运行了一个多月（没有删档， 部署了六个测试节点，区块数据已经达到30多万）的基础上，对区块、Genesis、Stalib等模块做重大重构，实现了新的Service Registry框架，并增加了新的共识算法。欢迎[下载](https://github.com/starcoinorg/starcoin/releases/) Starcoin 加入 Proxima 测试网络进行测试。

## 主要更新

1. 实现新的Service Registry框架，重构原Actor实现的相关模块。
2. [break] 重构区块头字段，去掉gas_limit并增加chain_id字段，修改public_key字段的展示。
3. [break] 更新block_info的累加器字段，并对受影响的模块进行相关修改。
4. [break] 重构block的prologue/epilogue函数参数。
5. [break] Stdlib修正模块名称顺序，并增加Block、Account、Token等Spec验证。
6. [break] Stdlib添加可扩展的Token，并支持多个Stdlib版本，实现了token gov投票治理机制。
7. 新增一种keccak Hash算法的共识的实现。
8. 实现VM的readonly function的调用。
9. 支持用户自定义Chain，将chain配置改为genesis配置。
10. 增强 Account、State、epoch_info_by_number、生成genesis config等命令。
11. 重构通过 Genesis 初始化 Storage 的逻辑。
12. 重构 Node 启动过程中的错误处理机制。
13. 进一步完善区块同步、状态同步、叔块检查的测试用例，以及累加器、jellyfish_tree等核心模块的单元测试覆盖。



## 依赖升级

1. move-vm bump to e297690c7ffbab2eccb42245a407e5d03e715ba3 (August 26) .
2. rust tool chain bump to 1.46.0.

更多详细的信息请参看 [release milestone](https://github.com/starcoinorg/starcoin/milestone/10) 。
