---
title: import block
weight: 4
---

`starcoin_db_exporter`command with shell script import_net_block.sh offline import
net main, barnard, halley, proxima block

<!--more-->

## Usage
`starcoin_db_exporter`and`import_net_block.sh` under same path
`import_net_block.sh $1 $2`
$1 is net node like main, barnard
$2 is storage dir like ~/.starcoin/main, ~/.starcoin/barnard

Run Shell Cmd
```shell
./import_net_block.sh barnard ~/.starcoin/barnard
```

this cmd can skip block already executed
