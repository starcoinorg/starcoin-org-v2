---
title: Starcoin生态升级，StarSwap初体验
weight: 30
---

~~~
* 本文由Starcoin社区原创
~~~

区块链发展到今天，DeFi是公链生态的必争之地。最近，Starcoin生态迎来了一大波DeFi项目。跨链桥Poly Network强势入驻，Stable Coin赛道的FAI已经落地，Starswap也即将起飞。Starswap已经在Starcoin的Barnard网络部署，即将上线主网。

Starswap包含两个核心的功能：Swap和流动性挖矿。Swap是在链上将一种Token兑换成另一种Token。流动性挖矿的作用是在去中心化交易池中提供某个交易对的流动性。本文教你如何抢鲜尝试Starswap。



## 选择正确的网络

先设置Starmask的网络。如果是主网，就选择Starcoin主网。本文是在Barnard测试网进行体验，所以将Starmask的网络设置成Barnard网络。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxybko6rqkj30j40igaaz.jpg" alt="starmask_1" style="zoom:33%;" />



## 保证Starmask有足够的STC

Starmask有足够的STC才能进行后面的swap等操作。本文是在Barnard网络进行测试，所以需要通过Starcoin的水龙头申请测试需要的STC。如果是主网，则需要用户自己往钱包账户充钱。



### 1. 水龙头

从Starcoin官网找到Barnard网络的水龙头。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyd72902zj30u00vemyw.jpg" alt="starcoin_faucet" style="zoom:33%;" />



### 2. 复制账户地址

从Starmask复制自己的账户地址。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyd93ve6lj30is09wwet.jpg" alt="barnard_address" style="zoom:33%;" />



### 3. 申请测试STC

将第2步的账户地址，填写到第1步打开的Starcoin水龙头，去申请Barnard测试网的STC。

这里需要注意的是，为了防止恶意申请，水龙头网站需要绑定推特账户进行申请。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxydahuttuj31v40ro0wl.jpg" alt="starcoin_barnard" style="zoom:25%;" />



## Swap交易

前面是准备工作，这里才进入正式的Starswap介绍。点击[Starswap体验入口](https://starswap.xyz)，进入首页。



### 1. 连接Starmask钱包

如图所示，点击连接自己的Starmask钱包。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxydmw7eloj31g00sqmyj.jpg" alt="starswap_0" style="zoom:25%;" />



### 2. 选择Token

选择一个想要swap的Token。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxye5mmodpj313n0u0400.jpg" alt="starswap_1" style="zoom:33%;" />

### 3. 假设选择了FAI

FAI是Starcoin生态的第一个stable coin，这以FAI为例。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxye90xl6wj30u017m40l.jpg" alt="starswap_2" style="zoom:33%;" />

### 4. Swap

这一步是真正使用STC换FAI。首先输入STC数量，会根据链上的兑换价格，换算成FAI的个数。然后点击Swap按钮，进行兑换。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyecd586tj313n0u0wgg.jpg" alt="starswap_3" style="zoom:33%;" />

### 5. 确认

这步主要是确认数量、滑点等交易细节，确认之后会调用Starmask。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyess0ye3j30u00yc76j.jpg" alt="starswap_4" style="zoom:33%;" />

### 6. 发起交易

这步会真正的发起链上交易，所以需要钱包确认、签名、发送交易。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyewhwro0j30zs0u0tao.jpg" alt="starswap_5" style="zoom:33%;" />

### 7. 交易上链

交易上链之后，关闭弹窗。到这里，Swap结束，这时候账户就有FAI的Token了。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyezz8shvj30u00v4abb.jpg" alt="starswap_6" style="zoom:33%;" />



## 流动性

通过上面的swap交易，账户有STC和FAI了。



### 1. 进入流动性页面

按如图①的操作，点击Pool进入流动性页面。如果没有连接Starmask，使用②连接Starmask。然后点击伞按钮添加流动性。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyf4ezlv9j31ia0eewfa.jpg" alt="starswap_7" style="zoom:33%;" />

### 2. 添加流动性

先选择LP对，这里以STC和FAI为例。通过①添加STC和FAI的数量，尽量按比例添加。然后点击Supply按钮，添加流动性。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyfl5jnobj30kr0rsgne.jpg" alt="starswap_8" style="zoom:33%;" />

### 3. 确认

这步主要是确认流动性交易细节，确认之后会调用Starmask。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyfp1cccej30u016rn0m.jpg" alt="starswap_9" style="zoom:33%;" />

### 4. 发起交易

这步会真正的发起链上交易，所以需要钱包确认、签名、发送交易。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyfunsayoj30r20rstaq.jpg" alt="starswap_10" style="zoom:33%;" />

### 5. 交易上链

等待交易确认结果，交易上链之后，关闭弹窗。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyfwnhs4vj30u016uwh2.jpg" alt="starswap_11" style="zoom:33%;" />

### 6. 添加流动性成功

添加流动性成功之后，列表页面能看到添加结果。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gxyfymkbh2j31w60j8dhd.jpg" alt="starswap_12" style="zoom:33%;" />



## Starcoin & Starswap

上面是Starswap进行Swap交易、流动性挖矿的操作教程。

Starswap是Starcoin生态的首个Swap，标志着Starcoin进入全新的DeFi时代。Starswap是Move合约，面向资源编程和面向泛型编程，从安全性和扩展性上来说，比Solidity更胜一筹。

相信会有越来越多的Move合约，Starcoin生态和Move生态都会越来越丰富。
