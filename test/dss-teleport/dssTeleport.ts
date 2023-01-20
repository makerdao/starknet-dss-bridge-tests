import { Address, GetContractResult } from "@wagmi/core";
import teleportJoinAbi from "./abi/teleportJoinAbi";
import teleportRouterAbi from "./abi/teleportRouterAbi";
import teleportOracleAuthAbi from "./abi/teleportOracleAuthAbi";
import hre from "hardhat";
import { Dai, Vat, DaiJoin, Jug, Cure, Vow } from "../dss/dss";
import { expect } from "earljs";
import { formatBytes32String } from "ethers/lib/utils.js";
import { prank } from "../helpers/prank";

export type TeleportJoin = GetContractResult<typeof teleportJoinAbi>;
export type TeleportRouter = GetContractResult<typeof teleportRouterAbi>;
export type TeleportOracleAuth = GetContractResult<
  typeof teleportOracleAuthAbi
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

export async function deploy(
  deployer: Address,
  owner: Address,
  ilk: string,
  domain: string,
  parentDomain: string,
  daiJoin: DaiJoin
): Promise<TeleportInstance> {
  const teleport: TeleportInstance = {
    join: await deployTeleportJoin(
      await daiJoin.vat(),
      daiJoin.address,
      ilk,
      domain
    ),
    router: await deployTeleportRouter(
      await daiJoin.dai(),
      domain,
      parentDomain
    ),
    oracleAuth: await deployTeleportOracleAuth(daiJoin.address),
  };
  expect(await teleport.join.wards(deployer)).toBeTruthy();
  await (await teleport.join.rely(owner)).wait();
  await (await teleport.join.deny(deployer)).wait();

  expect(await teleport.router.wards(deployer)).toBeTruthy();
  await (await teleport.router.rely(owner)).wait();
  await (await teleport.router.deny(deployer)).wait();

  expect(await teleport.oracleAuth.wards(deployer)).toBeTruthy();
  await (await teleport.oracleAuth.rely(owner)).wait();
  await (await teleport.oracleAuth.deny(deployer)).wait();

  return teleport;
}

export interface DssTeleportConfig {
  debtCeiling: bigint;
  oracleThreshold: bigint;
  oracleSigners: Address[];
}

export interface DssInstance {
  vat: Vat;
  jug: Jug;
  cure: Cure;
  vow: Vow;
}

// TODO which wagmi type should be used here?
const SPOT = formatBytes32String("spot") as Address;
const VOW = formatBytes32String("vow") as Address;
const THRESHOLD = formatBytes32String("threshold") as Address;
const GATEWAY = formatBytes32String("gateway") as Address;

// TODO: how to use bitints?

export async function init(
  dss: DssInstance,
  teleport: TeleportInstance,
  cfg: DssTeleportConfig
) {
  const ilk = await teleport.join.ilk();
  await (await dss.vat.init(ilk)).wait();
  await (await dss.jug.init(ilk)).wait();
  await (
    await dss.vat["file(bytes32,bytes32,uint256)"](ilk, LINE, cfg.debtCeiling)
  ).wait();
  // dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
  await (
    await dss.vat["file(bytes32,bytes32,uint256)"](ilk, SPOT, 10n ** 27n)
  ).wait();
  await (await dss.cure.lift(teleport.join.address)).wait();
  await (await dss.vat.rely(teleport.join.address)).wait();
  await (await teleport.join.rely(teleport.oracleAuth.address)).wait();
  await (await teleport.join.rely(teleport.router.address)).wait();
  // teleport.join.rely(esm);
  await (
    await teleport.join["file(bytes32,address)"](VOW, dss.vow.address)
  ).wait();
  // teleport.oracleAuth.rely(esm);
  await (await teleport.oracleAuth.file(THRESHOLD, cfg.oracleThreshold)).wait();
  await (await teleport.oracleAuth.addSigners(cfg.oracleSigners)).wait();
  // teleport.router.rely(esm);
  await (
    await teleport.router["file(bytes32,bytes32,address)"](
      GATEWAY,
      await teleport.join.domain(),
      teleport.join.address
    )
  ).wait();
}

interface DssTeleportDomainConfig {
  domain: Address; // which type should be here? bytes32
  fees: Address;
  gateway: Address;
  debtCeiling: bigint;
}

const FEES = formatBytes32String("fees") as Address;
const LINE = formatBytes32String("line") as Address;

export async function initDomain(
  teleport: TeleportInstance,
  cfg: DssTeleportDomainConfig
) {
  await (
    await teleport.join["file(bytes32,bytes32,address)"](
      FEES,
      cfg.domain,
      cfg.fees
    )
  ).wait();
  await (
    await teleport.join["file(bytes32,bytes32,uint256)"](
      LINE,
      cfg.domain,
      cfg.debtCeiling
    )
  ).wait();
  await (
    await teleport.router["file(bytes32,bytes32,address)"](
      GATEWAY,
      cfg.domain,
      cfg.gateway
    )
  ).wait();
}
