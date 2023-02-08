import { Signer } from "ethers";
import { GetContractResult } from "@wagmi/core";
import { Abi } from "abitype";

let prankster: Signer;

export function startL1Prank(signer: Signer) {
  prankster = signer;
}

export function prank<TAbi extends Abi>(
  contract: GetContractResult<TAbi>
): GetContractResult<TAbi> {
  return new Proxy(
    {},
    {
      get(_, _callName) {
        const callName = _callName.toString();
        if (typeof contract[callName] === "function") {
          return (...args: any[]) => {
            if (prankster !== undefined) {
              // console.log(`calling ${contract.address} with prank`, _callName, args)
              return contract.connect(prankster)[callName](...args);
            } else {
              // console.log(`calling ${contract.address}`, _callName, args)
              return contract[callName](...args);
            }
          };
        }
        // console.log('getting', _callName)
        return contract[callName];
      },
    }
  ) as GetContractResult<TAbi>;
}
