#!/usr/bin/env bash

exec poetry run starknet-devnet --seed 0 --fork-network alpha-$1
