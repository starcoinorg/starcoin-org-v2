---
title: Get Started with Starcoin 
weight: 29
---

~~~
* By WGB Starcoin community 
~~~



Development of blockchain in 2021 was rapid and many records were refreshed, and due to this result, some high-quality projects were launched this year. Starcoin's main network was launched on May 18, 2021. As a high-quality public chain project this year, there are many highlights in design. With Safer programming lauguage Move as Starcoin's smart contract language, and the design concept of linear logic makes DeFi more credible. Therefore, in the context of DeFi, the advanced concept of Starcoin will have great competitiveness and growth. From beginner to exporter, everyone can find your own way to use Starcoin.

## Starmask: Where You Should Begin

Get started with Starcoin quickly using Starmask wallet.

1. Install Starmask

   There are two ways to install Starmask.

   1. Download from Github(Recommended)

      Download through the official [Github repository](https://github.com/starcoinorg/starmask-extension/releases) to get the latest official version, and access and download anywhere.

   2. Download from Chrome web store

      Download from [Chrome web store](https://chrome.google.com/webstore/detail/starmask/mfhbebgoclkghebffdldpobeajmbecfk/related), but you need to ensure that you can use Chrome.

2. Initialize Starmask

   You need to initialize Starmask after completely installation. As shown in below figure, the Starmask wallet has two initialization methods,choose one that suits you.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxor8ncgjaj30s40hmaam.jpg" alt="starcoin_starmask" style="zoom:33%;" />

   - If there is already a wallet then import the already created using the *Import Wallet* button.

   - Click the *Create a Wallet* button if this is the first time creating a wallet.

     Tips:

     It is important to note that you must keep your mnemonic properly to avoid loss and theft. Click to view a [more detailed Starmask](https://github.com/starcoinorg/starmask-extension/blob/main/docs/en/how-to-install.md) installation and initialization tutorial.

3. Use Starmask

   It is easily to manage your own data on the Starcoin, such as STC, and easily operate accounts. If you are using Starmask wallet first time, you can check [the more detailed Starmask tutorial[text]](https://github.com/starcoinorg/starmask-extension/blob/main/docs/en/how-to-use.md) or [Starmask tutorial [video]](https://www.youtube.com/watch?v=VA1uVLmzuhQ) to master the common operations of Starmask: transfer, network management, private key management and so on.

   In addition to the usual wallet functions, Starmask can help you to do  more things:

   1. Participate in Starcoin community governance, [tutorial](https://www.youtube.com/watch?v=ut4WjdPDHrs);
   2. Show and view your own NFTs;
   3. Collect airdrops, [tutorials](https://www.youtube.com/watch?v=6wmABlTyg7E);
   4. Connect to the Starcoin ecosystem, such as kiko, etc.;

## Onekey Wallet, Another Choice

After installing Starmask, if you want to properly manage your account, consider a hardware wallet. Onekey is a hardware wallet that already supports STC. Here we will focus on the connection between Starmask and onekey to manage accounts.

1. Prepare environment

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotwg1j1kj315h0u0juf.jpg" alt="onekey_client" style="zoom:33%;" />

   Here you already learned Starmask and got the onekey wallet that supports STC. Then, download and install the client of the onekey wallet from here

2. Open Starmask and click your avatar to enter the account management page

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxoticum59j30oa13sab3.jpg" alt="starcoin_onekey_1" style="zoom:33%;" />

3. Click 'Connect Hardware Wallet' to connect with onekey wallet

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotkgka06j30nw14wgns.jpg" alt="starcoin_onekey_2" style="zoom:33%;" />

4. Click 'OneKey',then click 'Connect', start connecting.

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotl3kzjtj312j0u0abl.jpg" alt="starcoin_onekey_3" style="zoom:33%;" />

   

5. Click  'Authorize'

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotps5yo9j31lx0u0js7.jpg" alt="starcoin_onekey_4" style="zoom:33%;" />

6. Set Pin and click confirm

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotollny6j31hy0u0dhb.jpg" alt="starcoin_onekey_5" style="zoom:33%;" />

   

7. Click 'export'

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotpfxt5uj31gi0u075s.jpg" alt="starcoin_onekey_6" style="zoom:33%;" />

8. Choose account you want to save, then click 'unlock' to unlock account

    <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxotqctu7wj315u0u0jt5.jpg" alt="starcoin_onekey_7" style="zoom:33%;" />

9. Click 'export', onekey wallet has been set completely. 

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gxots0g6h5j31ho0u0jsg.jpg" alt="starcoin_onekey_8" style="zoom:33%;" />





## For Users who Has their Own Starcoin Node

We have introduced the Starmask in previous section, another way is to use a Starcoin node. Starcoin nodes have all the data, so having your own Starcoin nodes can do many things, commonly used operations, such as:

1. Create a poll;
2. Mint STC;
3. View the status of any account;

So,these users can consider building their own Starcoin node. Next, we will learn the installation, startup and use instructions of the node.

1. Install node

   There are multiple ways to install Starcoin ([View more details](https://starcoin.org/zh/developer/setup/install/))

   - Depending on different platform, download the corresponding binary code, Starcoin supports Windows, Mac and Linux at the same time, [download link](https://github.com/starcoinorg/starcoin/releases).
   - Compile source code into binary code, [tutorial](https://starcoin.org/zh/developer/setup/build/).
   - Install from Docker,[tutorial](https://starcoin.org/zh/developer/setup/run_by_docker/).

2. Start node from command line

   ```Shell
   starcoin -n dev -d ./data
   ```

   It is important to note here that Starcoin has designed several different networks depending on the goals, covering every stage of the development cycle. Includes Dev, Test, Halley, Proxima, Barnard, Main:

   - Dev: for local development
   - Test: for unit testing and integration testing
   - Halley: Always run the latest version of Stdlib, if Stdlib changes, the Genesis Block will be reset immediately to clean up the original data
   - Proxima: It is used for testing before Dapp release, and data will be cleared regularly
   - Barnard: It is used for testing before Dapp release. Data will not be deleted. Compatibility must be upgraded.
   - Main: Starcoin main network

   Before starting the Starcoin node, it is recommended to choose a appreciate network according to your own needs.

3. Console command line tutorial

   During the runtime of the Starcoin node, it is often necessary to connect to the node through the console and view the running status from command line. Starcoin provides a console command for connecting nodes, [user guide](https://starcoin.org/zh/developer/cli/console/), check the detailed console command tutorial from [here](https://starcoin.org/zh/developer/cli/).



## Senior User, Make contribution to Starcoin Community

As senior users,in addition to general usage,they will also deeply participate in Starcoin ecosystem, and make their contribution to development of Starcoin.

1. Code

   Starcoin is an open source community. Any developer can initiate an issue, submit a commit, and contribute source code to Starcoin through [Starcoin's code repository](https://github.com/starcoinorg) according to their own advantages. This is the most direct way.

2. Articles

   Even if you are not a developer, you can participate deeply by writing articles or making videos about Starcoin and Move, and let more people know Starcoin.

3. Development ecosystem

   Starcoin is an open public chain, and any individual or teams can deploy their own contracts. Starcoin uses Move as a smart contract. Move itself has unique advantages in NFT, DeFi and other fields. If you can master Move, design your own contract products and let more people know Starcoin and Move through your contracts.

   Through the above methods of participation, while promoting the development of Starcoin and obtaining first-hand Starcoin dynamics, you can also obtain STC Grants.

## Join Starcoin, Participate in Starcoin Ecosystem

We hope everyone no matter how do you participate in our ecosystem, you will get Starcoin bonus.

Through the following ways, join the Starcoin community, experience Starcoin, and keep latest developments of Starcoin. 

![starcoin_stc](https://tva1.sinaimg.cn/large/008i3skNly1gxovxqmamgj309k0e6q2z.jpg)

telegram：https://t.me/Starcoin_STC

discode：https://discord.com/invite/starcoin

twitter：https://twitter.com/starcoinstc

meduim：https://starcoin.medium.com/
