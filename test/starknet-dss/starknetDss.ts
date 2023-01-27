import {
	wrap,
	WrappedStarknetContract,
	wrapTyped,
} from "../helpers/starknet/wrap";
import hre from "hardhat";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { starknetPrank } from "../helpers/starknet/prank";
import { SplitUintType } from "../../lib/starknet-dss/test/utils";
import {
	vatAbi,
	daiAbi,
	daiJoinAbi,
	cureAbi,
	endAbi,
	jugAbi,
	spotterAbi,
} from "./abi";

import { getL2ContractAt } from "../helpers/starknet/utils";

export type SNVat = WrappedStarknetContract<typeof vatAbi>;
export type SNDai = WrappedStarknetContract<typeof daiAbi>;
export type SNCure = WrappedStarknetContract<typeof cureAbi>;
export type SNEnd = WrappedStarknetContract<typeof endAbi>;
export type SNDaiJoin = WrappedStarknetContract<typeof daiJoinAbi>;
export type SNJug = WrappedStarknetContract<typeof jugAbi>;
export type SNSpotter = WrappedStarknetContract<typeof spotterAbi>;

export type Felt = bigint | string; // TODO: what it should be exactly

export async function deploySNVat(
	deployer: Account,
	ward: Felt
): Promise<SNVat> {
	const factory = await hre.starknet.getContractFactory("vat");
	await deployer.declare(factory);
	const vat = await deployer.deploy(factory, { ward });
	return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

export async function deploySNDai(
	deployer: Account,
	ward: Felt
): Promise<SNDai> {
	const factory = await hre.starknet.getContractFactory("dai");
	await deployer.declare(factory);
	const dai = await deployer.deploy(factory, { ward });
	return starknetPrank<typeof daiAbi>(wrapTyped(hre, dai));
}

export async function deploySNDaiJoin(
	deployer: Account,
	vat: string,
	dai: string
): Promise<SNDaiJoin> {
	const factory = await hre.starknet.getContractFactory("daiJoin");
	await deployer.declare(factory);
	const daiJoin = await deployer.deploy(factory, { vat, dai });
	return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

export async function deploySNSpotter(
	deployer: Account,
	vat: string,
	ward: Felt
): Promise<SNSpotter> {
	const factory = await hre.starknet.getContractFactory("spotter");
	await deployer.declare(factory);
	const spotter = await deployer.deploy(factory, { vat, ward });
	return starknetPrank<typeof spotterAbi>(wrapTyped(hre, spotter));
}

// TODO: change jug constructor params' names
export async function deploySNJug(
	deployer: Account,
	vat: string,
	ward: Felt
): Promise<SNJug> {
	const factory = await hre.starknet.getContractFactory("jug");
	await deployer.declare(factory);
	const jug = await deployer.deploy(factory, { vat_: vat, ward_: ward });
	return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

export async function deploySNCure(
	deployer: Account,
	ward: Felt
): Promise<SNCure> {
	const factory = await hre.starknet.getContractFactory("cure");
	await deployer.declare(factory);
	const cure = await deployer.deploy(factory, { ward });
	return starknetPrank<typeof cureAbi>(wrapTyped(hre, cure));
}

export async function deploySNEnd(
	deployer: Account,
	ward: Felt
): Promise<SNEnd> {
	const factory = await hre.starknet.getContractFactory("end");
	await deployer.declare(factory);
	const end = await deployer.deploy(factory, { ward });
	return starknetPrank<typeof endAbi>(wrapTyped(hre, end));
}

// TODO: add init script
// Based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/deploy/XDomainDss.sol
export async function getSNDaiJoin(address: string): Promise<SNDaiJoin> {
	const daiJoin = await getL2ContractAt(hre, "./abi/daiJoinAbi.ts", address);
	return starknetPrank<typeof daiJoinAbi>(wrapTyped(hre, daiJoin));
}

export async function getSNDai(address: string): Promise<SNDai> {
	const dai = await getL2ContractAt(hre, "./abi/daiAbi.ts", address);
	return starknetPrank<typeof daiAbi>(wrapTyped(hre, dai));
}

export async function getSNVat(address: string): Promise<SNVat> {
	const vat = await getL2ContractAt(hre, "./abi/vatAbi.ts", address);
	return starknetPrank<typeof vatAbi>(wrapTyped(hre, vat));
}

export async function getSNJug(address: string): Promise<SNJug> {
	const jug = await getL2ContractAt(hre, "./abi/jugAbi.ts", address);
	return starknetPrank<typeof jugAbi>(wrapTyped(hre, jug));
}

export async function getSNCure(address: string): Promise<SNCure> {
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
