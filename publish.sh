#!/bin/bash

./build.sh

find public -name .DS_Store

hugo deploy --force --maxDeletes -1 –invalidateCDN 