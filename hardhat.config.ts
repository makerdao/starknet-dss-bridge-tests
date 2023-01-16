import "@nomiclabs/hardhat-ethers";
import "@shardlabs/starknet-hardhat-plugin";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: "http://127.0.0.1:8545",
    },
    mainnet: {
      url: "http://127.0.0.1:8545",
    },
    devnet: {
      //starknet devnet endpoint
      url: "http://127.0.0.1:5050",
    },
  },
  starknet: {
    dockerizedVersion: "0.10.3",
    network: "devnet",
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
