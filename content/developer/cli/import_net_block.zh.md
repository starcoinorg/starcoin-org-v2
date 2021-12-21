---
title: 导入区块
weight: 4
---

`starcoin_db_exporter`命令行工具配合import_net_block.sh脚本可以离线导入
离线导入main, barnard, halley, proxima网络的区块

<!--more-->

## 使用方法
`starcoin_db_exporter`和`import_net_block.sh`在同一路径下
`import_net_block.sh $1 $2`
$1是节点名称可以是main, barnard
$2是数据存储的地方,可以使用~/.starcoin/main, ~/.starcoin/barnard

执行命令
```shell
./import_net_block.sh barnard ~/.starcoin/barnard
```

这个命令会跳过已经有的区块，每获取一个区块更新下进度，中断脚本后会从下一个高度执行

