import daiJoinAbi from "./abi/daiJoinAbi";
import daiAbi from "./abi/daiAbi";
import vatAbi from "./abi/vatAbi";
import jugAbi from "./abi/jugAbi";
import cureAbi from "./abi/cureAbi";
import vowAbi from "./abi/vowAbi";
import { Address, GetContractResult } from "@wagmi/core";
import hre from "hardhat";
import { prank } from "../helpers/prank";

export type Dai = GetContractResult<typeof daiAbi>;
export type Vat = GetContractResult<typeof vatAbi>;
export type DaiJoin = GetContractResult<typeof daiJoinAbi>;
export type Jug = GetContractResult<typeof jugAbi>;
export type Cure = GetContractResult<typeof cureAbi>;
export type Vow = GetContractResult<typeof vowAbi>;

export async function getDaiJoin(address: Address): Promise<DaiJoin> {
  const daiJoin = (await hre.ethers.getContractAt(
    daiJoinAbi as any,
    address
  )) as DaiJoin;
  return prank(daiJoin);
}

export async function getDai(address: Address): Promise<Dai> {
  const dai = (await hre.ethers.getContractAt(
    daiJoinAbi as any,
    address
  )) as Dai;
  return prank(dai);
}

export async function getVat(address: Address): Promise<Vat> {
  const vat = (await hre.ethers.getContractAt(vatAbi as any, address)) as Vat;
  return prank(vat);
}

export async function getJug(address: Address): Promise<Jug> {
  const jug = (await hre.ethers.getContractAt(jugAbi as any, address)) as Jug;
  return prank(jug);
}

export async function getCure(address: Address): Promise<Cure> {
  const cure = (await hre.ethers.getContractAt(
    cureAbi as any,
    address
  )) as Cure;
  return prank(cure);
}

export async function getVow(address: Address): Promise<Vow> {
  const vow = (await hre.ethers.getContractAt(vowAbi as any, address)) as Vow;
  return prank(vow);
}
