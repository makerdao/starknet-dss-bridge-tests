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
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
    ],
  },
};

export default config;
