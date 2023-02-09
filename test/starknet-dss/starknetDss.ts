import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import hre from "hardhat";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import {
  currentSnAccount,
  starknetPrank,
  startSnPrank,
} from "../helpers/starknet/prank";
import {
  vatAbi,
  daiAbi,
  daiJoinAbi,
  cureAbi,
  endAbi,
  jugAbi,
  spotterAbi,
  potAbi,
  tokenAbi,
} from "./abi";

import { getL2ContractAt, l2String } from "../helpers/utils";
import { Felt } from "../helpers/starknet/types";
import { breakIntoDai } from "./breakIntoDai";
import { Address } from "@wagmi/core";

export type SNVat = WrappedStarknetContract<typeof vatAbi>;
export type SNDai = WrappedStarknetContract<typeof daiAbi>;
export type SNCure = WrappedStarknetContract<typeof cureAbi>;
export type SNEnd = WrappedStarknetContract<typeof endAbi>;
export type SNDaiJoin = WrappedStarknetContract<typeof daiJoinAbi>;
export type SNJug = WrappedStarknetContract<typeof jugAbi>;
export type SNSpotter = WrappedStarknetContract<typeof spotterAbi>;
export type SNPot = WrappedStarknetContract<typeof potAbi>;
export type SNToken = WrappedStarknetContract<typeof tokenAbi>;

async function deploySNVat(ward: Felt): Promise<SNVat> {
  const factory = await hre.starknet.getContractFactory("vat");
  await currentSnAccount().declare(factory);
  const vat = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

async function deploySNDai(ward: Felt): Promise<SNDai> {
  const factory = await hre.starknet.getContractFactory("dai");
  await currentSnAccount().declare(factory);
  const dai = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof daiAbi>(wrapTyped(hre, dai));
}

export async function deploySNToken(ward: Felt): Promise<SNToken> {
  const factory = await hre.starknet.getContractFactory("tests/mock_token");
  await currentSnAccount().declare(factory);
  const token = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof tokenAbi>(wrapTyped(hre, token));
}

async function deploySNDaiJoin(vat: Felt, dai: Felt): Promise<SNDaiJoin> {
  const factory = await hre.starknet.getContractFactory("dai_join");
  await currentSnAccount().declare(factory);
  const daiJoin = await currentSnAccount().deploy(factory, { vat, dai });
  return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

async function deploySNSpotter(vat: Felt, ward: Felt): Promise<SNSpotter> {
  const factory = await hre.starknet.getContractFactory("spotter");
  await currentSnAccount().declare(factory);
  const spotter = await currentSnAccount().deploy(factory, { vat, ward });
  return starknetPrank<typeof spotterAbi>(wrapTyped(hre, spotter));
}

// TODO: change jug constructor params' names
async function deploySNJug(vat: Felt, ward: Felt): Promise<SNJug> {
  const factory = await hre.starknet.getContractFactory("jug");
  await currentSnAccount().declare(factory);
  const jug = await currentSnAccount().deploy(factory, {
    vat_: vat,
    ward_: ward,
  });
  return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

async function deploySNPot(vat: Felt, ward: Felt): Promise<SNPot> {
  const factory = await hre.starknet.getContractFactory("pot");
  await currentSnAccount().declare(factory);
  const pot = await currentSnAccount().deploy(factory, { vat, ward });
  return starknetPrank<typeof potAbi>(wrapTyped(hre, pot));
}

async function deploySNCure(ward: Felt): Promise<SNCure> {
  const factory = await hre.starknet.getContractFactory("cure");
  await currentSnAccount().declare(factory);
  const cure = await currentSnAccount().deploy(factory, { ward });
  return starknetPrank<typeof cureAbi>(wrapTyped(hre, cure));
}

async function deploySNEnd(vat: string, ward: Felt): Promise<SNEnd> {
  const factory = await hre.starknet.getContractFactory("end");
  await currentSnAccount().declare(factory);
  const end = await currentSnAccount().deploy(factory, { ward, vat });
  return starknetPrank<typeof endAbi>(wrapTyped(hre, end));
}

export interface SNDssInstance {
  vat: SNVat;
  jug: SNJug;
  cure: SNCure;
  dai: SNDai;
  daiJoin: SNDaiJoin;
  end: SNEnd;
  spotter: SNSpotter;
  pot: SNPot;
}

export async function deploy(
  owner: Account,
  dai: string
): Promise<SNDssInstance> {
  let vat = await deploySNVat(owner.address);
  let dai_ = await getSNDai(dai);
  let daiJoin = await deploySNDaiJoin(vat.address, dai_.address);
  // //dss.dog = DaiAbstract(address(new Dog()));  // Needs merge in xdomain-dss
  let spotter = await deploySNSpotter(vat.address, owner.address);
  let pot = await deploySNPot(vat.address, owner.address);
  let jug = await deploySNJug(vat.address, owner.address);
  let cure = await deploySNCure(owner.address);
  let end = await deploySNEnd(vat.address, owner.address);

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

// TODO: add init script
// Based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/deploy/XDomainDss.sol
export async function getSNDaiJoin(address: string): Promise<SNDaiJoin> {
  const daiJoin = await getL2ContractAt(
    hre,
    "dai_join.cairo/dai_join_abi.json",
    address
  );
  return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

export async function getSNDai(address: string): Promise<SNDai> {
  const dai = await getL2ContractAt(hre, "dai.cairo/dai_abi.json", address);
  return starknetPrank<typeof daiAbi>(wrapTyped(hre, dai));
}

export async function getSNVat(address: string): Promise<SNVat> {
  const vat = await getL2ContractAt(hre, "vat.cairo/vat_abi.json", address);
  return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

export async function getSNJug(address: string): Promise<SNJug> {
  const jug = await getL2ContractAt(hre, "jug.cairo/jug_abi.json", address);
  return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

export async function getSNCure(address: string): Promise<SNCure> {
  const cure = await getL2ContractAt(hre, "cure.cairo/cure_abi.json", address);
  return starknetPrank<typeof cureAbi>(wrapTyped(hre, cure));
}

export interface SNDssConfig {
  claimToken: string;
  endWait: bigint;
}

export async function init(
  dss: SNDssInstance,
  cfg: SNDssConfig,
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

  // WardsAbstract(cfg.claimToken).rely(address(dss.end));

  // daiJoin needs a vat.dai balance to match the existing dai supply
  let totalSupply = await dss.dai.totalSupply();
  // Vat(address(dss.vat)).swell(address(dss.daiJoin), int256(totalSupply) * 10 ** 27);
  await dss.vat.swell(dss.daiJoin.address, totalSupply * 10n ** 27n);
}
