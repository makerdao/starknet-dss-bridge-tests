import { Address, GetContractResult } from "@wagmi/core";
import {ethers, Signer} from "ethers";
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
import escrowLikeAbi from "./abi/escrowLikeAbi";
import starknetDomainHostAbi from "./abi/starknetDomainHostAbi";
import {expect} from "earljs";

export type SnDomainHost = GetContractResult<typeof starknetDomainHostAbi>;
export type Escrow = GetContractResult<typeof escrowLikeAbi>;

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
): Promise<SnDomainHost> {
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
  )) as SnDomainHost;
  await contract.deployed();
  const bridge = prank(contract);

  const deployer = (await deployerSigner.getAddress()) as Address;
  const owner = (await ownerSigner.getAddress()) as Address;

  expect(await bridge.wards(deployer)).toBeTruthy();
  await bridge.rely(owner);
  await bridge.deny(deployer);

  return bridge;
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
const SPOT = formatBytes32String("spot") as Address;
export async function initHost(
  { cure, dai, jug, spotter, vat, vow }: DssInstance,
  host: SnDomainHost,
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

  // TODO: commenting spotter out, filing SPOT on vat should be equivalent
  // await spotter['file(bytes32,bytes32,address)'](ilk, PIP, host.address);
  // await spotter['file(bytes32,bytes32,uint256)'](ilk, MAT, 10n ** 27n);
  // console.log('poking', spotter.address, ilk)
  // await spotter.poke(ilk);

  await vat["file(bytes32,bytes32,uint256)"](ilk, SPOT, 10n ** 27n);
  await vat["file(bytes32,bytes32,uint256)"](ilk, LINE, debtCeiling);
  // //dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
  await cure.lift(host.address);
}
