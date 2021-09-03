---
title: 使用例子
weight: 2
---

<!--more-->

1. 发起一个交易
```typescript
const functionId = '0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script'
const tyArgs = ['0x00000000000000000000000000000001::STC::STC']
const record = {
    airDropId: 1629220858501,
    ownerAddress: '0x3f19d5422824f47e6c021978cee98f35',
    root: '0xaacff971f163f956a24068dc5f50e03313e374a1725a8806ff275441f9aa6109',
    address: '0x3f19d5422824f47e6c021978cee98f35',
    idx: 0,
    amount: 1000000000,
    proof: [
      '0xac47a36f0bc7f19afd2baba9c8182e7e8d6dbe2a3eff03f9519fd4b50e6f1960'
    ]
}
const args = [record.ownerAddress, record.airDropId, record.root, record.idx, record.amount, record.proof]

const nodeUrl = 'https://barnard-seed.starcoin.org'

const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrl)

// // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
const payloadInHex = (function () {
    const se = new bcs.BcsSerializer()
    scriptFunction.serialize(se)
    return hexlify(se.getBytes())
})()

const txParams = {
    data: payloadInHex,
}

const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
console.log({ transactionHash })
```

## 参考
1. Starmask-test-dapp
- 在线demo: [https://starmask-test-dapp.starcoin.org](https://starmask-test-dapp.starcoin.org/)
- 源码仓库: [github](https://github.com/starcoinorg/starmask-test-dapp) 

2. starcoin.js 的 test cases