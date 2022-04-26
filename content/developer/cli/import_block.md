---
title: export import block
weight: 4
---
`starcoin_db_exporter` command can  export and offline import net main, barnard, halley, proxima block  
offline import block also can use import_block.sh 

<!--more-->

## Usage
### export
use `starcoin_db_exporter`  
run cmd
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
the output file is block_1_10000.csv

### offline import
#### use`starcoin_db_exporter` offline import
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

#### use `import_block.sh` offline import
`starcoin_db_exporter`and`import_block.sh` under same path
`import_block.sh $1 $2`
$1 is net node like main, barnard
$2 is storage dir like ~/.starcoin/main, ~/.starcoin/barnard

run cmd
```shell
./import_block.sh barnard ~/.starcoin/barnard
```

this cmd can skip block already executed
