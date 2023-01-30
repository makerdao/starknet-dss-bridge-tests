import { StarknetContractFactory } from "@shardlabs/starknet-hardhat-plugin/dist/src/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";

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
