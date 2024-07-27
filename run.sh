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
  rm -rf /must_be_madness/what_is_pill/wip-main-server-v2/build
  tsc --build
  yarn install
  echo "---- OK ----"

  echo "---- Start wip-main-server-v2 ----"
  sudo systemctl start wip-main-server-v2
  echo "---- OK ----"
elif [ $1 = "SINGLE-CONTAINER" ]; then
  echo "---- Build container image ----"
  build_cmd="docker build --no-cache . -t wip-main-server-v2"

  while read line; do
    arg_temp=$(echo $line | cut -f 1 -d'=')
    build_cmd+=" --build-arg $arg_temp=$(eval echo '$'$arg_temp)"
  done < .env

  $(echo $build_cmd)
  echo "---- OK ----"

  echo "---- Remove previous container ----"
  docker container rm -f wip-main-server-v2
  echo "---- OK ----"

  echo "---- Run container ----"
  docker run -d \
    -v /must_be_madness/what_is_pill/wip-main-server-v2/logs:/usr/local/wip-main-server-v2/logs \
    -v /must_be_madness/what_is_pill/resources:/usr/local/resources \
    --name wip-main-server-v2 wip-main-server-v2 \
    --add-host host.docker.internal:host-gateway
  echo "---- OK ----"

  echo "---- Remove previous image ----"
  docker image prune -f
  echo "---- OK ----"
fi