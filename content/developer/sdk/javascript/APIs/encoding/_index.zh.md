---
title: encoding
weight: 6
---

## Encoding

This part provide exampels of encoding functions.

---

### Import `encoding` module

```js
// import { encoding } from '@starcoin/starcion;
const { encoding } = require('@starcoin/starcion);
```

---

### Encode Starcoin Address

```js
const address = '0x0000000000000000000000000a550c18';
const encodedAddress =  encoding.addressToSCS(address);
console.log(encodedAddress);
```

Result:
```js
AccountAddress {
  value: [
    [ 0 ],  [ 0 ],  [ 0 ],
    [ 0 ],  [ 0 ],  [ 0 ],
    [ 0 ],  [ 0 ],  [ 0 ],
    [ 0 ],  [ 0 ],  [ 0 ],
    [ 10 ], [ 85 ], [ 12 ],
    [ 24 ]
  ]
}
```

---

### Encode & Decode String

The string can be normal characters, such as a sentence or an URL.

```js
const { arrayify, hexlify } = require('@ethersproject/bytes');
const { encoding } = require('@starcoin/starcoin');

const imageUrl = 'ipfs://QmSPcvcXgdtHHiVTAAarzTeubk5X3iWymPAoKBfiRFjPMY';
const imageBytes = encoding.stringToBytes(imageUrl);
const imageHex = hexlify(imageBytes);
console.log(imageHex);

const decodedImageHex = encoding.bytesToString(imageBytes);
console.log(decodedImageHex);
```

Result:
```js
0x697066733a2f2f516d5350637663586764744848695654414161727a546575626b3558336957796d50416f4b42666952466a504d59
ipfs://QmSPcvcXgdtHHiVTAAarzTeubk5X3iWymPAoKBfiRFjPMY
```

---

### Encode Struct Type Tags to Send STC

```js
const { encoding } = require('@starcoin/starcoin');
const { utils } = require('@starcoin/starcoin');

const structTypeArgs = ['0x1::STC::STC']

const structTypeTags = utils.tx.encodeStructTypeTags(structTypeArgs)
console.log(JSON.stringify(structTypeTags, undefined, 2))
```

Result:
```js
[
  {
    "Struct": {
      "address": "0x1",
      "module": "STC",
      "name": "STC",
      "type_params": []
    }
  }
]
```

---

### Encode Struct Type Tags to Vote

```js
const { encoding } = require('@starcoin/starcoin');
const { utils } = require('@starcoin/starcoin');

const structTypeArgs = ['0x1::STC::STC', '0x1::OnChainConfigDao::OnCha    inConfigUpdate<0x1::TransactionPublishOption::TransactionPublishOption>'    ]

const structTypeTags = utils.tx.encodeStructTypeTags(structTypeArgs)
console.log(JSON.stringify(structTypeTags, undefined, 2))
```

Result:
```js
[
  {
    "Struct": {
      "address": "0x1",
      "module": "STC",
      "name": "STC",
      "type_params": []
    }
  },
  {
    "Struct": {
      "address": "0x1",
      "module": "OnChainConfigDao",
      "name": "OnChainConfigUpdate",
      "type_params": [
        {
          "Struct": {
            "address": "0x1",
            "module": "TransactionPublishOption",
            "name": "TransactionPublishOption",
            "type_params": []
          }
        }
      ]
    }
  }
]
```

---

### Encode & Decode Receipt Identifier

Starcoin receipt identifier starts with `stc`.

#### Encode address with auth key
```js
const address = "1603d10ce8649663e4e5a757a8681833";
const authKey = "93dcc435cfca2dcf3bf44e9948f1f6a98e66a1f1b114a4b8a37ea16e12beeb6d";
const receiptIdentifier = encoding.encodeReceiptIdentifier(address, authKey)
console.log(receiptIdentifier);
```

Result:
```js
stc1pzcpazr8gvjtx8e895at6s6qcxwfae3p4el9zmnem738fjj83765cue4p7xc3ff9c5dl2zmsjhm4k63mmwta
```

#### Encode address without auth key
```js
const address = "1603d10ce8649663e4e5a757a8681833";
const receiptIdentifier = encoding.encodeReceiptIdentifier(address)
console.log(receiptIdentifier);
```

Result:
```js
stc1pzcpazr8gvjtx8e895at6s6qcxvs4ct50
```

#### Encode address with empty auth key
```js
const address = "1603d10ce8649663e4e5a757a8681833";
const authKey = "";
const receiptIdentifier = encoding.encodeReceiptIdentifier(address, authKey)
console.log(receiptIdentifier);
```

Result:
```js
stc1pzcpazr8gvjtx8e895at6s6qcxvs4ct50
```

#### Decode Receipt Identifer

```js
const receiptIdentifier_1 = "stc1pzcpazr8gvjtx8e895at6s6qcxwfae3p4el9zmnem738fjj83765cue4p7xc3ff9c5dl2zmsjhm4k63mmwta";
const addressAuthKey_1 = encoding.decodeReceiptIdentifier(receiptIdentifier_1);
console.log(addressAuthKey_1);

const receiptIdentifier_2 = "stc1pzcpazr8gvjtx8e895at6s6qcxvs4ct50";
const addressAuthKey_2 = encoding.decodeReceiptIdentifier(receiptIdentifier_2);
console.log(addressAuthKey_2);
```

Result:
```js
{
  accountAddress: '1603d10ce8649663e4e5a757a8681833',
  authKey: '93dcc435cfca2dcf3bf44e9948f1f6a98e66a1f1b114a4b8a37ea16e12beeb6d'
}
{ accountAddress: '1603d10ce8649663e4e5a757a8681833', authKey: '' }
```

---

### Convert Private Key to Public Key

```js
const privateKey = '0xa6d8991ca3d6813f493d13216d6dedd30211a649d21b2ca102b860bea51045fd'
const publicKey = await encoding.privateKeyToPublicKey(privateKey)
console.log(publicKey)
```

Result:
```js
0xe8eba2c517d0b5012c20737b3627c58447ccd6098aaae84027520afcc82a4ded
```

---

### Convert Public Key to Address

```js
const publicKey = '0xe8eba2c517d0b5012c20737b3627c58447ccd6098aaae84027520afcc82a4ded';
const address = await encoding.publicKeyToAddress(publicKey);
console.log(address);
```

Result:
```js
0x400e8f6e15f47c92519e2527fcd64b3a
```

---

### Convert Public Key to Receipt Identifier

```js
const publicKey = '0x94c3732e3c08eee7738d33b4e6f74daa615da14a94607ac00b531d189cb5b0dd';
const receiptIdentifier = await encoding.publicKeyToReceiptIdentifier(publicKey);
console.log(receiptIdentifier);
```

Result:
```js
stc1pvg2sp0etf2k30f5sevj0ng39cmhuvhh4vzevdu07ksg38r0mrd0xy9gqhu454tgh56gvkf8e5gjuv6hqjnv
```

---

### Convert Public Key to Auth Key

```js
const publicKey = '0xe8eba2c517d0b5012c20737b3627c58447ccd6098aaae84027520afcc82a4ded';
const authKey = await encoding.publicKeyToAuthKey(publicKey);
console.log(authKey);
```

Result:
```js
0x049ad0f8c75341261eb354aba13b3a4f400e8f6e15f47c92519e2527fcd64b3a
```

---

### Decode SignedUserTransaction Hex

```js
const hex = "0x49624992dd72da077ee19d0be210406a100000000000000002000000000000000000000000000000010f5472616e73666572536372697074730c706565725f746f5f706565720107000000000000000000000000000000010353544303535443000310621500bf2b4aad17a690cb24f9a225c601001000ca9a3b0000000000000000000000001fe501000000000001000000000000000d3078313a3a5354433a3a535443e8ab000000000000fe002020e2c9a32b0ce41c3a5f4a5f010909741f12e265debcb681c9f9d58c2e69e65c4040288d5662f0f0e72d181073c00bd4f6a15fcfaf4911f6ac35827e09c5e6e02d0df0f2d1bb81c90617911362a39801b88cf6ae405ef226c2e6645a1e5c946e09";

const signedUserTransaction = encoding.decodeSignedUserTransaction(hex);
console.log(signedUserTransaction)
```

Result:
```js
{
  transaction_hash: '0x17d671d18736358b7e6665be3cde9d27a4e515f5f12ce9d014f45ff550be84d3',
  raw_txn: {
    sender: '0x49624992dd72da077ee19d0be210406a',
    sequence_number: 16n,
    payload: '0x02000000000000000000000000000000010f5472616e73666572536372697074730c706565725f746f5f706565720107000000000000000000000000000000010353544303535443000310621500bf2b4aad17a690cb24f9a225c601001000ca9a3b000000000000000000000000',
    max_gas_amount: 124191n,
    gas_unit_price: 1n,
    gas_token_code: '0x1::STC::STC',
    expiration_timestamp_secs: 44008n,
    chain_id: 254
  },
  authenticator: {
    Ed25519: {
      public_key: '0x20e2c9a32b0ce41c3a5f4a5f010909741f12e265debcb681c9f9d58c2e69e65c',
      signature: '0x40288d5662f0f0e72d181073c00bd4f6a15fcfaf4911f6ac35827e09c5e6e02d0df0f2d1bb81c90617911362a39801b88cf6ae405ef226c2e6645a1e5c946e09'
    }
  }
}
```

---