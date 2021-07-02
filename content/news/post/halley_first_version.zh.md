+++
title = "Starcoin区块链发布第一个测试网版本, 测试网Halley也已经同步启动"
date = "2020-04-09"
image = 'read.jpg'
summary = "经过 3 个月的紧张开发，Stacoin 发布了其 Layer 1 第 1 个测试网版本 V0.1，该版本基本实现了一个完整的去中心化区块链网络，测试网 Halley 也已经同步启动。"
archives="2020"
author = "Tim"
tags = [
    "Halley",
    "Starcoin"
]
+++

<br/>


经过 3 个月的紧张开发，Stacoin 发布了其 Layer 1 第 1 个测试网版本 V0.1，该版本基本实现了一个完整的去中心化区块链网络，测试网 Halley 也已经同步启动。

Starcoin 是新一代的区块链公链基础设施，目标是实现一个安全的、分层的、去中心化区块链系统。

Starcoin 是第一个使用 Move 智能合约的去中心化公链（其他 Move 区块链项目大多使用有限范围并且需要专有权限的 PoS 共识），Move 的安全特性从底层确保了数字资产的安全。

V0.1 完成了 Starcoin Layer 1 主要功能，可以安全快速的定义数字资产，并具备通过智能合约实现资产转移交换等能力。

V0.1 的主要特性包括：

* 安全
对于 Starcoin 来说，安全始终是第一位的特性， Starcoin 的安全性来自基于 Move 的虚拟机，在 Move 中，数字资产资源是一等公民，这样确保了数字资产安全。另外 Starcoin 发布的测试网版本使用 Rust 开发，Rust 在内存管理及编程安全方面具有更好的支持。

* 成熟的去中心化共识算法。

PoW 共识以算力为基础，当算力达到一定规模后，必须拥有全网一半以上的算力才能发动攻击，攻击成本非常高，从历史来看，是目前最安全的区块链共识。

* Stdlib 和 可编程性

Starcoin 提供一套智能合约的基础库 stdlib，内置基础的工具库以及 Token 等数字资产基础资源模型，简化了用户开发数字资产合约的成本，提高了链的可编程性。

开发者可以通过[这里](https://github.com/starcoinorg/starcoin/releases/tag/v0.1.0-alpha)下载预编译版本，也可以通过 GitHub 下载源代码，编译方法可以参考相关[文档](http://developer.starcoin.org/en/build/)。

Starcoin 目前可以通过 Halley 来访问，Halley 是 Starcoin 第一个测试网络，使用方法请参阅 [文档](http://developer.starcoin.org/en/runnetwork/)。
