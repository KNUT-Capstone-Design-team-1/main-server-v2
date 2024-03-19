#!/bin/bash
echo "---- Set environment values ----"
unamestr=$(uname)

if [ $unamestr = "Linux" ]; then
  export $(grep -v '^#' .env | xargs -d '\n')

elif [ $unamestr = "FreeBSD" ] || [ $unamestr = "Darwin" ]; then
  export $(grep -v '^#' .env | xargs -0)
fi

echo "---- OK ----"
echo "---- $1 ----"

if [ $1 = "STAND-ALONE" ]; then
  echo "---- Stop wip-main-server-v2 ----"
  sudo systemctl stop wip-main-server-v2
  echo "---- OK ----"

  echo "---- Build and install library ----"
  tsc --build --force
  npm install
  echo "---- OK ----"

  echo "---- Start wip-main-server-v2 ----"
  sudo systemctl start wip-main-server-v2
  echo "---- OK ----"
elif [ $1 = "SINGLE-CONTAINER" ]; then
  echo "---- Build Container image ----"
  build_cmd="docker build . -t wip-main-server-v2"

  while read line; do
    arg_temp=$(echo $line | cut -f 1 -d'=')
    build_cmd+=" --build-arg $arg_temp=$(eval echo '$'$arg_temp)"
  done < .env

  $(echo $build_cmd)
  echo "---- OK ----"

  echo "---- Remove previous container ----"
  docker container rm -f wip-main-server-v2
  echo "---- OK ----"

  echo "---- Remove previous image ----"
  docker rmi $(docker images -q wip-main-server-v2)
  echo "---- OK ----"

  echo "---- Run container ----"
  docker run -d --name wip-main-server-v2 wip-main-server-v2
  echo "---- OK ----"
fi