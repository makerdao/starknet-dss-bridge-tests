import { GetContractResult } from "@wagmi/core";
import { Abi } from "abitype";
import { Signer } from "ethers";

let prankster: Signer | undefined;

export function startL1Prank(signer: Signer) {
  prankster = signer;
}

export function prank<TAbi extends Abi>(
  contract: GetContractResult<TAbi>
): GetContractResult<TAbi> {
  return new Proxy(
    {},
    {
      get(_target, _callName) {
        const callName = _callName.toString();
        // console.log(typeof contract[callName] === "function");
        if (typeof contract[callName] === "function") {
          return (...args: any[]) => {
            if (prankster !== undefined) {
              console.log(
                `calling ${contract.address} with prank`,
                (prankster as any).address,
                _callName,
                args
              );
              return contract.connect(prankster)[callName](...args);
            } else {
              console.log(`calling ${contract.address}`, _callName, args);
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
