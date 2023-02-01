import { StarknetContractFactory } from "@shardlabs/starknet-hardhat-plugin/dist/src/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";
import hre from "hardhat";
import {Account} from "@shardlabs/starknet-hardhat-plugin/dist/src/account";

export async function getL2ContractAt(
	hre: HardhatRuntimeEnvironment,
	abiPath: string, // folder.cairo/contract_abi.cairo
	address: string
) {
	const factory = new StarknetContractFactory({
		hre,
		abiPath: path.join(
			process.env.PWD!,
			"/starknet-artifacts/contracts/starknet/starknet-dss/",
			abiPath
		),
		metadataPath: "", //ignored
	});
	return factory.getContractAt(address);
}

export function l2String(str: string): string {
	return `0x${Buffer.from(str, "utf8").toString("hex")}`;
}

export function l1String(str: string): string {
	return hre.ethers.utils.formatBytes32String(str);
}

export async function reset() {
	// TODO: how to reset properly? jsonRpcUrl should be outside ts code
	await hre.network.provider.request({
		method: "hardhat_reset",
		params: [
			{
				forking: {
					jsonRpcUrl:
						"https://mainnet.infura.io/v3/56387818e18e404a9a6d2391af0e9085",
				},
			},
		],
	});
}
export async function snPredeployedAccounts(n: number): Promise<Account[]> {
	const result: Account[] = [];
	for (const {address, private_key} of (
		await hre.starknet.devnet.getPredeployedAccounts()
	).slice(0, n)) {
		const account =
			await hre.starknet.OpenZeppelinAccount.getAccountFromAddress(
				address,
				private_key
			);
		result.push(account);
	}
	return result;
}
