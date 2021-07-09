+++
title = "Starcoin Move stdlib v5 upgrade completed"
date = "2021-06-17"
summary = "Starcoin Move stdlib v5 upgrade completed, transaction information: [0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3](https://stcscan.io/main/transactions/detail/0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3)"
author = "jolestar"
tags = [
    "Starcoin"
]
archives="2021"
+++

Starcoin Move stdlib v5 upgrade completed, transaction information: [0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3](https://stcscan.io/main/transactions/detail/0x7d4275ca7d444c57ffdccfd0baf6bb5f5f5d2abca90d3763d6b2a93dc046b1e3)

This upgrade includes the hard fork feature. Versions prior to v1.2.0 will not be able to execute the latest transactions, please upgrade to v1.2.0 as soon as possible.

A series of updates based on this version will follow:

1. transfers in the SDK will use the 0x1::TransferScripts::peer_to_peer_v2 method by default and no longer require the auth key parameter.
2. The auth key field in ReceiptIdentifier is deprecated, after that ReceiptIdentifier and account address are equivalent and are different encode format to display the same data, all api that accept account address can automatically accept ReceiptIdentifier.