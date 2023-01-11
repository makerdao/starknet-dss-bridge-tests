#!/usr/bin/env bash

(trap 'kill 0' SIGINT; yarn chain:l1 $1 & yarn chain:l2 $1 & wait)

if [ $? -eq 0 ]
then
  kill -9 $(lsof -t -i:8545)
  kill -9 $(lsof -t -i:5050)
  exit 0
else
  kill -9 $(lsof -t -i:8545)
  kill -9 $(lsof -t -i:5050)
  exit 1
fi