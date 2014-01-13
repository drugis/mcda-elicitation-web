#!/bin/bash

cp -R -L ../spring ./spring
mkdir spring/sass
cp config.rb spring/sass/
cp -R ../sass spring/sass/sass
cp -R ../sass-shared spring/sass/sass-shared

docker build -t=mcdaweb .

#rm -Rf spring
