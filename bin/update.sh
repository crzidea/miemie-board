#!/bin/sh
cd `dirname $0`/..
tmp=/tmp/gh-pages-miemie-board
asserts="font-awesome fonts img"
mkdir -p $tmp
rm -rf $tmp/* >/dev/null 2>&1
grunt
cp -rL dist/* $tmp >/dev/null 2>&1
cd public
cp -rf $asserts $tmp >/dev/null 2>&1
git checkout gh-pages
cp -rf $tmp/* ..
