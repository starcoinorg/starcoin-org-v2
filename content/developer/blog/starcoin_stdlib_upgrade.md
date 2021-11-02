---
title: Starcoin's stdlib upgrade and DAO on-chain governance
weight: 9
---



```
* By Starcoin community  author：WGB
```

 

Starcoin is different from other public blockchain, it pre-define consensus, block settings, block rewards, account definition, Token definition, NFT protocol, etc. in stdlib library, in order to unify the management, such as, upgrade and maintain. Stdlib is contract library on blockchain, so Starcoin does no need to use *<u>hard code</u>* to implement block rewards, block algorithms, consensus and other difintions, at the same time, stdlib can be upgraded and fixed by DAO on-chain management.



## Smart contract: Starcoin vs ETH

1. Smart contract programming language

   | Item     | Difference                                                   |
   | -------- | ------------------------------------------------------------ |
   | ETH      | General smart contract language in ETH is solidity(no standard library) |
   | Starcoin | Smart contract language in Starcoin is Move. There are module and script in Move, and also stdlib(official standard libray ) |

   ETH: Most of smart contract are built with Solidity,in development process,some Tokens such as ERC-20 tokens, you need to implement by yourself,there is no stdlib standard library.

   Starcoin: Starcoin use Move as smart contract language, Move has module and script concept, module is used to write basic code,  work with script together. There is stdlib in Starcoin,  ERC20, NFT, DAO,etc. are built-in implementation, and Move supports generics, it's easily to create different Token and other functionalities.

2. Smart contract call and storage

   | Item     | Difference                                                   |
   | -------- | ------------------------------------------------------------ |
   | ETH      | call smart contract: contract address + function + data      |
   | Starcoin | call smart contract: address of the contract owner + module + function + data |

   ETH: There are two different type of addresses: contract address and non-contract address, contracts are stored to contract's address,so you need one contract's address when you call this contract. You will need to change contract address if you do not use proxy contract after the contract was upgraded.

   Starcoin: Starcoin's contract and other resources are stored to the account's address,so you need address of the contract's owner and module to call this contract. Upgrade of the contract does not effect the contract's call address and module's name.

   

3. Smart contract upgrade

   | Item     | Difference                                                   |
   | -------- | ------------------------------------------------------------ |
   | ETH      | Contract upgrade manes new contract address, approximately equal to a new contract, need to change to new contract address so that you can call new contract |
   | Starcoin | Contract upgrade does not affect contract call,  you still use address of the contract owner + module + function + data to  call new contract |

   ETH: You can use proxy contract if you do not want to change call address after contract upgrade, you can access proxy contract address, and proxy contract can provide new contract address.

   Starcoin:  Starcoin's contract needs to upgrade, it's need to vote in DAOs, process in Two-phase. You can you use original address of the upgraded contract if the vote result is "approval ".

   

## Smart contract upgrade scheme: Starcoin vs ETH

Starcoin's stdlib exist on the blockchain, use DAO to make decentralized management, community can make decisions to upgrade contract by vote. There are two phases when you submit code: submit upgrade scheme, submit upgraded code. 

There are seven phase in the whole process, as the figure show:

1. PENDING
2. ACTIVE
3. AGREED
4. QUEUED
5. EXECTABLE
6. ETRACTED
7. Upgrade complete

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvcjr15ke2j60p10g575o02.jpg" alt="合约升级流程" style="zoom:70%;" />

### 1. PENDING

The coder will submit a upgrade proposal txn to DAO after codes are modified, the process now in PENDING state. The process will go into next state after a period of time ,during this time, community will discuss and find out the proposal.

### 2. ACTIVE

After the previous state is finished, will go into ACTIVE state, in this state, members in this  community need to vote, after the specified time, process will go into next state.

### 3. AGREED

In this stage, the vote result from previous state will be counted, if it exceeds predetermined proportion, it's deemed the upgrade scheme is approved by the DAO. The process will go into next state after initiate publicity.

### 4. QUEUED

The process now in publicity period, in this stage, the main purpose is to display initiator and the proposal. The process will enter the next state after the publicity period has passed.

### 5. EXECTABLE

Now is the first phase of the Two-phase, submit contract code upgrade scheme. The process will enter the next state after submission is done.

### 6. ETRACTED

The state is the second phase of the Two-phase, you can submit our fix or upgrade code. The process will go into the next state after submission is finished.

### 7. UPGRADE COMPLETE

All process is finished now. You can use new contract code after this state.



## Contract upgrade practice

1. Write code in stdlib

   We use DummyToken.move in stdlib as an example, add one Mymint fuction and Mymint script. The functionality is to create 100 DummyToken.

   ###### DummyToken Module in DummyToken.move

   ```Move
   /// Anyone can mint DummyToken, amount should < 10000
       public fun mint(_account: &signer, amount: u128) : Token<DummyToken> acquires SharedMintCapability{
           assert(amount <= 10000, Errors::invalid_argument(EMINT_TOO_MUCH));
           let cap = borrow_global<SharedMintCapability>(token_address());
           Token::mint_with_capability(&cap.cap, amount)
       }
   
       // Add Mymint function here 
       public fun Mymint(_account: &signer) : Token<DummyToken> acquires SharedMintCapability{
           let cap = borrow_global<SharedMintCapability>(token_address());
           Token::mint_with_capability(&cap.cap, 100)
       }
   
       /// Return the token address.
       public fun token_address(): address {
           Token::token_address<DummyToken>()
       }
   ```

   

   ###### DummyTokenScripts Module in DummyToken.move

   ```Move
       public(script) fun mint(sender: signer, amount: u128){
           let token = DummyToken::mint(&sender, amount);
           let sender_addr = Signer::address_of(&sender);
           if(Account::is_accept_token<DummyToken>(sender_addr)){
               Account::do_accept_token<DummyToken>(&sender);
           };
           Account::deposit(sender_addr, token);
       }
   
       //Add script Mymint function here
       public(script) fun Mymint(sender:signer){
           let token = DummyToken::Mymint(&sender);
           let sender_addr = Signer::address_of(&sender);
           if(Account::is_accept_token<DummyToken>(sender_addr)){
               Account::do_accept_token<DummyToken>(&sender);
           };
           Account::deposit(sender_addr, token);
       }
   ```

   

2. Compile Module to bytecode

   In Starcoin command line to execute command: compile and package module bytecode

   Compile:

   ```shell
   Execute：
       dev compile -s 0x1 path/to/DummyToken.move
   
   Result：
       {
           "ok": [
               "path/to/DummyToken.mv",
               "path/to/DummyTokenScripts.mv"
           ]
       }
   ```

   Package:

   ```shell
   Execute：
       dev package -n MymintUpgrade -o storage path/to/DummyToken*
   
   Result：
       {
           "ok": {
               "file": "path/to/storage/MymintUpgrade.blob",
               "package_hash": "0x6e54935144115233c9decb255d3bcd5f14c7b9d82c968c5f3a0cb1b14f18bce8"
           }
       }
   ```

3. Prepare accounts and balance

   ###### Prepare accounts:

   You need two accounts: 

   1: coder account: to submit scheme and code

   2: Voting representative account: to vote

   Use key to import account or account create to create new account 

   ###### Prepare balance:

   1: The coder account needs a certain amount of STC as GAS fee to pay some operation such as: submit and upgrade 

   2:  Voting representative account needs large amount of STC as votes. Use command line "account unlock account address" to unlock this account to obtain STC

   

   ```shell
   Default account：
       dev get-coin -v 6000000STC
   Transfer：
       account transfer -s 0x0000000000000000000000000a550c18 -r <Account Collection Identification Code > -v 60000000000000000 -b
   ```

    

4. Submit Proposal, enter PENDING

   

   ```shell
   Submit proposal：
       dev module-proposal -s <account address> -m <module path> -v <version> -e false
   ```

   ###### -m: [Path]of upgrade package

   ###### -v: New version number

   ###### -e: false: Does not skip compatibility check. Default value is false

5. Check the state of your proposal

   ###### Check proposal id:

   ```shell
   dev call --function 0x1::Dao::proposal_info -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address>
   ```

   ###### Check proposal state:

   ```shell
       dev call --function 0x1::Dao::proposal_state -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address> --arg <proposal_id>
   Result:
       {
           "ok": [
               <state_num>
           ]
       }
   ```

6. Wait for community discussion to enter ACTIVE

   The PENDING state will last a period of time, then enter vote period, you can accelerate block time by setting sleep in dev.

   ```shell
   Accelerate：
       dev sleep -t 3600000
   Generate block（Effective time）：
       dev gen-block
   ```

   ###### Check proposal state:

   ```shell
   Execute：
       dev call --function 0x1::Dao::proposal_state -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address> --arg <proposal_id>
   Result：
       {
           "ok": [
               2
           ]
       }
   Become ACTIVE state
   ```

   

7. Community vote,enter AGREED

   Use voting account to vote, then wait for the voting time to finish, process will enter AGREED stage

   ```shell
   Vote：
       account execute-function -s <account address> --function 0x1::DaoVoteScripts::cast_vote -t 0x1::STC::STC -t 0x1::UpgradeModuleDaoProposal::UpgradeModuleV2 --arg <proposal address> --arg <proposal_id> --arg true --arg 59000000000000000u128
   ```

8. The AGREED proposal will enter update queue, enter QUEUED

   After enter AGREED state, anyone can put AGREED proposal into the queue

   ```shell
   dev module-queue -s <account address> -a <proposal address> -i <proposal_id>
   ```

9. Waiting during publicity period, enter EXECTABLE

   After publicity period is finished, enter EXECTABLE state. You can accelerate this stage by command line in dev.

   ```shell
   Accelerate：
       dev sleep -t 3600000
   Generate block（Effective time）：
       dev gen-block
   ```

10. Submit upgrade scheme, enter ETRACTED

    This is executable stage, you can execute your upgrade plan.

    ```shell
    dev module-plan -i <proposal_id> -a <proposal address>  -s <account address>
    ```

11. Submit code, enter Upgrade complete

    DAO process is finished in this stage. This is the second phase of the Two-phase. Code segement:

    ```shell
    dev module_exe -m path/to/storage/MymintUpgrade.blob -s <account address>
    ```

12. Complete contract upgrade process

    Contract upgrade process is complete.

13. Verify upgrade

    Execute Mymint in DummyTokenScripts to verify the upgrade  

    ```shell
    To get 100 DummyToken：
        account execute-function --function 0x1::DummyTokenScripts::Mymint -b -s <account address>
    Check DummyToken：
        account show <account address>
    Result：
        "balances": {
          "0x00000000000000000000000000000001::DummyToken::DummyToken": 100,
          "0x00000000000000000000000000000001::STC::STC": 9999645054
        }
    ```