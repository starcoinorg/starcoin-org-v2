#!/bin/bash

./build.sh

find public -name .DS_Store

aws s3 cp ./public s3://starcoin.org/ --recursive
echo 'Successful upload to s3://starcoin.org/'