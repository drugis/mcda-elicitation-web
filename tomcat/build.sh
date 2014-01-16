#!/bin/bash

cd initial
docker build -t=mcdaweb:initial .
cd update
docker build -t=mcdaweb .
