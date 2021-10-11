---
title: serde
weight: 1
---

<!--more-->

`serde` module provides `Deserializer` and `Serializer`.


### Serializer

Source code:
```js
export interface Serializer {
  serializeStr(value: string): void;

  serializeBytes(value: Uint8Array): void;

  serializeBool(value: boolean): void;

  serializeUnit(value: null): void;

  serializeChar(value: string): void;

  serializeF32(value: number): void;

  serializeF64(value: number): void;

  serializeU8(value: number): void;

  serializeU16(value: number): void;

  serializeU32(value: number): void;

  serializeU64(value: BigInt | number): void;

  serializeU128(value: BigInt | number): void;

  serializeI8(value: number): void;

  serializeI16(value: number): void;

  serializeI32(value: number): void;

  serializeI64(value: BigInt | number): void;

  serializeI128(value: BigInt | number): void;

  serializeLen(value: number): void;

  serializeVariantIndex(value: number): void;

  serializeOptionTag(value: boolean): void;

  getBufferOffset(): number;

  getBytes(): Uint8Array;

  sortMapEntries(offsets: number[]): void;
}
```

Example:
```js
public serialize(serializer: Serializer): void {
  serializer.serializeU64(this.proposal_id);
  this.proposer.serialize(serializer);
  this.voter.serialize(serializer);
  serializer.serializeBool(this.agree);
  serializer.serializeU128(this.vote);
}
```

Reference: [serialize](https://github.com/starcoinorg/starcoin.js/blob/c1651dcd0e6c51b01edabc83639c9f96905772b7/src/lib/runtime/onchain_events/index.ts#L172)

### Deserializer

Source code:
```js
export interface Deserializer {
  deserializeStr(): string;

  deserializeBytes(): Uint8Array;

  deserializeBool(): boolean;

  deserializeUnit(): null;

  deserializeChar(): string;

  deserializeF32(): number;

  deserializeF64(): number;

  deserializeU8(): number;

  deserializeU16(): number;

  deserializeU32(): number;

  deserializeU64(): BigInt;

  deserializeU128(): BigInt;

  deserializeI8(): number;

  deserializeI16(): number;

  deserializeI32(): number;

  deserializeI64(): BigInt;

  deserializeI128(): BigInt;

  deserializeLen(): number;

  deserializeVariantIndex(): number;

  deserializeOptionTag(): boolean;

  getBufferOffset(): number;

  checkThatKeySlicesAreIncreasing(
      key1: [number, number],
      key2: [number, number]
  ): void;
}
```

Example:
```js
static deserialize(deserializer: Deserializer): BlockRewardEvent {
  const block_number = deserializer.deserializeU64();
  const block_reward = deserializer.deserializeU128();
  const gas_fees = deserializer.deserializeU128();
  const miner = AccountAddress.deserialize(deserializer);
  return new BlockRewardEvent(block_number,block_reward,gas_fees,miner);
}
```

Reference: [deserialize](https://github.com/starcoinorg/starcoin.js/blob/c1651dcd0e6c51b01edabc83639c9f96905772b7/src/lib/runtime/onchain_events/index.ts#L85)