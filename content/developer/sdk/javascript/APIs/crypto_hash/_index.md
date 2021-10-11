---
title: crypto_hash
weight: 5
---

<!--more-->

## crypto_hash

`crypto_hash` can create hash from data with the sha3_256 algorithm.


Example:
```js
const { crypto_hash } = require('@starcoin/starcoin');

const hasher = crypto_hash.createHash("test");
const data = new Uint8Array(Buffer.from("test"));
const value = hasher.crypto_hash(data);
console.log(value);
```

Result: 
```js
0x7875f210ee3a08253dc4cdfde9ea7c170ec7dca3866c819c622e671ce7df5d60
```