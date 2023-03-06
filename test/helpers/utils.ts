import { StarknetContractFactory } from "@shardlabs/starknet-hardhat-plugin/dist/src/types";
import { Address } from "@wagmi/core";
import { utils } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";
import { KeyPair } from "starknet";
import {
  getKeyPair,
  getStarkKey,
  sign,
} from "starknet/dist/utils/ellipticCurve";
import { pedersen } from "starknet/dist/utils/hash";
import { BigNumberish, toFelt } from "starknet/utils/number";

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

export function toUint256(v: bigint): { low: bigint; high: bigint } {
  const bits = v.toString(16).padStart(64, "0");
  return {
    low: BigInt(`0x${bits.slice(32)}`),
    high: BigInt(`0x${bits.slice(0, 32)}`),
  };
}

export const starknetInt256 = (amount: bigint): bigint => {
  const value = ~((amount - 1n) | ~((1n << 256n) - 1n));
  return value;
};

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

export async function getAddressOfNextDeployedContract(): Promise<string> {
  const signer = (await hre.ethers.getSigners())[0];
  return getContractAddress({
    from: await signer.getAddress(),
    nonce: await signer.getTransactionCount(),
  });
}

type Signature = {
  pk: string;
  r: BigNumberish;
  s: BigNumberish;
};

export async function getStarknetSignatures(
  signHash: string
): Promise<{ signatures: Signature[]; signers: string[] }> {
  // seeds chosen s.t. corresponding addresses are in ascending order
  const seeds = [
    8, 10, 6, 2, 9, 15, 14, 20, 7, 29, 24, 13, 12, 25, 16, 26, 21, 22, 0, 18,
    17, 27, 3, 28, 23, 19, 4, 5, 1, 11,
  ];
  const numSigners = seeds.length;
  const signers: string[] = new Array(numSigners);
  const signatures: Signature[] = [];
  for (let index = 0; index < numSigners; index++) {
    const sk = pedersen([seeds[index], 0]);
    const _keyPair: KeyPair = getKeyPair(sk);
    const _pk = getStarkKey(_keyPair);
    signers[index] = toFelt(_pk);
    const _signature = sign(_keyPair, signHash);
    signatures.push({
      pk: toFelt(_pk),
      r: _signature[0],
      s: _signature[1],
    } as Signature);
  }
  return Promise.resolve({ signatures, signers });
}
