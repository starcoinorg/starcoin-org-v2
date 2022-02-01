---
title: Starcoin Track, FAI Guide
weight: 40
---

```
* By Starcoin community 
```

In the past two years, with the rapid development of DeFi, DeFi tracks such as DEX and StableCoin have also continued to make great progress, and many high-quality projects have emerged on the StableCoin track.

The Starcoin ecosystem has several high-quality StableCoin protocols implemented by Move, such as the FAI introduced earlier. This article will introduce another protocol on the StableCoin track - the WEN protocol.

The WEN protocol is completely implemented through Move. The token's Chinese name is Stablecoin, which has been deployed to Starcoin's Barnard test network. 



## Select the Correct Network

Set up StarMask's network first. If it is the main network, choose the Starcoin main network. In this article, we will use the Barnard test network, so set the StarMask network to the Barnard network.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gye61nfu86j30jg0q0abf.jpg" alt="0" style="zoom:33%;" />



## Ensure StarMask Has Enough STC

StarMask must have enough STC to perform subsequent operations FAI. Run test on the Barnard network, so you need to apply for the STC required for the test through the Starcoin faucet. In the case of the main network, users are required to top up their wallet accounts by themselves. 

1. ##### Faucet

   Find Barnard's Faucet on Starcoin official website

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gye6glipulj30u00vejt4.jpg" alt="starcoin_faucet" style="zoom:20%;" />

   

2. ##### Copy Account Address

   Copy your own account address from StarMask

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gye6hknah3j30j409kaad.jpg" alt="barnard_address_copy" style="zoom:33%;" />

   

3. ##### Apply for Test STC

   Fill in the account address in step 2 to the Starcoin faucet opened in step 1 to apply for STC on the Barnard testnet.

   It should be noted here that, in order to prevent malicious applications, the faucet website needs to bind a Twitter account to apply. 

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gye6gm0bcvj31v40ro0wl.jpg" alt="starcoin_barnard" style="zoom:25%;" />

## First Time to Use WEN

When first time using WEN, there is some simple initialization work.

1. ##### Visit WEN Official Website

   Click [this link](https://wenwen.money/) to visit WEN official website, the red arrows mark there are two experience entrances.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhxfspbdij321d0u0426.jpg" alt="wen_1" style="zoom:25%;" />

   

2. ##### Connect to StarMask Wallet

   Click "Connect Wallet" button on the right corner to connect your own StarMask wallet as shown. 

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhxxw1gn6j320w0jy406.jpg" alt="wen_2" style="zoom:25%;" />

   

3. ##### Select Wallet

   Select the corresponding explore plug-in wallet in the pop-up box, here select StarMask.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhyaumzwrj30wk0modgm.jpg" alt="wen_3" style="zoom:25%;" />

   



## Stake and Lending

After connecting to the wallet, enter the lending page to perform Stake and Lending operations.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhyu9rulqj321g0lajt3.jpg" alt="wen_4" style="zoom:25%;" />

1. ##### Stake and Lending

   In stablecoins, these two steps can be completed in one transaction or separated into two transactions.

   1: Click "Borrow" button, go to lending function.

   2: Enter the amount of STC Staked in the input box, or click the "Max" button to stake all STC in the current account.

   3: Enter the amount of STC needed to lending in the input box, it should be noted here:

   - Maximum amount of WEN that can be borrowed
   - Different quantities result in different Position Health and risk of liquidation. 

   4: Open StarMask wallet, initiate transaction.

   Steps 2 and 3 are not necessary, which means splitting the stake and lending into two different transactions.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyoj2p2f28j310u0qowg5.jpg" alt="starcoin_wen_6" style="zoom:45%;" />

   

   

2. ##### Initiate on-chain transactions

   This step is an operation in StarMask, sign the transaction,then to confirm the transaction, and then submit the transaction on the chain.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyy36ckgwoj31ae0u0goi.jpg" alt="wen_7" style="zoom:33%;" />

3. ##### Update Balance

   After the transaction is on the chain, the balance of the WEN account will change.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhzb84chzj313w0kqdg7.jpg" alt="wen_8" style="zoom:50%;" />



## Repay and Withdraw

After borrowing WEN, it can also be returned at some point in the future, and the STC can be withdrawn from the WEN account.

1. ##### Repay and Withdraw

   In stablecoins, these two steps can be completed in one transaction or separated into two transactions.

   1: Click "Repay" button, go to repay function.

   2: Enter the amount of WEN need to repay in the input box, or click the "Max" button to repay all WEN in the current account.

   3: Enter the amount of STC need to withdraw in the input box, or click the "Max" button to withdraw all STC in the current account.

   3:Open StarMask wallet to initiate a transaction.

   Steps 2 and 3 are not necessary, which means splitting the repay and withdraw into two different transactions.

   

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyhzg5t6hzj31aj0u0q5a.jpg" alt="wen_9" style="zoom:40%;" />

   

2. ##### Initiate on-chain transactions

   This step is an operation in StarMask, sign the transaction,then to confirm the transaction, and then submit the transaction on the chain. 

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyisshxykkj31710u0goe.jpg" alt="wen_10" style="zoom:45%;" />

   

2. ##### Update Balance

   After the transaction is on the chain, the balance of the WEN account will change.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gyit0ubnqjj313m0lijrr.jpg" alt="wen_11" style="zoom:50%;" />

   

## Starcoin and WEN

WEN has been deployed on the Barnard network, and you can experience it first if you are interested. The operability of the WEN protocol is relatively easy, and it is currently undergoing the next upgrade to add more liquidity and richer features.

Move is a smart contract language specially designed for financial scenarios and has high security. Starcoin is the first permissionless public chain that supports the smart contract language Move, so Starcoin will surely have a bright future in the DeFi field. As one of Move's representative projects on the StableCoin track, the WEN protocol is worth looking forward to. 

