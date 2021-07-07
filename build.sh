#!/bin/bash

rm -rf public

rm -rf resources

git submodule update --init --recursive

hugo --minify
