---
title: Function Test使用指南
weight: 20
---

Functional Test使用指南

<!--more-->

## Funtional Test

Functional Test是一个Move的测试工具。

* 查看[介绍](https://www.diem.com/en-us/blog/how-to-use-the-end-to-end-tests-framework-in-move/)
* 查看[例子](https://github.com/starcoinorg/starcoin/tree/master/vm/functional-tests/tests/testsuite)
* 查看[源代码](https://github.com/starcoinorg/starcoin/tree/master/vm/functional-tests/src)



## 使用指南

### 全局配置

配置参数由`account:`开头,后续参数按顺序配置,参数间只能用`,`分割，注意余额和币类型是一个参数，用空格分割。

| 参数 | 说明                    | 是否必须 |
| ---- | ----------------------- | -------- |
| 1    | 昵称                    | Y        |
| 2    | 指定测试地址,必须0x开头 | N        |
| 3    | 余额 币类型,默认为STC   | N        |
| 4    | SequenceNumber          | N        |

```
//! account: alice, 0x07fa08a855753f0ff7292fdcbe871216, 10000 0x1::STC::STC, 100

//! account: bob, 10000 0x1::STC::STC
```



### 出块模拟 block-prologue

```
//! block-prologue

//! new-transaction

//! author: genesis 

//! block-number: 2

//! block-time: 87000000
```

| 参数         | 说明                              |
| ------------ | --------------------------------- |
| author       | 出块用户                          |
| block-number | 块号                              |
| block-time   | 出块时间,会影响Timestap获取的时间 |



### 交易配置表

```
//! new-transaction

//! sender: alice

//! max-gas: 20000

//! sequence-number:100
```

| 参数            | 说明           |
| --------------- | -------------- |
| new-transaction | 是否开启新交易 |
| sender          | 交易发起用户   |
| args            | 参数           |
| max-gas         | 最大gas        |
| gas-price       | gas价格        |
| sequence-number | 序列号         |
| expiration-time | 过期时间       |



### Directives Check

```
// check: EXECUTED

or

// check: Abc

or

// check: not EXECUTED
```



## 注意事项

1. use时不支持写{{address}}语法，例如

```
//! new-transaction

//! sender: alice

address alice = {{alice}}; //执行成功

address liquidier = {{liquidier}};

script {

    use alice::TokenMock::{Usdx};  //正常执行

    use {{alice}}::TokenMock::{Usdx}; //会报错

    fun do_test(){

       xxx;

    }

 }
```



2. 每个new-transaction会开启一个交易，同时在VM的输出中有对应的交易执行全过程，排查问题可以依据交易的顺序定位到交易的位置。