# Starcoin's Architecture



Monday Nov 15, 2021 By Qiming Deng

## Starcoin's Architecture

On May 18,2021, Starcoin, a new generation layered smart contract and distributed financial network, launched its new main network. Starcoin uses an enhanced PoW consensus, it is the first permissionless public chain that uses Move as the smart contract language, it implements DAO on-chain governance thoroughly.  Westar labs as a lover of open source    technology, we are very fortunate to learn part of Starcoin's design and implementation, to do a little bit contribution to the open source society. From technology perspective, here, we will introduce Starcoin. 

Starcoin is a large system, from a macro perspective, let's first understant the overall structure of Starcoin. As shown in the below figure, Starcoin contains lots of components, such as Chain, Sync, TxPool, Stdlib, etc. On the whole, Starcoin has two parts:

- Chain,Rust, component without underscore in the below figure
- Contract,Move, component with underscore in the below figure

We can simply distinguish between "chain" and "contract" by programming languages. The chain-related logic is implemented through Rust, and the contract is implemented through Move. Although Starcoin is logically divided into two parts, the "chain" and the "contract", the "chain" and the "contract" play a role of mutual support and promotion. The "chain" is the basis of the "contract" and provides an running environment for the contract. The "contract" in turn provides nutrients for the "chain", expressing some of the core state of the chain, such as block rewards and so on. Therefore, "chain" and "contract" are an interactive unity. 

![starcoin_arch](http://westar.io/blog/starcoin_arch/images/starcoin_arch.jpg)

## Starcoin's Core Service

We learned the overall structure of Starcoin from a macro perspective. Next, we introduced the core components, services, and functions of Starcoin's "chain".

Starcoin draws on the idea of microservices, splits different modules, then organizes different functions through services, and provides services in a unified manner by nodes. Starcoin uses Rust's Actix framework to design a complete service-registy system, including service registration, service status checking, and service shutdown capabilities, which can easily manage the service life cycle. At the same time, a set of Bus protocol is designed for the communication between services to decouple the services. As shown in the below figure, RegistyService in the service-registy module is the basic service of all other services. 

![starcoin_services](http://westar.io/blog/starcoin_arch/images/starcoin_services.jpg)

- The NodeService in the node module express the node service, which represents a Starcoin node, it is mainly used to initialize the services required by the node and is the entry for the Starcoin node to start;
- The NetworkActorService of the network module represents a network service, which is used to process Starcoin network messages, such as establishing node connections, broadcasting blocks, synchronizing transactions, etc.;
- The RpcService of the rpc module represents the Rpc service, which is used to manage requests such as ipc, tcp, http and websocket, including management of external interfaces, traffic restrictions and other functions;
- The TxPoolService of the txpool module represents the transaction pool, which is used to manage local transactions and is one of the services most commonly used by general users;
- The TxnSyncService of the sync module represents the transaction synchronization service, which is used to synchronize transactions from other nodes in the Starcoin network;
- The SyncService of the sync module represents the block synchronization service, which is used to synchronize blocks from other nodes in the Starcoin network;
- The ChainReaderService of the chain module represents the read chain service, which is usually used for operations such as querying blocks and status;
- Storage of storage module represents the storage of the chain, and all chain-related data is stored in the Storage;
- The StratumService of the stratum module is a mining pool service, which implements the mining pool protocol and is used to deal with mining machines;
-  The MinerService of the miner module is a mining task management service, used to assemble blocks and generate mining tasks;
- The BlockConnectorService in the sync module represents the service of connecting blocks, propagating blocks synchronized from the network, blocks broadcasted in the network, and new blocks mined by local nodes to the chain;
- The WriteBlockChainService in the sync module represents the write service of the block, verifying the block, updating the block and state, and maintaining the latest chain state; 

The above are the core and important services of Starcoin, and there are some other services that are not introduced here. 

## Starcoin's Storage

We have learned core services of Starcoin,all service collaboration is to store data and ensure that the status of all distributed nodes is ultimately consistent. Therefore, we will introduce Starcoin's Storage-related content in depth.

Starcoin's data is stored in Storage. Before introducing Storage, let's briefly understand the two very special core data structures of Starcoin:

- MerkleAccumulator
- GlobalState Tree

### MerkleAccumulator

MerkleAccumulator, as shown in the below figure, is a core data structure of Starcoin, which is used to provide proof of blocks and transactions. The feature of MerkleAccumulator is that the leaf nodes can accumulate from left to right, and then build a tree-shaped MerkleAccumulator, and finally store the hash of the Root node in the block. The advantage of using MerkleAccumulator is that it is very easy to prove whether a block or transaction is on the chain. For example, the Proof of leaf node B in the figure is leaf node C,A and D. Starcoin cleverly designed two MerkleAccumulators to provide proof of  blocks and transactions separately, corresponding to the block_accumulator_root and txn_accumulator_root of BlockHeader, which are Starcoin's " two MerkleAccumulator". 

![starcoin_merkle_accumulator](http://westar.io/blog/starcoin_arch/images/starcoin_merkle_accumulator.png)



### GlobalStateTree

The design of Starcoin's GlobalStateTree is also very interesting. It consists of three trees with a two-layer structure, as shown in the below figure:      

- The Root of the AccountTree is the state_root of the BlockHeader
- The leaf nodes of the AccountTree are mapped to the ResourceRoot and CodeRoot of the other two Tree  
- The leaf nodes of the StateTree are mapped to the Data area data of Account 
- The leaf nodes of the CodeTree are mapped to the Code area data of the Account

![starcoin_state_tree](http://westar.io/blog/starcoin_arch/images/starcoin_state_tree.png)

The data of the two MerkleAccumulator and GlobalStateTree will eventually be stored in Storage and StateDB.

### Storage

Starcoin's Storage uses Key-Value's RocksDB to store all data such as blocks, transactions, and user status. As shown in the below figure, there are a total of 15 ColumnFamily (ID represents Hash):

- ChainInfo: Store the initialization data of nodes such as the Head Block of the master branch of the chain  
- Block: Store the mapping relationship between Block ID and Block
- BlockHeader: Store the mapping relationship between Block ID and BlockHeader
- BlockBody: Store the mapping relationship between Block ID and BlockBody
- BlockInfo: Store the mapping relationship between Block ID and BlockInfo
- BlockTransactions: Store the mapping relationship between Block ID and Transaction ID
- BlockTransactionInfos: Storethe mapping relationship between Block ID and TransactionInfo ID    
- FailedBlock: Store the block that failed the verification    
- Transaction: Store the mapping relationship between Transaction ID and Transaction    
- TransactionInfo: Store the mapping relationship between Transaction ID and TransactionInfo    
- TransactionInfoHash: Store the mapping relationship between TransactionInfo ID and Transaction ID    
- ContractEvent: Store the mapping relationship between TransactionInfo ID and Event    
- AccumulatorNodeBlock: Store the mapping relationship between the ID of AccumulatorNode and AccumulatorNode, the data of MerkleAccumulator belonging to Block   
- AccumulatorNodeTransaction: Store the mapping relationship between the ID of AccumulatorNode and AccumulatorNode, the data of MerkleAccumulator belonging to Transaction    
- StateNode: Store the mapping relationship between StateNode ID and StateNode, which belongs to the data of GlobalStateTree

![starcoin_storage](http://westar.io/blog/starcoin_arch/images/starcoin_storage.jpg)

### Move

We have introduced Starcoin's Service and Storage, both of them belong to the chain. Next, let's take a look of contract.

Starcoin uses Move as the smart contract language. There are two biggest features of Move:

- Resource-oriented programming, safe and reliable
- Oriented to generic programming, flexible and extensible

From a technical perspective, in addition to the two major differences between Move and Solidity, there are many advantages, mainly as follows:

- Ability feature is the cornerstone of Move's safety, Solidity does not have this feature
- Powerful modularity, Solidity cross-contract can only be called through Interface
- Pure static call, safe and reliable, Solidity dynamic call leads to many serious security vulnerabilities
- Richer function visibility
- Struct types can be accessed across Modules, Solidity can only use basic types across Contracts
- Complete testing system, Move has complete UnitTest and FunctionalTest
- Formal verification, Solidity's formal verification is still in the initial stage of exploration, unavailable, basically equivalent to zero
- Easily build complex systems, it is difficult for Solidity to write systems with more than ten thousand lines of code

Move has many other advantages. It can be said that Move is a revolution of smart contracts. Therefore, Starcoin chose Move as the smart contract language. In the Starcoin ecosystem, there are already many excellent Move projects such as shown in the below figure: 

- DAO
- Bridge
- Swap
- NFT
- Oracle
- Lending
- StableCoin
- IDO
- INO
- GmeFi
- Others

![starcoin_move_defi](http://westar.io/blog/starcoin_arch/images/starcoin_move_defi.jpg)

## Conclusion

No matter from the perspective of the chain or from the perspective of the contract, Starcoin has many interesting aspects in its design. Westar Lab explore in depth the source code of Starcoin, and interpreted Starcoin from a technical point . More interpretations of the source code of  Starcoin will be gradually updated. Welcome everyone to follow us.
