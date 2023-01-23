import {wrap, WrappedStarknetContract, wrapTyped} from "../helpers/starknet/wrap";
import vatAbi from "./abi/vatAbi";
import hre from "hardhat";
import {Account} from "@shardlabs/starknet-hardhat-plugin/dist/src/account";

type SNVat = WrappedStarknetContract<typeof vatAbi>;
type Felt = bigint | string; // TODO: what it should be exactly

// TODO: there should be global "active account" ala prank somewhere
export async function deploySNVat(deployer: Account, ward: Felt): Promise<SNVat> {
  const factory = await hre.starknet.getContractFactory("vat");
  await deployer.declare(factory);
  const vat = await deployer.deploy(factory, { ward })
  return wrapTyped(hre, vat);
}
