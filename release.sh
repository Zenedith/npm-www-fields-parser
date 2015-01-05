#!/bin/bash

# after merge pull request
description="$1"

if [ $# -lt 1 ];then
  echo "usage: $0 \$description"
  exit 1
fi

function gitTag() {
  echo "git tag stage\n"
  local tag="$1"
  git-release $tag
}

function packageProperty() {
  local field="$1"
  echo `npm view . $field`
}


function githubRelease() {
  echo "github release stage\n"
  local tag="$1"
  local description="$2"
  local repo=`packageProperty "name"`

  echo "github release $repo"

  github-release release \
    --user "zenedith" \
    --repo "$repo" \
    --tag $tag \
    --name "Release $tag" \
    --description "$description"
}

tag=`packageProperty "version"`
gitTag $tag
githubRelease $tag $description
