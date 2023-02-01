import hre from "hardhat";
import { Address } from "@wagmi/core";
import * as dssTeleport from "./dss-teleport/dssTeleport";
import * as starknetDss from "./starknet-dss/starknetDss";
import { getDaiJoin, getVat, getJug, getCure, getVow } from "./dss/dss";
import {
	DssInstance,
	DssTeleportConfig,
	TeleportFees,
} from "./dss-teleport/dssTeleport";
import { startPrank } from "./helpers/prank";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import {deploySNVat, SNDssConfig} from "./starknet-dss/starknetDss";
import {l1String, reset, snPredeployedAccounts} from "./helpers/utils";
import config from "./config";

export async function getAdmin(address: Address) {
	await hre.network.provider.request({
		method: "hardhat_impersonateAccount",
		params: [address],
	});
	return await hre.ethers.getSigner(address);
}

export async function setup() {
	// based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/tests/domains/IntegrationBase.t.sol#L94
	// Setup outline:
	//  1. deploy teleport/host
	//  2. deploy bridge/host
	//  3. deploy dss/guest
	//  4. deploy claim token/guest
	//  5. deploy teleport/guest
	//  6. deploy bridge/guest
	//  7. init teleport/host
	//  8. init domain teleport/host
	//  9. init bridge/host
	// 10. init dss/guest
	// 11. init teleport/guest
	// 12. init domain dss/guest
	// 13. init guest


	await reset()

	const [snDeployer, snOwner] = await snPredeployedAccounts(2);

	const snVat = await deploySNVat(snDeployer, snOwner.address);

	const signers = await hre.ethers.getSigners();
	const admin = await hre.ethers.getImpersonatedSigner(config.domains.root.admin);

	// fund admin account
	setBalance(admin.address, 10n ** 18n);

	const deployer = signers[0];

	const daiJoin = await getDaiJoin(config.domains.root.daiJoin);

	const teleport = await dssTeleport.deploy(
		deployer.address as Address,
		admin.address as Address,
		config.domains.root.teleportIlk,
		l1String(config.domains.starknet.domain),
		l1String(config.domains.root.domain),
		daiJoin
	);

	const WAD = 10n ** 18n;
	const _8_DAYS = 8n * 24n * 60n * 60n;

	const fees: TeleportFees = await dssTeleport.deployLinearFee(
		WAD / 10000n,
		_8_DAYS
	);

	const dss: DssInstance = {
		vat: await getVat("0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B"),
		jug: await getJug("0x19c0976f590D67707E62397C87829d896Dc0f1F1"),
		cure: await getCure("0x0085c9feAb2335447E1F4DC9bf3593a8e28bdfc7"),
		vow: await getVow("0xA950524441892A31ebddF91d3cEEFa04Bf454466"),
	};

	const snDss = await starknetDss.deploy(
		snDeployer,
		snOwner,
		config.domains.starknet.dai
	);

	const snClaimToken = await starknetDss.deploySNToken(
		snDeployer,
		snOwner.address
	);

	const snDssConfig: SNDssConfig = {
		claimToken: snClaimToken.address,
		endWait: 3600n, // 1 hour
	};

	const teleportConfig: DssTeleportConfig = {
		debtCeiling: 10n ** 18n,
		oracleThreshold: 5n,
		oracleSigners: [],
	};

	startPrank(admin);

	await dssTeleport.init(dss, teleport, teleportConfig);

	await starknetDss.init(snDss, snDssConfig);

	return {
		teleport,
		fees,
		snVat,
	};
}
