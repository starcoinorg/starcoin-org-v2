#!/bin/bash

rm -rf public

rm -rf resources

cd content/developer/SIPs

git submodule init && git submodule update

cd ../../../

# comment out 'type: *' line, otherwise, hugo will use the news theme
find content/developer/SIPs/ -name index*.md | xargs sed -i 's/^type\:/\# type\:/'

hugo -s . --minify
