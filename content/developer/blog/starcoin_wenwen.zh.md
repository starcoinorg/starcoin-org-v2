---
title: Starcoin生态再提速，StableCoin赛道又添新成员，快来体验WEN吧
weight: 40
---

```
* 本文由Starcoin社区原创
```

最近两年，随着DeFi的高速发展，DEX、StableCoin等DeFi赛道也持续高歌猛进，StableCoin赛道不断涌现出很多优质的项目。

Starcoin生态，也迎来了多个Move实现的优质StableCoin协议，例如前面介绍过的FAI。本文将介绍另一个StableCoin赛道的协议——WEN协议。

WEN协议是完全通过Move实现的，代币的中文名叫稳稳币，目前已经部署到Starcoin的Barnard测试网络。



## 选择正确的网络

先设置StarMask的网络。如果是主网，就选择Starcoin Main。本文是在Barnard测试网进行体验，所以将StarMask的网络设置成Barnard Test Network。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gye61nfu86j30jg0q0abf.jpg" alt="0" style="zoom:33%;" />

## 保证StarMask有充足的STC

StarMask有足够的STC才能进行后面的FAI操作。本文是在Barnard网络进行测试，所以需要通过Starcoin的水龙头申请测试需要的STC。如果是主网，则需要用户自己往钱包账户充钱。



### 1. 水龙头

从Starcoin官网找到Barnard网络的水龙头。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gye6glipulj30u00vejt4.jpg" alt="starcoin_faucet" style="zoom:20%;" />



### 2. 复制账户地址

从StarMask复制自己的账户地址。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gye6hknah3j30j409kaad.jpg" alt="barnard_address_copy" style="zoom:33%;" />



### 3. 申请测试STC

将第2步的账户地址，填写到第1步打开的Starcoin水龙头，去申请Barnard测试网的STC。

这里需要注意的是，为了防止恶意申请，水龙头网站需要绑定推特账户进行申请。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gye6gm0bcvj31v40ro0wl.jpg" alt="starcoin_barnard" style="zoom:25%;" />

## 首次使用WEN

首次使用WEN，有一些简单的初始化工作。

### 1. 官网首页
点击进入[稳稳币官网](https://wenwen.money/)。如图，红色箭头标识有两个入口稳稳币的体验入口。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhxfspbdij321d0u0426.jpg" alt="wen_1" style="zoom:25%;" />

### 2. 连接钱包

进入到稳稳币的页面后，点击右上角的`Connect Wallet`，连接StarMask。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhxxw1gn6j320w0jy406.jpg" alt="wen_2" style="zoom:25%;" />

### 3. 选择钱包

在弹框中选择对应的浏览器插件钱包，这里选择StarMask。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhyaumzwrj30wk0modgm.jpg" alt="wen_3" style="zoom:25%;" />

## 质押 & 借贷

连上钱包之后，进入借贷页面，进行质押和借贷操作。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhyu9rulqj321g0lajt3.jpg" alt="wen_4" style="zoom:25%;" />

### 1. 质押借贷

在稳稳币中，这两步操作既可以在一个交易中完成，也可以分开到两个交易中完成。

第①步，点击`Borrow`按钮，进入到借贷功能。

第②步，输入质押的STC数量，或者点击`Max`按钮，质押所有STC。

第③步，输入借贷的WEN数量，这里需要注意的是：

* 最多能借贷的WEN数量
* 不同的数量，导致的Position Health不一样，爆仓风险也不一样

第④步，唤起StarMask钱包，发交易。

第②和③步都不是必须的，那意味着将质押和借贷拆成两个不同的交易。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyoj2p2f28j310u0qowg5.jpg" alt="starcoin_wen_6" style="zoom:45%;" />

### 2. 发起链上交易

这步是StarMask内的操作，对交易进行签名确认，然后将交易上链。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyy36ckgwoj31ae0u0goi.jpg" alt="wen_7" style="zoom:33%;" />

### 3. Balance变更

交易上链之后，WEN账户的balance会改变。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhzb84chzj313w0kqdg7.jpg" alt="wen_8" style="zoom:50%;" />



## 归还 & 提款

借WEN之后，也可以在未来的某个时刻归还，并将STC从WEN账户中提走。

### 1. 归还提款

在稳稳币中，这两步操作既可以在一个交易中完成，也可以分开到两个交易中完成。

第①步，点击`Repay`按钮，进入到归还功能。

第②步，输入归还的WEN数量，或者点击`Max`按钮，归还所有的WEN。

第③步，输入提取的STC数量，或者点击`Max`按钮，提取所有的STC。

第④步，唤起StarMask钱包，发交易。

第②和③步都不是必须的，那意味着将归还和提款拆成两个不同的交易。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhzg5t6hzj31aj0u0q5a.jpg" alt="wen_9" style="zoom:40%;" />

### 2. 发起链上交易

这步是StarMask内的操作，对交易进行签名确认，然后将交易上链。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyisshxykkj31710u0goe.jpg" alt="wen_10" style="zoom:45%;" />

### 3. Balance变更

交易上链之后，WEN账户的balance会改变。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyit0ubnqjj313m0lijrr.jpg" alt="wen_11" style="zoom:50%;" />



## Starcoin & WEN

WEN已经在Barnard网络部署，感兴趣的可以先去体验一下。WEN协议的操作性比较好，目前在进行下一步的升级，增加更多的流动性和更丰富的特性。

Move是专门针对金融场景设计的智能合约语言，有良好的安全性。Starcoin是首个支持智能合约语言Move的无许可公链，所以Starcoin必将在DeFi领域大有可为。WEN协议作为Move在StableCoin赛道的代表性项目之一，非常值得期待。
