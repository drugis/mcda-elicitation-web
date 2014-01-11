#!/bin/bash

if [ ! -e MCDAWEB_CONTAINER ]; then echo "No container running?"; exit; fi

docker stop `cat MCDAWEB_CONTAINER`
docker commit `cat MCDAWEB_CONTAINER` mcdaweb
rm MCDAWEB_CONTAINER
