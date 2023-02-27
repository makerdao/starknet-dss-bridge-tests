# starknet-dss-bridge-tests

# Install dependencies
  
  ```
  yarn install
  poetry install
  ```

# Run chain
  
  ```
  yarn chain mainnet|goerli (load?)
  ```
  You can specify the option `load` if you want to load the chain with the latest state of `starknet-devnet` stored locally.
  If you don't specify the option, `starknet-devnet`'s state will be dumped on each transaction to a `devnet-dmp.pkl` file.

# Run tests
Once the chain is running you can run the integration tests.
    
    
    yarn test
    

## How to work with submodules
### Add new submodule
```
cd lib
git submodule add git@github.com:makerdao/dss.git
```

### Set branch
```
git config -f .gitmodules submodule.lib/dss.branch v1.2
```

### Init submodules after checkout
```
git submodule update --init --recursive
```

or add `--recurse-submodules` to the `clone` command:

```
git clone --recurse-submodules git@github.com:makerdao/dss.git
```

### Update submodules
```
git submodule update --remote
```
