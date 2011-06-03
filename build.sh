#!/bin/sh

git archive --format zip -o horn-master.zip master
rm -Rf demo
mkdir demo
cd demo
unzip ../horn-master.zip
cd ..
rm horn-master.zip
jekyll
