import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import teleportJoinAbi from "./abi/starknetTeleportJoinAbi";
import teleportOracleAuthAbi from "./abi/starknetTeleportOracleAuthAbi";
import teleportRouterAbi from "./abi/starknetTeleportRouterAbi";
import teleportConstantFeeAbi from "./abi/starknetTeleportConstantFeeAbi";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import hre from "hardhat";
import { Felt, Uint256 } from "../helpers/starknet/types";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import { SNDaiJoin } from "../starknet-dss/starknetDss";

type SNTeleportJoin = WrappedStarknetContract<typeof teleportJoinAbi>;
type SNTeleportOracleAuth = WrappedStarknetContract<
  typeof teleportOracleAuthAbi
>;
type SNTeleportRouter = WrappedStarknetContract<typeof teleportRouterAbi>;
type SNTeleportConstantFee = WrappedStarknetContract<
  typeof teleportConstantFeeAbi
>;

// TODO: there should be global "active account" ala prank somewhere
async function deploySNTeleportJoin(
  deployer: Account,
  vat: Felt,
  daiJoin: Felt,
  ilk: Felt,
  domain: Felt
): Promise<SNTeleportJoin> {
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

async function deploySNTeleportOracleAuth(
  deployer: Account,
  teleport_join: Felt
): Promise<SNTeleportOracleAuth> {
  const factory = await hre.starknet.getContractFactory("teleport_oracle_auth");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward: deployer.address,
    teleport_join,
  });
  return wrapTyped(hre, contract);
}

async function deploySNTeleportRouter(
  deployer: Account,
  dai: Felt,
  domain: Felt,
  parent_domain: Felt
): Promise<SNTeleportRouter> {
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

async function deploySNTeleportConstantFee(
  deployer: Account,
  fee: Uint256,
  ttl: Felt
): Promise<SNTeleportConstantFee> {
  const factory = await hre.starknet.getContractFactory(
    "teleport_constant_fee"
  );
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, { fee, ttl });
  return wrapTyped(hre, contract);
}

interface SNTeleportInstance {
  join: SNTeleportJoin;
  router: SNTeleportRouter;
  oracleAuth: SNTeleportOracleAuth;
}

export async function deploy(
  deployer: Account,
  owner: Address,
  ilk: string,
  domain: string,
  parentDomain: string,
  daiJoin: SNDaiJoin
): Promise<SNTeleportInstance> {
  const teleport: SNTeleportInstance = {
    join: await deploySNTeleportJoin(
      deployer,
      await daiJoin.vat(),
      daiJoin.address,
      ilk,
      domain
    ),
    router: await deploySNTeleportRouter(
      deployer,
      await daiJoin.dai(),
      domain,
      parentDomain
    ),
    oracleAuth: await deploySNTeleportOracleAuth(deployer, daiJoin.address),
  };
  expect(await teleport.join.wards(deployer.address)).toBeTruthy();
  await teleport.join.rely(owner);
  await teleport.join.deny(deployer.address);

  expect(await teleport.router.wards(deployer.address)).toBeTruthy();
  await teleport.router.rely(owner);
  await teleport.router.deny(deployer.address);

  expect(await teleport.oracleAuth.wards(deployer.address)).toBeTruthy();
  await teleport.oracleAuth.rely(owner);
  await teleport.oracleAuth.deny(deployer.address);

  return teleport;
}

// function deploy(
//   address deployer,
//   address owner,
//   bytes32 ilk,
//   bytes32 domain,
//   bytes32 parentDomain,
//   address daiJoin
// ) internal returns (TeleportInstance memory teleport) {
//   teleport.join = new TeleportJoin(
//     DaiJoinAbstract(daiJoin).vat(),
//     daiJoin,
//     ilk,
//     domain
//   );
//   teleport.router = new TeleportRouter(
//     DaiJoinAbstract(daiJoin).dai(),
//     domain,
//     parentDomain
//   );
//   teleport.oracleAuth = new TeleportOracleAuth(address(teleport.join));
//
//   switchOwner(address(teleport.join), deployer, owner);
//   switchOwner(address(teleport.router), deployer, owner);
//   switchOwner(address(teleport.oracleAuth), deployer, owner);
// }

//
// function deployLinearFee(
//   uint256 fee,
//   uint256 ttl
// ) internal returns (TeleportFees) {
//   return new TeleportLinearFee(fee, ttl);
// }
//
// function init(
//   DssInstance memory dss,
//   TeleportInstance memory teleport,
//   DssTeleportConfig memory cfg
// ) internal {
//   bytes32 ilk = teleport.join.ilk();
//   dss.vat.init(ilk);
//   dss.jug.init(ilk);
//   dss.vat.file(ilk, "line", cfg.debtCeiling);
//   //dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
//   dss.vat.file(ilk, "spot", 10 ** 27);
//   dss.cure.lift(address(teleport.join));
//   dss.vat.rely(address(teleport.join));
//   teleport.join.rely(address(teleport.oracleAuth));
//   teleport.join.rely(address(teleport.router));
//   //teleport.join.rely(esm);
//   teleport.join.file("vow", address(dss.vow));
//   //teleport.oracleAuth.rely(esm);
//   teleport.oracleAuth.file("threshold", cfg.oracleThreshold);
//   teleport.oracleAuth.addSigners(cfg.oracleSigners);
//   //teleport.router.rely(esm);
//   teleport.router.file("gateway", teleport.join.domain(), address(teleport.join));
// }
//
// function initDomain(
//   TeleportInstance memory teleport,
//   DssTeleportDomainConfig memory cfg
// ) internal {
//   teleport.join.file("fees", cfg.domain, cfg.fees);
//   teleport.join.file("line", cfg.domain, cfg.debtCeiling);
//   teleport.router.file("gateway", cfg.domain, cfg.gateway);
// }
