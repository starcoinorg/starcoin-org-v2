---
title: bcs
weight: 2
---

## BcsSerializer

### Example 1

Use `bcs.BcsSerializer` to serialize scriptFunction:

```js
const { arrayify } = require('@ethersproject/bytes');
const { bcs } = require('@starcoin/starcoin');
const { utils } = require('@starcoin/starcoin');

const functionId = '0x1::TransferScripts::peer_to_peer_v2'

const strTypeArgs = ['0x1::STC::STC']
const tyArgs = utils.tx.encodeStructTypeTags(strTypeArgs)

const args = [
arrayify('0x1df9157f14b0041eed18dcc56520d829'),
arrayify('0x0060d743dd500b000000000000000000')
]
const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args);

const se = new bcs.BcsSerializer();
scriptFunction.serialize(se);
const payloadInHex = utils.hex.toHexString(se.getBytes());

console.log(payloadInHex);
```

Result:
```js
0x02000000000000000000000000000000010f5472616e73666572536372697074730f706565725f746f5f706565725f763201070000000000000000000000000000000103535443035354430002101df9157f14b0041eed18dcc56520d829100060d743dd500b000000000000000000
```

Reference: [BcsSerializer with scriptFunction](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.spec.ts#L38)


### Exmple 2

Use `bcs.Serializer` to serialize transaction arguments: 

```js
const { arrayify, hexlify } = require('@ethersproject/bytes');
const { bcs } = require('@starcoin/starcoin');
const { utils } = require('@starcoin/starcoin');

const sendAmount = 0.01;
const config = { creator: "0xb2aa52f94db4516c5beecef363af850a", id: 1, type_args_1: "0x1::OnChainConfigDao::OnChainConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption, d::e::f>" };
const functionId = '0x1::DaoVoteScripts::cast_vote';
const strTypeArgs = ['0x1::STC::STC', config.type_args_1]
const tyArgs = utils.tx.encodeStructTypeTags(strTypeArgs)

const proposerAdressHex = config.creator;
const proposalId = config.id;
const agree = true; // yes: true; no: false
const votes = sendAmount * 1000000000; // sendAmount * 1e9

// Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
const proposalIdSCSHex = (function () {
  const se = new bcs.BcsSerializer();
  se.serializeU64(proposalId);
  return hexlify(se.getBytes());
})();
// Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
const agreeSCSHex = (function () {
  const se = new bcs.BcsSerializer();
  se.serializeBool(agree);
  return hexlify(se.getBytes());
})();
// Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
const votesSCSHex = (function () {
  const se = new bcs.BcsSerializer();
  se.serializeU128(votes);
  return hexlify(se.getBytes());
})();
const args = [
  arrayify(proposerAdressHex),
  arrayify(proposalIdSCSHex),
  arrayify(agreeSCSHex),
  arrayify(votesSCSHex),
];

console.log({ args });
```

Result:
```js
{
  args: [
    Uint8Array(16) [
      178, 170,  82, 249,  77,
      180,  81, 108,  91, 238,
      206, 243,  99, 175, 133,
       10
    ],
    Uint8Array(8) [
      1, 0, 0, 0,
      0, 0, 0, 0
    ],
    Uint8Array(1) [ 1 ],
    Uint8Array(16) [
      128, 150, 152, 0, 0, 0,
        0,   0,   0, 0, 0, 0,
        0,   0,   0, 0
    ]
  ]
}
```

Reference: [https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.spec.ts#L169](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.spec.ts#L169)

---

## BcsDeserializer

### Example 1

Use `bcs.BcsDeserializer` to deserialize transaction data.
```js
const { arrayify } = require('@ethersproject/bytes');
const { bcs } = require('@starcoin/starcoin');
const { starcoin_types } = require('@starcoin/starcoin');

const data = '...';
const bytes = arrayify(data);
const de = new bcs.BcsDeserializer(bytes);
const scsData = starcoin_types.SignedUserTransaction.deserialize(de);
```

Reference: [decodeSignedUserTransaction](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.ts#L47)

### Example 2

Use `bcs.BcsDeserializer` to deserialize transaction payload.
```js
const { arrayify } = require('@ethersproject/bytes');
const { bcs } = require('@starcoin/starcoin');
const { starcoin_types } = require('@starcoin/starcoin');

const payload = '...';
const bytes = arrayify(payload);
const de = new bcs.BcsDeserializer(bytes);
const bcsTxnPayload = starcoin_types.TransactionPayload.deserialize(de);
```

Reference: [decodeTransactionPayload](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.ts#L93)

### Example 3

Use `bcs.BcsDeserializer` to deserialize package transaction payload hex.

```js
const { arrayify } = require('@ethersproject/bytes');
cosnt { addHexPrefix } = require('ethereumjs-util');
const { bcs } = require('@starcoin/starcoin');
const { starcoin_types } = require('@starcoin/starcoin');

const packageHex = '...';
const bytes = arrayify(packageHex);
const deserializer = new bcs.BcsDeserializer(arrayify(addHexPrefix(packageHex)))
const transactionPayload = starcoin_types.TransactionPayloadVariantPackage.load(deserializer)
```

Reference: [packageHexToTransactionPayload](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.ts#L161)

### Example 4

Use `bcs.BcsDeserializer` to convert address to SCS.

```js
const { bcs } = require('@starcoin/starcoin');
const { utils } = require('@starcoin/starcoin');
const { starcoin_types } = require('@starcoin/starcoin');

const addr = '0x...';
const bytes = utils.hex.fromHexString(addr, 16 * 2);
cosnt addressSCS = starcoin_types.AccountAddress.deserialize(new bcs.BcsDeserializer(bytes));
```

Reference: [addressToSCS](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.ts#L178)

---

## BcsEncode

`BcsEncode` is based on `bcs.BcsSerializer`.

Example: 
```js
export function packageHexToTransactionPayloadHex(
  packageHex: string
): string {
  const transactionPayload = packageHexToTransactionPayload(packageHex)
  return bcsEncode(transactionPayload)
}
```

Reference: [packageHexToTransactionPayloadHex](https://github.com/starcoinorg/starcoin.js/blob/81014bde5c13628646d0b67a88ff78b505a01d77/src/encoding/index.ts#L170)

---

## BcsDecode

`BcsDecode` is based on `bcs.BcsDeserializer`.

Example: 
```js
export function decodeEventData(eventName: string, eventData: string): any {
  const eventType = onchain_events[eventName];
  const d = bcsDecode(
    eventType,
    eventData
  );
  return d;
}
```

Reference: [decodeEventData](https://github.com/starcoinorg/starcoin.js/blob/a43e26ce98e41814b96ce7b9eb65698593663c33/src/onchain_events/index.ts#L166)

