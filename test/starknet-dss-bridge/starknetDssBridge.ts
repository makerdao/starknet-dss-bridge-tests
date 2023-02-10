import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import hre from "hardhat";
import { Felt, Uint256 } from "../helpers/starknet/types";
import { expect } from "earljs";
import domainGuestAbi from "./abi/domainGuestAbi";
import { getEscrow, StarknetDomainHost } from "../dss-bridge/dssBridge";
import { SNDssInstance } from "../starknet-dss/starknetDss";
import { l2String } from "../helpers/utils";
import { DssInstance } from "../dss/dss";
import { Address } from "@wagmi/core";
import { formatBytes32String } from "ethers/lib/utils.js";
import { ethers } from "ethers";

type SNDomainGuest = WrappedStarknetContract<typeof domainGuestAbi>;

async function deploySNDomainGuest(
	deployer: Account,
	daiJoin: Felt,
	claimToken: Felt,
	router: Felt,
	host: Felt
): Promise<SNDomainGuest> {
	const factory = await hre.starknet.getContractFactory("domain_guest");
	await deployer.declare(factory);
	const contract = await deployer.deploy(factory, {
		ward: deployer.address,
		daiJoin,
		claimToken,
		router,
		host,
	});
	return wrapTyped(hre, contract);
}

export interface BridgeInstance {
	guest: SNDomainGuest;
	host: StarknetDomainHost;
}

export interface DssBridgeHostConfig {
	escrow: Address;
	debtCeiling: bigint; // RAD
}

export async function initGuest(dss: SNDssInstance, bridge: BridgeInstance) {
	// dss.end.file("vow", address(bridge.guest));
	await dss.end.file(l2String("vow"), bridge.guest.address);
	// bridge.guest.file("end", address(dss.end));
	await bridge.guest.file(l2String("end"), dss.end.address);
	// bridge.guest.rely(address(dss.end));
	await bridge.guest.rely(dss.end.address);
	// dss.vat.rely(address(bridge.guest));
	await dss.vat.rely(bridge.guest.address);
	// dss.end.rely(address(bridge.guest));
	await dss.end.rely(bridge.guest.address);
}

const VOW = formatBytes32String("vow") as Address;
const PIP = formatBytes32String("pip") as Address;
const MAT = formatBytes32String("mat") as Address;
const LINE = formatBytes32String("line") as Address;

export async function initHost(
	dss: DssInstance,
	bridge: BridgeInstance,
	cfg: DssBridgeHostConfig
) {
	// bytes32 ilk = bridge.host.ilk();
	const ilk = await bridge.host.ilk();
	// bridge.host.file("vow", address(dss.vow));
	await bridge.host.file(VOW, dss.vow.address);
	// dss.vat.rely(addressx(bridge.host));
	await dss.vat.rely(bridge.host.address);
	// EscrowLike(cfg.escrow).approve(address(dss.dai), address(bridge.host), type(uint256).max);
	const escrow = await getEscrow(cfg.escrow);
	await escrow.approve(
		dss.dai.address,
		bridge.host.address,
		ethers.constants.MaxUint256.toBigInt()
	);
	// dss.vat.init(ilk);
	await dss.vat.init(ilk);
	// dss.jug.init(ilk);
	await dss.jug.init(ilk);
	// dss.vat.rely(address(bridge.host));
	await dss.vat.rely(bridge.host.address);
	// dss.spotter.file(ilk, "pip", bridge.oracle);
	await dss.spotter.file(ilk, PIP, bridge.host.address);
	// dss.spotter.file(ilk, "mat", 10 ** 27);
	await dss.spotter.file(ilk, MAT, 10n ** 27n);
	// dss.spotter.poke(ilk);
	await dss.spotter.poke(ilk);
	// dss.vat.file(ilk, "line", cfg.debtCeiling);
	await dss.vat["file(bytes32,bytes32,uint256)"](ilk, LINE, cfg.debtCeiling);
	// //dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
	// dss.cure.lift(address(bridge.host));
	await dss.cure.lift(bridge.host.address);
}
