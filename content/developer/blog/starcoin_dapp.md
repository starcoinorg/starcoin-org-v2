---
title: Starcoin & Dapp in action
weight: 13
---

## Starcoin and Dapp in Action

```
By Starcoin community, WGB 
```



## 1. Background of Dapp

With the continuous development of computer and Internet technology, from handphone to pager, from pager to mobile phone,until now smart wearables,we have been exploring portable interactive experiences. However,with the progress of  technology, people are seeking more functions, therefore, the functions of mobile phones have changed from communication devices at the beginning to multi-function devices with multimedia entertainment, communication and office.,all these functions are provided by App. Each software company has launched their own apps to provide services, and we have also experienced the convenience brought by technological advances. But, since the apps launched by various companies are centralized, this also leads to the fact that if software companies  do not run the App server or maintain the App due to various reasons , this will cause the App to be abandoned. If software companies shut down their server ,the data stored in the server will disappear permanently . If the information is game data, then you hard work  and valuable equipment and achievements will become "tears of the times".

But with the current blockchain technology, we can take advantage of  blockchain's immutable and permanent features to upgrade App to Dapp(Decentralized application), Dapps are created and run in a decentralized manner,even one blockchain has been forgotten, you still can own your data by running a node. In this article, we will learn how to develop one Dapp with Move language in Starcoin.



## 2. Dapp Development

From the structure perspective, Dapp has backend and frontend, Dapp's frontend is similar to the frontend of traditional app, but Dapp's backend is blockchain, this is different from traditional app. Traditional app is: frontend-API-database,Dapp is: frontend-smart contract-blockchain, so the main development of Dapp is the interaction of frontend interface. Here we have a official example: Starmask-test-dapp.

1. Preparation before developing the frontend interface

   1. Multiple account in Chrome

      If you need multiple  test account in you DEV environment, it's convenient to use Chrome's multiple account functionality. 

      ![Chrome多账户](https://tva1.sinaimg.cn/large/008i3skNly1gvlil0ehkqj60sw0m50u502.jpg)

   2. Install Starmask

      Login to your new account in Chrome, download .zip file and decompress this file, then install Starmask, or you can go to Chrome web store, search Starmask and install it. You can click click official document to read detailed installation guide.

      ###### Chrome Web Store

      ![Chrome商店安装](https://tva1.sinaimg.cn/large/008i3skNly1gvliln22obj60sx0eugmh02.jpg)

      ###### Decompress file 

      ![解压方式安装](https://tva1.sinaimg.cn/large/008i3skNly1gvlim69q5rj613w0fu76o02.jpg)

   3. Create new account

      After installing Starmask, you can create or import account,then you can use your new account to develop or debug.

      ![成功创建账户](https://tva1.sinaimg.cn/large/008i3skNly1gvlimjegpyj60lc0h8wf202.jpg)

2. StarMask

   Dapp depends on blockchain, but since the interaction with blockchain requires private keys to do signatures and other operations, so most of Dapps won't get private keys directly, prefer to use a middleware plug-in wallet, to manage user's secret key,so that Dapp won't obtain user's private key. When users need to interact with blockchain,the wallet plug-in initiates a confirmation request to users, users need to respond to this request, after this process, the wallet plug-in will send signed transaction to the blockchain for interaction, if this transaction is rejected, the Dapp will get rejection information.

   Starcoin's wallet plug-in is offical wallet plug-in StarMask, this plug-in can help us to securely store and use our accests.

   StarMask has a similar architecture to MetaMask, and provides a global variable similar to web3 so that the JavaScript SDK can easily interact with the wallet plug-in.

   ###### MetaMask structure

   ![MetaMask架构图](https://tva1.sinaimg.cn/large/008i3skNly1gvline5wmkj60ag0k1dgs02.jpg)

   ###### Starcoin's Gloabal Variable

   ![Starcoin全局变量](https://tva1.sinaimg.cn/large/008i3skNly1gvliohadwzj613r0nojvn02.jpg)

   1. StarMask's dependency library

      StarMask is official and open source wallet plug-in, it's programming language is JavaScript, below figure show its dependency library

      ![StarMask依赖库](https://tva1.sinaimg.cn/large/008i3skNly1gvlip0csi6j60ql0k1q4m02.jpg)  

   

3. Official Example: Starmask-test-dapp

   Starcoin, same with Ethereum, also provides a JavaScript SDK, which can be used to develop front-end webpages. We also provides a official Dapp example, which can test the wallet link, send STC, call contract, cast example NFT, and verify the signature ., etc. commonly used functions have been covered , the source code is also open source on Github, we can develop Dapp based on this example.

   ###### Official Example Dapp

   Entry Link: https://starmask-test-dapp.starcoin.org/

   GitHub repository: https://github.com/starcoinorg/starmask-test-dapp

   <img src="https://tva1.sinaimg.cn/large/008i3skNly1gvliph3e3hj612s0lemzg02.jpg" alt="Dapp-test" style="zoom:40%;" />

4. Starmask-test-dapp Analysis 

   We can analyse the function and process of Starmask-test-dapp during development, and learn the process of Dapp development and the use of code in this procedure. The overall development process and code are similar to those on Ethereum. If you have development experience on Ethereum,it's really easy to develop on Starcoin.

   1.  Starmask-test-dapp dependency library

      The main libraries: starmask-onboarding、starmask-forwarder and starcoin.js

      starmask-onboarding: it's used to to detect whether StarMask is installed, if not, you can click the button to jump to the installation, if it is already installed, it can be displayed as "click to connect to the wallet".

      starcoin.js: it's use to interact with blockchain,covert format, it's main library during development of Dapp.

      ![test-dapp](https://tva1.sinaimg.cn/large/008i3skNly1gvliq0t228j60rr07zdgc02.jpg)

   2. Brief Function Analysis

      Main operations in Starmask-test-dapp are connecting wallet, obtaining chain information, obtaining accounts, requesting permissions, signing and verifying, sending transactions, deploying and calling contracts.

      ###### Connect Wallet

      This is the first step to use one Dapp, connect Dapp to Starmask, then the Dapp can perform subsequent operations.

      ###### Obtain chain information

      To check whether the current chain is the main network, test network or local network

      ###### Obtain Account

      To get the connected account

      ###### Request permission

      If you have multiple accounts in StarMask, after connecting, switch between accounts through requesting permission function.

      ###### Signature and verification

      It's used to sign information fragments, and also can verify the signer of the information

      ###### Send transaction

       It's generally used to send STC

      ###### Deployment contract

      The contract can be deployed in bytecode, without the need to synchronize the main network or test network

      ###### Call contract

      Call the contract on the Dapp, which is the main way of interaction between the Dapp and the blockchain

   3. Brief Function Analysis

      1. Connect Wallet

         In Starmask-test-app, connect StarMask by the following code,call stc_requestAccounts by global variable starcoin to connect wallet

         ```javascript
         const onClickConnect = async () => {
             try {
               const newAccounts = await window.starcoin.request({
                 method: 'stc_requestAccounts',
               })
               handleNewAccounts(newAccounts)
             } catch (error) {
               console.error(error)
             }
           }
         ```

      2. Obtain Blockchain Information

         In Starmask-test-app,obtain blockchain information by the following code,call chain.id by global variable starcoin

         ```javascript
         async function getNetworkAndChainId() {
             try {
                 const chainInfo = await window.starcoin.request({
                 method: 'chain.id',
                 })
                 handleNewChain(`0x${chainInfo.id.toString(16)}`)
                 handleNewNetwork(chainInfo.id)
             } catch (err) {
                 console.error(err)
             }
         }
         ```
      
      3. Obtain Account
      
         In Starmask-test-app,obtain account by the following code,call stc_accounts by global variable starcoin
      
         ```javascript
         getAccountsButton.onclick = async () => {
               try {
                 const _accounts = await window.starcoin.request({
                   method: 'stc_accounts',
                 })
                 getAccountsResults.innerHTML = _accounts[0] || 'Not able to get accounts'
               } catch (err) {
                 console.error(err)
                 getAccountsResults.innerHTML = `Error: ${err.message}`
               }
             }
         ```
      
      4. Request Permission
      
         In Starmask-test-app,request permission by the following code,call wallet_requestPermissions by global variable starcoin
      
         ```javascript
         const permissionsArray = await window.starcoin.request({
                   method: 'wallet_requestPermissions',
                   params: [{ stc_accounts: {} }],
         })
         ```
      
      5. Signature and Verify
      
         In Starmask-test-app,signature and verify by the following code,call personal_sign  by global variable starcoin to verify, use tools in starcoin.js to verify signature address
      
         signature:
      
          
      
         ```javascript
         const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
                 console.log({ msg })
                 const networkId = networkDiv.innerHTML
                 const extraParams = { networkId }
                 const sign = await window.starcoin.request({
                   method: 'personal_sign',
                   // params: [msg, from, 'Example password'],
                   // extraParams = params[2] || {}; means it should be an object:
                   // params: [msg, from, { pwd: 'Example password' }],
                   params: [msg, from, extraParams],
                 })
         ```
      
         verify:
      
         ```javascript
         const from = accounts[0]
         const sign = personalSignResult.innerHTML
         const recoveredAddr = await utils.signedMessage.recoverSignedMessageAddress(sign)
         console.log({ recoveredAddr })
         ```
      
         
      
      6. Send Transaction
      
         In Starmask-test-dapp,send transaction by the following code,pack amount and payee information into the transaction,then send it. 	
      
         ```javascript
         const sendAmount = parseFloat(document.getElementById('amountInput').value, 10)
               if (!(sendAmount > 0)) {
                 // eslint-disable-next-line no-alert
                 window.alert('Invalid sendAmount: should be a number!')
                 return false
               }
               const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
               const sendAmountSTC = new BigNumber(String(document.getElementById('amountInput').value), 10)
               const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER)
               const sendAmountHex = `0x${sendAmountNanoSTC.toString(16)}`
               console.log({ sendAmountHex, sendAmountNanoSTC: sendAmountNanoSTC.toString(10) })
         
               const txParams = {
                 to: toAccount,
                 value: sendAmountHex,
                 gasLimit: 127845,
                 gasPrice: 1,
               }
         
               const expiredSecs = parseInt(document.getElementById('expiredSecsInput').value, 10)
               console.log({ expiredSecs })
               if (expiredSecs > 0) {
                 txParams.expiredSecs = expiredSecs
               }
         
               console.log({ txParams })
               const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
         ```
      
      7. Deploy Contract
      
         In Starmask-test-dapp,deploy contract by the following code,first, compile code to bytecode package on local,then put it into Starmask-test-dapp, send the transaction after grouping the package, then the contract can be deployed
      
         ```javascript
         onst packageHex = contractPayloadhex.value
                 const transactionPayloadHex = encoding.packageHexToTransactionPayloadHex(packageHex)
                 transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction({
                   data: transactionPayloadHex,
                 })
         ```
      
      8. Call Contract 
      
         In Starmask-test-dapp, the contract is called in the following two ways. Contracts that do not require signatures can be called through Call, and contracts that require signatures need to be called by grouping and sending transactions.
      
         Contracts that do not require signatures:
      
         ```javascript
         const result = await starcoinProvider.call({
                   function_id: `${accounts[0]}::ABC::token_address`,
                   type_args: [],
                   args: [],
                 })
         ```
      
         Contracts that require signatures :
      
         ```javascript
         const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
                 const sendAmountSTC = new BigNumber(String(document.getElementById('amountInput').value), 10)
                 const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER)
                 const sendAmountHex = `0x${sendAmountNanoSTC.toString(16)}`
         
                 // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
                 const amountSCSHex = (function () {
                   const se = new bcs.BcsSerializer()
                   // eslint-disable-next-line no-undef
                   se.serializeU128(BigInt(sendAmountNanoSTC.toString(10)))
                   return hexlify(se.getBytes())
                 })()
                 console.log({ sendAmountHex, sendAmountNanoSTC: sendAmountNanoSTC.toString(10), amountSCSHex })
         
                 const args = [
                   arrayify(toAccount),
                   arrayify(amountSCSHex),
                 ]
         
                 const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args)
                 console.log(scriptFunction)
         
                 // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
                 const payloadInHex = (function () {
                   const se = new bcs.BcsSerializer()
                   scriptFunction.serialize(se)
                   return hexlify(se.getBytes())
                 })()
                 console.log({ payloadInHex })
         
                 const txParams = {
                   data: payloadInHex,
                 }
         
                 const expiredSecs = parseInt(document.getElementById('expiredSecsInput').value, 10)
                 console.log({ expiredSecs })
                 if (expiredSecs > 0) {
                   txParams.expiredSecs = expiredSecs
                 }
         
                 console.log({ txParams })
                 const transactionHash = await starcoinProvider.getSigner().sendUncheckedTransaction(txParams)
         ```

5. Develop Tool - Postman

   When you need to interact with backend from frontend,we usually need to debug contract's call. Take Postman as an example for Starcoin contract call debugging, after forking collection is in your workspace, you can easily use the API to interact with the contract or debug by adding network information such as Main, barnard, and localhost.

   1. Fork Collection

      In official website, find [Postman guide page](https://starcoin.org/en/developer/rpc/postman_document/),then click Run in Postman button,fork Starcoin's API to your own workspace.

      <img src="https://tva1.sinaimg.cn/large/008i3skNly1gvliqmd4rkj60ru0kcdhr02.jpg" style="zoom:50%;" />

      Postman 

   2. Add Environment Json File

      In official website, find [Postman guide page](https://starcoin.org/en/developer/rpc/postman_document/),scroll down to the bottom of this page, you can find links,copy each link and add to Postman Environment, then you can send request in Postman, and do interaction with contract. Detailed settings you can find in Postman guide page.

      <img src="https://tva1.sinaimg.cn/large/008i3skNly1gvliqyg9foj60jh04zwes02.jpg" style="zoom:70%;" />

      

   3. Call API

      ![Postman设置成功](https://tva1.sinaimg.cn/large/008i3skNly1gvlirf6ty9j60zk0m841q02.jpg)