#!/usr/bin/env bash

anvil --fork-url https://$1.infura.io/v3/56387818e18e404a9a6d2391af0e9085 --state state.json --no-rate-limit  --code-size-limit 100000
