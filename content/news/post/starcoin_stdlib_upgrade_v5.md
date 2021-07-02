+++
title = "Starcoin Move stdlib upgrade voting is open"
date = "2021-06-08"
summary = "Voting for the Starcoin Move stdlib v5 upgrade is open. This upgrade is the first stdlib upgrade since the Starcoin mainnet lanuched and includes the following features."
author = "jolestar"
tags = [
    "Starcoin"
]
archives="2021"
+++

Voting for the Starcoin Move stdlib v5 upgrade is open. This upgrade is the first stdlib upgrade since the Starcoin mainnet lanuched and includes the following features.


1. Add limit on treasury withdrawals proposol amount, the maximum amount of which cannot exceed the voted threshold (4% of the current liquidity). (https://github.com/starcoinorg/starcoin/pull/2566)
2. Implemented a new on-chain authentication strategy to simplify the complexity of initializing on-chain accounts. (https://github.com/starcoinorg/starcoin/pull/2562)

## Upgrade proposal information

1. Upgrade package binary: https://github.com/starcoinorg/starcoin/tree/master/vm/stdlib/compiled/5/4-5
2. Package hash: 0x20d79acaca9c50d4cbf51a992e5de658dcecf39c1573244f7d850b4b47af56d360
3. Proposal id: 0
4. Proposal transaction: https://explorer.starcoin.org/main/transactions/detail/0x0237dba2eb4ea5971f7fb53693acb91f6879bfa12db3c15f1a6281e1661d9ee0
5. Proposer address: 0xb2aa52f94db4516c5beecef363af850a


Coin holders are invited to vote on the chain. When voting, the STC of the current account will be stake to the contract until the end of the voting period, which is currently 7 days.  
**To encourage participation in on-chain governance, incentives for on-chain governance will be introduced in the future. Users who participate in voting this time will be compensated according to the incentive strategy.**

For voting methods, please refer to: [Starcoin Move stdlib upgrade Guide](https://github.com/starcoinorg/starcoin/discussions/2578)

For more information on Starcoin governance, please see.

* [Governance section of the Starcoin technical white paper](https://developer.starcoin.org/en/sips/sip-2/)
* [Lifecycle of on-chain governance](https://developer.starcoin.org/zh/key_concepts/dao_governance/)
* [Modifying DAO settings through the governance mechanism](https://developer.starcoin.org/zh/cli/modify_dao_config/)
