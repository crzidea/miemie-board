#!/bin/sh
cd `dirname $0`/..
tmp=~/tmp/gh-pages-miemie-board
mkdir -p $tmp
rm -rf $tmp/* >/dev/null 2>&1
grunt
cp -rL dist/* $tmp
git checkout gh-pages
cp -rf $tmp/* .
