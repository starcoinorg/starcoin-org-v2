#!/bin/bash

./build.sh

aws s3 cp ./public s3://starcoin.org/ --recursive
