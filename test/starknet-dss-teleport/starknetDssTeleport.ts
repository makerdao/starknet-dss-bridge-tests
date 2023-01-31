import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import teleportJoinAbi from "./abi/starknetTeleportJoinAbi";
import teleportOracleAuthAbi from "./abi/starknetTeleportOracleAuthAbi";
import teleportRouterAbi from "./abi/starknetTeleportRouterAbi";
import teleportConstantFeeAbi from "./abi/starknetTeleportConstantFeeAbi";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import hre from "hardhat";
import { Felt, Uint256 } from "../helpers/starknet/types";

type SNTeleportJoin = WrappedStarknetContract<typeof teleportJoinAbi>;
type SNTeleportOracleAuth = WrappedStarknetContract<
  typeof teleportOracleAuthAbi
>;
type SNTeleportRouter = WrappedStarknetContract<typeof teleportRouterAbi>;
type SNTeleportConstantFee = WrappedStarknetContract<
  typeof teleportConstantFeeAbi
>;

// TODO: there should be global "active account" ala prank somewhere
export async function deploySNTeleportJoin(
  deployer: Account,
  ward: Felt,
  vat: Felt,
  daiJoin: Felt,
  ilk: Felt,
  domain: Felt
): Promise<SNTeleportJoin> {
  const factory = await hre.starknet.getContractFactory("teleport_join");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward,
    vat,
    daiJoin,
    ilk,
    domain,
  });
  return wrapTyped(hre, contract);
}

export async function deploySNTeleportOracleAuth(
  deployer: Account,
  ward: Felt,
  teleport_join: Felt
): Promise<SNTeleportOracleAuth> {
  const factory = await hre.starknet.getContractFactory("teleport_oracle_auth");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, { ward, teleport_join });
  return wrapTyped(hre, contract);
}

export async function deploySNTeleportRouter(
  deployer: Account,
  ward: Felt,
  dai: Felt,
  domain: Felt,
  parent_domain: Felt
): Promise<SNTeleportRouter> {
  const factory = await hre.starknet.getContractFactory("teleport_router");
  await deployer.declare(factory);
  const contract = await deployer.deploy(factory, {
    ward,
    dai,
    domain,
    parent_domain,
  });
  return wrapTyped(hre, contract);
}

export async function deploySNTeleportConstantFee(
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
