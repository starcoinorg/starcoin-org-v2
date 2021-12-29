---
title: 导出导入区块
weight: 4
---
`starcoin_db_exporter`命令行工具提供了离线导出导入
main,barnard,halley, proxima网络的区块  
离线导入区块也可以使用import_net_block.sh脚本

<!--more-->

## 使用方法
### 导出
使用`starcoin_db_exporter`命令导出  
执行命令
```shell
./starcoin_db_exporter export-block-range --db-path ~/.starcoin/main -s 1 -e 10000 -n main -o ~/bak/
USAGE:
    starcoin_db_exporter export-block-range --db-path <db-path> --end <end> --net <net> --output <output> --start <start>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
    -i, --db-path <db-path>    starcoin node db path. like ~/.starcoin/main
    -e, --end <end>            
    -n, --net <net>            Chain Network, like main, proxima
    -o, --output <output>      output dir, like ~/, output filename ~/block_start_end.csv
    -s, --start <start> 
```
上面例子中导出文件为~/目录下block_1_10000.csv

### 离线导入
#### 使用`starcoin_db_exporter`离线导入
```shell
./starcoin_db_exporter apply-block -i ~/block_1_10000.csv -n main -o ~/.starcoin/main
USAGE:
    starcoin_db_exporter apply-block [FLAGS] --input-path <input-path> --net <net> --to-path <to-path> [verifier]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information
    -w, --watch      Watch metrics logs

OPTIONS:
    -i, --input-path <input-path>    input file, like accounts.csv
    -n, --net <net>                  Chain Network
    -o, --to-path <to-path>          starcoin node db path. like ~/.starcoin/main
```
#### 使用`import_net_block.sh`离线导入
`starcoin_db_exporter`和`import_net_block.sh`在同一路径下
`import_net_block.sh $1 $2`
$1是节点名称可以是main, barnard
$2是数据存储的地方,可以使用~/.starcoin/main, ~/.starcoin/barnard

执行命令
```shell
./import_net_block.sh barnard ~/.starcoin/barnard
```

这个命令会跳过已经有的区块，每获取一个区块更新下进度，中断脚本后会从下一个高度执行

