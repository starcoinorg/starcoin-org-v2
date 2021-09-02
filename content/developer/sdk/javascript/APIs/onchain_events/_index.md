---
title: onchain_events
weight: 7
---

##  Decode Event Key and Data

Decode the key and data of an event on the Starcoin blockchain.

### Import `onchain_events` module

```js
// import { onchain_events } from '@starcoin/starcoin';
const { onchain_events } = require('@starcoin/starcoin');
```

---

### Decode Event Key

```js
const eventKeyInHex = "0x000000000000000063af4e1cf4e6345df840f4c57597a0f6";
const eventKey = onchain_events.decodeEventKey(eventKeyInHex);
console.log(eventKey);
```

Result: 
```js
{ address: '0x63af4e1cf4e6345df840f4c57597a0f6', salt: 0n }
```
---

### Decode Deposit Event Data

```js
const eventName = 'DepositEvent';
const eventData = '0x00ca9a3b00000000000000000000000000000000000000000000000000000001035354430353544300';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  amount: 1000000000n,
  metadata: [],
  token_code: {
    address: '0x00000000000000000000000000000001',
    module: 'STC',
    name: 'STC'
  }
}
```

---

### Decode Withdraw Event Data

```js
const eventName = 'WithdrawEvent';
const eventData = '0x00e1f50500000000000000000000000000000000000000000    000000000000001035354430353544300';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  amount: 100000000n,
  metadata: [],
  token_code: {
    address: '0x00000000000000000000000000000001',
    module: 'STC',
    name: 'STC'
  }
}
```

---

### Decode New Block Event Data

```js
const eventName = 'NewBlockEvent';
const eventData = '0x440000000000000094e957321e7bb2d3eb08ff6be81a6fcde    c8a9d73780100000000000000000000';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  number: 68n,
  author: '0x94e957321e7bb2d3eb08ff6be81a6fcd',
  timestamp: 1616847407852n,
  uncles: 0n
}
```

---

### Decode Block Reward Event Data

```js
const eventName = 'BlockRewardEvent';
const eventData = '0x57fa0200000000006041c4200100000000000000000000000    00000000000000000000000000000009a306cd9afde5d249257c2c6e6f39103';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  block_number: 195159n,
  block_reward: 4844700000n,
  gas_fees: 0n,
  miner: '0x9a306cd9afde5d249257c2c6e6f39103'
}
```
---

### Decode Accept Token Event Data

```js
const eventName = 'AcceptTokenEvent';
const eventData = '0x000000000000000000000000000000010353544303535443';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  token_code: {
    address: '0x00000000000000000000000000000001',
    module: 'STC',
    name: 'STC'
  }
}
```
---

### Decode Mint Event Data

```js
const eventName = 'MintEvent';
const eventData = '0x80cb29d000000000000000000000000000000000000000000    0000000000000010353544303535443';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  amount: 3492400000n,
  token_code: {
    address: '0x00000000000000000000000000000001',
    module: 'STC',
    name: 'STC'
  }
}
```
---

### Decode Vote Changed Event Data

```js
const eventName = 'VoteChangedEvent';
const eventData = '0x0a000000000000000000000000000000000000000a550c180    000000000000000000000000a550c180100003426f56b1c000000000000000000';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{
  agree: true,
  vote: 8000000000000000n,
  voter: '0x0000000000000000000000000a550c18',
  proposal_id: 10n,
  proposer: '0x0000000000000000000000000a550c18'
}
```
---

### Decode Proposal Created Event Data

```js
const eventName = 'ProposalCreatedEvent';
const eventData = '0x03000000000000000000000000000000000000000a550c18';
const result = onchain_events.decodeEventData(eventName, eventData);
console.log(result.toJS());
```

Result: 
```js
{ proposal_id: 3n, proposer: '0x0000000000000000000000000a550c18' }
```