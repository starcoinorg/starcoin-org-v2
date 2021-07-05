#!/bin/bash

rm -rf public

rm -rf resources

hugo -s . --minify

aws s3 cp ./public s3://starcoin.org/ --recursive
echo 'Successful upload to s3://starcoin.org/'
