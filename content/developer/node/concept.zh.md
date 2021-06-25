+++
title = "关键概念"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
author = "Tim"
+++

<br />

## 交易

交易SignedUserTransaction是Starcoin区块链的基本概念，是用户跟链打交道的入口。用户通过客户端提交签名后的交易，更新链上的账本状态。

签名交易包括Authenticator和RawUserTransaction两部分，如图所示：

![Transaction](/img/key_words/Transaction.png)

其中，Authenticator有Ed25519和MultiEd25519两种方式。

RawUserTransaction则包括以下内容：

- **sender** —— 发送地址，16字节，交易发送者的账户地址
- **sequence_number** —— 序列号，8字节，一个无符号整数，必须等于发送者账户下存储的序列号
- **expiration_timestamp_secs** —— 过期时间， 8字节，交易失效的时间
- **chain_id** —— 网络标识，1字节，区分不同网络
- **max_gas_amount** —— 最大Gas数，8字节
- **gas_unit_price** —— Gas单位，8字节
- **gas_token_code** —— 支付Gas的Token，默认STC，长度与Token有关
- **payload** —— 交易数据，包含3种类型（Script、ScriptFunction、Package），长度不确定
  - Script：自定义智能合约脚本
  - Package：部署和更新智能合约
  - ScriptFunction：调用智能合约的script function




## 区块头

区块头BlockHeader表示了当前区块包含的所有交易执行完之后，链所处的状态。BlockHeader是Starcoin区块链的核心概念，包含了重要的数据。

![BlockHeader](/img/key_words/BlockHeader.png)

图中各字段表示的意思如下：

- **parent_hash** —— 父区块哈希， 32字节，通过引用父区块哈希的方式，把所有区块链起来
- **timestamp** —— 时间戳，8字节
- **number** —— 区块高度，8字节，在父区块的高度上递增
- **author** —— 矿工签名，16字节
- **author_auth_key** —— 矿工的auth_key，32字节，可选，用于第一次创建矿工的链上账号
- **txn_accumulator_root** —— 当前区块的所有交易执行完之后，交易的Merkle累加器root，32字节，参看[默克尔累加器](#默克尔累加器)
- **block_accumulator_root** —— 父区块的Merkle累加器root，32字节，参看[默克尔累加器](#默克尔累加器)
- **state_root** —— 当前区块的所有交易执行完之后，全局状态树root，32字节，参看[全局状态树](#全局状态树)
- **difficulty** —— 当前区块的最小难度，32字节
- **body_hash** —— 当前区块的BlockBody的哈希，32字节
- **gas_used** —— 当前Block的所有交易消耗的总Gas，8字节
- **chain_id** —— 网络标识，1字节，区分不同网络
- **nonce** —— 计算出来的nonce，4字节
- **extra** —— 区块头的扩展数据，4字节



## 区块

区块Block包含了一批有序的交易，并且也包括了这些交易按顺序执行之后的状态。区块是Starcoin区块链的核心概念，如图所示：

![Block](/img/key_words/Block.png)

Block包含了BlockHeader和BlockBody。其中BlockBody包含了两部分：

- **uncles** —— 叔块BlockHeader数组，可选，参看[区块头](#区块头)
- **transactions** —— 交易数组，参看[交易](#交易)



## 全局状态树

全局状态树GlobalStateTree存储了链上所有用户账号的状态。Starcoin区块链使用双层的稀疏默克尔树SparseMerkleTree作为状态树，如下图所示：

![SparseMerkleTree](/img/key_words/State.png)

上图红圈表示叶子节点，蓝圈表示中间节点，绿色正方块表示占位符（表示子树下没有任何数据）。

由于Starcoin账号既存储状态数据，也存储代码数据，所以通过两层三个稀疏默克尔树来存储所有状态：

* AccountTree：账号树，Root是BlockHeader的state_root
* StateTree：状态树
* CodeTree：代码树

如图中所示，如果要证明b账号的状态有效，Proof是acd。



## 默克尔累加器

默克尔累加器MerkleAccumulator是Starcoin区块链另一个核心数据结构，用于提供区块和交易的证明。它的结构如图所示：

![MerkleAccumulator](/img/key_words/Proof.png)

MerkleAccumulator是一个叶子节点可以从左到右不断增加，从而不断累加的默克尔累加器。

Starcoin区块链设计了两个默克尔累加器，分别是区块默克尔累加器和交易默克尔累加器。上图红圈表示叶子节点，对应区块默克尔累加器就是指区块，对应交易默克尔累加器就是指交易；蓝圈表示中间节点。所以Starcoin区块链可以非常方便的给区块或者交易提供证明，例如，上图中叶子节点B的Proof是CAD。

