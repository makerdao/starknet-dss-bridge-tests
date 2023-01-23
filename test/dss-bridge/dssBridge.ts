import { Address, GetContractResult } from "@wagmi/core";
import hre from "hardhat";
import { prank } from "../helpers/prank";
import starknetDomainHostAbi from "./starknetDomainHostAbi";
import { A } from "@wagmi/core/dist/contracts-9eb7706c";

export type StarknetDomainHost = GetContractResult<
  typeof starknetDomainHostAbi
>;

async function deployStarknetDomainHost(
  ilk: Address,
  daiJoin: Address,
  escrow: Address,
  router: Address,
  starknet: Address,
  guest: bigint,
  l2dai: bigint
): Promise<StarknetDomainHost> {
  const contractFactory = await hre.ethers.getContractFactory(
    "StarknetDomainHost"
  );
  const contract = (await contractFactory.deploy(
    ilk,
    daiJoin,
    escrow,
    router,
    starknet,
    guest,
    l2dai
  )) as StarknetDomainHost;
  await contract.deployed();
  return prank(contract);
}
