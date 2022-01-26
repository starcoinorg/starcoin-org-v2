---
title: In-depth Practice, Use Starcoin's DAO to Update On-chain Configuration
weight: 39
---

```
* By Starcoin community 
```

This article is appropriate for users who have a certain understanding of Move and Starcoin, and have a basic knowledge of DeFi development. If you are new to Starcoin and Move, please read Move in Action first. This article mainly introduces how Starcoin be used to implement distributed and decentralized voting for on-chain governance. After reading this article, you can:

1. Learn how to implement decentralized voting on Starcoin
2. Learn how to implement decentralized voting on Starcoin to reach consensus using Starcoin's native Layer 2 and Move, to implement some custom definition.
3. Learn how to implment DAO with Move Promgramming language on Starcoin.

## Background

DAO is a decentralized autonomous organization. Its abstract expression is that a person in a group of people proposes a consensus, this consensus is usually decentralized, transparent, not affected by any centralized organization, and verified by blockchain, this consensus is used to implement to perform the intended behavior after getting unified by everyone. The concrete expression is a type of smart contract in DeFi. This type of smart contract can manage the behavior modes of other smart contracts (such as configuration, upgrade, etc.), usually a proposal is proposed by an account, and some stakeholders participate in voting. 

## Starcoin DAO Process

The DAO governance process in Starcoin can be summarized by the following diagram: 

![f5e8e3fb015a4a7c40d10193f1e3080d.png](https://tva1.sinaimg.cn/large/008i3skNly1gyl1t29buhj31bf0u0gpa.jpg)

### Role

There are the following roles in this process: the DAO project initiator (Coder), the person participating in the proposal in the DAO (Everyone), the miner (Miner), and anyone (Anyone), in addition, there is a proposal (Proposal) the concept of.

- Coder: The project initiator, is mainly responsible for initiating the proposal and maintaining part of the execution logic code of the proposal (that is, what the proposal does is determined by the project). Currently, the stdlib library provides two built-in proposal categories, configuration modification and contract upgrade, for upper-layer contract calls.
- Everyone: Project participants, voting participants of the proposal, if it exceeds X% (X is a configured value), the proposal is approved and enters the execution process, otherwise it will be rejected by the system;
- Miner: The miner that executes the contract.
- Anyone: Here specifically refers to all users on the chain

### Proposal

In addition, there is a concept of proposal (Proposal), a proposal represents the entire process of initiation, voting, and execution, which includes the following states:

- PEDDING, the voting waiting stage. After a proposal is submitted to the chain, it will take some time for all voting participants or the community to discuss the proposal.
- ACTIVE, the voting activation stage. During this time period, anyone can cast a 'yes' or 'no' vote under the proposal.
- AGREED, voting consent stage. If the 'yes' percentage votes in the ACTIVE stage reaches X%, this stage will be reached automatically.
- QUEUED, the voting result announcement period. At this stage, you can query the voting results, sponsors, and Proposal information.
- EXECUTEABLE, the executable stage. At this stage, the actions of the contract can be executed. Due to the passive nature of the blockchain contract, a person is required to drive the proposal execution, and this person can be anyone.
- EXCTRACTED, the executed stage, this state is mainly used to distinguish whether the proposal has been executed. Since DAO is abstracted into a Proposal at the Move contract code layer, the action that needs to be executed will be put into the contract as a structure for process management during the proposal, and the structure will be extracted when it needs to be executed to do the corresponding Action, the state after this execution is EXCTRACTED, which will be discussed in detail in the code analysis chapter.

## In Action

This section mainly introduces how to use Move to implement the relevant code of DAO, and how to release a test governance token to participate in the DAO governance voting, and deploy and test the contract in the local environment of Starcoin. About how to use DAO to upgrade the contract, you can Refer to Starcoin's stdlib upgrade and Dao on-chain governance. 

### Scenario Assumption

For example, we have released a project in Starcoin. There is a specific value in the project that needs to be modified from the initial 0 to 100. We use the DAO voting process to modify it. After success, we need to read the value as100. Let's practice how to simulate in the local environment by writing code to achieve the corresponding requirements.

### Environment Preparation

Take the mac OS system as an example here, download the latest version of the corresponding platform of the Starcoin build package](https://github.com/starcoinorg/starcoin/releases), save in any local directory, you need to add the bin directory to the PATH environment variable, if you execute the command to check the version number, it can be printed correctly, indicating that the installation is successful. 

```bash
% export PATH=$PATH:~/Downloads/starcoin-artifacts
% starcoin --version 
starcoin 1.9.0-rc.2 (build:v1.9.0-rc.2-2-g2fb4113cc)

% move --version
move 1.9.0-rc.2
```

### Code

Use the 'move scaffold' command to create a new project mock-swap-config (code reference star-dao-mock)

```shell
% move scaffold mock-swap-config
% ls -R mock-swap-config
args.txt	src		tests

mock-swap-config/src:
modules	scripts

mock-swap-config/src/modules:

mock-swap-config/src
```

The project has been built, we need to use IDE to open this directory. It is recommended to use Intellij's IDEA or CLion. First we need to issue a token to support our contract for DAO voting, we call it STD. Second, you need to write a configuration management contract and another contract that handles proposal submission and execution. Add the following files, where SWP.move is the governance token, MockSwapConfig.move is the mock Swap configuration, and MockSwapProposal.move is the mock Swap proposal processing contract.

 

```shell
# Add file in src/modules：
./src/module/STD.move
./src/module/MockModuleConfig.move
./src/module/MockModuleDaoProposal.move
./src/module/MockModuleDaoProposalScript.move
```

#### STD.move Code

```Move
//{
//    "ok": {
//        "account": "0xcccf61268df4d021405ef5d4041cb6d3",
//        "private_key": "0xb518999b30451faeb590ff71af971b2a674511bb4b73a17d9d3eeadce727b1b4"
//    }
//}

address 0xcccf61268df4d021405ef5d4041cb6d3 {
/// STD is a governance token of Starcoin blockchain DAPP.
/// It uses apis defined in the `Token` module.
module STD {
    use 0x1::Token;
    use 0x1::Account;
    use 0x1::Signer;
    use 0x1::Dao;

    /// STD token marker.
    struct STD has copy, drop, store {}

    /// precision of STD token.
    const PRECISION: u8 = 9;

    const ERROR_NOT_GENESIS_ACCOUNT: u64 = 10001;

    /// STD initialization.
    public fun init(account: &signer) {
        Token::register_token<STD>(account, PRECISION);
        Account::do_accept_token<STD>(account);

        Dao::plugin<STD>(
            account,
            100,
            1000000,
            10,
            100,
        );
    }

    // Mint function, block ability of mint and burn after execution
    public fun mint(account: &signer, amount: u128) {
        let token = Token::mint<STD>(account, amount);
        Account::deposit_to_self<STD>(account, token);
    }

    /// Returns true if `TokenType` is `STD::STD`
    public fun is_std<TokenType: store>(): bool {
        Token::is_same_token<STD, TokenType>()
    }

    spec is_abc {
    }

    public fun assert_genesis_address(account : &signer) {
        assert(Signer::address_of(account) == token_address(), ERROR_NOT_GENESIS_ACCOUNT);
    }

    /// Return STD token address.
    public fun token_address(): address {
        Token::token_address<STD>()
    }

    spec token_address {
    }

    /// Return STD precision.
    public fun precision(): u8 {
        PRECISION
    }

    spec precision {
    }
}
}
```

Note that the json object in the file header is the key pair derived from the starcoin node. We can use the 'account create' command in the starcoin console to generate the key pair, or directly import the existing key pair.

The relevant code of MockSwapConfig.move. This contract is mainly used for the management of simulation configuration. There is a corresponding configuration class 0x1::Config in Starcoin's stdlib library, which can implement general configuration management and event release. To achieve the demonstration effect, a simple configuration management contract, which mainly provides initial, modification, and query operations. The ability to modify the configuration is hosted to ParameterModifyCapability, so that the configuration can be modified when needed.

```Move
address 0xcccf61268df4d021405ef5d4041cb6d3 {

module MockModuleConfig {
    use 0x1::Token;
    use 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD;

    struct ParameterModifyCapability has key, store {}

    struct MockConfig has key, store {
        mock_config_val: u128,
    }

    public fun init(signer: &signer, mock_config_val: u128) : ParameterModifyCapability {
        move_to(signer, MockConfig {
            mock_config_val
        });
        ParameterModifyCapability {}
    }

    public fun modify(_cap: &ParameterModifyCapability, val: u128) acquires MockConfig {
        let addr = Token::token_address<STD>();
        let conf = borrow_global_mut<MockConfig>(addr);
        conf.mock_config_val = val;
    }

    public fun query(): u128 acquires MockConfig {
        let addr = Token::token_address<STD>();
        let conf = borrow_global_mut<MockConfig>(addr);
        conf.mock_config_val
    }
}
}
```

####  MockModuleDaoProposal.move Code

```Move
address 0xcccf61268df4d021405ef5d4041cb6d3 {

module MockModuleDaoProposal {
    use 0x1::Dao;
    use 0x1::Token;
    use 0x1::Signer;
    use 0x1::Errors;
    use 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD;
    use 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleConfig::{ParameterModifyCapability, Self};

    const ERR_NOT_AUTHORIZED: u64 = 101;

    struct MockModuleDaoProposalCapWrap has key, store {
        cap: ParameterModifyCapability,
    }

    struct MockModuleDaoProposalAction has copy, drop, store {
        mock_config_val: u128,
    }

    /// Add dao of mock module proposal action
    public fun plugin(account: &signer, cap: ParameterModifyCapability) {
        let token_issuer = Token::token_address<STD>();
        assert(Signer::address_of(account) == token_issuer, Errors::requires_address(ERR_NOT_AUTHORIZED));

        move_to(account, MockModuleDaoProposalCapWrap { cap })
    }

    /// Start a proposal
    public fun submit_proposal(
        signer: &signer,
        mock_config_val: u128,
        exec_delay: u64) {
        Dao::propose<STD, MockModuleDaoProposalAction>(
            signer,
            MockModuleDaoProposalAction { mock_config_val },
            exec_delay,
        );
    }

    public fun proposal_state(account: address, proposal_id: u64): u8 {
        Dao::proposal_state<STD, MockModuleDaoProposalAction>(account, proposal_id)
    }

    /// Perform propose after propose has completed
    public fun execute_proposal(proposer_address: address,
                                proposal_id: u64) acquires MockModuleDaoProposalCapWrap {
        let MockModuleDaoProposalAction { mock_config_val } =
            Dao::extract_proposal_action<STD, MockModuleDaoProposalAction>(proposer_address, proposal_id);
        let wrap = borrow_global_mut<MockModuleDaoProposalCapWrap>(proposer_address);
        MockModuleConfig::modify(&wrap.cap, mock_config_val);
    }
}
}
```

MockModuleDaoProposalScript provides business operation entry functions for the overall contract. 

```Move
address 0xcccf61268df4d021405ef5d4041cb6d3 {

module MockModuleDaoProposalScript {

    use 0x1::Signer;
    use 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleConfig;
    use 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal;
    use 0xcccf61268df4d021405ef5d4041cb6d3::STD;

    /// demostrate for publish token and initialize dao environment
    public(script) fun init(signer: signer, mint_amount: u128) {
        assert(Signer::address_of(&signer) == @0xcccf61268df4d021405ef5d4041cb6d3, 101);

        STD::init(&signer);
        STD::mint(&signer, mint_amount);

        let cap = MockModuleConfig::init(&signer, 0);
        MockModuleDaoProposal::plugin(&signer, cap);
    }

    public(script) fun proposal(signer: signer,
                                mock_config_val: u128,
                                exec_delay: u64) {
        MockModuleDaoProposal::submit_proposal(
            &signer,
            mock_config_val,
            exec_delay);
    }

    public(script) fun execute_proposal(proposer_address: address,
                                        proposal_id: u64) {
        MockModuleDaoProposal::execute_proposal(
            proposer_address,
            proposal_id);
    }

    public fun query(): u128 {
        MockModuleConfig::query()
    }
}
}
```

## Local Deployment

First, use the Move command in the project directory to compile the contract code, and package and publish it to the local directory. After executing this command, a new folder ./build/ will be generated under the project root, and the corresponding binary files will be generated under under the ./build/ folder, which is convenient to package and deploy. In addition, the move check command will check whether all modules in the current project have syntax errors, and if so, it will output an error message.

```shell
% move clean
% move check
% move publish
```

After configuring the binary package of starcoin, open the command prompt window and enter the following command, it will output information and start the local node, and start the node console .

```shell
% starcoin -n dev console

# Start console
...
...
2021-12-28T21:03:19.197119+08:00 INFO - Service starcoin_rpc_server::service::RpcService start.
2021-12-28T21:03:19.197147+08:00 INFO - starcoin_rpc_server::service::RpcService service actor started
2021-12-28T21:03:19.201689+08:00 INFO - ChainWater actor started
2021-12-28T21:03:19.225381+08:00 INFO - Start console, disable stderr output.
starcoin% 
```

An address is needed to represent which account the current contract belongs to, so it can only be deployed by this account. Find the private key in the key pair of the account in the file header comment in STD.move above, import it into the node's wallet, and set it as the default account. After the setup is complete, use the dev get-coin command to allocate STC tokens to the account. Only accounts with STC tokens can deploy the contract. Instructions about console commands can be queried using the help subcommand.

 

```shell
# Import accounts
starcoin% account import -i 0xb518999b30451faeb590ff71af971b2a674511bb4b73a17d9d3eeadce727b1b4
{
  "ok": {
    "address": "0xcccf61268df4d021405ef5d4041cb6d3",
    "is_default": false,
    "is_readonly": false,
    "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
    "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
  }
}
# Set default account
starcoin% account default 0xcccf61268df4d021405ef5d4041cb6d3
{
  "ok": {
    "address": "0xcccf61268df4d021405ef5d4041cb6d3",
    "is_default": true,
    "is_readonly": false,
    "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
    "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
  }
}

# Obtain STC token
starcoin% dev get-coin 0xcccf61268df4d021405ef5d4041cb6d3
txn 0x9b417212b682f95b30950401d213de93d341016948e7562b5633b94e80663041 submitted.
{
  "ok": {
    "block_hash": "0xbdec81f4d6f85bfbfa26ac650017cab231f93c500cc49160849b3b2abeb2a97c",
    "block_number": "1",
    "transaction_hash": "0x9b417212b682f95b30950401d213de93d341016948e7562b5633b94e80663041",
    "transaction_index": 1,
    "transaction_global_index": "2",
    "state_root_hash": "0xeb5895db7b3078c34c0c795c2bd784d7ecf8ee7fa6f5869e4382ce53c8fa8d5d",
    "event_root_hash": "0x174b2db93b42b3bd41a3fc8161fad642af80ffa0fb272768697855935a0617a4",
    "gas_used": "119871",
    "status": "Executed"
  }
}

# Use command line to view the STC quota in this current account
starcoin% account show 
{
  "ok": {
    "account": {
      "address": "0xcccf61268df4d021405ef5d4041cb6d3",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
      "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
    },
    "auth_key": "0x01cf8ea9221db5f76052aa283709eceecccf61268df4d021405ef5d4041cb6d3",
    "sequence_number": 0,
    "balances": {
      "0x00000000000000000000000000000001::STC::STC": 1000000000
    }
  }
```

Use the following command in the console to package the project file, we specify to output a packaged file packaged.blob in the ./build/ directory.

```shell
starcoin% dev package -o ./build -n packaged ./storage/0xcccf61268df4d021405ef5d4041cb6d3/
{
  "ok": {
    "file": "./build/packaged.blob", # file name
    "package_hash": "0xb60a270a0314c75baf04d135079075c1eea6dc468693be4c28cc0247eb86f641" #packaged hash value
  }
}
```

We can deploy directly, if the dry_run status in the returned information is Executed, the deployment is complete.

```shell
starcoin% dev deploy ./build/packaged.blob -b
Use package address (0xcccf61268df4d021405ef5d4041cb6d3) as transaction sender
txn 0xeadb0391b1a76b7b485d0bae5b865e00cc96d6aab7b238cb87489b78412fcb25 submitted.
{
  "ok": {
    "raw_txn": {
      "sender": "0xcccf61268df4d021405ef5d4041cb6d3",
      "sequence_number": "0",
      "payload":[
      		...
          ],
          "init_script": null
        }
      },
      "max_gas_amount": "10000000",
      "gas_unit_price": "1",
      "gas_token_code": "0x1::STC::STC",
      "expiration_timestamp_secs": "3608",
      "chain_id": 254
    },
    "raw_txn_hex": "...",
    "dry_run_output": {
      "explained_status": "Executed",
      "events": [],
      "gas_used": "20304",
      "status": "Executed", # represent the successful status of transaction
      "write_set": [
        {
          "access_path": "0x00000000000000000000000000000001/1/0x00000000000000000000000000000001::TransactionFee::TransactionFee<0x00000000000000000000000000000001::STC::STC>",
          "action": "Value",
          "value": {
            "Resource": {
              "raw": "0x8f230200000000000000000000000000",
              "json": {
                "fee": {
                  "value": 140175
                }
              }
            }
          }
        }
        ...
```

## Process Simulation

### Initialization

At this point, we have deployed all contracts to the local node environment. In order to simplify the process, we put some necessary initialization conditions into MockModuleDaoProposalScript::init, which receives a parameter of the token issuance amount. This function registers and issues STD, and registers STD as a governance coin for the DAO process. Assuming that the total amount of STD issued is $10^8$, since its precision is 9, a total of $10^8 times 9$ units need to be issued. Also, we need to see if the configuration we care about is properly initialized to 0. 

```shell
starcoin% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::init --arg 100000000000000000u128 -b

# Output
...

# Check whether the registration and issuance is successful 
starcoin% account show
{
  "ok": {
    "account": {
      "address": "0xcccf61268df4d021405ef5d4041cb6d3",
      "is_default": true,
      "is_readonly": false,
      "public_key": "0xf542c5a6fc1aba30495016ab8888b317f343a4cde915ecaa46c8f636ac3bb5be",
      "receipt_identifier": "stc1pen8kzf5d7ngzzsz77h2qg89k6vtlthlr"
    },
    "auth_key": "0x01cf8ea9221db5f76052aa283709eceecccf61268df4d021405ef5d4041cb6d3",
    "sequence_number": 2,
    "balances": {
      "0xcccf61268df4d021405ef5d4041cb6d3::STD::STD": 100000000000000000, # The registered STD has been put into the current account
      "0x00000000000000000000000000000001::STC::STC": 20999669436
    }
  }
}

# Check if the configuration is 0
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::query
{
  "ok": [
    0
  ]
}
```

### Initiate a Proposal

According to the process description in the above section, first we need to initiate a proposal. To simplify the process, we set Coder, Everyone, and Anyone to be the current account 0xcccf61268df4d021405ef5d4041cb6d3, and then use dev sleep -t 86400000 to speed up the epoch lapse. 

```shell
# Initiate a proposal, call MockModuleDaoProposalScript::proposal，Proposal Number is 0
% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::proposal --arg 100u128 --arg 0u64
# Omit output 
...

# Check the status of the proposal. Each status corresponds to a value in the code. For the corresponding value of the proposal status, please refer to the code analysis section.
% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    1
  ]
}

% dev sleep -t 86400
% dev gen-block
...

# Check the corresponding proposal status again and enter the ACTIVE status
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    2
  ]
}
```

### Vote

Enter the ACTIVE state and start voting. Use the current account to vote for approval. To simplify the process and ensure the approval of the number of votes, we voted $9\ times 10^7$, accounting for 90% of the total (about setting the percentage of votes passed by the proposal, discussed in the summary of code analysis) 

```shell
% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0x1::DaoVoteScripts::cast_vote -t 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD -t 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::MockModuleDaoProposalAction --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0 --arg true --arg 90000000000000000u128 -b

...

% dev sleep -t 86400000
% dev gen-block
...

# Check the corresponding proposal status again and enter the AGRED status
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    4
  ]
}
```

### Put in queue

Enter the AGREED state and enter the announcement stage 

```shell
starcoin% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0x1::Dao::queue_proposal_action -t 0xcccf61268df4d021405ef5d4041cb6d3::STD::STD -t 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::MockModuleDaoProposalAction --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64 -b

# Check the corresponding proposal status again and enter the QUEUED status
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    5
  ]
}

# Wait for a while, and the test node executes this command to simulate time acceleration
starcoin% dev sleep -t 86400000
starcoin% dev gen-block

# Check the corresponding proposal status again and enter the EXECUTABLE status
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    6
  ]
}
```

### Implement

Anyone executes the action of the proposal 

```shell
# Excute proposal
starcoin% account execute-function -s 0xcccf61268df4d021405ef5d4041cb6d3 --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::execute_proposal --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0 -b

# Check the corresponding proposal status again and enter the EXTRACTED status
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposal::proposal_state --arg 0xcccf61268df4d021405ef5d4041cb6d3 --arg 0u64
{
  "ok": [
    7
  ]
}
```

### View final status

In the end, we completed all the processes and checked the final value again, and found that it had been modified to 100.

```shell
starcoin% dev call --function 0xcccf61268df4d021405ef5d4041cb6d3::MockModuleDaoProposalScript::query
{
  "ok": [
    100
  ]
}
```

## Code Analysis

In the previous section, we mainly implement a deployable and practical project, and used the DAO.move module in Starcoin stdlib to implement on-chain governance and modify the configuration. This section briefly discusses some of the code implementations in the previous section, as well as some implementation logic of DAOs that rely on Starcoin.

We know that Starcoin is different from Ethereum, and its storage model is the account Resource mode, that is, deprecated contract account and storing all data under the path of the account (refer to the Starcoin white paper, Starcoin contract account details). Since the contract account has been removed, reviewing the process described in the second section of this article, we need to consider the following issues: 

1. Where should the process of proposals and related status data be stored? How to make sure it is not modified?
2. Where should each voter's staked tokens be stored? Are the mortgaged funds safe?
3. How to ensure that the action can be executed after the proposal is passed?

With the above questions, let's see how the contract code in Starcoin is implemented 

### Dao.move

The Dao.move file is in the stdlib library, after executing the 'move check' command in the project root directory, the file can be found in the build/package/starcoin/source_files/ directory, which mainly implements the process described in the second section above. Since the role of each state has been discussed before, it will not be introduced too much here. 

```rust
/// Proposal state
    const PENDING: u8 = 1;
    const ACTIVE: u8 = 2;
    const DEFEATED: u8 = 3;
    const AGREED: u8 = 4;
    const QUEUED: u8 = 5;
    const EXECUTABLE: u8 = 6;
    const EXTRACTED: u8 = 7;
```

The following are the definitions of several core data structures of the contract, and all subsequent operations are about these structures.

```rust
/// Configuration of the `Token`'s DAO.
    struct DaoConfig<TokenT: copy + drop + store> has copy, drop, store {
        /// after proposal created, how long use should wait before he can vote.
        voting_delay: u64,
        /// how long the voting window is.
        voting_period: u64,
        /// the quorum rate to agree on the proposal.
        /// if 50% votes needed, then the voting_quorum_rate should be 50.
        /// it should between (0, 100].
        voting_quorum_rate: u8,
        /// how long the proposal should wait before it can be executed.
        min_action_delay: u64,
    }

    /// Proposal data struct.
    struct Proposal<Token: store, Action: store> has key {
        /// id of the proposal
        id: u64,
        /// creator of the proposal
        proposer: address,
        /// when voting begins.
        start_time: u64,
        /// when voting ends.
        end_time: u64,
        /// count of votes for agree.
        for_votes: u128,
        /// count of votes for againest.
        against_votes: u128,
        /// executable after this time.
        eta: u64,
        /// after how long, the agreed proposal can be executed.
        action_delay: u64,
        /// how many votes to reach to make the proposal pass.
        quorum_votes: u128,
        /// proposal action.
        action: Option::Option<Action>,
    }

    /// User vote info.
    struct Vote<TokenT: store> has key {
        /// vote for the proposal under the `proposer`.
        proposer: address,
        /// proposal id.
        id: u64,
        /// how many tokens to stake.
        stake: Token::Token<TokenT>,
        /// vote for or vote against.
        agree: bool,
    }
```

1. Starcoin allows different tokens to be used as DAO governance tokens. DaoConfig<TokenT> implements a global token Dao configuration. If the tokens issued by itself need to support DAO governance, this structure needs to be registered. The structure contains The following fields:

   - voting_delay, the time to wait after the proposal is created to be voted, that is, the duration of the PEDDING state
   - voting_period, the period for voting
   - voting_quorum_rate, the percentage of votes passed, $0 < voting_quorum_rate \le 100$
   - min_action_delay, the duration of the announcement period

   ```rust
   /// Plugin method of the module.
       /// Should be called by token issuer.
       public fun plugin<TokenT: copy + drop + store>(signer: &signer) {
           let token_issuer = Token::token_address<TokenT>();
           assert(Signer::address_of(signer) == token_issuer, Errors::requires_address(ERR_NOT_AUTHORIZED));
           let dao_config_modify_cap = Config::extract_modify_config_capability<
               Dao::DaoConfig<TokenT>,
           >(signer);
           assert(Config::account_address(&dao_config_modify_cap) == token_issuer, Errors::requires_address(ERR_NOT_AUTHORIZED));
           let cap = DaoConfigModifyCapability { cap: dao_config_modify_cap };
           move_to(signer, cap);
       }
   ```

   The structure will be constructed when the Dao::plugin<TokenT> method been called, and then the constructed structure will be published through Config::publish_new_config. Note that this method can only be called by the issuer of the Token, and it is usually called during the initialization phase. In addition to Dao::Config, there is also a DaoGlobalInfo used to save the global information of the current governance token, including several events and the unique id. Note that the DaoGlobalInfo information will be stored into the Token issuer, that is, the Token issuer (also known as the project issuer), which has the ability to change these global configurations. After 0x1::Config stores the configuration to the current account, a capacity will be generated to represent the modification permission of the configuration and hosted in the current contract, so that it can be easily used when needed. Capability in Move is an abstraction of permissions, such as casting permissions MintCapability.

   

2. Proposal is the structure of its proposal, which defines Proposal<Token: store, Action: store>Action to represent the action structure that needs to be defined. This structure is defined by the outside world. When Dao::proposal is called when a proposal is initiated, the structure is locked to Proposal, and can be retrieved during the EXECUTABLE executable phase. Obviously, in addition to some time information and proposal proposer information recorded in the code, there is also the action structure after the current proposal is passed. Here, the type parameter can be regarded as a pair, that is, a single Token can define different Actions. The structure also stores how many votes approved and how many rejected the current proposal.

   The main processing functions of the Proposal structure are: 

   ```rust
   /// propose a proposal.
       /// `action`: the actual action to execute.
       /// `action_delay`: the delay to execute after the proposal is agreed
       public fun propose<TokenT: copy + drop + store, ActionT: copy + drop + store>(
           signer: &signer,
           action: ActionT,
           action_delay: u64,
       ) acquires DaoGlobalInfo {
           if (action_delay == 0) {
               action_delay = min_action_delay<TokenT>();
           } else {
               assert(action_delay >= min_action_delay<TokenT>(), Errors::invalid_argument(ERR_ACTION_DELAY_TOO_SMALL));
           };
           let proposal_id = generate_next_proposal_id<TokenT>();
           let proposer = Signer::address_of(signer);
           let start_time = Timestamp::now_milliseconds() + voting_delay<TokenT>();
           let quorum_votes = quorum_votes<TokenT>();
           let proposal = Proposal<TokenT, ActionT> {
               id: proposal_id,
               proposer,
               start_time,
               end_time: start_time + voting_period<TokenT>(),
               for_votes: 0,
               against_votes: 0,
               eta: 0,
               action_delay,
               quorum_votes: quorum_votes,
               action: Option::some(action),
           };
           move_to(signer, proposal);
           // emit event
           let gov_info = borrow_global_mut<DaoGlobalInfo<TokenT>>(Token::token_address<TokenT>());
           Event::emit_event(
               &mut gov_info.proposal_create_event,
               ProposalCreatedEvent { proposal_id, proposer },
           );
       }
   ```

   In the above code, a Proposal structure is first constructed according to the global configuration, and configuration information such as the duration of some states is read out and placed in the structure. Line 30 gives 'proposal move' to the currently signed user, which means that which user initiates the proposal will store this information. According to the separation of resources and code of the move contract, other contracts cannot access the data in the current contract unless the current contract code authorizes or changes the contract code. This locks the Proposal information under the Dao.move contract of the current signing user. The practice of Ethereum is to use the characteristics of the contract to constrain users, which puts higher requirements for the developer of the contract, and it is easy to generate bugs and lead to resource leakage. Another advantage is data isolation, Proposals are stored under different users, and the data will not affect each other.

3. Vote<TokenT: store> is the user's voting information. When the relevant voting users perform voting operations, a Vote structure will be constructed and store them in the voting user's resource path. At the same time, the tokens mortgaged by the current user will be mortgaged to the Vote structure, here is the answer to the second question, the tokens are mortgaged in the Vote structure under DAO.move. If the current contract does not provide a function for the extraction operation, any other contract cannot withdraw the tokens mortgaged by the current user. The number of approval/rejection will then be counted into the proposal .

   ```Move
   fun do_cast_vote<TokenT: copy + drop + store, ActionT: copy + drop + store>(proposal: &mut Proposal<TokenT, ActionT>, vote: &mut Vote<TokenT>, stake: Token::Token<TokenT>) {
           let stake_value = Token::value(&stake);
           Token::deposit(&mut vote.stake, stake);
           if (vote.agree) {
               proposal.for_votes = proposal.for_votes + stake_value;
           } else {
               proposal.against_votes = proposal.against_votes + stake_value;
           };
       }
   ```

   There is another problem mentioned above, that is, the determination of the state. In the following function, the time and voting parameters in the Proposal are used to determine the state. The code is relatively obvious, we will not discuss it here. Readers can find reference and read by themselves.

   ```rust
   fun do_proposal_state<TokenT: copy + drop + store, ActionT: copy + drop + store>(
           proposal: &Proposal<TokenT, ActionT>,
           current_time: u64,
       ): u8 {
           if (current_time < proposal.start_time) {
               // Pending
               PENDING
           } else if (current_time <= proposal.end_time) {
               // Active
               ACTIVE
           } else if (proposal.for_votes <= proposal.against_votes ||
               proposal.for_votes < proposal.quorum_votes) {
               // Defeated
               DEFEATED
           } else if (proposal.eta == 0) {
               // Agreed.
               AGREED
           } else if (current_time < proposal.eta) {
               // Queued, waiting to execute
               QUEUED
           } else if (Option::is_some(&proposal.action)) {
               EXECUTABLE
           } else {
               EXTRACTED
           }
       }
   ```

   The above explains some of the more important structures and functions of Dao.move, and the rest of the code readers can read by themselves. 

## mock-swap-config project

The implementation of Dao.move was mainly discussed above. Apparently Dao.move implements an abstract voting process function. The specific voting needs to be implemented by developers themselves. And our project example demonstrates how to use Dao.move. In the project, MockModuleConfig.move, MockModuleDaoProposal.move, MockModuleDaoProposalScript.move, and STD.move respectively implement the functions of configuration, proposal, proposal entry, and governance currency MockModuleDaoProposal.move.

(For the complete code, see the deployment contract section in the previous section)

The contract provides a total of 4 functions: plugin, submit_proposal, proposal_state, execute_proposal. The plugin is called when STD is initialized. In the plugin function, STD is registered as a governance currency in the global Dao, and ParameterModifyCapability is used as a configuration, the modification permission is hosted in the current contract. Referring to the above code, note that we also define two structures, MockModuleDaoProposalCapWrap and MockModuleDaoProposalAction. The former is mainly to configure the modification permission hosted by the contract, while the latter is mainly to define the current actions that our contract needs to perform. Only one u128 is defined here to record the target value we need to modify after voting.

submit_proposal calls Dao's to initiate a proposal, and passes our defined MockModuleDaoProposalAction as the template parameter of the action to be executed. Let's look at execute_proposal. At the beginning, we need to get the current proposal action through Dao. If the proposal is not in the correct state, it will report an error and exit. When we correctly extract the value in the action of the proposal, we can get the modification permission of the MockModuleConfig contract hosted under the MockModuleDaoProposalCapWrap structure of the current contract to modify the value to achieve the purpose of modifying the configuration. Of course, when performing this action on-chain, the identity of any signer is not required.

## Summarize

In the first section, this article discusses the core process and status of Starcoin's Dao to give readers an overall impression. The second part discusses how to write and deploy a custom Dao project, deploy it to the local test environment and demonstrate the process. In the last part, we focused on the code implementation of the core logic of Dao.move, and then discussed the most important upper-layer application contract in the project, MockModuleDaoProposal.move. There is also a part of the upgrade code and configuration modification voting code in stdlib, which is also an upper-level application based on Dao.move. Readers can read on their own. 

## References

https://starcoin.org/zh/developer/blog/starcoin_dao_1/  The Collision of Starcoin and the DAO

https://starcoin.org/zh/developer/blog/starcoin_stdlib_upgrade/  Starcoin's stdlib upgrade and DAO on-chain governance

https://starcoin.org/zh/developer/blog/starcoin_contract_account/  Explanation of Starcoin Contract Account
