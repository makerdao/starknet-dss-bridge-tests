import {
  wrap,
  WrappedStarknetContract,
  wrapTyped,
} from "../helpers/starknet/wrap";
import vatAbi from "./abi/vatAbi";
import hre from "hardhat";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { Felt } from "../helpers/starknet/types";

type SNVat = WrappedStarknetContract<typeof vatAbi>;

// TODO: there should be global "active account" ala prank somewhere
export async function deploySNVat(
  deployer: Account,
  ward: Felt
): Promise<SNVat> {
  const factory = await hre.starknet.getContractFactory("vat");
  await deployer.declare(factory);
  const vat = await deployer.deploy(factory, { ward });
  return wrapTyped(hre, vat);
}

// TODO: add more contracts
// TODO: add init script
// Based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/deploy/XDomainDss.sol
