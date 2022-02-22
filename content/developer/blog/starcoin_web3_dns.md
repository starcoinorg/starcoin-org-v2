---
title: Explore the Web3 Ecological Infrastructure Based on Starcoin - Decentralized Domain Name System
weight: 45
---

```
* By Starcoin community 
```

![starcoin_web3](https://tva1.sinaimg.cn/large/008i3skNly1gyxyboyh4jj30tk0e8406.jpg)

## Web3.0

Beginning with the Bitcoin white paper published by Satoshi Nakamoto, a revolution in the Internet is happening quietly.

People are immersed in the development of the Internet ecology and enjoy the interaction of web2.0, various Internet ecology has gradually produced a more convenient mobile Internet ecology. However, with the improvement of the Internet ecology, various drawbacks have also been magnified. Because some Internet companies shut down some services, the user's effort in the company's product is completely invalid, and the user has no way to access the product. The company's compensation for the closed service has also become a test of conscience. Since the services of the web2.0 centralized network are relatively centralized, for example, in June 2021, Fastly was paralyzed due to a software vulnerability, and users could not connect to websites such as The New York Times, Twitch, Reddit, etc., the decentralized system can effectively Avoid a comprehensive crash caused by such a single point of failure.

However, with the development of decentralization, the advent of smart contracts has brought new opportunities. People can interact without trust through contracts, and use machine-fixed rules to constrain human interaction. Various ecosystems such as DAO (decentralized organization), DeFi (decentralized finance), stake stablecoins and algorithmic stablecoins, privacy and digital infrastructure, GameFi, etc. have been gradually developed.



## Decentralized Domain Name System

The Domain Name System (DNS) has become a basic part of the Internet. We no longer have to remember some IP addresses to access a certain website, with the upgrade of the website server, only the new IP address needs to be resolved and recorded in the Domain Name System. 

The domain name system can have different suffix names, which are generally used in different application scenarios. For example, org is generally used by non-profit organization, com is a global website, and there are some suffixes with special meanings for different country abbreviations, such as io, me, etc.

For us in the Web3.0 ecosystem, a decentralized domain name system is also very necessary. It can run on the contract and translate the decentralized wallet address which randomly composed of numbers and letters into domain names with suffix eth, stc, bit. Each domain name can be resolved to a fixed wallet address, most decentralized wallet addresses are long, difficult to remember, and have poor readability, errors are inevitable during use, and they may appear during transfers or withdrawals, the loss of assets is likely to be irretrievable in theory.

For Web2.0 Internet products, the mobile phone number or user name is generally used to log in to the website, but in Web3.0, it is necessary to log in through the wallet, and map the unreadable wallet addresses into domain names that can be easily read by humans, it is convenient to memory and share. 

Most decentralized domain name systems can not only resolve wallet addresses, but also support a variety of Web2.0 website or social account addresses, and other information can be easily obtained by calling the contract API, which can be relatively smooth to make users switch to the Web3 ecosystem.

![starcoin_dns](https://tva1.sinaimg.cn/large/008i3skNly1gyxydx7xq8j30ro0ecgn2.jpg)



## How to Implement a Decentralized Domain Name System on Starcoin

Starcoin uses Move as the contract language, which makes it impossible to be compatible with EVM ecologically. Although it cannot be quickly ported ecologically, it can be reimplemented using Move language.

The most different thing in the Move language is the processing way of resources. The resources of EVM will be stored in the corresponding contract, but the resources in Move are stored in the personal account. The advantage of this is that the user can clearly know the owner of the resource. But this will also have disadvantages, for example, when the domain name is resolved, it is necessary to check the owner of the domain name, however, since the resources are stored in the personal account, the contract cannot know which account the domain name is currently stored in, so it needs to use a public account (resolver role) to store the current owner of all domain names, so that the corresponding owner can be searched through the domain name, and then the domain name can be found from the owner's account.

The resources are stored in the user account, and the user can obtain the status and resolution of the current domain name through different methods such as block browsers or the official website of the domain name, so that the ownership is clear, and there will be no time-consuming in the EVM due to forgetting the asset contract address. When the domain name is added and resolved, the domain name in the current account is operated, and the result can be viewed in the block browser in real time, this experience is also better than that in EVM.

Another problem with domain names is the problem of expiration. In EVM, it is easy to modify the owner and expiration time, but in Move, the domain name is in the user's account, and the function of Move can be used to transfer the expired domain name. It cannot be destroyed and can only be transferred, and the expired domain name is transferred from the expired account to the newly registered account, which can also achieve the effect in EVM.

The resolution of the domain name can be done by RPC-API, and the search function is implemented by the contract, which can facilitate the domain name resolution of other systems.

![1643693979124](https://tva1.sinaimg.cn/large/008i3skNly1gyxygl7ycnj30vk0d4js4.jpg)



## Combined with the IdentifierNFT protocol in Stdlib

There are many NFT protocols in Starcoin's Stdlib. If the Domain Name System and IdentifierNFT are combined, the result is also very ideal. The IdentifierNFT protocol is mainly used as a special identifier, and the Domain Name System happens to be a special identifier that can be combined. It enables each user to bind a domain name of their own, so that it is very suitable for transactions on the chain or as a bridge between web2.0 and web3.0.

The characteristic of the IdentifierNFT protocol is that each user can only have one NFT of the same type, which also allows each person to have only one domain name, which can solve the problem of hoarding domain names to a certain extent and make decentralized domain names more decentralized. .

For the problem of registration by others after the domain name expires, it can also be specified in the contract that the domain name whose owner has expired can be taken out after the expiration, or the domain name resolution can be stopped.

The IdentifierNFT protocol supports a variety of NFT operations by default, such as withdrawal and deposit, authorization and revocation operations, etc.

Compared with the custom structure protocol, using the IdentifierNFT protocol will reduce many unnecessary problems. If the access and authorization problems mentioned above require a lot of code, Stdlib also has many other NFT protocols, which can meet different needs.

With the continuous improvement of the Starcoin ecosystem, it is believed that more Move developers will try and use the Move language to develop more interesting applications.
