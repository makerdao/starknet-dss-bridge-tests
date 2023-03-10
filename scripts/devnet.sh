#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

image=shardlabs/starknet-devnet:0.4.3

if [ "$(uname)" == "Darwin" ]; then
    image="${image}-arm"
fi

docker rm -f devnet
exec docker run --name devnet -p 127.0.0.1:5050:5050 ${image} --seed 0 --fork-network alpha-$1
