#!/bin/sh

git archive --format zip -o horn-master.zip master
rm -Rf horn
mkdir horn
cd horn
unzip ../horn-master.zip
cd ..
rm horn-master.zip
jekyll
