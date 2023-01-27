import {
	wrap,
	WrappedStarknetContract,
	wrapTyped,
} from "../helpers/starknet/wrap";
import hre from "hardhat";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { starknetPrank } from "../helpers/starknet/prank";
import { SplitUintType } from "../../lib/starknet-dss/test/utils";

import vatAbi from "./abi/vatAbi";
import daiAbi from "./abi/daiAbi";
import cureAbi from "./abi/cureAbi";
import daiJoinAbi from "./abi/daiJoinAbi";
import jugAbi from "./abi/jugAbi";
import { getL2ContractAt } from "../helpers/starknet/utils";

export type SNVat = WrappedStarknetContract<typeof vatAbi>;
export type SNDai = WrappedStarknetContract<typeof daiAbi>;
export type SNCure = WrappedStarknetContract<typeof cureAbi>;
export type SNDaiJoin = WrappedStarknetContract<typeof daiJoinAbi>;
export type SNJug = WrappedStarknetContract<typeof jugAbi>;

export type Felt = bigint | string; // TODO: what it should be exactly

// TODO: there should be global "active account" ala prank somewhere
export async function deploySNVat(
	deployer: Account,
	ward: Felt
): Promise<SNVat> {
	const factory = await hre.starknet.getContractFactory("vat");
	await deployer.declare(factory);
	const vat = await deployer.deploy(factory, { ward });
	return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

// TODO: add more contracts
// TODO: add init script
// Based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/deploy/XDomainDss.sol
export async function getDaiJoin(address: string): Promise<SNDaiJoin> {
	const daiJoin = await getL2ContractAt(hre, "./abi/daiJoinAbi.ts", address);
	return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

export async function getDai(address: string): Promise<SNDai> {
	const dai = await getL2ContractAt(hre, "./abi/daiAbi.ts", address);
	return starknetPrank<typeof daiAbi>(wrapTyped(hre, dai));
}

export async function getVat(address: string): Promise<SNVat> {
	const vat = await getL2ContractAt(hre, "./abi/vatAbi.ts", address);
	return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

export async function getJug(address: string): Promise<SNJug> {
	const jug = await getL2ContractAt(hre, "./abi/jugAbi.ts", address);
	return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

export async function getCure(address: string): Promise<SNCure> {
	const cure = await getL2ContractAt(hre, "./abi/cureAbi.ts", address);
	return starknetPrank<typeof cureAbi>(wrapTyped(hre, cure));
}

export interface XDomainDssConfig {
	claimToken: string;
	endWait: SplitUintType<bigint>;
}

export interface SNDssInstance {
	vat: SNVat;
	jug: SNJug;
	cure: SNCure;
}

export async function init(dss: SNDssInstance, cfg: XDomainDssConfig) {}
