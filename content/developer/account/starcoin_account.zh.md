---
title: Starcoin账户说明
weight: 2
---

区块链发展至今，有两种不同的记账模型：UTXO和Account。UTXO具备无状态等特点，而面对日益强烈的个性化业务需求，表达能力比较差；Account模型则具有可编程的优势，能够通过智能合约语言改变用户的链上状态。Starcoin在继承Account模型的基础上，有一些特别的设计，通过智能合约语言Move对链上账户进行记账操作，让用户的数据更加安全。

## 地址不再需要激活

Starcoin支持两种初始化账户的方式：

	1. 主动初始化链上账户，激活地址；

  2. 被动初始化链上账户，地址不再需要激活；

下图展示了通过Starcoin钱包主动创建一个Account的完整流程：

![starcoin_account_1.png](/img/account/starcoin_account_1.png)

1. 生成助记词（Mnemonic）：Starcoin钱包遵循BIP32、BIP39、BIP44规范，能非常可靠地生成助记词，管理钱包账户。
2. 生成秘钥对（Private Key，Public Key）：Starcoin密钥使用 Ed25519 curve 及 PureEdDSA scheme 生成，见 RFC 8032。
3. 生成认证密钥（Authentication Key）：SHA3-256(Public key | 0x00)，其中 | 为连接。0x00 是一个 1bytes 的标识符，表示单签。后面会详细介绍。
4. 生成帐户地址（Address）：Authentication Key的后16字节。
5. 生成收款识别码（Receipt Identifier）：详情参看 [sip-21](https://starcoin.org/en/developer/sips/sip-21/)。

在上面创建账户的流程中，紫色虚线表示链上账户初始化的过程，也就是激活链上地址。这是主动初始化账户的方式，要求必须有Authentication Key才能初始化链上账户。在用户习惯使用Address的情况下，这种方式增加了操作的复杂度，也增大了用户的理解成本。使用这种方式初始化的链上账户Account可以简单的理解为Address + Authentication Key，如图：

![starcoin_account_2](/img/account/starcoin_account_2.png)

2021年6月15日，Starcoin完成主网启动以来的首次升级。这次升级包含多个优化（[提案详情](https://starcoin.org/zh/news/post/starcoin_stdlib_upgrade_v5/)），其中一个非常重要的更新，就是新增了被动初始化账户的方式，地址不再需要激活，简化账户的初始化过程。用户可以在只知道Address（不知道Authentication Key）的情况下，初始化账户。这种方式符合用户的操作习惯，降低了操作的成本，同时，对用户屏蔽了Authentication Key的细节。一个典型的应用场景，给一个链上不存在的Address转账。使用这种方式初始化的链上账户Account可以简单的理解为Address + Default Authentication Key，如图：

![starcoin_account_4](/img/account/starcoin_account_4.png)

从主动方式升级到被动方式，地址不再需要激活。虽然Authentication Key被设置成了默认值0000000000000000000000000000000000000000000000000000000000000000，但是在未来的某个时刻（当前账户主动发起的第一个交易上链时）会被设置成正确的值。现在，Starcoin用户完全可以自由地选择任何一种方式来初始化链上账户。

## Authentication Key的作用

在上面的流程中，并没有体现出Authentication Key的作用，实际上，Authentication Key的作用是验证交易。如图：

![starcoin_account_3](/img/account/starcoin_account_3.png)

在交易的验证阶段，交易包含的Authentication Key必须等于该账户链上保存的Authentication Key，也就是说，交易才能继续往下执行。实际上，Public Key也能达到这个目的，之所以增加Authentication Key，这要从Starcoin的Account说起。Starcoin的Account有一些独特的地方，其中一个非常有意思的设计是Account本身不区分单签账户和多签账户。Starcoin的多签是在钱包里进行的，使用Public Key数组（单签账户可以理解为只有1个元素的数组）计算出Address，如图：

![starcoin_account_6](/img/account/starcoin_account_6.png)

所以，在没有Authentication Key的情况下，链上账户Account可以简单的理解为Address + Public Key Array，如图：

![starcoin_account_7](/img/account/starcoin_account_7.png)

而Public Key数组长度是不固定的，这会增加Account存储空间，也会增加交易验证的复杂性，所以，Starcoin的Account使用了固定长度的Authentication Key。这就是Authentication Key的作用和好处。总结起来，Authentication Key用于校验交易，优点是：

1. 固定长度；
2. 分离Account与多签逻辑；

## 首次设置Authentication Key

被动初始化账户方式，发生在账户A使用Address创建账户B的情况下，意味着账户B在链上不存在。所以只要在新的账户B上链第一个交易的时候，识别出Authentication Key的默认值，并且将它设置成正确的值，就能完全兼容整个流程，如图：

![starcoin_account_5](/img/account/starcoin_account_5.png)

图中绿线部分表示链上账户的Authentication Key为默认值的情况下，通过交易的Authentication Key计算出来的Address，必须等于该账户链上保存的Address，交易才能继续往下执行。在交易执行结束后，将正确的Authentication Key保存到该链上账户下，完成Authentication Key的设置。

## 推荐使用Address转账

前面提到一个典型的应用场景，给一个链上不存在的Address转账。

2021年6月15日的升级之前（[提案详情](https://starcoin.org/zh/news/post/starcoin_stdlib_upgrade_v5/)），由于Starcoin的账户必须先激活才能转账，而激活账户必须有Authentication Key，所以，为了兼容账户不存在的情况，设计了收款识别码（Receipt Identifier），包含了Address和可选的Authentication Key。

2021年6月15日的升级之后，Starcoin账户可以根据Address创建，不再需要激活。所以，即便是链上不存在的账户，也可以使用Address直接进行转账操作。

Starcoin建议用户使用更便捷的Adress转账（0x地址）。由于升级是兼容性升级，stc开头的地址也可以继续使用，但是不再推荐。