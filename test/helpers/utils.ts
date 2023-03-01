import { StarknetContractFactory } from "@shardlabs/starknet-hardhat-plugin/dist/src/types";
import { Address } from "@wagmi/core";
import { utils } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import fs, { writeFileSync } from "fs";
import hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";

export const WAD = 10n ** 18n;
export const RAY = 10n ** 27n;
export const RAD = 10n ** 45n;

export const _1_HOUR = 3600n;
export const _6_HOURS = 6n * _1_HOUR;

export interface SetupConfig {
  l1join: Address;
  l1router: Address;
  l1oracleauth: Address;
  l1fees: Address;
  domainHost: Address;
  l2cure: string;
  l2daiJoin: string;
  l2vat: string;
  l2pot: string;
  l2spotter: string;
  l2join: string;
  l2router: string;
  l2oracleauth: string;
  l2fees: string;
  l2jug: string;
  domainGuest: string;
  l2end: string;
  bridgeOracle: Address;
  claimToken: string;
}

export async function getL2ContractAt(
  hre: HardhatRuntimeEnvironment,
  abiPath: string, // folder.cairo/contract_abi.cairo
  address: string
) {
  const factory = new StarknetContractFactory({
    hre,
    abiPath: path.join(
      process.env.PWD!,
      "/starknet-artifacts/contracts/starknet/",
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

// Dump deployment data to starknet_addresses.json
export async function saveSnapshot(
  teleport: any,
  snTeleport: any,
  snDss: any,
  snClaimToken: any,
  fees: any,
  snFee: any,
  host: any,
  guest: any,
  bridgeOracle: any
) {
  const addresses: SetupConfig = {
    l1join: teleport.join.address,
    l1router: teleport.router.address,
    l1oracleauth: teleport.oracleAuth.address,
    l1fees: fees.address,
    domainHost: host.address,
    l2cure: snDss.cure.address,
    l2daiJoin: snDss.daiJoin.address,
    l2vat: snDss.vat.address,
    l2pot: snDss.pot.address,
    l2spotter: snDss.spotter.address,
    l2jug: snDss.jug.address,
    l2end: snDss.end.address,
    claimToken: snClaimToken.address,
    l2join: snTeleport.join.address,
    l2router: snTeleport.router.address,
    l2oracleauth: snTeleport.oracleAuth.address,
    domainGuest: guest.address,
    l2fees: snFee.address,
    bridgeOracle: bridgeOracle.address,
  };

  const addressesFile = path.join(__dirname, "../starknet_addresses.json");
  writeFileSync(addressesFile, JSON.stringify(addresses, null, 2));
}

// Load deployment data from starknet_addresses.json
export function loadSnapshot(): SetupConfig {
  if (!fs.existsSync(path.join(__dirname, "../starknet_addresses.json"))) {
    console.error("starknet_addresses.json not found");
    return {} as SetupConfig;
  }

  const addresses = JSON.parse(
    fs
      .readFileSync(path.join(__dirname, "../starknet_addresses.json"))
      .toString()
  );

  return addresses;
}

export async function getAddressOfNextDeployedContract(): Promise<string> {
  const signer = (await hre.ethers.getSigners())[0];
  return getContractAddress({
    from: await signer.getAddress(),
    nonce: await signer.getTransactionCount(),
  });
}
