#!/usr/bin/env bash
export STARKNET_DEVNET_CAIRO_VM=rust
if [[ $2 == "load" ]]; then  
  exec poetry run starknet-devnet --seed 0 --fork-network alpha-$1 --load-path starknet_state.dmp
else
  exec poetry run starknet-devnet --seed 0 --fork-network alpha-$1 --dump-on exit --dump-path starknet_state.dmp
fi 