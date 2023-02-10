import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import hre from "hardhat";
import { Felt, Uint256 } from "../helpers/starknet/types";
import { expect } from "earljs";
import domainGuestAbi from "./abi/domainGuestAbi";
import { StarknetDomainHost } from "../dss-bridge/dssBridge";
import { SNDssInstance } from "../starknet-dss/starknetDss";
import { l2String } from "../helpers/utils";

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

export async function init(dss: SNDssInstance, bridge: BridgeInstance) {
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
