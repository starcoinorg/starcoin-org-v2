---
title: export import snapshot
weight: 4
---
`starcoin_db_exporter` command can  export and offline import net main, barnard, halley, proxima snapshot  
offline import snapshot also can use import_snapshot.sh

<!--more-->

## Usage
### export snapshot
use `starcoin_db_exporter`  
run cmd
```shell
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
the output snapshot data file is in dir ~/snapshot, the export snapshot cost 1hour-2hour()
increment export snapshot
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
this cmd use increment export snapshot data, dir ~/snapshot have old snapshot data, like ~/snpashot is the 1-400w block height
snapshot data, then want get 1-500w block height snapshot data, use this cmd will export 400w-500w block snapshot data, then merge
with old snapshot data gen new snapshot data
### offline import snapshot
#### use`starcoin_db_exporter` offline import
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

#### use `import_snapshot.sh` offline import snapshot
`starcoin_db_exporter`and`import_snapshot.sh` under same path
`import_net_block.sh $1 $2`
$1 is net node like main, barnard
$2 is import_snapshot.sh download snapshot which dir
$3 is storage dir like ~/.starcoin/main, ~/.starcoin/barnard

run cmd
```shell
./import_snapshot.sh barnard  ~/snapshot/ ~/.starcoin/barnard
```