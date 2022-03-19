+++
title = "关于Starcoin链上治理投票（投票ID:4)通过的公告"
date = "2021-09-03"
summary = "Starcoin链上治理投票ID4已经通过，主网 stdlib v6 升级交易完成执行..."
author = "Starcoin"
tags = [
    "Starcoin"
]
archives="2021"

+++

 ## 一、Starcoin链上治理投票ID4已经通过，主网 stdlib v6 升级交易完成执行，支持以下特性

1. 实现 Oracle 协议，支持通用的数据预言机以及价格预言机。 (#2732)
2. 实现通用的 NFT 协议。(#2688, #2763, #2760, #2767, #2769, #2771, #2772)
3. 实现合约账户（目前只对 stdlib 开放，计划下一步对外开放）。(#2673)
4. Account::deposit 支持存入 zero 。 (#2745)
5. Account 支持自动收款功能，收款人不需要事先 accept_token。 (#2746)
6. 添加了许多脚本函数，供外部调用。 (#2745, #2781)
7. 修复 Math.mul_div 的 bug。 (#2775)

 

## 二、创世用户可以领取GenesisNFT

* GenesisNFT 的账号列表： https://github.com/starcoinorg/starcoin/blob/master/contrib-contracts/src/genesis-nft-address.json 

* 领取工具：https://github.com/starcoinorg/starcoin/tree/master/cmd/genesis-nft-miner

  （GenesisNFT 的领取工具尚未 release，用户可以自行编译，也可等待官方release领取）

