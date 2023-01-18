import daiJoinAbi from "./abi/daiJoinAbi";
import daiAbi from "./abi/daiAbi";
import vatAbi from "./abi/vatAbi";
import { Address, GetContractResult } from "@wagmi/core";
import hre from "hardhat";

export type Dai = GetContractResult<typeof daiAbi>;
export type Vat = GetContractResult<typeof vatAbi>;
export type DaiJoin = GetContractResult<typeof daiJoinAbi>;

export async function getDaiJoin(address: Address): Promise<DaiJoin> {
  return (await hre.ethers.getContractAt(
    daiJoinAbi as any,
    address
  )) as DaiJoin;
}

export async function getDai(address: Address): Promise<Dai> {
  return (await hre.ethers.getContractAt(daiJoinAbi as any, address)) as Dai;
}

export async function getVat(address: Address): Promise<Vat> {
  return (await hre.ethers.getContractAt(vatAbi as any, address)) as Vat;
}
