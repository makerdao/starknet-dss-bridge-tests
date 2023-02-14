import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre from "hardhat";

import { currentSnAccount } from "../helpers/starknet/prank";
import { Felt, Uint256 } from "../helpers/starknet/types";
import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { l2String } from "../helpers/utils";
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

// TODO: there should be global "active account" ala prank somewhere
async function deploySnTeleportJoin(
  deployer: Account,
  vat: Felt,
  daiJoin: Felt,
  ilk: Felt,
  domain: Felt
): Promise<SnTeleportJoin> {
  const factory = await hre.starknet.getContractFactory("teleport_join");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    vat,
    daiJoin,
    ilk,
    domain,
  });
  return wrapTyped(hre, contract);
}

async function deploySnTeleportOracleAuth(
  deployer: Account,
  teleport_join: Felt
): Promise<SnTeleportOracleAuth> {
  const factory = await hre.starknet.getContractFactory("teleport_oracle_auth");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    teleport_join,
  });
  return wrapTyped(hre, contract);
}

async function deploySnTeleportRouter(
  deployer: Account,
  dai: Felt,
  domain: Felt,
  parent_domain: Felt
): Promise<SnTeleportRouter> {
  const factory = await hre.starknet.getContractFactory("teleport_router");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    dai,
    domain,
    parent_domain,
  });
  return wrapTyped(hre, contract);
}

export async function deploySnTeleportConstantFee(
  fee: Uint256,
  ttl: Felt
): Promise<SnTeleportConstantFee> {
  const factory = await hre.starknet.getContractFactory(
    "teleport_constant_fee"
  );
  const deployer = currentSnAccount();
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, { fee, ttl });
  return wrapTyped(hre, contract);
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
      currentSnAccount(),
      await daiJoin.vat(),
      daiJoin.address,
      ilk,
      domain
    ),
    router: await deploySnTeleportRouter(
      currentSnAccount(),
      await daiJoin.dai(),
      domain,
      parentDomain
    ),
    oracleAuth: await deploySnTeleportOracleAuth(
      currentSnAccount(),
      daiJoin.address
    ),
  };
  expect(await teleport.join.wards(currentSnAccount().address)).toBeTruthy();
  await teleport.join.rely(owner.address);
  await teleport.join.deny(currentSnAccount().address);

  expect(await teleport.router.wards(currentSnAccount().address)).toBeTruthy();
  await teleport.router.rely(owner.address);
  await teleport.router.deny(currentSnAccount().address);

  expect(
    await teleport.oracleAuth.wards(currentSnAccount().address)
  ).toBeTruthy();
  await teleport.oracleAuth.rely(owner.address);
  await teleport.oracleAuth.deny(currentSnAccount().address);

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
    l2String(cfg.domain),
    cfg.fees
  );
  await teleport.join.file_line(
    l2String("line"),
    l2String(cfg.domain),
    cfg.debtCeiling
  );

  await teleport.router.file(
    l2String("gateway"),
    l2String(cfg.domain),
    cfg.gateway
  );
}
