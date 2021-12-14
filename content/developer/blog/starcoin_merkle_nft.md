---
title: Starcoin's Standard NFT Protocol: In Action
weight: 8
---

```
* By Starcoin community
```


## Starcoin's Standard NFT Protocol

Starcoin uses Move as the smart contract language, and cleverly uses the advantages of the Move language to define a set of secure and extensible standard NFT protocols, which are simple and efficient. Compared with Ethereum's NFT protocol, Starcoin's standard NFT protocol has richer features. Many applications are implement under Starcoin's standard NFT protocol, such as CyberRare, IdentifierNFT, etc. Here is another application scenario.

![cyber_rare](https://tva1.sinaimg.cn/large/008i3skNly1gvnvu7qelyj613k0boaay02.jpg)

Let us imagine such a scenario. For example, the anniversary celebration of a certain NFT platform, to give back to users, a group of users can receive a commemorative version of NFT. In this case, the usual practice is to submit the addresses of these users to the chain. But if there are a lot of Addresses, this method will have some problems when dealing with it like this:

- Limitation of  size of a single transaction;
- Problems related to large arrays are prone to occur. Traverse the large arrays to find Addresses, which may cause the gas fee to increase sharply. If the Gas exceeds the maximum limit, the Address behind the array will not receive the NFT;

There are many similar scenarios, such as airdrop activities and so on. For this scenario, Starcoin designed a MerkleNFT module based on the standard NFT protocol, which can easily solve the problems encountered above. Let's dive into the source code to understand the MerkleNFT module.

## MerkleNFT Principle Analysis

MerkleNFT is an interesting application designed based on the Starcoin standard NFT protocol, using MerkleTree and the standard NFT protocol.

1. MerkleTree

   

   ![starcoin_nft_merkle](https://tva1.sinaimg.cn/large/008i3skNly1gvo5f6rsthj609q06xglu02.jpg)

   The above figure is an example of a typical MerkleTree. Those who understand the structure of Bitcoin blocks should know that there is a Merkle Root in the block header, which records the Root of the block transaction. If you want to verify whether a transaction is in the block, you only need to construct the MerkleRoot using the transaction and the transaction's Proof. If it is the same as the block's MerkleRoot, it proves that the transaction exists in the block.

2. MerkleNFT

   MerkleNFT also uses such a MerkleTree. As shown in the figure above, the leaf node is replaced with the address of the account, and the MerkleRoot is Hash12345678. If you want to prove that Address3 is on MerkleTree, Proof is (Address4, Hash12, Hash5678).

   In the previously assumed anniversary celebration of a certain NFT platform, the NFT collection process is as follows:

   1. First generate a MerkleTree under the chain, and the leaf node is the Address of all the users;
   2. Then only need to submit the Merkle Root and NFT information of MerkleTree to the chain and save it in the MerkleNFT contract;
   3. Distribute the Proof corresponding to each Address to users off-chain;
   4. The user calls the MerkleNFT contract with Proof to receive his own commemorative NFT;

## MerkleNFT Source Analysis

We have learned about the core principles and ingenious design of MerkleNFT. We continue to dive into the source code of MerkleNFT to learn about the Move implementation of the MerkleNFT contract.

```Move
public fun verify(proof: &vector<vector<u8>>, root: &vector<u8>, leaf: vector<u8>): bool
```

The above is the function "verify" for verifying Proof in the MerkleProof module. The function of MerkleProof is very clear. The main logic is to assemble the proof and leaf nodes submitted by the user, and then determine whether it is equal to the submitted root.

The logic related to NFT is in the MerkleNFTDistributor module.

```Move
struct MerkleNFTDistribution<NFTMeta: copy + store + drop> has key {
        merkle_root: vector<u8>,
        claimed_bitmap: vector<u128>,
    }
    
    public fun register<NFTMeta: copy + store + drop, Info: copy + store + drop>(signer: &signer, merkle_root: vector<u8>, leafs: u64, info: Info, meta: Metadata): MintCapability<NFTMeta>
    
    public fun mint_with_cap<NFTMeta: copy + store + drop, NFTBody: store, Info: copy + store + drop>(sender: &signer, cap:&mut MintCapability<NFTMeta>, creator: address, index: u64, base_meta: Metadata, type_meta: NFTMeta, body: NFTBody, merkle_proof:vector<vector<u8>>): NFT<NFTMeta, NFTBody>
        acquires MerkleNFTDistribution
```

The logic of MerkleNFTDistributor is concise. It implements NFT registration and mint functions in the standard NFT protocol:

- MerkleNFTDistribution does not have copy and drop ability , and has good security. The most important role is to store data such as Merkle Root;
- The register function calls the register of the NFT protocol to register the metadata of the NFT;
- The function mint_with_cap is the NFT required by mint users and the function also calls the NFT protocol. It is important to note that the user needs to pass MerkleTree-related parameters such as merkle_proof, and the verify of the MerkleProof module will be called for verification, and only the verification is passed,an mint is succeed;

The MerkleProof module and MerkleNFTDistributor module are the core implementations of MerkleNFT. The whole logic is very clear and concise. The design uses MerkleTree ingeniously to reduce the logic complexity. It is an interesting application scenario of the NFT protocol. Those who interested can view the complete source code.

## Conclusion

Starcoin's NFT protocol is a very complete set of tools with good security and scalability. It is foreseeable that there will be a lot of scenarios for development in the future. MerkleNFT and GenesisNFT cleverly combine MerkleTree with the NFT protocol to easily solve difficult problems such as large arrays. It is believed that it will be very useful in scenarios such as NFT airdrops.