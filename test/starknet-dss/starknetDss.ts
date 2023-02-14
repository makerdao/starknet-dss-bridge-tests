import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { Address } from "@wagmi/core";
import hre from "hardhat";

import { currentSnAccount, starknetPrank } from "../helpers/starknet/prank";
import { Felt } from "../helpers/starknet/types";
import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { getL2ContractAt, l2String } from "../helpers/utils";
import {
  cureAbi,
  daiAbi,
  daiJoinAbi,
  endAbi,
  jugAbi,
  potAbi,
  spotterAbi,
  tokenAbi,
  vatAbi,
} from "./abi";
import { breakIntoDai } from "./breakIntoDai";

export type SnVat = WrappedStarknetContract<typeof vatAbi>;
export type SnDai = WrappedStarknetContract<typeof daiAbi>;
export type SnCure = WrappedStarknetContract<typeof cureAbi>;
export type SnEnd = WrappedStarknetContract<typeof endAbi>;
export type SnDaiJoin = WrappedStarknetContract<typeof daiJoinAbi>;
export type SnJug = WrappedStarknetContract<typeof jugAbi>;
export type SnSpotter = WrappedStarknetContract<typeof spotterAbi>;
export type SnPot = WrappedStarknetContract<typeof potAbi>;
export type SnToken = WrappedStarknetContract<typeof tokenAbi>;

async function deploySnVat(ward: Felt): Promise<SnVat> {
  const factory = await hre.starknet.getContractFactory("vat");
  await currentSnAccount().declare(factory);
  const vat = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

export async function deploySnToken(ward: Felt): Promise<SnToken> {
  const factory = await hre.starknet.getContractFactory("tests/mock_token");
  await currentSnAccount().declare(factory);
  const token = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof tokenAbi>(wrapTyped(hre, token));
}

async function deploySnDaiJoin(vat: Felt, dai: Felt): Promise<SnDaiJoin> {
  const factory = await hre.starknet.getContractFactory("dai_join");
  await currentSnAccount().declare(factory);
  const daiJoin = await currentSnAccount().deploy(factory, { vat, dai });
  return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

async function deploySnSpotter(vat: Felt, ward: Felt): Promise<SnSpotter> {
  const factory = await hre.starknet.getContractFactory("spotter");
  await currentSnAccount().declare(factory);
  const spotter = await currentSnAccount().deploy(factory, { vat, ward });
  return starknetPrank<typeof spotterAbi>(wrapTyped(hre, spotter));
}

async function deploySnJug(vat: Felt, ward: Felt): Promise<SnJug> {
  const factory = await hre.starknet.getContractFactory("jug");
  await currentSnAccount().declare(factory);
  // TODO: rename jug.cairo constructor arguments to just vat, ward
  const jug = await currentSnAccount().deploy(factory, {
    vat_: vat,
    ward_: ward,
  });
  return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

async function deploySnPot(vat: Felt, ward: Felt): Promise<SnPot> {
  const factory = await hre.starknet.getContractFactory("pot");
  await currentSnAccount().declare(factory);
  const pot = await currentSnAccount().deploy(factory, { vat, ward });
  return starknetPrank<typeof potAbi>(wrapTyped(hre, pot));
}

async function deploySnCure(ward: Felt): Promise<SnCure> {
  const factory = await hre.starknet.getContractFactory("cure");
  await currentSnAccount().declare(factory);
  const cure = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof cureAbi>(wrapTyped(hre, cure));
}

async function deploySnEnd(vat: string, ward: Felt): Promise<SnEnd> {
  const factory = await hre.starknet.getContractFactory("end");
  await currentSnAccount().declare(factory);
  const end = await currentSnAccount().deploy(factory, { ward, vat });
  return starknetPrank<typeof endAbi>(wrapTyped(hre, end));
}

export interface SnDssInstance {
  vat: SnVat;
  jug: SnJug;
  cure: SnCure;
  dai: SnDai;
  daiJoin: SnDaiJoin;
  end: SnEnd;
  spotter: SnSpotter;
  pot: SnPot;
}

export async function deploySnDss(
  owner: Account,
  dai: string
): Promise<SnDssInstance> {
  const vat = await deploySnVat(owner.address);
  const dai_ = await getSnDai(dai);
  const daiJoin = await deploySnDaiJoin(vat.address, dai_.address);
  // //dss.dog = DaiAbstract(address(new Dog()));  // Needs merge in xdomain-dss
  const spotter = await deploySnSpotter(vat.address, owner.address);
  const pot = await deploySnPot(vat.address, owner.address);
  const jug = await deploySnJug(vat.address, owner.address);
  const cure = await deploySnCure(owner.address);
  const end = await deploySnEnd(vat.address, owner.address);

  return {
    vat,
    jug,
    dai: dai_,
    cure,
    daiJoin,
    end,
    spotter,
    pot,
  };
}

// Based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/deploy/XDomainDss.sol
export async function getSnDaiJoin(address: string): Promise<SnDaiJoin> {
  const daiJoin = await getL2ContractAt(
    hre,
    "dai_join.cairo/dai_join_abi.json",
    address
  );
  return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

export async function getSnDai(address: string): Promise<SnDai> {
  const dai = await getL2ContractAt(hre, "dai.cairo/dai_abi.json", address);
  return starknetPrank<typeof daiAbi>(wrapTyped(hre, dai));
}

export async function getSnVat(address: string): Promise<SnVat> {
  const vat = await getL2ContractAt(hre, "vat.cairo/vat_abi.json", address);
  return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

export async function getSnJug(address: string): Promise<SnJug> {
  const jug = await getL2ContractAt(hre, "jug.cairo/jug_abi.json", address);
  return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

export async function getSnCure(address: string): Promise<SnCure> {
  const cure = await getL2ContractAt(hre, "cure.cairo/cure_abi.json", address);
  return starknetPrank<typeof cureAbi>(wrapTyped(hre, cure));
}

export interface SnDssConfig {
  claimToken: string; // TODO: replace when claim token is available
  endWait: bigint;
}

export async function initSnDss(
  dss: SnDssInstance,
  cfg: SnDssConfig,
  l1GovRelayAddress: Address,
  l2GovRelayAddress: string
) {
  await dss.vat.rely(dss.jug.address);
  //dss.vat.rely(dss.dog));
  await dss.vat.rely(dss.pot.address);
  await dss.vat.rely(dss.jug.address);
  await dss.vat.rely(dss.spotter.address);
  await dss.vat.rely(dss.end.address);

  await breakIntoDai(
    currentSnAccount(),
    dss.dai,
    l1GovRelayAddress,
    l2GovRelayAddress
  );
  await dss.dai.rely(dss.daiJoin.address);

  //dss.dog.file("vow", (dss.vow));

  await dss.pot.rely(dss.end.address);

  await dss.spotter.rely(dss.end.address);

  await dss.end.file(l2String("pot"), dss.pot.address);
  await dss.end.file(l2String("spot"), dss.spotter.address);
  await dss.end.file(l2String("cure"), dss.cure.address);
  //dss.end.file("vow", (dss.vow));
  await dss.end.file(l2String("claim"), cfg.claimToken);

  await dss.end.file(l2String("wait"), cfg.endWait);

  await dss.cure.rely(dss.end.address);

  // TODO: uncomment when claim token is available
  // WardsAbstract(cfg.claimToken).rely(address(dss.end));

  // daiJoin needs a vat.dai balance to match the existing dai supply
  const totalSupply = await dss.dai.totalSupply();
  await dss.vat.swell(dss.daiJoin.address, totalSupply * 10n ** 27n);
}
