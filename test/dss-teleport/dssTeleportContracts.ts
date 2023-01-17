import { Address, getContract, GetContractResult } from "@wagmi/core";
import { providers, Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import dssTeleportJoinAbi from "./abi/dssTeleportJoinAbi";

export type TeleportJoin = GetContractResult<typeof dssTeleportJoinAbi>;

export async function deployTeleportJoin(
  hre: HardhatRuntimeEnvironment,
  signerOrProvider: Signer | providers.Provider,
  vat: Address,
  daiJoin: Address,
  ilk: string,
  domain: string
): Promise<TeleportJoin> {

  const contractFactory = await hre.ethers.getContractFactory("TeleportJoin");
  const contract = await contractFactory.deploy(vat, daiJoin, ilk, domain);
  await contract.deployed();

  // return getContract({
  //   address: await contract.address,
  //   abi: dssTeleportJoinAbi,
  //   signerOrProvider: signerOrProvider,
  // });
  return contract as TeleportJoin
}
