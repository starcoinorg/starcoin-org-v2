---
title: 第一笔链上交易
weight: 3
---


这篇文章指导你如何在 starcoin 区块链上执行自己的第一笔交易。
在这之前，建议你先阅读 tech 相关的文章，对 starcoin 的基本概念有一定了解。

<!--more-->

## 前提

假设你已经在本地跑起来一个 starcoin dev 节点。


## 提交交易的几个步骤

- 启动 starcoin 控制台，并连接到 starcoin 节点，详细步骤请查阅[使用 starcoin 控制台](./console)。
- 创建两个账户，Alice,Bob, 详细步骤请查阅[账号管理](./account_manager)。
- 给 Alice 账户挖钱。
- 提交转账交易：Alice 给 Bob 打钱。


### 创建账户

连接到节点后，我们先来创建两个账户。这里我们假设两个账号已经创建成功，Alice 是默认账号，的地址是 0xfa635e304e0c1accf59e6ed211998158 ， Bob 的地址是 0x76a12ea4a733de0fae0cf329083d1952 。

### 使用 Faucet 给账户充钱

 Dev 环境下，可以利用 faucet 给账户充钱。faucet 只在 dev 和 test net 中存在，以便于开发者做开发和测试。
 下面我们就通过 console 给 Alice 充钱。

``` bash
starcoin% dev get-coin -v 100STC
```

`dev get-coin` 会往默认账户中充钱，如果链上不存在这个账户，它会先创建这个账户，然后再往该账户转入 `-v` 指定数量的 coin。
 命令输出的是以 faucet 账户（地址是 `0000000000000000000000000a550c18` ）发出的交易信息。

等待几秒钟，然后再查看账户信息。

```bash
starcoin% account show 0xfa635e304e0c1accf59e6ed211998158
{
  "ok": {
    "account": {
      "address": "0xfa635e304e0c1accf59e6ed211998158",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0xcf6af68573e8cc232e99aeb11ba2786c8e3f94d90108b1239c36154cd1a75788",
      "receipt_identifier": "stc1plf34uvzwpsdveav7dmfprxvptqrzyhqp"
    },
    "auth_key": "0x5007518ade0231dd0ebb785ba3cc3ecffa635e304e0c1accf59e6ed211998158",
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 100000000000
    },
    "sequence_number": 0
  }
}
```

可以看到 `balances`  有数据了。

### 提交交易 - 转账


首先需要解锁 Alice 的账户，授权 node 使用 alice 的私钥对交易签名。

``` bash
account unlock -p my-pass 0xfa635e304e0c1accf59e6ed211998158
```
其中 `-p my-pass` 是创建账户时传入的密码，初始的默认账号密码为空，可以不传递这个参数。

账户解锁后，执行以下命令：

```bash
starcoin% account execute-function --function 0x1::TransferScripts::peer_to_peer_v2 -t 0x1::STC::STC --arg 0x76a12ea4a733de0fae0cf329083d1952 --arg 10000u128 -s 0xfa635e304e0c1accf59e6ed211998158
```

其中：

- `-s 0xfa635e304e0c1accf59e6ed211998158`: 是 Alice 的账户地址。
- `-r 0x76a12ea4a733de0fae0cf329083d1952`：是 Bob 的账户地址。

> 如果，Bob 的账户在链上还不存在，转账交易会自动在链上创建 Bob 的账户。


此时，交易已经被提交到链上。还需要等待几秒（dev 环境出块时间比较短），让交易上链。然后再查看 Bob 的账户信息：


``` bash
starcoin% account show 0x76a12ea4a733de0fae0cf329083d1952
{
  "ok": {
    "account": {
      "address": "0x76a12ea4a733de0fae0cf329083d1952",
      "is_default": false,
      "is_readonly": false,
      "public_key": "0xabd226b1b90b0e969d1db3f937d600006f4c5db342ef3f8bc49a555e9c2fea2b",
      "receipt_identifier": "stc1pw6sjaf98x00qltsv7v5ss0ge2gnl9jpv"
    },
    "auth_key": "0x891410477b6abc7c95bb8eff9cdcf9af76a12ea4a733de0fae0cf329083d1952",
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 10000
    },
    "sequence_number": 0
  }
}
```

可以发现：Bob 账户已经有钱了。


至此，你已经成功完成了一笔链上转账！

