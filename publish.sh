#!/bin/bash

./build.sh

find public -name .DS_Store

aws s3 cp ./public s3://starcoin.org/ --recursive --cache-control max-age=0
echo 'Successful upload to s3://starcoin.org/'