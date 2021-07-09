+++
title = "Starcoin Move 合约标准库 v5 版升级完成"
date = "2021-06-17"
summary = "Starcoin Move 合约标准库 v5 版升级完成，交易信息：[0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3](https://stcscan.io/main/transactions/detail/0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3)"
author = "jolestar"
tags = [
    "Starcoin"
]
archives="2021"
+++

Starcoin Move 合约标准库 v5 版升级完成，交易信息：[0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3](https://stcscan.io/main/transactions/detail/0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3)

此次升级包含硬分叉特性，v1.2.0 之前的版本将无法执行最新的交易，如果发现节点运行状态有问题，请尽快升级到 v1.2.0 版本。

后续有一系列基于此版本的更新：

1. SDK 中的转账默认会使用 0x1::TransferScripts::peer_to_peer_v2 方法，不再需要 auth key 参数（如果收款账号在链上不存在，会自动创建账号并将地址作为 auth key）。
2. ReceiptIdentifier 中的 auth key 字段废弃，之后 ReceiptIdentifier 和账号地址是等价的，是同一个数据的不同展示方式，所有接受账号地址的接口和方法都能自动接受 ReceiptIdentifier。
