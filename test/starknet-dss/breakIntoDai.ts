import hre from "hardhat";
import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { expect } from "earljs";
import { SNDai } from "./starknetDss";
import fs from "fs";
import { Address } from "@wagmi/core";
import { HardhatRuntimeEnvironment } from "hardhat/types";

interface SendMessageToL2Params {
  l2_contract_address: string;
  entry_point_selector: string;
  l1_contract_address: string;
  payload: string[];
  nonce: string;
}

interface SendMessageToL2Result {
  transaction_hash: string;
}

// replace with a call on devnet object when it is available
async function sendMessageToL2(
  hre: HardhatRuntimeEnvironment,
  params: SendMessageToL2Params
) {
  return (
    (
      // @ts-ignore
      await hre.starknet.devnet.requestHandler(
        "/postman/send_message_to_l2",
        "POST",
        params
      )
    ).data as SendMessageToL2Result
  );
}

export async function breakIntoDai(
  breaker: Account,
  dai: SNDai,
  l1GovRelayAddress: Address,
  l2GovRelayAddress: string
) {
  const l2Spell = `%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import get_caller_address

@contract_interface
namespace HasWards {
    func rely(user: felt) {
    }
}

@external
func execute{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    const dai = ${dai.address};
    HasWards.rely(dai, ${breaker.address});
    return ();
}`;
  const spellFileName = "contracts/tmp.cairo";
  try {
    fs.writeFileSync(spellFileName, l2Spell);

    await hre.run("starknet-compile", { paths: [spellFileName] });
    const spellFactory = await hre.starknet.getContractFactory("tmp");
    const classHash = await breaker.declare(spellFactory);

    // TODO: waiting for a fix from shardlabs
    // const { transaction_hash } = await hre.starknet.devnet.sendMessageToL2(
    //   l2GovRelayAddress,
    //   "relay",
    //   l1GovRelayAddress,
    //   // @ts-ignore
    //   [classHash],
    //   "0x0"
    // );

    // @ts-ignore
    const { transaction_hash } = await sendMessageToL2(hre, {
      l2_contract_address: l2GovRelayAddress,
      entry_point_selector:
        "0xa9ebda8d3a6595cf15b1d46ea0e440a9810c2b99a3e889c6b3b46f7ff0e5e1",
      l1_contract_address: l1GovRelayAddress,
      payload: [classHash],
      nonce: "0x0",
    });

    const receipt = await hre.starknet.getTransactionReceipt(transaction_hash);
    expect(receipt.status).toEqual("ACCEPTED_ON_L2");
  } finally {
    fs.rmSync(spellFileName);
  }
}
