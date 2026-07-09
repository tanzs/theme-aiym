#!/bin/bash
set -e
cd /vol1/1000/docker/halo/halo2/themes/theme-aiym
git config user.email "aiym@aiym.fun"
git config user.name "AIYM"
git branch -m main
git remote add origin https://github.com/tanzs/theme-aiym.git
echo "DONE"
