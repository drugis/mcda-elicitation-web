#!/bin/bash
ATHENTICATION_METHOD="$1"
MATOMO_VERSION="$2"
MCDA_HOST="$3"
TAG="$4"

if [ "$ATHENTICATION_METHOD" = "LOCAL" ]
then
  WEBPACK_COMMAND="build-local-login"
else 
  WEBPACK_COMMAND="build-prod"
fi

if [ "$MCDA_HOST" = "" ]
then
  echo MCDA_HOST argument not provided
  exit 1
fi

if [ "$TAG" = "" ]
then
  TAG="latest"
fi

mkdir -p docker
cp -Rf node-backend docker
cp -Rf public docker
cp -Rf app docker
cp -Rf examples docker
cp -Rf schema docker
cp -Rf shared docker
cp -Rf tutorials docker
cp -f webpack* docker
cp -f package.json docker
cp -f Dockerfile docker
cp -f yarn.lock docker
cp -f index.ts docker
cp -f tsconfig.json docker
cp -f ts-backend-config.json docker
cd docker
docker build --build-arg WEBPACK_COMMAND=$WEBPACK_COMMAND --build-arg MATOMO_VERSION=$MATOMO_VERSION --build-arg MCDA_HOST=$MCDA_HOST --tag addis/mcda:$TAG .
cd ..
rm -rf docker
