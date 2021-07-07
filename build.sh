#!/bin/bash

rm -rf public

rm -rf resources

git submodule init && git submodule update

hugo -s . --minify
