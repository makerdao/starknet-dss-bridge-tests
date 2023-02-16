import { StarknetContractFactory } from "@shardlabs/starknet-hardhat-plugin/dist/src/types";
import { Address } from "@wagmi/core";
import { utils } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import fs from "fs";
import hre, { starknet } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";

export const WAD = 10n ** 18n;
export const RAY = 10n ** 27n;
export const RAD = 10n ** 45n;

export const _1_HOUR = 3600n;
export const _6_HOURS = 6n * _1_HOUR;

export async function getL2ContractAt(
  hre: HardhatRuntimeEnvironment,
  abiPath: string, // folder.cairo/contract_abi.cairo
  address: string
) {
  const factory = new StarknetContractFactory({
    hre,
    abiPath: path.join(
      process.env.PWD!,
      "/starknet-artifacts/contracts/starknet/starknet-dss/",
      abiPath
    ),
    metadataPath: "", //ignored
  });
  return factory.getContractAt(address);
}

export function l2String(str: string): Address {
  return `0x${Buffer.from(str, "utf8").toString("hex")}` as Address;
}

export function l1String(str: string): Address {
  return hre.ethers.utils.formatBytes32String(str) as Address;
}

export function l2StringAsUint256(str: string): bigint {
  return BigInt(hre.ethers.utils.formatBytes32String(str));
}

export async function reset() {
  // TODO: how to reset properly? jsonRpcUrl should be outside ts code
  await hre.network.provider.request({
    method: "anvil_reset",
    params: [
      {
        forking: {
          jsonRpcUrl:
            "https://mainnet.infura.io/v3/56387818e18e404a9a6d2391af0e9085",
        },
      },
    ],
  });
  // await starknet.devnet.flush();
}

export async function setBalance(
  address: string,
  balance: string
): Promise<void> {
  const balanceHex = utils
    .parseEther(balance)
    .toHexString()
    .replace("0x0", "0x");

  await hre.network.provider.request({
    method: "anvil_setBalance",
    params: [address, balanceHex],
  });
}

export async function saveSnapshot() {
  await starknet.devnet.dump("starknet_state.dmp");
}

export async function loadSnapshot() {
  if (!fs.existsSync("starknet_state.dmp")) {
    return;
  }

  await starknet.devnet.load("starknet_state.dmp");
}

export async function getAddressOfNextDeployedContract(): Promise<string> {
  const signer = (await hre.ethers.getSigners())[0];
  return getContractAddress({
    from: await signer.getAddress(),
    nonce: await signer.getTransactionCount(),
  });
}
