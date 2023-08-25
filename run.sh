!#/bin/bash

# set environment values
unamestr=$(uname)

if [ "$unamestr" = 'Linux' ]; then
  export $(grep -v '^#' .env | xargs -d '\n')

elif [ "$unamestr" = 'FreeBSD' ] || [ "$unamestr" = 'Darwin' ]; then
  export $(grep -v '^#' .env | xargs -0)
fi

# container stop
docker stop wip-main

# docker image delete
build_mode=$1
if [$build_mode = "rebuild"]; then
  docker rmi wip-main
fi

# docker image build
build_cmd="docker build -t wip-main"
while read line; do
   arg_temp=$(echo $line | cut -f 1 -d'=')
   build_cmd+=" --build-arg $arg_temp=$(eval echo '$'$arg_temp)"
done < .env

build_cmd+=" ."
echo $build_cmd

# docker container run
docker run wip-main -d