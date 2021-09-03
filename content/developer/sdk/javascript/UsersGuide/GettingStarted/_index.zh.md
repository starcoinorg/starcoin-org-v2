---
title: 准备开始
weight: 1
---


<!--more-->
## 使用说明

1. 安装依赖库

```bash
npm install @starcoin/starcoin
```

2. 按需引入相关package

```typescript
import { providers, utils, bcs, encoding } from '@starcoin/starcoin'；
```
3. 检查Starmask插件是否安装
如果是web dapps， 必须做这一步检查，否则不需要(比如在只是用来decrpyt一个字符串)

```typescript
import StarMaskOnboarding from '@starcoin/starmask-onboarding'

const { isStarMaskInstalled } = StarMaskOnboarding

let onboarding

try {
    onboarding = new StarMaskOnboarding({ forwarderOrigin })
} catch (error) {
    console.error(error)
}

if (!isStarMaskInstalled()) {
    onboardButton.innerText = 'Click here to install StarMask!'
    onboardButton.onclick = onClickInstall
    onboardButton.disabled = false
} else if (isStarMaskConnected()) {
    onboardButton.innerText = 'Connected'
    onboardButton.disabled = true
    if (onboarding) {
        onboarding.stopOnboarding()
    }
} else {
    onboardButton.innerText = 'Connect'
    onboardButton.onclick = onClickConnect
    onboardButton.disabled = false
}

const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress'
    onboardButton.disabled = true
    onboarding.startOnboarding()
}


const accountButtonsDisabled = !isStarMaskInstalled() || !isStarMaskConnected()

```

4. 连接远程节点

必须先检查 Starmask 插件是否安装, 否则无法连接远程节点

```typescript
let starcoinProvider

try {
    // window.starcoin is injected by Starmask(chrome extension)
    if (window.starcoin) {
      // We must specify the network as 'any' for starcoin to allow network changes
      starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
    }
  } catch (error) {
    console.error(error)
  }
```

5. 注册全局的监听事件

```typescript
// 钱包网络切换
window.starcoin.on('chainChanged', handleNewChain)
window.starcoin.on('networkChanged', handleNewNetwork)

// 钱包帐号切换
window.starcoin.on('accountsChanged', handleNewAccounts)
```

6. 连接Starmask钱包

```typescript
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

## 参考
1. Starmask-test-dapp
- 在线demo: [https://starmask-test-dapp.starcoin.org](https://starmask-test-dapp.starcoin.org/)

- 源码仓库: [github](https://github.com/starcoinorg/starmask-test-dapp) 