import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import hre from "hardhat";
import { Felt, Uint256 } from "../helpers/starknet/types";
import { expect } from "earljs";
import domainGuestAbi from "./abi/domainGuestAbi";

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

export interface SNDssBridgeInstance {
	guest: SNDomainGuest;
}

export async function init(dssBridge: SNDssBridgeInstance) {
	const { guest } = dssBridge;
}
