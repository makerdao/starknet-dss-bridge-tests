import {
	wrap,
	WrappedStarknetContract,
	wrapTyped,
} from "../helpers/starknet/wrap";
import hre from "hardhat";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { starknetPrank, startStarknetPrank } from "../helpers/starknet/prank";
import { l2String, SplitUintType } from "../../lib/starknet-dss/test/utils";
import {
	vatAbi,
	daiAbi,
	daiJoinAbi,
	cureAbi,
	endAbi,
	jugAbi,
	spotterAbi,
	potAbi,
} from "./abi";

import { getL2ContractAt } from "../helpers/starknet/utils";

export type SNVat = WrappedStarknetContract<typeof vatAbi>;
export type SNDai = WrappedStarknetContract<typeof daiAbi>;
export type SNCure = WrappedStarknetContract<typeof cureAbi>;
export type SNEnd = WrappedStarknetContract<typeof endAbi>;
export type SNDaiJoin = WrappedStarknetContract<typeof daiJoinAbi>;
export type SNJug = WrappedStarknetContract<typeof jugAbi>;
export type SNSpotter = WrappedStarknetContract<typeof spotterAbi>;
export type SNPot = WrappedStarknetContract<typeof potAbi>;

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

export async function deploySNPot(
	deployer: Account,
	vat: string,
	ward: Felt
): Promise<SNPot> {
	const factory = await hre.starknet.getContractFactory("pot");
	await deployer.declare(factory);
	const pot = await deployer.deploy(factory, { vat, ward });
	return starknetPrank<typeof potAbi>(wrapTyped(hre, pot));
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

export interface SNDssInstance {
	vat: SNVat;
	jug: SNJug;
	cure: SNCure;
	dai: SNDai;
	daiJoin: SNDaiJoin;
	end: SNEnd;
	spotter: SNSpotter;
	pot: SNPot;
}

export async function deployAll(
	deployer: Account,
	owner: Account,
	dai: string
): Promise<SNDssInstance> {
	// dss.vat = VatAbstract(address(new Vat()));
	let vat = await deploySNVat(deployer, owner.address);
	// dss.dai = DaiAbstract(address(Dai(dai)));
	let dai_ = await getSNDai(dai);
	// dss.daiJoin = DaiJoinAbstract(
	// 	address(new DaiJoin(address(dss.vat), address(dss.dai)))
	// );
	let daiJoin = await deploySNDaiJoin(deployer, vat.address, dai_.address);
	// //dss.dog = DaiAbstract(address(new Dog()));  // Needs merge in xdomain-dss
	// dss.spotter = SpotAbstract(address(new Spotter(address(dss.vat))));
	let spotter = await deploySNSpotter(deployer, vat.address, owner.address);
	// dss.pot = PotAbstract(address(new Pot(address(dss.vat))));
	let pot = await deploySNPot(deployer, vat.address, owner.address);
	// dss.jug = JugAbstract(address(new Jug(address(dss.vat))));
	let jug = await deploySNJug(deployer, vat.address, owner.address);
	// dss.cure = CureAbstract(address(new Cure()));
	let cure = await deploySNCure(deployer, owner.address);
	// dss.end = EndAbstract(address(new End(address(dss.vat))));
	let end = await deploySNEnd(deployer, owner.address);

	// switchOwner(address(dss.vat), deployer, owner);
	// switchOwner(address(dss.spotter), deployer, owner);
	// switchOwner(address(dss.pot), deployer, owner);
	// switchOwner(address(dss.jug), deployer, owner);
	// switchOwner(address(dss.cure), deployer, owner);
	// switchOwner(address(dss.end), deployer, owner);
	startStarknetPrank(owner);
	return {
		vat,
		jug,
		dai: dai_,
		cure,
		daiJoin,
		end,
		spotter,
		pot,
	};
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
	endWait: bigint;
}

export async function init(dss: SNDssInstance, cfg: XDomainDssConfig) {
	await dss.vat.rely(dss.jug.address);
	//dss.vat.rely(dss.dog));
	await dss.vat.rely(dss.pot.address);
	await dss.vat.rely(dss.jug.address);
	await dss.vat.rely(dss.spotter.address);
	await dss.vat.rely(dss.end.address);

	await dss.dai.rely(dss.daiJoin.address);

	//dss.dog.file("vow", (dss.vow));

	await dss.pot.rely(dss.end.address);

	await dss.spotter.rely(dss.end.address);

	await dss.end.file(l2String("pot"), dss.pot.address);
	await dss.end.file(l2String("spot"), dss.spotter.address);
	await dss.end.file(l2String("cure"), dss.cure.address);
	//dss.end.file("vow", (dss.vow));
	await dss.end.file(l2String("claim"), cfg.claimToken);

	await dss.end.file(l2String("wait"), cfg.endWait);

	await dss.cure.rely(dss.end.address);

	// WardsAbstract(cfg.claimToken).rely(address(dss.end));

	// daiJoin needs a vat.dai balance to match the existing dai supply
	let totalSupply = await dss.dai.totalSupply();
	// Vat(address(dss.vat)).swell(address(dss.daiJoin), int256(totalSupply) * 10 ** 27);
	await dss.vat.swell(dss.daiJoin.address, totalSupply * 10n ** 27n);
}
