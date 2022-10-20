#! /bin/bash

cd ~/Masters/CS/Visual-Analysis/global-warning || exit 1

git add . >> /dev/null

git commit -m "$@" >> /dev/null

git push --force https://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@github.com/mohammadzainabbas/global-warning.git

cd - || exit 1