import { Signer } from "ethers";
import { GetContractResult } from "@wagmi/core";
import { Abi } from "abitype";

let prankster: Signer;

export function startPrank(signer: Signer) {
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

//       return async
//       const callName = _callName.toString();
//       if (callName === "address") {
//         return contract.address;
//       }

//       if (callName === "connect") {
//         return (account: Account) => {
//           connectedAccount = account;
//         };
//       }

//       const abiEntry = contract.getAbi()[callName] as AbiEntry | undefined;

//       if (!abiEntry) {
//         throw new Error(
//           `Can't evaluate: ${callName} in contract ${contract.address}`
//         );
//       }
//       if (abiEntry.type != "function") {
//         throw new Error(
//           `Can't evaluate a non function: ${callName} in contract ${contract.address}`
//         );
//       }
//       const cairoFunction = abiEntry as CairoFunction;
//       return async (...args: any[]) => {
//         if (cairoFunction.stateMutability === "view") {
//           const res = await contract.call(
//             callName,
//             getCallArgs(args, cairoFunction.inputs)
//           );
//           return getResults(res, cairoFunction.outputs);
//         } else {
//           if (!connectedAccount) {
//             throw new Error(
//               `No account connected to contract ${contract.address}`
//             );
//           }

//           const parameters: Parameters<typeof connectedAccount.invoke> = [
//             contract,
//             callName,
//             getCallArgs(args, cairoFunction.inputs),
//           ];
//           if (getOptions(args)) {
//             parameters.push(getOptions(args));
//           }

//           const txHash = await connectedAccount.invoke(...parameters);
//           return await hre.starknet.getTransactionReceipt(txHash);
//         }
//       };
//     },
//   }
// ) as StarknetContract;
