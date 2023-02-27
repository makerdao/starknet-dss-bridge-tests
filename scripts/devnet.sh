#!/usr/bin/env bash
export STARKNET_DEVNET_CAIRO_VM=rust
if [[ $2 == "load" ]]; then  
  exec poetry run starknet-devnet --seed 0 --fork-network alpha-$1 --load-path devnet-dmp.pkl
else
  exec poetry run starknet-devnet --seed 0 --fork-network alpha-$1 --dump-on exit --dump-path devnet-dmp.pkl
fi 