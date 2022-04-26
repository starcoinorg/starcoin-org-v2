---
title: 导出导入快照
weight: 4
---
`starcoin_db_exporter`命令行工具提供了离线导出导入
main,barnard,halley, proxima网络的快照功能，这样可以快速的搭建区块链网络
离线导入快照也可以使用import_snapshot.sh脚本

<!--more-->

## 使用方法
### 快照导出
使用`starcoin_db_exporter`命令导出快照 
执行命令
```shell
./starcoin_db_exporter export-snapshot -i ~/.starcoin/main -n main -o ~/snapshot
USAGE:
    starcoin_db_exporter export-snapshot [OPTIONS] --db-path <db-path> --net <net> --output <output>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
    -i, --db-path <db-path>        starcoin node db path. like ~/.starcoin/main
    -t, --increment <increment>    enable increment export snapshot
    -n, --net <net>                Chain Network, like main, proxima
    -o, --output <output>          output dir, like ~/, manifest.csv will write in output dir
```
上面例子中将快照导出为~/snapshot目录下，导出快照可能需要1-2小时时间(看具体机器配置)

增量导出快照
```shell
./starcoin_db_exporter export-snapshot -i ~/.starcoin/main -n main -o ~/snapshot -t true
USAGE:
    starcoin_db_exporter export-snapshot [OPTIONS] --db-path <db-path> --net <net> --output <output>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
    -i, --db-path <db-path>        starcoin node db path. like ~/.starcoin/main
    -t, --increment <increment>    enable increment export snapshot
    -n, --net <net>                Chain Network, like main, proxima
    -o, --output <output>          output dir, like ~/, manifest.csv will write in output dir
```
上面例子使用增量导出，需要~/snapshot目录下有旧的快照, 比如原来~/snapshot下快照为1-400w高度的快照, 现在要导1-500w高度快照，
会把后面400w-500w快照导出后与原来合并，节省时间

### 快照离线导入
#### 使用`starcoin_db_exporter`离线导入
```shell
./starcoin_db_exporter apply-snapshot -i ~/snapshot -n main -o ~/.starcoin/main
USAGE:
    starcoin_db_exporter apply-snapshot --input-path <input-path> --net <net> --to-path <to-path>

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
    -i, --input-path <input-path>    input_path, manifest.csv in this dir
    -n, --net <net>                  Chain Network
    -o, --to-path <to-path>          starcoin node db path. like ~/.starcoin/main
```
#### 使用`import_snapshot.sh`离线导入
`starcoin_db_exporter`和`import_snapshot.sh`在同一路径下
`import_snapshot.sh $1 $2 $3`
$1是网络名称可以是main, barnard
$2是指定import_snapshot.sh下载快照路径
$3是数据存储的地方,可以使用~/.starcoin/main, ~/.starcoin/barnard

执行命令
```shell
./import_snapshot.sh barnard  ~/snapshot/ ~/.starcoin/barnard
```

