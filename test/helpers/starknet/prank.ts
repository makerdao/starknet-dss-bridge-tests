import type { Abi } from "./abi";
import { WrappedStarknetContract } from "./wrap";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";

let prankster: Account;

export function startSnPrank(signer: Account) {
  prankster = signer;
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
            if (prankster !== undefined) {
              // console.log(`calling ${contract.address} with prank`, _callName, args)
              return (contract.connect(prankster) as any)[callName](...args);
            } else {
              // console.log(`calling ${contract.address}`, _callName, args)
              return (contract as any)[callName](...args);
            }
          };
        }
        // console.log('getting', _callName)
        return (contract as any)[callName];
      },
    }
  ) as WrappedStarknetContract<TAbi>;
}
