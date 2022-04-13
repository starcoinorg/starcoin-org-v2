---
title: 部署 Move 合约
weight: 2
---

这篇文章指导你如何编译和部署 Move 合约到 starcoin 区块链。

<!--more-->


Move 是一种新的编程语言，旨在为 [Diem 区块链]（https://github.com/deim/diem）提供安全和可编程的基础。
Starcoin Blockchain 还支持 Move 语言编写智能合约。


首先按照 [Run/Join Network](../setup/runnetwork) 中的描述启动一个开发网络，并获得一些测试硬币，比如"1000000000"。

然后，我们开始吧！

1. 创建一个简单的模块，比如：`MyCounter`.

```move
module MyCounter {

     use StarcoinFramework::Signer;

     struct Counter has key, store {
        value:u64,
     }
     public fun init(account: &signer){
        move_to(account, Counter{value:0});
     }
     public fun incr(account: &signer) acquires Counter {
        let counter = borrow_global_mut<Counter>(Signer::address_of(account));
        counter.value = counter.value + 1;
     }

     public(script) fun init_counter(account: signer){
        Self::init(&account)
     }

     public(script) fun incr_counter(account: signer)  acquires Counter {
        Self::incr(&account)
     }

}
```

源文件位于 [my-counter](https://github.com/starcoinorg/guide-to-move-package-manager/tree/main/my-counter)

2. 编译模块

修改模块地址：
- 编辑`Move.toml`
- MyCounter = "0xABCDE" 改为 MyCounter = "0xb19b07b76f00a8df445368a91c0547cc"

在控制台中，运行：

```bash
$ mpm release

Packaging Modules:
         0xb19b07b76f00a8df445368a91c0547cc::MyCounter
Release done: release/my_counter.v0.0.1.blob, package hash: 0xa7e3c02c102c85708c6fa8c9f84064d09cf530b9581278aa92568d67131c3b6d
```

它将编译模块，您将获得二进制包
3. 导入  0xb19b07b76f00a8df445368a91c0547cc 账号.

```bash
starcoin% account import -i 0x05c9d09cd06a49e99efd0308c64bfdfb57409e10bc9e2a57cb4330cd946b4e83 -p my-pass 
{
  "ok": {
    "address": "0xb19b07b76f00a8df445368a91c0547cc",
    "is_default": false,
    "is_readonly": false,
    "public_key": "0x7932502fa3f8c9bc9c9bb994f718b9bd90e58a6cdb145e24769560d3c96254d2",
    "receipt_identifier": "stc1pkxds0dm0qz5d73zndz53cp28esyfj4ue"
  }
}
```

4. 部署模块 
获得 devnet 测试币
```bash
dev get-coin 0xb19b07b76f00a8df445368a91c0547cc
```
解锁帐户
```bash
account unlock 0xb19b07b76f00a8df445368a91c0547cc -p my-pass
```
```bash
starcoin% dev deploy /guide-to-move-package-manager/my-counter/release/my_counter.v0.0.1.blob -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0xeb055894f0c4440608246825c238a36683a8a0ad57144e905a12398a02ce806b submitted.
{
  "ok": {
    "dry_run_output": {
      "events": [],
      "explained_status": "Executed",
      "gas_used": "7800",
      "status": "Executed",
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "json": {
                "fee": {
                  "value": 292331
                }
              },
              "raw": "0xeb750400000000000000000000000000"
            }
          }
        },
  .....
  ....
}
```

5. 调用 init_counter 脚本函数来初始化资源

```bash
starcoin% account execute-function --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::init_counter -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0x0f67bab5ee5ceeb9c2fe4ffeed9ab6b79f2869e922862ec40dba8aa7787709b1 submitted.
{
  "ok": {
    "dry_run_output": {
      "events": [],
      "explained_status": "Executed",
      "gas_used": "11667",
      "status": "Executed",
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "json": {
                "fee": {
                  "value": 23334
                }
              },
              "raw": "0x265b0000000000000000000000000000"
            }
          }
        },
  .....
  .....
}

```

6. 查看资源

```bash
starcoin% state get resource 0xb19b07b76f00a8df445368a91c0547cc 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
{
  "ok": {
    "json": {
      "value": 0
    },
    "raw": "0x0000000000000000"
  }
}
```

7. 调用 incr_counter 递增计数器

```bash
starcoin% account execute-function --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::incr_counter -s 0xb19b07b76f00a8df445368a91c0547cc -b
txn 0x7e8d6189c144c7640cbd79617247c0e242f52df6d60c74c29250492077b1b690 submitted.
{
  "ok": {
    "dry_run_output": {
      "events": [],
      "explained_status": "Executed",
      "gas_used": "17231",
      "status": "Executed",
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "json": {
                "fee": {
                  "value": 34462
                }
              },
              "raw": "0x9e860000000000000000000000000000"
            }
          }
        },
    ......
    ......
}
```

8. 再次查看资源

```bash
starcoin% state get resource 0xb19b07b76f00a8df445368a91c0547cc 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
{
  "ok": {
    "json": {
      "value": 1
    },
    "raw": "0x0100000000000000"
  }
}
```

你现在可以看到计数器的值是 1。

9. 使用另一个帐户再次初始化和增加计数器

假设新账户地址为 0x0da41daaa9dbd912647c765025a12e5a

```bash
starcoin% account execute-function -s 0x0da41daaa9dbd912647c765025a12e5a  --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::init_counter -b
starcoin% contract get resource 0x0da41daaa9dbd912647c765025a12e5a 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
starcoin% account execute-function -s 0x0da41daaa9dbd912647c765025a12e5a  --function 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::incr_counter -b
starcoin% contract get resource 0x0da41daaa9dbd912647c765025a12e5a 0xb19b07b76f00a8df445368a91c0547cc::MyCounter::Counter
```