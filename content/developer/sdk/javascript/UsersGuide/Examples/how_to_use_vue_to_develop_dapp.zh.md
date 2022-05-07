---
title: 使用Vue3开发Dapp
weight: 1
---
如何使用Vue3技术栈开发Dapp？
<!--more-->
## 环境搭建：

### 使用vite新建项目

使用 NPM:

```bash
$ npm create vite@latest
```

使用 Yarn:

```bash
$ yarn create vite
```
为了便于阅读，后续开发统一使用 yarn 。[如何安装 Yarn](https://yarnpkg.com/)

跟着命令行提示一步一步完成：

![1651818469067](/images/sdk/demo/1651818469067.png)

完成后，按照命令行的最终提示，我们成功新建了一个vite的vue3项目，选择你最熟悉的ide工具进入代码库（项目中使用的 vscode），这个项目的目录结构应该如下：

![1651818621815](/images/sdk/demo/1651818621815.png)

然后我们输入命令行：
```bash
$ yarn
```

等待安装完成后，我们再执行命令行：
```bash
$ yarn dev
```

稍等片刻，会出现ready提示：

![1651818847075](/images/sdk/demo/1651818847075.png)

在浏览器上打开这个网址，即可看到我们成功运行的vite项目

![1651818909690](/images/sdk/demo/1651818909690.png)

我们的项目需要在浏览器端将当前用户的info 作为一个store放置在最上层以便能在各个vue组件中获取到相应的值，因此，我们需要使用一个vue 的store工具，本项目使用的是 `pinia`。

:::  tip 为什么使用 `pinia` 而不是 `vuex`？
1. pinia 相比 vuex 更加的轻量（体积约 1KB）
2. 移除了 `Mutations`，且 `Actions` 支持同步和异步
3. 支持多个 Store

且 pinia 以作为 vue3 官方推荐的 store库，详细信息可自行查阅 vue 文档官方网站 或 github。

安装 pinia
```bash
$ yarn add pinia
```

安装完成后，在 `main.js` 里导入 `pinia` 并作为中间件加载到 Vue App上。
完整代码如下：
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

这样，我们项目的初始依赖就已经加载完成。

### 初始化项目代码
现在让我们上手改造一下现在的代码，以便后续接入 starcoin 的 jsdk。

首先我们删掉 `App.vue` 里 无关的代码，如 `HelloWord 组件`，并添加上我们的标题以及logo。
修改后的 `App.vue` 完整代码应该如下：
```vue
<script setup>
</script>

<template>
  <h1>E2E Test Dapp</h1>
  <img
    class="logo"
    alt="Vue logo"
    src="https://starmask-test-dapp.starcoin.org/logo-horizontal.png"
  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 317px;
  height: 143px;
}
</style>
```

删除 `components`下的 `HelloWorld.vue` 文件。
然后在 `src` 下新建一个文件夹 `stores`，并在 `stores` 下新建文件 `starcoin.js`。并定义一个 `starcoin`的 store。
完整代码如下：
```javascript
import { defineStore } from 'pinia';

export const useStarcoinStore = defineStore('starcoin', {
  state: () => {
    return {}
  },
});
```

最终我们的整个代码目录结构应该如下图所示：

![1651822625091](/images/sdk/demo/1651822625091.png)


完成了项目的初始化，下一步，我们就来接入 starcoin.js 这个jsdk，来为我们的Dapps 与 Starcoin 区块链及其生态系统进行交互。

### 接入sdk

### vite jsdk兼容配置
在接入 starcoin sdk 前，我们需要给vite 增加一些polyfill 插件用来兼容 jsdk中的一些node方法。
我们需要安装如下依赖：
* @esbuild-plugins/node-globals-polyfill
* @esbuild-plugins/node-modules-polyfill
* rollup-plugin-node-polyfills

```bash
$ yarn add --dev @esbuild-plugins/node-globals-polyfill @esbuild-plugins/node-modules-polyfill rollup-plugin-node-polyfills
```

安装完成后，修改`vite.config.js` 配置如下：
```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      // process and buffer are excluded because already managed
      // by node-globals-polyfill
      string_decoder:
        'node_modules/rollup-plugin-node-polyfills/polyfills/string-decoder.js',
      '@': '/src/',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
  },
});
```
如需了解更多 `node-polyfill`相关信息可以阅读代码 [node-modules-polyfill](https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts)。

### starcoin 接入

在常见的 dapp应用中，我们通常需要与钱包进行交互，在starcoin dapp中也是如此。作为开发者，我们首先需要检测用户的浏览器是否已经安装 `Starmask` 钱包插件。我们可以通过，`@starcoin/starmask-onboarding`所提供的 `isStarMaskInstalled` 参数进行判断。
这是 `@starcoin/starmask-onboarding`的调用例子：

```javascript
import StarMaskOnboarding from '@starcoin/starmask-onboarding'
const { isStarMaskInstalled } = StarMaskOnboarding
```
在我们的项目同样也需要用到这个方法，我们来安装这个依赖：
```bash
$ yarn add --dev @starcoin/starmask-onboarding
```

安装完成后，我们对它进行加载，还记得之前我们定义的 `starcoin store`吗，作为 starcoin 的信息，浏览器是否安装钱包插件也应该存放在这个 store中，以便项目中各个组件来对它进行判断。进入 `src/stores/starcoin.js` 中，我们导入刚刚安装的依赖，并使用它。同时我们抽象出一个 initialStarCoin 的方法用来返回 starcoin store需要存放的信息。具体代码如下：
```javascript
import { defineStore } from 'pinia';
import StarMaskOnboarding from '@starcoin/starmask-onboarding';

const initialStarCoin = () => {
  const currentUrl = new URL(window.location.href);
  const forwarderOrigin =
    currentUrl.hostname === 'localhost' ? 'http://localhost:9032' : undefined;

  const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled();
  const isStarMaskConnected = false;

  let onboarding;
  try {
    onboarding = new StarMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  return {
    isStarMaskInstalled,
    isStarMaskConnected,
    onboarding,
  };
};

const initial = initialStarCoin();

export const useStarcoinStore = defineStore('starcoin', {
  state: () => {
    return { ...initial };
  },
});
```

其中，`onboarding` 用来处理没有安装 Starmask钱包插件的操作，它提供了一个方法`startOnboarding`，可以调起当前浏览器自动打开 `Starmask`插件的页面。`isStarMaskConnected` 用来存储当前是否连接钱包。`isStarMaskInstalled` 用来存储当前 Starmask钱包插件 是否安装。

代码完成后，我们在 `App.vue` 中使用我们的定义好的 store：
```vue
<script setup>
import { useStarcoinStore } from '@/stores/starcoin'

const starCoinStore = useStarcoinStore()
</script>

// ...
<template>
// ...
</style>
```
并打印出我们刚刚在 store 中调用的方法，输出 `isStarMaskInstalled`.
```javascript
// src/stores/starcoin.js
// ...
const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled();
const isStarMaskConnected = false;

console.log(isStarMaskInstalled, 'isStarMaskInstalled');
//...
```

回到浏览器，我们可以在控制台看见当前打印的结果：

![1651825634869](/images/sdk/demo/1651825634869.png)

然后我们安装 `vue-devtools`工具 [vue-devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

安装完成后，我们可以在控制台看到 `vue devtools`，进入后选择 `Pinia` 窗口，我们就可以看见之前在 store 中定义好的 `starcoin store`了：

![1651825878921](/images/sdk/demo/1651825878921.png)

可以通过 `isStarMaskConnected` 和 `isStarMaskInstalled` 看到我们目前是没有安装 Starmask 钱包，而且也没有连接。

为了便于后续开发时能够更好的理解状态，我们目前没有安装。有需要可以到 [StarMask](https://chrome.google.com/webstore/detail/starmask/mfhbebgoclkghebffdldpobeajmbecfk) 这里进行安装。
安装后再次刷新页面就可以看到`isStarMaskInstalled` 由 `false` 变为了 `true`。可以注意到的是 `onboarding`中的 `state` 也由 `NOT_INSTALLED` 变为了 `INSTALLED`。

![1651826115947](/images/sdk/demo/1651826115947.png)

完成了 `starcoin store`的初始接入，下面就来开发我们 dapp 的第一个模块，与钱包进行连接，并获取当前连接钱包用户的 account地址、网络状态、ChainId。

## dapp开发

### 连接钱包并获取状态

为了便于快速展示，我们使用element-ui 作为前端展示框架。
安装 element-ui
```bash
$ yarn add element-plus
```

安装完成后，在 `main.js` 中引入 `element-plus`，
完整代码如下：
```javascript
// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

createApp(App).use(createPinia()).use(ElementPlus).mount('#app');
```

连接钱包后，在本项目中，需要展示当前连接钱包用户的 chainId、network、以及account address，因此我们需要去`starcoin store`中添加这些信息，并根据 `pinia`的方式提供修改这些信息的方法。
完整代码如下：
```vue
// src/stores/starcoin.js
import { defineStore } from 'pinia';
import StarMaskOnboarding from '@starcoin/starmask-onboarding';

const initialStarCoin = () => {
  const currentUrl = new URL(window.location.href);
  const forwarderOrigin =
    currentUrl.hostname === 'localhost' ? 'http://localhost:9032' : undefined;

  const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled();
  const isStarMaskConnected = false;
  const accounts = [];

  let onboarding;
  try {
    onboarding = new StarMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  let chainInfo = {
    chain: '',
    network: '',
    accounts: '',
  };

  return {
    isStarMaskInstalled,
    isStarMaskConnected,
    onboarding,
    accounts,
    chainInfo,
  };
};

const initial = initialStarCoin();

export const useStarcoinStore = defineStore('starcoin', {
  state: () => {
    return { ...initial };
  },
  actions: {
    changeChain(chain) {
      this.chainInfo.chain = chain;
    },
    changeNetwork(network) {
      this.chainInfo.network = network;
    },
    changeAccounts(accounts) {
      this.accounts = accounts;
      this.isStarMaskConnected = this.accounts && this.accounts.length > 0;
    },
  },
});
```

对比之前的代码，我们新添加了 `accounts`、`chainInfo`用来存放需要账户信息以及 chainId和network，同时我们增加了 `changeChain`、`changeNetwork`、`changeAccounts`三个action用来改变store的值，在`changeAccounts`中，如果当前获取到了账号信息，那么就说明是已经连接到钱包了，所以同时也可以更改`isStarMaskConnected`的状态。

定义好`starcoin store`后，然后我们进入 components 文件夹，新建一个 `BasicActions.vue` 文件，用来开发 钱包连接模块。在 BasicActions.vue 中，我们需要一个连接钱包的 button按钮，一个获取当前连接钱包账户信息的按钮，以及一个用来展示 `selectedAccount`信息的容器。

在前面的代码中，我们在 `starcoin store`里定义了 `isStarMaskInstalled`、`isStarMaskConnected`、`onboarding`。我们的钱包连接 button 依赖这三个参数。

BasicActions里我们需要了解三个状态：
1. 当浏览器未安装 StarMask插件时，button 的文本需要提示用户进行安装，并且当用户点击 button时，能够跳转到 StarMask 插件页面
2. 当浏览器安装了 StarMask 插件但未连接时，button 的文本需要提示用户进行连接，并且当用户点击 button 时，调用插件提供的能力，进行钱包的连接（后面会详细介绍）
3. 当浏览器已安装 StarMask 插件并已经连接，button 文本需要告诉用户当前已连接，并且button 不可点

根据这三种状态我们来进行连接钱包 button的开发。

其中第二点，当安装好 StarMask 插件后，插件会写入全局window一个参数`starcoin`，通过调用`womdpw.starcoin.request`方法，可以获取当前连接钱包的一些信息。例如通过 `stc_requestAccounts`，获取当前连接钱包的账户：
```javascript
const newAccounts = await window.starcoin.request({
    method: 'stc_requestAccounts',
});
```

根据上面的状态和`starcoin store`提供的参数，我们来进行开发。
`BasicActions.vue`完整的代码如下：
```vue
<script setup>
import { ref, computed } from 'vue'
import { useStarcoinStore } from '@/stores/starcoin'

const starCoinStore = useStarcoinStore()
const textStatus = ['Click here to install StarMask!', 'Connect', 'Connected']
const disabled = ref(false)
const showSelectedAccount = ref(false)

const status = computed(() => {
  if (!starCoinStore.isStarMaskInstalled) {
    disabled.value = false
    return 0
  } else if (starCoinStore.isStarMaskConnected) {
    disabled.value = true
    starCoinStore.onboarding?.stopOnboarding()
    return 2
  } else {
    disabled.value = false
    return 1
  }
})

const clickHandle = async () => {
  const _status = status.value

  if (_status === 0) {
    disabled.value = true
    starCoinStore.onboarding.startOnboarding()
  } else if (_status === 1) {
    try {
      const newAccounts = await window.starcoin.request({
        method: 'stc_requestAccounts',
      })
      starCoinStore.changeAccounts(newAccounts)
    } catch (error) {
      console.error(error)
    }
  }
}

const getAccount = () => {
  showSelectedAccount.value = true
}
</script>
<!--  -->
<template>
  <div class="card-wrap">
    <el-card>
      <h3>Basic Actions</h3>
      <el-button type="primary" :disabled="disabled" @click="clickHandle">
        {{ textStatus[status] }}
      </el-button>
      <el-button type="primary" :disabled="status !== 2" @click="getAccount">
        GET SELECTED ACCOUNT
      </el-button>
      <el-button type="info" disabled>
        SelectedAccount:
        {{ showSelectedAccount ? starCoinStore.accounts[0] : '' }}
      </el-button>
    </el-card>
  </div>
</template>

<style scoped></style>
```
其中，`status`就是我们在上文所定义的三个状态值，`clickHandle`方法中，就是我们对于这三个状态所做的处理。
1. 当status 为0，没有安装插件时，点击按钮打开StarMask 插件的安装页面
2. 当 status 为1， 安装了插件但是没有连接，点击按钮，调用插件提供的能力 request，提供参数 method 为 stc_requestAccounts，调起钱包进行连接
3. 当 status 为2，安装了插件并已经连接，那么只需要将当前的按钮置灰不可点即可

开发完成后，我们在 `App.vue`中引入 `BasicActions`组件。
完整代码如下：
```vue
// src/App.vue
<script setup>
import { useStarcoinStore } from '@/stores/starcoin'
import BasicActions from './components/BasicActions.vue'

const starCoinStore = useStarcoinStore()
</script>

<template>
  <h1>E2E Test Dapp</h1>
  <img
    class="logo"
    alt="Vue logo"
    src="https://starmask-test-dapp.starcoin.org/logo-horizontal.png"
  />
  <BasicActions />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 317px;
  height: 143px;
}
</style>
```

再次打开浏览器并刷新，应该可以看到如下的界面：

![1651831529379](/images/sdk/demo/1651831529379.png)

点击 `Click here to install StarMask`，就会弹出插件安装页面，点击 Add to Chrome，进行安装。

![1651831598764](/images/sdk/demo/1651831598764.png)

安装后，在新弹出的页面中点击 Get Started，根据`StarMask`的提示来新建你的账户。

![1651831944606](/images/sdk/demo/1651831944606.png)

当你看到当前的页面后，代表你已经安装好了 `StarMask`并成功新建了账户。

![1651832100910](/images/sdk/demo/1651832100910.png)

让我们在回到我们的 dapp项目，并刷新页面，你可以看到按钮的文本 由 `Click here to install StarMask!`变成了 `Connect`，打开我们的 `vue-devtools`，也可以看到`starcoin store`里的 `isStarMaskInstalled`变为了 `true`。也代表着当前浏览器已经安装了 StarMask钱包插件。

![1651832276262](/images/sdk/demo/1651832276262.png)

再次点击`connect`，会弹出一个小窗口，用来连接钱包，按照提示点击 next 并最终 connect。

![1651832349250](/images/sdk/demo/1651832349250.png)

连接完成后，可以我们的钱包连接 button 的文本也变成了 `Connected`，并且在钱包插件中，在你的账号左侧，也显示了 Connected，代表钱包已经和当前 Dapp页面进行了连接。

![1651832455125](/images/sdk/demo/1651832455125.png)

我们也可以点击 ` GET SELECTED ACCOUNT `按钮来测试我们的功能，点击后，可以看到`SelectedAccount`后面展示的就是当前连接账户的账户地址。

![1651832534147](/images/sdk/demo/1651832534147.png)

至此，我们就在dapp里实现了一个连接钱包的模块功能。

### 请求权限
通过插件提供的能力，我们可以通过全局的 `window.starcoin` 变量调用 `wallet_requestPermissions` 方法进行请求权限。
相关代码如下：
```javascript
const permissionsArray = await window.starcoin.request({
          method: 'wallet_requestPermissions',
          params: [{ stc_accounts: {} }],
})
```

我们也可以调用 `wallet_getPermissions`方法，来获取当前权限账户。
```javascript
const permissionsArray = await window.starcoin.request({
    method: 'wallet_getPermissions',
  })
```

了解这个两个方法后，我们进入 `src/components/`目录中，新建一个 `PermissionsActions.vue`文件，用来开发请求权限模块。
完整代码如下：
```vue
<script setup>
import { ref } from 'vue'
import { useStarcoinStore } from '@/stores/starcoin'

const permissionsResult = ref('')

const starCoinStore = useStarcoinStore()
const getPermissionsDisplayString = (permissionsArray) => {
  if (permissionsArray.length === 0) {
    return 'No permissions found.'
  }

  const permissionNames = permissionsArray.map((perm) => perm.parentCapability)

  return permissionNames
    .reduce((acc, name) => `${acc}${name}, `, '')
    .replace(/, $/u, '')
}

const reqPermissions = async () => {
  const permissionsArray = await window.starcoin.request({
    method: 'wallet_requestPermissions',
    params: [{ stc_accounts: {} }],
  })

  permissionsResult.value = getPermissionsDisplayString(permissionsArray)
}

const getPermissions = async () => {
  const permissionsArray = await window.starcoin.request({
    method: 'wallet_getPermissions',
  })

    console.log(permissionsArray)
  permissionsResult.value = getPermissionsDisplayString(permissionsArray)
}
</script>
<template>
  <div class="card-wrap">
    <el-card>
      <h3>Permissions Actions</h3>
      <el-button
        type="primary"
        @click="reqPermissions"
        :disabled="!starCoinStore.isStarMaskConnected"
      >
        REQUEST PERMISSIONS
      </el-button>
      <el-button
        type="primary"
        @click="getPermissions"
        :disabled="!starCoinStore.isStarMaskConnected"
      >
        GET PERMISSIONS
      </el-button>
      <el-button type="info" disabled
        >Permissions result: {{ permissionsResult }}</el-button
      >
    </el-card>
  </div>
</template>

<style scoped></style>
```

其中核心方法为 `reqPermissions`以及 `getPermissions`分别调用了上文所说的`window.starcoin`所提供的方法。然后我们在 `App.vue`中引入该组件。
```javascript
// src/App.vue
<script setup>
// ...
import PermissionsActions from './components/PermissionsActions.vue'
// ...
</script>
<template>
// ...
<BasicActions />
<PermissionsActions />
// ...
</template>
// ...
```
回到浏览器，我们可以看到获取权限模块已经添加完成。

![1651836430578](/images/sdk/demo/1651836430578.png)

点击 `Request Permissions`按钮，会调起 StarMask插件，获取权限

![1651836508278](/images/sdk/demo/1651836508278.png)

权限获取完成后，可以在最后的 `Permissions result`中看到当前返回的结果。

### 状态展示
在完成钱包连接后，为了更直观的展现当前的账户状态，我们可以可以开发一个状态展现的模块。
进入`src/components`，新建文件`Status.vue`。
当钱包连接后，会更改`starcoin store`内的 `chainInfo`、`accounts`等参数，因此我们这里只需要展示 store里参数的值即可。
完整代码如下：
```vue
// src/components/Status.vue
<script setup>
import { computed } from 'vue'
import { useStarcoinStore } from '@/stores/starcoin'

const starcoinStore = useStarcoinStore()
const statusDefined = computed(() => [
  {
    key: 'Network',
    value: starcoinStore.chainInfo.network,
  },
  {
    key: 'ChainId',
    value: starcoinStore.chainInfo.chain,
  },
  {
    key: 'SelectedAccount',
    value: starcoinStore.accounts,
  },
])
</script>
<!--  -->
<template>
  <div class="status-wrap">
    <h2 class="title">Status</h2>
    <div class="status-main">
      <div
        :key="index"
        class="status-main-item"
        v-for="(item, index) of statusDefined"
      >
        <el-alert
          :closable="false"
          :title="`${item.key}: ${item.value}`"
          type="success"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: left;
}
</style>
```

同时，为了能够监听钱包插件连接，以及账号切换、网络切换等事件，我们需要用到插件提供的方法。
```javascript
// 钱包网络切换
window.starcoin.on('chainChanged', handleNewChain)
window.starcoin.on('networkChanged', handleNewNetwork)

// 钱包帐号切换
window.starcoin.on('accountsChanged', handleNewAccounts)
```
因此我们在整个App初始化，且已经安装完钱包插件后，需要初始化这些监听事件。
```javascript
const onStarcoinEvent = () => {
  if (starCoinStore.isStarMaskInstalled) {
    const handleNewChain = (chain) => {
      starCoinStore.changeChain(chain)
    }

    const handleNewNetwork = (network) => {
      starCoinStore.changeNetwork(network)
    }

    const handleNewAccounts = (accounts) => {
      starCoinStore.changeAccounts(accounts)
    }

    // 钱包网络切换
    window.starcoin.on('chainChanged', handleNewChain)
    window.starcoin.on('networkChanged', handleNewNetwork)

    // 钱包帐号切换
    window.starcoin.on('accountsChanged', handleNewAccounts)
  }
}
```

为了避免重复连接，我们也需要在进入页面的时候就判断当前是否已经连接，如果已经安装了StarMask插件，我们需要获取当前的 `chain.id`：
```javascript
if (starCoinStore.isStarMaskInstalled) {
    const chainInfo = await window.starcoin.request({
      method: 'chain.id',
    })
}
```

如果已连接，我们获取当前的账户 `accounts`信息：
```javascript
if (window?.starcoin.isConnected) {
    const newAccounts = await window.starcoin.request({
      method: 'stc_accounts',
    })
    starCoinStore.changeAccounts(newAccounts)
}
```

因此，我们来修改一下 `App.vue`的代码。
完整代码如下：
```vue
<script setup>
import { useStarcoinStore } from '@/stores/starcoin'
import Status from './components/Status.vue'
import BasicActions from './components/BasicActions.vue'
import PermissionsActions from './components/PermissionsActions.vue'

const starCoinStore = useStarcoinStore()

const onStarcoinEvent = () => {
  if (starCoinStore.isStarMaskInstalled) {
    const handleNewChain = (chain) => {
      starCoinStore.changeChain(chain)
    }

    const handleNewNetwork = (network) => {
      starCoinStore.changeNetwork(network)
    }

    const handleNewAccounts = (accounts) => {
      starCoinStore.changeAccounts(accounts)
    }

    // 钱包网络切换
    window.starcoin.on('chainChanged', handleNewChain)
    window.starcoin.on('networkChanged', handleNewNetwork)

    // 钱包帐号切换
    window.starcoin.on('accountsChanged', handleNewAccounts)
  }
}

const initialChaiInfo = async () => {
  if (starCoinStore.isStarMaskInstalled) {
    const chainInfo = await window.starcoin.request({
      method: 'chain.id',
    })

    starCoinStore.changeChain(`0x${chainInfo.id.toString(16)}`)
    starCoinStore.changeNetwork(chainInfo.id)
  }
}

const initialAccount = async () => {
  if (window?.starcoin.isConnected) {
    const newAccounts = await window.starcoin.request({
      method: 'stc_accounts',
    })
    starCoinStore.changeAccounts(newAccounts)
  }
}

onStarcoinEvent()
initialChaiInfo()
initialAccount()
</script>

<template>
  <h1>E2E Test Dapp</h1>
  <img
    class="logo"
    alt="Vue logo"
    src="https://starmask-test-dapp.starcoin.org/logo-horizontal.png"
  />
  <Status />
  <el-row justify="space-around" type="flex" class="content-wrap">
    <BasicActions />
    <PermissionsActions />
  </el-row>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  width: 317px;
  height: 143px;
}

.content-wrap {
  width: 100%;
}
</style>

```

修改完成后回到页面并刷新，可以看到`Status`模块已经把我们当前连接账户的 `Network`、`ChainId`、`SelectedAccount`都正确的展示出来了。

![1651837915167](/images/sdk/demo/1651837915167.png)

至此，我们也完成了 Dapp的 Status 展示模块。

### 发起转账
在Dapp中，我们不可避免的会与合约进行交互，而我们现在要做的 `SendSTC`模块，其中就会调用合约函数。
首先我们安装 `starcoin`的jsdk。
```bash
$ yarn add @starcoin/starcoin
```

`@starcoin/starcoin`提供`providers`方法用来连接远程节点。
```javascript
let starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
```

其次，我们引入`ethers`以及`bignumber.js`。
```bash
$ yarn add --dev ethers bignumber.js
```
`ehter`提供的工具包中的`hexlify`能够帮我们来处理 Hex字符串。`hexlify`方法能将任何数字、‎‎BigNumber‎‎、十六进制字符串或 ‎‎Arrayish‎‎ 转换为十六进制字符串。

`bignumber.js`则可以帮我们处理Javascript 的精度计算问题。

安装完成后，我们进入`src/components/`，新建`SendSTC.vue`文件。并引入刚刚安装的依赖。
```javascript
// src/components/SendSTC.vue
import { providers, utils, bcs } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js';
import { ethers } from "ethers";

const hexlify = ethers.utils.hexlify;
```

安装好依赖后，我们来了解一下 move合约函数。
合约的函数分成两种：
一种是需要签名，需要先在dapp里面生成Transaction，然后唤起Starmask钱包，由当前选中帐号点击确认，生成签名后的rawUserTransaction的hex，然后再提交到链上执行，同时扣除gas费。
另一种是不需要签名的，可以直接调用链的API(contract.call_v2)，得到返回结果。

我们即将开发的转账模块所调用的合约，就是一个需要签名的合约。
通过以下步骤我们可以执行一个需要签名的合约函数：

1. 通过Postman或者curl命令调用 contract.dry_run 或者 contract.dry_run_raw，确认 type_args 和 args 的参数都正确，而且执行成功。

2. 在js里面集成，调用 contract.call_v2 时，需要注意：
   * 调用 utils.tx.encodeScriptFunctionByResolve， 生成 ScriptFunction
   * 生成 ScriptFunction 的 二进制的Hex: payloadInHex
   * 构造一个只有 data 属性的 txParams 对象。(data=payloadInHex)
   * 调用 starcoinProvider.getSigner().sendUncheckedTransaction， 唤起 Starmask 钱包, 自动计算gas费， 当前选中帐号点击 确认 后，会生成rawUserTransaction的hex，然后再提交到链上执行，返回transacition hash。

其中 `utils.tx.encodeScriptFunctionByResolve`方法是`utils.tx.encodeScriptFunction`的增强版本： 不再需要客户端自己转换 args 每一个参数的js数据类型到 bsc 数据类型。 `encodeScriptFunctionByResolve` 会在内部先去查询 argsType, 再调用`encodeScriptFunction`生成一个`TransactionPayload`， 用于生成`RawUserTransaction`。

以我们转账模块的合约为例子：

```vue
import { providers, utils, bcs } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js';
import { ethers } from "ethers";

const hexlify = ethers.utils.hexlify;

// 转账信息
const toInputVal = '0x46ecE7c1e39fb6943059565E2621b312';
const amountInputVal = '0.001';
const tes = '1800';

// 生成ScriptFunction 所需参数
const functionId = '0x1::TransferScripts::peer_to_peer_v2';
const strTypeArgs = ['0x1::STC::STC'];
const toAccount = toInputVal;
const sendAmount = parseFloat(amountInputVal.value, 10);

const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
const sendAmountSTC = new BigNumber(String(amountInputVal.value), 10)
const sendAmountNanoSTC = sendAmountSTC.times(
    BIG_NUMBER_NANO_STC_MULTIPLIER
);

const args = [toAccount, sendAmountNanoSTC]
const nodeUrl = 'https://main-seed.starcoin.org';

// 调用 `utils.tx.encodeScriptFunctionByResolve`， 生成 `ScriptFunction`
const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
      functionId,
      strTypeArgs,
      args,
      nodeUrl
);

// 生成 `ScriptFunction` 的 二进制的Hex: payloadInHex
const payloadInHex = (function () {
      const se = new bcs.BcsSerializer()
      scriptFunction.serialize(se)
      return hexlify(se.getBytes())
    })()
    
// 构造一个只有 `data` 属性的 txParams 对象。(data=payloadInHex)
const txParams = {
    data: payloadInHex,
}

const expiredSecs = parseInt(tes.value, 10)
if (expiredSecs > 0) {
    txParams.expiredSecs = expiredSecs
}

// 调用 `starcoinProvider.getSigner().sendUncheckedTransaction`， 唤起 Starmask 钱包，确认 后，会生成rawUserTransaction的hex，再提交到链上执行，返回transacition hash。
const transactionHash = await starcoinProvider
    .getSigner()
    .sendUncheckedTransaction(txParams)
```

依照上面的核心代码，我们来进行 `SendSTC.vue`的开发。
完整代码如下：
```vue
// src/components/SendSTC.vue
<script setup>
import { ref } from 'vue'
import { providers, utils, bcs } from '@starcoin/starcoin'
import BigNumber from 'bignumber.js';
import { ethers } from "ethers";

const hexlify = ethers.utils.hexlify;
const nodeUrlMap = {
  '1': 'https://main-seed.starcoin.org',
  '2': 'https://proxima-seed.starcoin.org',
  '251': 'https://barnard-seed.starcoin.org',
  '253': 'https://halley-seed.starcoin.org',
  '254': 'http://localhost:9850',
}

const toInputVal = ref('0x46ecE7c1e39fb6943059565E2621b312')
const amountInputVal = ref('0.001')
const tes = ref('1800')
const contractStatus = ref('Not clicked')

const transferClick = async () => {
  let starcoinProvider = new providers.Web3Provider(window.starcoin, 'any')
  contractStatus.value = 'Calling'

  try {
    const functionId = '0x1::TransferScripts::peer_to_peer_v2'
    const strTypeArgs = ['0x1::STC::STC']

    const toAccount = toInputVal.value
    if (!toAccount) {
      window.alert('Invalid To: can not be empty!')
      return false
    }

    const sendAmount = parseFloat(amountInputVal.value, 10)
    if (sendAmount <= 0) {
      // eslint-disable-next-line no-alert
      window.alert('Invalid sendAmount: should be a number!')
      return false
    }

    const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000')
    const sendAmountSTC = new BigNumber(String(amountInputVal.value), 10)
    const sendAmountNanoSTC = sendAmountSTC.times(
      BIG_NUMBER_NANO_STC_MULTIPLIER
    )

    const args = [toAccount, sendAmountNanoSTC]
    const nodeUrl = nodeUrlMap[window.starcoin.networkVersion]

    const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(
      functionId,
      strTypeArgs,
      args,
      nodeUrl
    );

    // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
    const payloadInHex = (function () {
      const se = new bcs.BcsSerializer()
      scriptFunction.serialize(se)
      return hexlify(se.getBytes())
    })()

    const txParams = {
      data: payloadInHex,
    }

    const expiredSecs = parseInt(tes.value, 10)
    if (expiredSecs > 0) {
      txParams.expiredSecs = expiredSecs
    }

    const transactionHash = await starcoinProvider
      .getSigner()
      .sendUncheckedTransaction(txParams)
  } catch (error) {
    contractStatus.value = 'Call Failed'
    throw error
  }

  contractStatus.value = 'Call Completed'
}
</script>
<template>
  <div class="card-wrap">
    <el-card>
      <h3>Send STC</h3>
      <h4>To</h4>
      <el-input v-model="toInputVal" />
      <h4>Amount of STC</h4>
      <el-input v-model="amountInputVal" />
      <h4>Transaction Expired Seconds(default 30 minutes)</h4>
      <el-input v-model="tes" />
      <h4>Contract Function</h4>
      <el-button type="primary" @click="transferClick"
        >0x1::TransferScripts::peer_to_peer_v2</el-button
      >
      <el-button disabled>Contract Status: {{ contractStatus }}</el-button>
    </el-card>
  </div>
</template>

<style scoped></style>
```

组件开发完成后，进入`App.vue`引入该组件。
```vue
<script>
import SendSTC from './components/SendSTC.vue'
</script>

<template>
// ...
<SendSTC />
</template>
```

回到浏览器，我们可以看到`SendSTC`模块已经添加到页面中了。

![1651843033013](/images/sdk/demo/1651843033013.png)

点击`Send`，我们可以唤起钱包，以及自动计算好的gas费用。

![1651844549223](/images/sdk/demo/1651844549223.png)

在 `DATA`中，我们也可以看到本次交易的信息。

![1651844571321](/images/sdk/demo/1651844571321.png)

确认后，可以看到已经生成了`rawUserTransaction`的hex，等待上链执行。



![1651844611055](/images/sdk/demo/1651844611055.png)

![1651844621106](/images/sdk/demo/1651844621106.png)



稍等片刻浏览器会提示已经处理完成，点击钱包插件可以看到

![1651844671133](/images/sdk/demo/1651844671133.png)



![1651844680898](/images/sdk/demo/1651844680898.png)



点击详情右侧的小箭头，可以跳转到交易的详细信息，在网站中我们可以看到此次交易的信息，并且可以查看playload详情。

![1651844763428](/images/sdk/demo/1651844763428.png)

![1651844770545](/images/sdk/demo/1651844770545.png)

转账的合约执行完毕，Send STC模块的功能也已经完全实现了。

至此一个Dapp所包含的基本功能已经实现了。你也完成了从零到完整的开发一个基于`vite-vue3`的 `starcoin`的dapp。如果还想要了解更多的信息，可以阅读官网里关于 [Javascript SKD](https://starcoin.org/zh/developer/sdk/javascript/)的详细文档。
也可以阅读代码的完整示例：[https://github.com/starcoinorg/starmask-test-dapp-vue3](https://github.com/starcoinorg/starmask-test-dapp-vue3)

## 参考
1. [starmask-test-dapp-vue3](https://github.com/starcoinorg/starmask-test-dapp-vue3)
2. [starcoin javascirpt SDK](https://starcoin.org/zh/developer/sdk/javascript/intro/)
