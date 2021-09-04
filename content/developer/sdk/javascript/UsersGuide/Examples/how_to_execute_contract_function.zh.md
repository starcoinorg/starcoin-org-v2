---
title: 如何执行一个合约函数
weight: 1
---

<!--more-->

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

### 如何执行一个不需要签名的合约函数?

1. 通过Postman或者curl命令调用 contract.call_v2，确认 type_args 和 args 的参数都正确，而且执行成功。
    ![](/images/sdk/call_v2.png)

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

### 如何通过dry run来模拟执行一个需要签名的合约函数?

在dapp里面执行一个需要签名的合约函数的时候，必须先通过dry run来模拟执行该合约函数，确保type_args和 args两个数组的参数的类型和value都正确。

有两个链的API `contract.dry_run` 和 `contract.dry_run_raw`， 可以模拟执行一个合约函数。 除了检查参数(result.status=Executed)，还可以预估gas费(result.gas_used)。

任何合约函数，都可以通过`contract.dry_run_raw`来模拟执行。

但是如果 `contract.resolve_function` 返回的args数组里面，存在至少一个 type_tag 是 `{ "Vector": { "Vector": "U8" } }` 的参数，那么就只能通过`contract.dry_run_raw` 来模拟执行, 否则就可以通过 `contract.dry_run` 来模拟执行， 这是因为curl的命令行没有办法提供数据类型是 `{ "Vector": { "Vector": "U8" } }` 的数据。

1. contract.dry_run

通过 `contract.resolve_function`， 我们发现 `0x1::TransferScripts::peer_to_peer_v2` 的args数组没有type_tag 是 `{ "Vector": { "Vector": "U8" } }` 的参数，可以通过 `contract.dry_run` 来模拟执行。

```bash
curl --location --request POST 'https://main-seed.starcoin.org' \
--header 'Content-Type: application/json' \
--data-raw '{
 "id":101, 
 "jsonrpc":"2.0", 
 "method":"contract.resolve_function", 
 "params":["0x1::TransferScripts::peer_to_peer_v2"]
}'
```

返回结果:
```json
{
    "jsonrpc": "2.0",
    "result": {
        "name": "peer_to_peer_v2",
        "module_name": {
            "address": "0x00000000000000000000000000000001",
            "name": "TransferScripts"
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
                "type_tag": "U128",
                "doc": ""
            }
        ]
    },
    "id": 101
}
```

比如，我们想在barnard测试网，从帐号A `0x3f19d5422824f47e6c021978cee98f35` 给帐号B `0xd42cce7f1afe838b9f40a6583da07693` 转 0.1 STC.

- Postman
    ![](/images/sdk/dry_run.png)

- Curl命令
```bash
curl --location --request POST 'https://barnard-seed.starcoin.org' \
--header 'Content-Type: application/json' \
--data-raw '{
 "id":200, 
 "jsonrpc":"2.0", 
 "method":"contract.dry_run", 
 "params":[
     {
         "chain_id": 251,
         "gas_unit_price": 1,
         "sender": "0x3f19d5422824f47e6c021978cee98f35",
         "sender_public_key": "0xc51dada886afe59d4651f36b56f3c4a1a84da53dfbddf396d81a5b36ab5cdc26",
         "sequence_number": 37,
         "max_gas_amount": 40000000,
         "script": {
             "code": "0x1::TransferScripts::peer_to_peer_v2", 
             "type_args": ["0x1::STC::STC"],
             "args": ["0xd42cce7f1afe838b9f40a6583da07693", "10000000u128"]
            }
     }
    ]
}'
```

2. contract.dry_run_raw

`contract.dry_run_raw` 的params，接受两个参数: rawUserTransactionHex, accountPublicKey

比如，帐号 `0x5a2cd40212ad13a1effab6b07cf31f06` 想在主网领取 投票#2奖励-[OnChainConfig]叔块率目标值调整。

rawUserTransactionHex的生成方法如下：

```js
import BigNumber from 'bignumber.js';
import { providers, encoding, utils } from "@starcoin/starcoin";

const record = {
    address: "0x5a2cd40212ad13a1effab6b07cf31f06",
    airDropId: 3,
    amount: "57534",
    idx: "116",
    ownerAddress: "0x7842a425898c512b7ab3db052b643227",
    proof: ["0x2e39cb0801363d4ce36c8eb27ee69960c9a43b51394a2dec622d8b4d9130d91b", "0x9267d8363135d6344b6c35a7c0637ddd91df7c19bbb6c79f48cf5e11080b9995", "0x823c08106684649abdfda09e93d4767faed9ec03a0e7e7f33dbe7aa93fb643b3", "0x45e19c7169f4db91cf3b588fddf11300c7c573c049602e14964cfb89fe1b30a5", "0xc18cf48f7532baae1dc1b8e0e3c8a7f370c286e9c964a82c9173356d8c9b41e3", "0x07abf6fc9cd5a0fd0a5adf56f8b4146032d127aba9193ad8212c09393290d7f5", "0x617f661c712f8e7005801b99c0a886194a96e5c6ef9368535e428600a48f8691", "0xdb06fba7d7dd3a9b28ad5a9408e21dd6cc7fe31879918721d3a75515ab355044", "0x71353420cdb8de8d67760c14f0f8e04f7cf1c0cbbeec2a68302c2e82597e7488"],
    root: "0x1b17740edac5f7d689a24270836e81b9aafee3d570f50d11038f0ddf6e8389be",
}
const functionId = '0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script'
const typeArgs = ['0x1::STC::STC']
const args = [record.ownerAddress, record.airDropId, record.root, record.idx, record.amount, record.proof]

const maxGasAmount =  40000000;
const gasPrice = 1;

const provider = new providers.JsonRpcProvider(nodeUrl);
const sequenceNumber = await new Promise((resolve, reject) => {
      return provider.getResource(
        record.address,
        '0x1::Account::Account',
        (err, res) => {
          if (err) {
            return reject(err);
          }

          const sequence_number = res && res.value[6][1].U64 || 0;
          return resolve(new BigNumber(sequence_number, 10).toNumber());
        },
      );
    });
const nowSeconds = await new Promise((resolve, reject) => {
      return provider.getNodeInfo((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.now_seconds);
      });
    });
// expired after 30 minutes since Unix Epoch by default
const expiredSecs = 1800;
const expirationTimestampSecs = nowSeconds + expiredSecs;
const chainId = 1;
const nodeUrl = 'https://main-seed.starcoin.org'

const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, typeArgs, args, nodeUrl);

const rawUserTransaction = utils.tx.generateRawUserTransaction(
    record.address,
    scriptFunction,
    maxGasAmount,
    gasPrice,
    sequenceNumber,
    expirationTimestampSecs,
    chainId,
);

const rawUserTransactionHex = encoding.bcsEncode(rawUserTransaction);
console.log(rawUserTransactionHex)
//0x5a2cd40212ad13a1effab6b07cf31f06140000000000000002b987f1ab0d7879b2ab421b98f96efb44174d65726b6c654469737472696275746f725363726970740c636c61696d5f73637269707401070000000000000000000000000000000103535443035354430006107842a425898c512b7ab3db052b64322708030000000000000021201b17740edac5f7d689a24270836e81b9aafee3d570f50d11038f0ddf6e8389be08740000000000000010bee00000000000000000000000000000aa0209202e39cb0801363d4ce36c8eb27ee69960c9a43b51394a2dec622d8b4d9130d91b209267d8363135d6344b6c35a7c0637ddd91df7c19bbb6c79f48cf5e11080b999520823c08106684649abdfda09e93d4767faed9ec03a0e7e7f33dbe7aa93fb643b32045e19c7169f4db91cf3b588fddf11300c7c573c049602e14964cfb89fe1b30a520c18cf48f7532baae1dc1b8e0e3c8a7f370c286e9c964a82c9173356d8c9b41e32007abf6fc9cd5a0fd0a5adf56f8b4146032d127aba9193ad8212c09393290d7f520617f661c712f8e7005801b99c0a886194a96e5c6ef9368535e428600a48f869120db06fba7d7dd3a9b28ad5a9408e21dd6cc7fe31879918721d3a75515ab3550442071353420cdb8de8d67760c14f0f8e04f7cf1c0cbbeec2a68302c2e82597e7488005a62020000000001000000000000000d3078313a3a5354433a3a5354437c7932610000000001
```

- Postman
    ![](/images/sdk/dry_run_raw.png)

- Curl命令
```bash
curl --location --request POST 'https://main-seed.starcoin.org' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 200,
    "jsonrpc": "2.0",
    "method": "contract.dry_run_raw",
    "params": [
        "0x5a2cd40212ad13a1effab6b07cf31f06140000000000000002b987f1ab0d7879b2ab421b98f96efb44174d65726b6c654469737472696275746f725363726970740c636c61696d5f73637269707401070000000000000000000000000000000103535443035354430006107842a425898c512b7ab3db052b64322708030000000000000021201b17740edac5f7d689a24270836e81b9aafee3d570f50d11038f0ddf6e8389be08740000000000000010bee00000000000000000000000000000aa0209202e39cb0801363d4ce36c8eb27ee69960c9a43b51394a2dec622d8b4d9130d91b209267d8363135d6344b6c35a7c0637ddd91df7c19bbb6c79f48cf5e11080b999520823c08106684649abdfda09e93d4767faed9ec03a0e7e7f33dbe7aa93fb643b32045e19c7169f4db91cf3b588fddf11300c7c573c049602e14964cfb89fe1b30a520c18cf48f7532baae1dc1b8e0e3c8a7f370c286e9c964a82c9173356d8c9b41e32007abf6fc9cd5a0fd0a5adf56f8b4146032d127aba9193ad8212c09393290d7f520617f661c712f8e7005801b99c0a886194a96e5c6ef9368535e428600a48f869120db06fba7d7dd3a9b28ad5a9408e21dd6cc7fe31879918721d3a75515ab3550442071353420cdb8de8d67760c14f0f8e04f7cf1c0cbbeec2a68302c2e82597e7488005a62020000000001000000000000000d3078313a3a5354433a3a5354437c7932610000000001",
        "0xeb7cca2a26f952e9308796dff5c0b942d49a02ca09ef9f8975d5bf5f8e546da0"
    ]
}'
```

### 如何执行一个需要签名的合约函数?

1. 通过Postman或者curl命令调用 contract.dry_run 或者 contract.dry_run_raw，确认 type_args 和 args 的参数都正确，而且执行成功。

2. 在js里面集成，调用 `contract.call_v2` 时，需要注意：

    i. 调用 `utils.tx.encodeScriptFunctionByResolve`， 生成 `ScriptFunction`

    ii. 生成 `ScriptFunction` 的 二进制的Hex: payloadInHex

    iii. 构造一个只有 `data` 属性的 txParams 对象。(data=payloadInHex)

    iv. 调用 `starcoinProvider.getSigner().sendUncheckedTransaction`， 唤起 Starmask 钱包, 自动计算gas费， 当前选中帐号点击 确认 后，会生成rawUserTransaction的hex，然后再提交到链上执行，返回transacition hash。

3. 下面是领取空投的合约函数`0xb987F1aB0D7879b2aB421b98f96eFb44::MerkleDistributorScript::claim_script`的例子:

```js
import { hexlify } from '@ethersproject/bytes'
import { providers, bcs, utils } from "@starcoin/starcoin";

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

const starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
console.log({ transactionHash })
```


## 参考
1. Starmask-test-dapp
- 在线demo: [https://starmask-test-dapp.starcoin.org](https://starmask-test-dapp.starcoin.org/)
- 源码仓库: [github](https://github.com/starcoinorg/starmask-test-dapp) 

2. [Postman 使用指南](https://starcoin.org/zh/developer/rpc/postman_document/)

3. starcoin.js 的 test cases