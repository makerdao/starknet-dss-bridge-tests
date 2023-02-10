import { Address, GetContractResult } from "@wagmi/core";
import hre from "hardhat";

import { prank } from "../helpers/prank";
import escrowLikeAbi from "./escrowLikeAbi";
import starknetDomainHostAbi from "./starknetDomainHostAbi";

export type StarknetDomainHost = GetContractResult<
	typeof starknetDomainHostAbi
>;
export type Escrow = GetContractResult<typeof escrowLikeAbi>;

export async function deployStarknetDomainHost(
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

export async function getEscrow(address: Address): Promise<Escrow> {
	const escrow = (await hre.ethers.getContractAt(
		escrowLikeAbi as any,
		address
	)) as Escrow;
	return prank(escrow);
}
