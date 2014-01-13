#!/bin/bash

if [ -e MCDAWEB_CONTAINER ]; then echo "Stop and Commit the container first"; exit; fi

cp ../spring/target/mcda-web.war update/
cp ../spring/database.sql update/
docker tag mcdaweb:latest mcdaweb:previous
cd update
docker build -t=mcdaweb .
