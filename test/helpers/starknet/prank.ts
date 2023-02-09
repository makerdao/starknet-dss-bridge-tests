import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import hre from "hardhat";

import type { Abi } from "./abi";
import { WrappedStarknetContract } from "./wrap";

let prankster: Account | undefined;

const predeployedAccounts: Account[] = [];

export function snPredeployedAccounts(): Account[] {
  return predeployedAccounts;
}

export async function initSnPredeployedAccounts(n: number) {
  for (const { address, private_key } of (
    await hre.starknet.devnet.getPredeployedAccounts()
  ).slice(0, n)) {
    const account =
      await hre.starknet.OpenZeppelinAccount.getAccountFromAddress(
        address,
        private_key
      );
    predeployedAccounts.push(account);
  }
}

export function currentSnAccount(): Account {
  return prankster || predeployedAccounts[0];
}

export function startSnPrank(signer: Account) {
  prankster = signer;
}

export function stopSnPrank() {
  prankster = undefined;
}

export function starknetPrank<TAbi extends Abi>(
  contract: WrappedStarknetContract<TAbi>
): WrappedStarknetContract<TAbi> {
  return new Proxy(
    {},
    {
      get(_, _callName) {
        const callName = _callName.toString();
        if (typeof (contract as any)[callName] === "function") {
          return (...args: any[]) => {
            contract.connect(currentSnAccount());
            return (contract as any)[callName](...args);
          };
        }
        // console.log('getting', _callName)
        return (contract as any)[callName];
      },
    }
  ) as WrappedStarknetContract<TAbi>;
}
