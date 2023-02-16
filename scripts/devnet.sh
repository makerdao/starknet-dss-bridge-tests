#!/usr/bin/env bash
export STARKNET_DEVNET_CAIRO_VM=rust
exec poetry run starknet-devnet --seed 0 --fork-network alpha-$1
