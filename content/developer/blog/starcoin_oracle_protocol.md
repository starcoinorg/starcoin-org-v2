---
title: Standard Oracle Protocol In Starcoin
weight: 11
---

~~~
* By Starcoin community
~~~


### Why Oracles Are Needed

So far, with the development of blockchain,we have encountered many difficulties,however, to solve these difficulties, we have made more innovation. How does the blockchain obtain real-world data? How does the contract to capture real market price? How does the blockchain keep unpredictability? Oracle is born for solving these similar problems. Oracle connects on-chain and off-chain,but also open a door between public chains,which expands application scenarios of the blockchain. So Oracle is like a bridge,allowing data in different places to establish connections with each other.

Oracle has become an essential component in the public chain ecosystem. Starcoin also defines a standard Oracle protocol, which is like a satellite.,it collects data of the planet and distributes it to other places through the Move contract to create rich value.

![oracle1](https://tva1.sinaimg.cn/large/008i3skNly1gv972jg7tmj60dg0bg3yl02.jpg)

### Standard Oracle Protocol

Starcoin has used Move programming language to design a standard Oracle protocol in Stdlib, and there are some features:

- Extensible
- Open data source
- Secure and reliable
- Concise and efficient

This protocol is fully functional, and its design is perfect, we can take a deep look at this protocol by the following source code

1. Flexible OracleInfo

~~~Move
   struct OracleInfo<OracleT: copy+store+drop, Info: copy+store+drop> has key {
       ///The datasource counter
       counter: u64,
       ///Ext info
       info: Info,
   }
   
   public fun register_oracle<OracleT: copy+store+drop, Info: copy+store+drop>(_sender: &signer, info: Info) acquires GenesisSignerCapability
~~~

   - OracleInfo is generic type, supports any type of Info through generic parameters, and has very good extensity.
   - OracleInfo only has key ability, it neither can be copied to a duplicate OracleInfo instance nor be dropped, so it's secure and reliable.
   - There is no array in OracleInfo, and any account can register OracleInfo by register_oracle function. 

2. Plentiful Data Source

~~~Move
   struct DataSource<OracleT: copy+store+drop, ValueT: copy+store+drop> has key {
       /// the id of data source of ValueT
       id: u64,
       /// the data version counter.
       counter: u64,
       update_events: Event::EventHandle<OracleUpdateEvent<OracleT, ValueT>>,
   }
   
   public fun init_data_source<OracleT:  copy+store+drop, Info: copy+store+drop, ValueT: copy+store+drop>(sender: &signer, init_value: ValueT) acquires OracleInfo
~~~

   - Any account can call init_data_source function to become DataSouce.
   - Data such as Update Credentials and Update Capability are stored under the current account and have clear ownership.

3. Reasonable Authority Management

~~~Move
   struct UpdateCapability<OracleT: copy+store+drop> has store, key {
       account: address,
   }
   
   struct GenesisSignerCapability has key{
       cap: Account::SignerCapability,
   }
~~~

   - Define two types of authority: To registe OracleInfo GenesisSignerCapability, to update OracleFeed UpdateCapability.
   - Only GENESIS_ADDRESS has GenesisSignerCapability, through the loan way, everyone can register for OracleInfo.
   - Any accounts can have UpdateCapability, any accounts with UpdateCapability can update corresponding OracleFeed data.

4. Secure OracleFeed

~~~Move
   struct DataRecord<ValueT: copy+store+drop> has copy, store, drop {
       ///The data version
       version: u64,
       ///The record value
       value: ValueT,
       ///Update timestamp millisecond
       updated_at: u64,
   }
   
   struct OracleFeed<OracleT: copy+store+drop, ValueT: copy+store+drop> has key {
       record: DataRecord<ValueT>,
   }
   
   public fun update<OracleT: copy+store+drop, ValueT: copy+store+drop>(sender: &signer, value: ValueT) acquires UpdateCapability, DataSource, OracleFeed
   
   public fun update_with_cap<OracleT: copy+store+drop, ValueT: copy+store+drop>(cap: &mut UpdateCapability<OracleT>, value: ValueT) acquires DataSource,OracleFeed
~~~

   - DataRecord stores real data, has strict version control and a timestamp updated_at  on the chain.
   - DataRecord only has key ability, cannot be dropped and copied, secure and reliable.
   - In current account,OracleFeed<OracleT: copy+store+drop, ValueT: copy+store+drop> is unique,only keep the latest data and avoid reading outdated data.
   - To update OracleFeed by update function and update_with_cap function,no matter which function, pdateCapability is needed,avoid being updated by others by mistake, and ensure data security.

   Starcoin's standard Oracle protocol maintains a simple and efficient structure, with the advantages of Move, and and has excellent security and extensibility.

5. Discussion about Starcoin's Oracle scenario

   Above we focused on the implementation details of the standard Oracle protocol. Next, we will discuss the possible application scenarios of Starcoin's Oracle.

   1. Real-time Price

      Users can collect time and price data of encrypted currencies from different data sources, and submit them to the chain in a near real-time manner through Oracle. Other contracts can use these data directly by filtering data sources, or use these data after aggregation processing, which is very convenient and flexible.

   2. Random number and Chain

      If the input is certain,in this circumstances, the smart contract must ensure that everyone's execution results are consistent, so it is difficult to provide a random number on the chain. However,through Oracle, users can submit VRF random data to the chain, which can not only verify the correctness of the random number, but also allow the contract to have random capabilities and add richer scenarios.

      Taking games as an example, unpredictability is one of the important features that make games attractive. The game obtains random numbers through Oracle, which can guarantee the unpredictability of the game.

      No doubt, there are more application scenarios for random numbers, such as red envelopes, simulating uncertain environments, and so on.

   3. Complex computation off-chain

      Due to limitation of gas and single thread, smart contracts cannot have complex calculation algorithm, which will limit the usage of smart contracts. If a solution similar to Proof is used to execute complex calculations off-chain, and then submit the results and Proof to the Oracle on the chain for use in other contracts, this will significantly reduce the difficulty of  design of smart contract , and at the same time, it can enrich application scenarios of smart contracts.

   4. Insurance and Claim 

      Insurance is an important financial scenario, but there have always been various inappropriate phenomena, such as insurance fraud and so on. Smart contract is the law in blockchain ecosystem,if you use Oracle to put events on the chain, and then authenticate and execute them through the contract, it will be a good combination. For example, common flight delay insurance, education fund insurance, etc., can regulate the market and improve efficiency in this way.

   5. To predict Market

      The market is changing rapidly, and any off-chain event can be quickly mapped to the chain through Oracle. The smart contract triggers operations such as settlement in the prediction market by obtaining data provided by Oracle. For example, sports competition results, gold price changes, game, etc.

6. How to implement PriceOracle in Starcoin

   We have learned design of Starcoin's standard Oracle protocol,  then explored its rich application.Next, we take the market price scenario as an example to learn how to add the business logic of a specific scenario to the current Oracle protocol to implement a complete Oracle application.

   Starcoin encapsulates a PriceOracle module on the standard Oracle protocol, and makes an official implementation for the price scenario. PriceOracle is also a general contract that can register any type of digital assets. Then, Starcoin implemented a STCUSDOracle contract on PriceOracle and registered a pair of currency combinations STC and USDT. Then through the PriceOracleScript contract, the value of STC corresponding to USD is registered in the Oracle on the chain. Finally, anyone can select and filter prices through the PriceOracleAggregator aggregator, and apply the aggregated prices to their products. Next, let's analyze the source code of PriceOracle, STCUSDOracle and PriceOracleAggregator in depth.

   ![starcoin_oracle_protocol](https://tva1.sinaimg.cn/large/008i3skNly1gvg1mmyjvzj612k0hydgy02.jpg)

   1. PriceOracle

      PriceOracle is built based on standard Oracle protocol and is a general contract implemented for price scenarios. In other words, any data in the form of Price can be uploaded to the chain through PriceOracle.

~~~Move
      struct PriceOracleInfo has copy,store,drop{
          scaling_factor: u128,
      }
~~~

      In the standard Oracle protocol, OracleInfo has a generic parameter Info: copy+store+drop. In PriceOracle, the specific implementation corresponding to Info is PriceOracleInfo, which only contains the calculation factor scaling_factor, so PriceOracleInfo must have cthree abilities of copy, store, and drop, which are the requirements of the generic parameter of Info.
    
      After clarifying the data definition of PriceOracleInfo, you can call the register_oracle function of the Oracle contract to register PriceOracleInfo, and you can also call Oracle's init_data_source and update to upload the data to the chain.
    
      PriceOracle is an application based on the standard Oracle protocol, so it inherits all the features of the Oracle protocol and is very convenient to use.

   2. STCUSDTOracle

      If PriceOracle is a general price contract, then the STCUSDTOracle contract is a specific product implemented in the price scenario.

~~~Move
      struct STCUSD has copy,store,drop {}
~~~

      We have seen that in the standard Oracle protocol, in OracleInfo, apart from Info, OracleInfo has another generic parameter OracleT: copy+store+drop, OracleT represents a pair of currency combinations, and Info represents information. PriceOracle only implements PriceOracleInfo, OracleT is also a generic parameter in PriceOracle, and the biggest role of the STCUSDTOracle contract is to determine the type of OracleT as STCUSD. Of course, anyone can implement their own pair of currency combination contracts and define their own products.

   3. PriceOracleScript

      PriceOracleScript is some scripts defined for transactions. This is an important user entry, mainly used to update Oracle data, including:

      - Register any pair of currency combination OracleT of PriceOracleInfo
      - Update any pair of currency combinations OracleT to the latest data

   4. PriceOracleAggregator

      The PriceOracleAggregator contract is an aggregator which is used to select and filter the data in Oracle, and then return the aggregated price to the user, and apply the real-time price on the chain to wherever it is needed.

      

## Conclusion

   Starcoin not only implements a standard Oracle protocol, but also a tool chain which implements a very complete Oracle protocol.

   From a technical perspective, from basic standard Oracle protocol, to PriceOracle designed for price scenarios, and finally to the user's transaction entry, any part can be quickly expanded, and is safe and reliable.

   From the perspective of application scenarios, Starcoin's Oracle has a wide range of application scenarios, such as real-time prices, match results, games, insurance claims, complex off-chain calculation results, etc., including valuable data in any scenario.

   From the perspective of product, the protocol is simple and efficient, and the data source and data are completely open. Anyone can submit their own data. Anyone can get real-time data from the chain only through the aggregator, which is very convenient to use.

   We have reasons to believe that Starcoin's Oracle is very imaginative and competitive.
