#!/bin/bash
MATOMO_VERSION="Test"
MCDA_HOST="localhost"
TAG="composed"

WEBPACK_COMMAND="build-prod"

mkdir -p docker
cp -Rf node-backend docker
cp -Rf public docker
cp -Rf app docker
cp -Rf examples docker
cp -Rf schema docker
cp -Rf ssl docker
cp -Rf shared docker
cp -Rf tutorials docker
cp -f webpack* docker
cp -f package.json docker
cp -f DockerComposeFile docker/Dockerfile
cp -f yarn.lock docker
cp -f index.ts docker
cp -f tsconfig.json docker
cp -f ts-backend-config.json docker
cd docker
docker build --build-arg WEBPACK_COMMAND=$WEBPACK_COMMAND --build-arg MATOMO_VERSION=$MATOMO_VERSION --build-arg MCDA_HOST=$MCDA_HOST --tag addis/mcda:$TAG .
cd ..
rm -rf docker
