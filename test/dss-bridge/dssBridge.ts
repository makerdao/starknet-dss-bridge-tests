import { Address, GetContractResult } from "@wagmi/core";
import { expect } from "earljs";
import { ethers, Signer } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import hre from "hardhat";

import { DaiJoin, DssInstance } from "../dss/dss";
import { TeleportRouter } from "../dss-teleport/dssTeleport";
import { prank } from "../helpers/prank";
import { l1String } from "../helpers/utils";
import { SnDai } from "../starknet-dss/starknetDss";
import {
  DssBridgeHostConfig,
  SnDomainGuest,
} from "../starknet-dss-bridge/starknetDssBridge";
import dsValueAbi from "./abi/dsValueAbi";
import escrowLikeAbi from "./abi/escrowLikeAbi";
import starknetDomainHostAbi from "./abi/starknetDomainHostAbi";

export type DomainHost = GetContractResult<typeof starknetDomainHostAbi>;
export type DSValue = GetContractResult<typeof dsValueAbi>;
export type Escrow = GetContractResult<typeof escrowLikeAbi>;

export async function getDomainHost(address: Address): Promise<DomainHost> {
  return prank(
    (await hre.ethers.getContractAt(
      starknetDomainHostAbi as any,
      address
    )) as DomainHost
  );
}

export async function deployDomainHost(
  deployerSigner: Signer,
  ownerSigner: Signer,
  ilk: string,
  daiJoin: DaiJoin,
  escrow: Address,
  router: TeleportRouter,
  starknet: Address,
  guest: SnDomainGuest,
  l2dai: SnDai
): Promise<DomainHost> {
  const contractFactory = await hre.ethers.getContractFactory(
    "StarknetDomainHost"
  );
  const contract = (await contractFactory.deploy(
    l1String(ilk),
    daiJoin.address,
    escrow,
    router.address,
    starknet,
    guest.address,
    l2dai.address
  )) as DomainHost;
  await contract.deployed();
  const bridge = prank(contract);

  const deployer = (await deployerSigner.getAddress()) as Address;
  const owner = (await ownerSigner.getAddress()) as Address;

  expect(await bridge.wards(deployer)).toBeTruthy();
  await bridge.rely(owner);
  await bridge.deny(deployer);

  return bridge;
}

export async function getBridgeOracle(address: Address): Promise<DSValue> {
  return prank(
    (await hre.ethers.getContractAt(dsValueAbi as any, address)) as DSValue
  );
}

export async function deployConstantDSValue(): Promise<DSValue> {
  const contractFactory = await hre.ethers.getContractFactory("DSValue");
  const contract = (await contractFactory.deploy()) as DSValue;
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

const VOW = formatBytes32String("vow") as Address;
const PIP = formatBytes32String("pip") as Address;
const MAT = formatBytes32String("mat") as Address;
const LINE = formatBytes32String("line") as Address;
export async function initHost(
  { cure, dai, jug, spotter, vat, vow }: DssInstance,
  host: DomainHost,
  oracle: DSValue,
  { escrow: escrowAddress, debtCeiling }: DssBridgeHostConfig
) {
  const ilk = await host.ilk();
  await host.file(VOW, vow.address);
  await vat.rely(host.address);
  const escrow = await getEscrow(escrowAddress);
  await escrow.approve(
    dai.address,
    host.address,
    ethers.constants.MaxUint256.toBigInt()
  );
  await vat.init(ilk);
  await jug.init(ilk);
  await vat.rely(host.address);

  await spotter["file(bytes32,bytes32,address)"](ilk, PIP, oracle.address);
  await spotter["file(bytes32,bytes32,uint256)"](ilk, MAT, 10n ** 27n);
  console.log("poking", spotter.address, ilk);
  await spotter.poke(ilk);

  await vat["file(bytes32,bytes32,uint256)"](ilk, LINE, debtCeiling);
  // //dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
  await cure.lift(host.address);

  return escrow;
}
