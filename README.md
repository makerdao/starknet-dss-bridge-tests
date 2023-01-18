# starknet-dss-bridge-tests

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
