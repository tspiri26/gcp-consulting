#!/bin/bash
echo "enter commit name: "
read commit

git config --global credential.helper store

# git init
git add .
git commit -m "$commit"
git push -u origin master
