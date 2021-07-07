#!/bin/bash

rm -rf public

rm -rf resources

cd content/developer/SIPs

git submodule init && git submodule update

cd ../../../

hugo -s . --minify
