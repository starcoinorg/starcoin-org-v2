---
title: 使用例子
weight: 2
---

<!--more-->

##  Web Dapp 里面如何执行一个合约的函数?

合约的函数分成两种：

一种是需要签名的，需要先在dapp里面生成Transaction，然后唤起Starmask，当前选中帐号确认签名，生成rawUserTransaction的hex，然后再提交到链上执行。

另一种是不需要签名的，可以直接调用链的API(contract.call_v2)，得到返回结果。

### 如何判断一个合约函数是否需要签名？

args参数的数组，第一个参数的类型， 如果是 Singer，就需要签名，否则就不需要。

有两种确认方法:

第一种是直接去查看源码，

第二种是调用链的API: contract.resolve_function，查看函数定义。

以 [Starcoin空投](https://github.com/starcoinorg/starcoin-airdrop) 项目为例:

1. 领取空投的合约函数 `0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script`，就需要签名。

```bash
curl --location --request POST 'https://main-seed.starcoin.org' \
--header 'Content-Type: application/json' \
--data-raw '{
 "id":101, 
 "jsonrpc":"2.0", 
 "method":"contract.resolve_function", 
 "params":["0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script"]
}'
```

返回结果:
```json
{
    "jsonrpc": "2.0",
    "result": {
        "name": "claim_script",
        "module_name": {
            "address": "0xb987f1ab0d7879b2ab421b98f96efb44",
            "name": "MerkleDistributorScript"
        },
        "doc": "",
        "ty_args": [
            {
                "name": "T0",
                "abilities": 4
            }
        ],
        "args": [
            {
                "name": "p0",
                "type_tag": "Signer",
                "doc": ""
            },
            {
                "name": "p1",
                "type_tag": "Address",
                "doc": ""
            },
            {
                "name": "p2",
                "type_tag": "U64",
                "doc": ""
            },
            {
                "name": "p3",
                "type_tag": {
                    "Vector": "U8"
                },
                "doc": ""
            },
            {
                "name": "p4",
                "type_tag": "U64",
                "doc": ""
            },
            {
                "name": "p5",
                "type_tag": "U128",
                "doc": ""
            },
            {
                "name": "p6",
                "type_tag": {
                    "Vector": {
                        "Vector": "U8"
                    }
                },
                "doc": ""
            }
        ]
    },
    "id": 101
}
```


2. 而检查是否已经领取空投的合约函数`0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributor2::is_claimd`，就不需要签名。


```bash
curl --location --request POST 'https://main-seed.starcoin.org' \
--header 'Content-Type: application/json' \
--data-raw '{
 "id":101, 
 "jsonrpc":"2.0", 
 "method":"contract.resolve_function", 
 "params":["0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributor2::is_claimd"]
}'
```

返回结果:
```json
{
    "jsonrpc": "2.0",
    "result": {
        "name": "is_claimd",
        "module_name": {
            "address": "0xb987f1ab0d7879b2ab421b98f96efb44",
            "name": "MerkleDistributor2"
        },
        "doc": "",
        "ty_args": [
            {
                "name": "T0",
                "abilities": 4
            }
        ],
        "args": [
            {
                "name": "p0",
                "type_tag": "Address",
                "doc": ""
            },
            {
                "name": "p1",
                "type_tag": "U64",
                "doc": ""
            },
            {
                "name": "p2",
                "type_tag": {
                    "Vector": "U8"
                },
                "doc": ""
            },
            {
                "name": "p3",
                "type_tag": "U64",
                "doc": ""
            }
        ]
    },
    "id": 101
}
```

### 如何执行一个需要签名的合约函数?

1. 先在Postman里面调用 contract.dry_run 或者 contract.dry_run_raw，确认 type_args 和 args 的参数都正确，而且执行成功。

2. 在js里面集成，调用 `contract.call_v2` 时，需要注意：

    i. 调用 `utils.tx.encodeScriptFunctionByResolve`， 生成 `ScriptFunction`

    ii. 生成 `ScriptFunction` 的 二进制的Hex: payloadInHex

    iii. 构造一个只有 `data` 属性的 txParams 对象。(data=payloadInHex)

    iv. 调用 `starcoinProvider.getSigner().sendUncheckedTransaction`， 唤起 Starmask 钱包, 自动计算gas费， 当前选中帐号点击 确认 后，会生成rawUserTransaction的hex，然后再提交到链上执行，返回transacition hash。

3. 下面是领取空投的合约函数`0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script`的例子:

```js
const functionId = '0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script'
const tyArgs = ['0x00000000000000000000000000000001::STC::STC']
const record = {
    airDropId: 2,
    ownerAddress: '0x7842a425898c512b7ab3db052b643227',
    root: '0x00dd4138ba37ab9004bfd6292978410be672267ec89f6b2c741219474ee0b382',
    address: '0x5A2cd40212ad13A1efFAB6B07cF31f06',
    idx: 84,
    amount: 115068,
    proof: [
        "0x9d01ca5f8d0596c6a1a4a424a97b95d505d473db7ebbc2e3330629abdd9f693a","0xc9415cab404581c2736103625bab9bdb506f52ce7c769c928cf8bf48c9ae17e0","0xc8a9f155c42cae3694964f2e292bfc22cfbdcd6a81fc47b1ee0e80eb6bdeca09","0x9ba5298c895d94bee1899191b63b8a715bf65fd4cd2766f907d971d449549b7c","0x2498c2a8c11eb3394c6c043ee54d292a40a8d46c61acf964ccc68da795164e34","0x7f23e148cfeffc1d4a916b3a6e139d8d6643a48c7d0299a6a9a77b87f37d02b5","0xc057fe32ef239b6152c7bc42e456459caa9e4d2d6898f4b49a292f6e6f5541fc","0xe90316d09087827d50ed99baaa28db266b176c9b70ed1f57d44ffa72a90208bc"
    ]
}
const args = [record.ownerAddress, record.airDropId, record.root, record.idx, record.amount, record.proof]

const nodeUrl = 'https://main-seed.starcoin.org'

const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrl)

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

### 如何执行一个不需要签名的合约函数?

1. 先在Postman里面调用 contract.call_v2，确认 type_args 和 args 的参数都正确，而且执行成功。
    ![](/images/sdk/call_v2.jpg)

2. 在js里面集成，调用 `contract.call_v2` 时，需要注意：

        i. args数组的每一个参数都需要是字符串

        ii. 如果args数组里面某一个参数的type_tag是`{ "Vector": "U8" }`, 说明这个参数需要的是一个字符串的二进制的hex.

            - 如何将一个js的字符串，转换成二进制的hex? 可以参考 encoding 里面的 `Encode & Decode String` 
        
            - 不要前面的0x
        
            - 前面需要加转义字符x.
        
        iii. 如果args数组里面某一个参数的type_tag是U64或者U128等，那么需要在数字后面加上小写的u64或者u128等。
3. 下面是检查是否已经领取空投的合约函数`0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributor2::is_claimd`的例子:

```js
const record = {
    airDropId: 2,
    ownerAddress: '0x7842a425898c512b7ab3db052b643227',
    //注意: record.root已经是字符串的二进制的hex，不需要再转换
    root: '0x00dd4138ba37ab9004bfd6292978410be672267ec89f6b2c741219474ee0b382',
    idx: 47,
}
const functionId = '0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributor2::is_claimd'
const tyArgs = ['0x00000000000000000000000000000001::STC::STC']
const args = [
    record.ownerAddress, // "type_tag": "Address",
    `${ record.airdropId }u64`, // "type_tag": "U64",
    `x\"${ record.root.slice(2) }\"`, //"type_tag": { "Vector": "U8" }
    `${ record.idx }u64`, // "type_tag": "U64",
]
const isClaimed = await new Promise((resolve, reject) => {
    return starcoinProvider.send(
        'contract.call_v2',
        [
            {
                function_id: functionId,
                type_args: tyArgs,
                args,
            },
        ],
    ).then((result: any) => {
        if (result) {
            resolve(result)
        } else {
            reject(new Error('fetch failed'))
        }
    })
});

const isClaimed =  (Array.isArray(result) && result.length) ? result[0] : undefined
```

## 参考
1. Starmask-test-dapp
- 在线demo: [https://starmask-test-dapp.starcoin.org](https://starmask-test-dapp.starcoin.org/)
- 源码仓库: [github](https://github.com/starcoinorg/starmask-test-dapp) 

2. [Postman 使用指南](https://starcoin.org/zh/developer/rpc/postman_document/)

3. starcoin.js 的 test cases