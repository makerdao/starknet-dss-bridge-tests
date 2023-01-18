import "@nomiclabs/hardhat-ethers";
import "@shardlabs/starknet-hardhat-plugin";
import { ethers } from "ethers";

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR)

const config = {
  defaultNetwork: "forkedEtherum",
  networks: {
    forkedEtherum: {
      // hardhat forked node
      url: "http://127.0.0.1:8545",
    },
    forkedStarknet: {
      //starknet forked devnet endpoint
      url: "http://127.0.0.1:5050",
    },
  },
  starknet: {
    dockerizedVersion: "0.10.3",
    network: "forkedStarknet",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    starknetSources: "./src",
    starknetArtifacts: "./starknet-artifacts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.15",
      }
    ],
    overrides: {
      "contracts/dss/dai.sol": {
        version: "0.5.12"
      },
      "contracts/dss/join.sol": {
        version: "0.5.12"
      },
      "contracts/dss/jug.sol": {
        version: "0.5.12"
      },
      "contracts/dss/lib.sol": {
        version: "0.5.12"
      },
      "contracts/dss/vat.sol": {
        version: "0.5.12"
      },
      "contracts/dss/vow.sol": {
        version: "0.5.12"
      },
    }
  },
};

export default config;
