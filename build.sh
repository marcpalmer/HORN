#!/bin/sh

git checkout master
git pull origin master
git checkout gh-pages
git archive --format zip -o horn-master.zip master
rm -Rf horn
mkdir horn
cd horn
unzip ../horn-master.zip
cd ..
rm horn-master.zip
git add horn
jekyll --server

