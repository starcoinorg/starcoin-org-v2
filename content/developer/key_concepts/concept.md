+++
title = "Node Key Concept"
weight =  "9"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
+++

<br />

**Trading**



SignedUserTransaction is the basic concept of the Starcoin blockchain and is the entry point for users to interact with the chain. The user updates the ledger status on the chain by submitting the signed transaction through the client.



The signed transaction consists of two parts: Authenticator and RawUserTransaction, as shown in the figure:



![Transaction](/img/key_words/Transaction.png)



Authenticator has ED25519 and MULTIED25519.



RawUserTransaction includes the following:



-* *sender**-sender**-sender**-sender**-sender**

-**SEQUENCE_NUMBER**-- Sequence number, 8 bytes, an unsigned integer, must be equal to the sequence number stored under the sender account

-**expiration_timestamp_secs**- I would like you to expiration_timestamp_secs**

-**chain_id**-- Network identifier, 1 byte, distinguishing between different networks

-**MAX_GAS_AMOUNT**-- Maximum number of Gas, 8 bytes

-**gas_unit_price**-- Gas unit, 8 bytes

-**GAS_TOKEN_CODE**-- Token to pay for Gas, default STC, length dependent on Token

-**Payload**-- Transaction data, containing 3 types (Script, ScriptFunction, Package). Undetermined length

-script: Customize smart contract scripts

-Package: Deploy and update smart contracts

-ScriptFunction: A script function that calls a smart contract









**Block Head**



The BlockHeader, the BlockHeader, represents the state of the chain after all transactions contained in the current block have been executed. BlockHeader is the core concept of the Starcoin blockchain and contains important data.



![BlockHeader](/img/key_words/BlockHeader.png)



The meaning of each field in the figure is as follows:



-**parent_hash**-- parent_hash (32 bytes) refers to the parent block hash, linking all blocks together

-**timestamp**- timestamp**

-**number**-- Block height, 8 bytes, incremented by the height of the parent block

-**author**-- Miner signature, 16 bytes

-**author_auth_key**-- Miner's auth_key, 32 bytes, optional, used to create the miner's on-chain account for the first time

-**txn_accumulator_root**-- After all transactions for the current block have been executed, the Merkle accumulator for the transaction root, 32 bytes, see [Merkel accumulator](# Merkel accumulator)

-**block_accumulator_root**-- The parent block's Merkle accumulator root, 32 bytes, see [Merkle accumulator](# Merkle accumulator)

-**STATE_ROOT**-- Global state tree root, 32 bytes, after all transactions in the current block have been executed, see [global state tree](# global state tree).

-**Difficulty**-- Minimum difficulty for the current block, 32 bytes

-**body_hash**-- The current block's BlockBody hash, 32 bytes

-**gas_used**-- Total Gas consumed by all transactions in the current Block, 8 bytes

-**chain_id**-- Network identifier, 1 byte, distinguishing between different networks

-**Nonce**-- Calculated Nonce, 4 bytes

-**Extra**-- Block header extended data, 4 bytes







**Block**



A Block contains an ordered set of transactions and the state of those transactions after they are executed in that order. Blocks are the core concept of the Starcoin blockchain, as shown in the figure:



![Block](/img/key_words/Block.png)



A Block contains a BlockHeader and a BlockBody. The Blockbody consists of two parts:



-**Uncles**- Block BlockHeader array, optional, see [BlockHeader](# BlockHeader)

-**Transactions**-- Transactions array, see [Transactions](# Transactions)







**Global state tree**



The GlobalStateTree GlobalStateTree stores the state of all user accounts on the chain. Starcoin blockchain uses a two-layer sparse Merkle tree, SparsMerkletree, as the state tree, as shown below:



![SparseMerkleTree](/img/key_words/State.png)



In the figure above, red circles represent leaf nodes, blue circles represent intermediate nodes, and green squares represent placeholders (indicating that there is no data under the subtree).



Since Starcoin accounts store both state data and code data, all states are stored through two layers of three sparse Merkle trees:



* AccountTree: Account tree where Root is the state_root of the BlockHeader

* Statetree: State tree

* CodeTree: The CodeTree



As shown in the figure, if you want to prove that the status of account B is valid, Proof is ACD.







**Merkel accumulator**



MerkleAccumulator MerkleAccumulator is another core data structure of the Starcoin blockchain, which is used to provide proof of blocks and transactions. Its structure is shown in the figure below:



![MerkleAccumulator](/img/key_words/Proof.png)



MerkleAccumulator MerkleAccumulator is a Merkel accumulator where leaf nodes can be continuously added from left to right, thus continuously accumulating.



Starcoin blockchain has designed two merkle accumulators, namely block merkle accumulator and transaction merkle accumulator. The red circle in the figure above represents leaf nodes, and the corresponding block is the block and the corresponding transaction is the transaction. The blue circles represent intermediate nodes. Therefore, Starcoin blockchain is very convenient to provide Proof for blocks or transactions. For example, the Proof of leaf node B in the figure above is CAD.
