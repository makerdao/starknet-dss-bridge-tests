#!/bin/bash

yarn test:wait

if [ $? -eq 0 ]
then
  kill -9 $(lsof -t -i:8545)
  docker stop devnet
  exit 0
else
  kill -9 $(lsof -t -i:8545)
  docker stop devnet
  exit 1
fi
