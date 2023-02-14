import { Address, GetContractResult } from "@wagmi/core";
import { expect } from "earljs";
import { Signer } from "ethers";
import { formatBytes32String } from "ethers/lib/utils.js";
import hre from "hardhat";

import { DaiJoin, DssInstance } from "../dss/dss";
import { prank } from "../helpers/prank";
import { l1String } from "../helpers/utils";
import teleportFeesAbi from "./abi/teleportFeesAbi";
import teleportJoinAbi from "./abi/teleportJoinAbi";
import teleportLinearFeeAbi from "./abi/teleportLinearFeeAbi";
import teleportOracleAuthAbi from "./abi/teleportOracleAuthAbi";
import teleportRouterAbi from "./abi/teleportRouterAbi";

export type TeleportJoin = GetContractResult<typeof teleportJoinAbi>;
export type TeleportRouter = GetContractResult<typeof teleportRouterAbi>;
export type TeleportOracleAuth = GetContractResult<
  typeof teleportOracleAuthAbi
>;
export type TeleportFees = GetContractResult<typeof teleportFeesAbi>;
export type TeleportLinearFeeAbi = GetContractResult<
  typeof teleportLinearFeeAbi
>;

// Based on:
// https://github.com/makerdao/dss-bridge/blob/v1/src/deploy/DssTeleport.sol

async function deployTeleportJoin(
  vat: Address,
  daiJoin: Address,
  ilk: string,
  domain: string
): Promise<TeleportJoin> {
  const contractFactory = await hre.ethers.getContractFactory("TeleportJoin");
  const contract: TeleportJoin = (await contractFactory.deploy(
    vat,
    daiJoin,
    ilk,
    domain
  )) as TeleportJoin;
  await contract.deployed();

  // TODO: code below does not work due to some obscure ts importing problems
  // return getContract({
  //   address: await contract.address,
  //   abi: dssTeleportJoinAbi,
  //   signerOrProvider: signerOrProvider,
  // });

  return prank(contract);
}

async function deployTeleportRouter(
  dai: Address,
  domain: string,
  parentDomain: string
): Promise<TeleportRouter> {
  const contractFactory = await hre.ethers.getContractFactory("TeleportRouter");
  const contract = (await contractFactory.deploy(
    dai,
    domain,
    parentDomain
  )) as TeleportRouter;
  await contract.deployed();
  return prank(contract);
}

async function deployTeleportOracleAuth(
  daiJoin: Address
): Promise<TeleportOracleAuth> {
  const contractFactory = await hre.ethers.getContractFactory(
    "TeleportOracleAuth"
  );
  const contract = (await contractFactory.deploy(
    daiJoin
  )) as TeleportOracleAuth;
  await contract.deployed();
  return prank(contract);
}

interface TeleportInstance {
  join: TeleportJoin;
  router: TeleportRouter;
  oracleAuth: TeleportOracleAuth;
}

export async function deployTeleport(
  deployerSigner: Signer,
  ownerSigner: Signer,
  ilk: string,
  domain: string,
  parentDomain: string,
  daiJoin: DaiJoin
): Promise<TeleportInstance> {
  const teleport: TeleportInstance = {
    join: await deployTeleportJoin(
      await daiJoin.vat(),
      daiJoin.address,
      l1String(ilk),
      l1String(domain)
    ),
    router: await deployTeleportRouter(
      await daiJoin.dai(),
      l1String(domain),
      l1String(parentDomain)
    ),
    oracleAuth: await deployTeleportOracleAuth(daiJoin.address),
  };

  const deployer = (await deployerSigner.getAddress()) as Address;
  const owner = (await ownerSigner.getAddress()) as Address;

  expect(await teleport.join.wards(deployer)).toBeTruthy();
  await teleport.join.rely(owner);
  await teleport.join.deny(deployer);

  expect(await teleport.router.wards(deployer)).toBeTruthy();
  await teleport.router.rely(owner);
  await teleport.router.deny(deployer);

  expect(await teleport.oracleAuth.wards(deployer)).toBeTruthy();
  await teleport.oracleAuth.rely(owner);
  await teleport.oracleAuth.deny(deployer);

  return teleport;
}

export async function deployLinearFee(
  fee: bigint,
  ttl: bigint
): Promise<TeleportFees> {
  const contractFactory = await hre.ethers.getContractFactory(
    "TeleportLinearFee"
  );
  const contract = (await contractFactory.deploy(fee, ttl)) as TeleportFees;
  await contract.deployed();
  return prank(contract);
}

export interface DssTeleportConfig {
  debtCeiling: bigint;
  oracleThreshold: bigint;
  oracleSigners: Address[];
}

// TODO which wagmi type should be used here?
const SPOT = formatBytes32String("spot") as Address;
const VOW = formatBytes32String("vow") as Address;
const THRESHOLD = formatBytes32String("threshold") as Address;
const GATEWAY = formatBytes32String("gateway") as Address;

export async function initTeleport(
  dss: DssInstance,
  teleport: TeleportInstance,
  cfg: DssTeleportConfig
) {
  const ilk = await teleport.join.ilk();
  await dss.vat.init(ilk);
  await dss.jug.init(ilk);
  await dss.vat["file(bytes32,bytes32,uint256)"](ilk, LINE, cfg.debtCeiling);
  await dss.vat["file(bytes32,bytes32,uint256)"](ilk, SPOT, 10n ** 27n);
  await dss.cure.lift(teleport.join.address);
  await dss.vat.rely(teleport.join.address);
  await teleport.join.rely(teleport.oracleAuth.address);
  await teleport.join.rely(teleport.router.address);
  // teleport.join.rely(esm);
  await teleport.join["file(bytes32,address)"](VOW, dss.vow.address);
  // teleport.oracleAuth.rely(esm);
  await teleport.oracleAuth.file(THRESHOLD, cfg.oracleThreshold);
  await teleport.oracleAuth.addSigners(cfg.oracleSigners);
  // teleport.router.rely(esm);
  await teleport.router["file(bytes32,bytes32,address)"](
    GATEWAY,
    await teleport.join.domain(),
    teleport.join.address
  );
}

export interface DssTeleportDomainConfig {
  domain: string; // which type should be here? bytes32
  fees: Address;
  gateway: Address;
  debtCeiling: bigint;
}

const FEES = formatBytes32String("fees") as Address;
const LINE = formatBytes32String("line") as Address;

export async function initTeleportDomain(
  teleport: TeleportInstance,
  cfg: DssTeleportDomainConfig
) {
  await teleport.join["file(bytes32,bytes32,address)"](
    FEES,
    l1String(cfg.domain),
    cfg.fees
  );
  await teleport.join["file(bytes32,bytes32,uint256)"](
    LINE,
    l1String(cfg.domain),
    cfg.debtCeiling
  );

  await teleport.router["file(bytes32,bytes32,address)"](
    GATEWAY,
    l1String(cfg.domain),
    cfg.gateway
  );
}
