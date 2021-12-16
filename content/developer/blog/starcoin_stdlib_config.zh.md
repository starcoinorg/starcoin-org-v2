---
title: Starcoin的Stdlib介绍之Config模块
weight: 20
---

```
* 本文由Starcoin社区原创
```

## Starcoin的Stdlib

Starcoin有一个非常重要的特性：Stdlib。

与以太坊不同，在Starcoin的账户模型中，合约产生的数据是分散存储到每个用户自己的账户下，没有大数组等常见安全问题。所以Starcoin可以非常便捷地实现官方的标准库Stdlib，定义一些基础功能的合约，方便其他合约调用，开箱即用，非常便捷。Starcoin的Stdlib使用Move实现，既包含了一些链相关的核心逻辑，例如增强的PoW共识、经济模型等等，也包括了一些基础的协议，例如，Token协议、链上治理DAO、NFT协议、Oracle协议、合约升级协议、Config协议等等。关于协议的介绍和使用，可以通过这里查看[更详细的介绍](https://starcoin.org/zh/developer/stdlib/stdlib/)。





<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw4bvxs03xj30ie0j274y.jpg" alt="starcoin_stdlib_protocols" style="zoom:33%;" />



## 介绍Stdlib的Config模块

Config是Stdlib一个很常用的模块，用于存储和操作一些通用配置。Starcoin的Stdlib中，有很多特性中使用到了Config模块，用于存储一些全局配置：

* VMConfig
* ConsensusConfig
* RewardConfig
* OnchainConfig等等

这样做有很多好处：

* 避免硬编码
* 统一管理
* 如果有必要，可以随时更新这些配置，从而避免硬分叉



<img src="https://tva1.sinaimg.cn/large/008i3skNly1gw4by74lw9j30oo0gq3z7.jpg" alt="starcoin_configs" style="zoom:33%;" />





## Config源码解析

Config模块的功能类似带泛型的Map，通过Key能获取存储的Value。虽然在Stdlib中承载了很多功能，但是合约的代码非常简洁：

* Config用于存储payload
* ModifyConfigCapability保存了修改某个Config权限的account_address，修改之后会产生一个ConfigChangeEvent

~~~
    /// A generic singleton resource that holds a value of a specific type.
    struct Config<ConfigValue: copy + drop + store> has key { payload: ConfigValue }

    /// Accounts with this privilege can modify config of type ConfigValue under account_address
    struct ModifyConfigCapability<ConfigValue: copy + drop + store> has store {
        account_address: address,
        events: Event::EventHandle<ConfigChangeEvent<ConfigValue>>,
    }

    /// A holder for ModifyConfigCapability, for extract and restore ModifyConfigCapability.
    struct ModifyConfigCapabilityHolder<ConfigValue: copy + drop + store> has key, store {
        cap: Option<ModifyConfigCapability<ConfigValue>>,
    }
~~~

Config模块中针对Config的操作函数有：

~~~Move
		/// Get a copy of `ConfigValue` value stored under `addr`.
    public fun get_by_address<ConfigValue: copy + drop + store>(addr: address): ConfigValue acquires Config

    /// Check whether the config of `ConfigValue` type exists under `addr`.
    public fun config_exist_by_address<ConfigValue: copy + drop + store>(addr: address): bool 
    
    /// Set a config item to a new value with capability stored under signer
    public fun set<ConfigValue: copy + drop + store>(account: &signer, payload: ConfigValue) acquires Config,ModifyConfigCapabilityHolder
    
    /// Publish a new config item under account address.
    public fun publish_new_config<ConfigValue: copy + drop + store>(account: &signer, payload: ConfigValue)
~~~

* get_by_address函数：从addr下获取ConfigValue
* config_exist_by_address函数：判断addr下是否存在ConfigValue
* set函数：将Config设置成新的payload值，需要有ModifyConfigCapability权限才能修改
* publish_new_config：生成一个新的config



## Config使用

由于Config模块能带来很多便利，Stdlib的全局配置都使用Config合约进行管理，同时跟链上治理功能进行结合，保证Stdlib中的全局配置安全。这里我们通过RewardConfig来了解一下Config模块的使用：

~~~Move
    /// Reward configuration
    struct RewardConfig has copy, drop, store {
        /// how many blocks delay reward distribution.
        reward_delay: u64,
    }

    /// Module initialization.
    public fun initialize(account: &signer, reward_delay: u64)
    
    /// Create a new reward config mainly used in DAO.
    public fun new_reward_config(reward_delay: u64) : RewardConfig
    
    /// Get reward configuration.
    public fun get_reward_config(): RewardConfig
~~~

RewardConfig存储在GENESIS_ADDRESS下（Genesis Account是Starcoin的创世账户，没有私钥，不受任何人管理），用于保存区块奖励相关的配置，这里只有reward_delay，表示奖励延迟支付区块数：

* initialize函数：初始化函数，会调用Config::publish_new_config设置RewardConfig
* new_reward_config函数：根据指定的reward_delay生成一个RewardConfig实例（new_reward_config函数和Config::set函数可以更新RewardConfig）
* get_reward_config函数：调用了Config::get_by_address函数获取最新的RewardConfig



## 总结

Config是一个通用模块，任何账户可以用来在自己的地址下存储和管理配置。为了避免大数组问题，Config没有使用数组来实现，安全可靠。Starcoin的一些全局配置，正是使用Config合约保存在Genesis Account账户下。感兴趣的可以查看[完整代码](https://github.com/starcoinorg/starcoin/blob/master/vm/stdlib/modules/Config.move)。