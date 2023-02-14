import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre from "hardhat";

import { currentSnAcc, starknetPrankTyped } from "../helpers/starknet/prank";
import { Felt, Uint256 } from "../helpers/starknet/types";
import {
  toUint256,
  WrappedStarknetContract,
  wrapTyped,
} from "../helpers/starknet/wrap";
import { l2String, l2StringAsUint256 } from "../helpers/utils";
import { SnDaiJoin, SnDssInstance } from "../starknet-dss/starknetDss";
import teleportConstantFeeAbi from "./abi/starknetTeleportConstantFeeAbi";
import teleportJoinAbi from "./abi/starknetTeleportJoinAbi";
import teleportOracleAuthAbi from "./abi/starknetTeleportOracleAuthAbi";
import teleportRouterAbi from "./abi/starknetTeleportRouterAbi";

export type SnTeleportJoin = WrappedStarknetContract<typeof teleportJoinAbi>;
export type SnTeleportOracleAuth = WrappedStarknetContract<
  typeof teleportOracleAuthAbi
>;
export type SnTeleportRouter = WrappedStarknetContract<
  typeof teleportRouterAbi
>;
export type SnTeleportConstantFee = WrappedStarknetContract<
  typeof teleportConstantFeeAbi
>;

async function deploySnTeleportJoin(
  deployer: Account,
  vat: Felt,
  daiJoin: Felt,
  ilk: string,
  domain: string
): Promise<SnTeleportJoin> {
  const factory = await hre.starknet.getContractFactory("teleport_join");
  await deployer.declare(factory);
  // TODO: camelCase in teleport_join constructor args
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    vat_: vat,
    daiJoin_: daiJoin,
    ilk_: l2String(ilk),
    domain_: toUint256(l2StringAsUint256(domain)),
  });
  return starknetPrankTyped(wrapTyped(hre, contract));
}

async function deploySnTeleportOracleAuth(
  deployer: Account,
  teleport_join: Felt
): Promise<SnTeleportOracleAuth> {
  const factory = await hre.starknet.getContractFactory("teleport_oracle_auth");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    teleport_join_: teleport_join,
  });
  return starknetPrankTyped(wrapTyped(hre, contract));
}

async function deploySnTeleportRouter(
  deployer: Account,
  dai: Felt,
  domain: string,
  parent_domain: string
): Promise<SnTeleportRouter> {
  const factory = await hre.starknet.getContractFactory("teleport_router");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    dai,
    domain: toUint256(l2StringAsUint256(domain)),
    parent_domain: toUint256(l2StringAsUint256(parent_domain)),
  });
  return starknetPrankTyped(wrapTyped(hre, contract));
}

export async function deploySnTeleportConstantFee(
  fee: Uint256,
  ttl: Felt
): Promise<SnTeleportConstantFee> {
  const factory = await hre.starknet.getContractFactory(
    "teleport_constant_fee"
  );
  const deployer = currentSnAcc();
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, { fee, ttl });
  return starknetPrankTyped(wrapTyped(hre, contract));
}

interface SnTeleportInstance {
  join: SnTeleportJoin;
  router: SnTeleportRouter;
  oracleAuth: SnTeleportOracleAuth;
}

export async function deploySnTeleport(
  owner: Account,
  ilk: string,
  domain: string,
  parentDomain: string,
  daiJoin: SnDaiJoin
): Promise<SnTeleportInstance> {
  const teleport: SnTeleportInstance = {
    join: await deploySnTeleportJoin(
      currentSnAcc(),
      await daiJoin.vat(),
      daiJoin.address,
      ilk,
      domain
    ),
    router: await deploySnTeleportRouter(
      currentSnAcc(),
      await daiJoin.dai(),
      domain,
      parentDomain
    ),
    oracleAuth: await deploySnTeleportOracleAuth(
      currentSnAcc(),
      daiJoin.address
    ),
  };
  expect(await teleport.join.wards(currentSnAcc().address)).toBeTruthy();
  await teleport.join.rely(owner.address);
  await teleport.join.deny(currentSnAcc().address);

  expect(await teleport.router.wards(currentSnAcc().address)).toBeTruthy();
  await teleport.router.rely(owner.address);
  await teleport.router.deny(currentSnAcc().address);

  expect(await teleport.oracleAuth.wards(currentSnAcc().address)).toBeTruthy();
  await teleport.oracleAuth.rely(owner.address);
  await teleport.oracleAuth.deny(currentSnAcc().address);

  return teleport;
}

export interface SnTeleportConfig {
  debtCeiling: bigint;
  oracleThreshold: bigint;
  oracleSigners: Address[]; //TODO: different configuration...
}

export async function initSnTeleport(
  dss: SnDssInstance,
  teleport: SnTeleportInstance,
  cfg: SnTeleportConfig
) {
  const ilk = await teleport.join.ilk();
  await dss.vat.init(ilk);
  await dss.jug.init(ilk);
  await dss.vat.file_ilk(ilk, l2String("line"), cfg.debtCeiling);

  // dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
  await dss.vat.file_ilk(ilk, l2String("spot"), 10n ** 27n);
  await dss.cure.lift(teleport.join.address);
  await dss.vat.rely(teleport.join.address);
  await teleport.join.rely(teleport.oracleAuth.address);
  await teleport.join.rely(teleport.router.address);
  // teleport.join.rely(esm);

  // TODO: no vow yet on l2
  //await teleport.join.file_vow(l2String('vow'), dss.vow.address);

  // teleport.oracleAuth.rely(esm);

  await teleport.oracleAuth.file(l2String("threshold"), cfg.oracleThreshold);

  // TODO: signers configuration
  // await teleport.oracleAuth.add_signers(cfg.oracleSigners);

  // teleport.router.rely(esm);
  await teleport.router.file(
    l2String("gateway"),
    await teleport.join.domain(),
    teleport.join.address
  );
}

export interface SnTeleportDomainConfig {
  domain: string;
  fees: Address;
  gateway: Address;
  debtCeiling: bigint;
}

export async function initSnTeleportDomain(
  teleport: SnTeleportInstance,
  cfg: SnTeleportDomainConfig
) {
  await teleport.join.file_fees(
    l2String("fees"),
    l2StringAsUint256(cfg.domain),
    cfg.fees
  );
  await teleport.join.file_line(
    l2String("line"),
    l2StringAsUint256(cfg.domain),
    cfg.debtCeiling
  );

  await teleport.router.file(
    l2String("gateway"),
    l2StringAsUint256(cfg.domain),
    cfg.gateway
  );
}
