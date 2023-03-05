import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import fs from "fs";
import hre from "hardhat";

import { SnDai } from "./starknetDss";

export async function breakIntoDai(
  breaker: Account,
  dai: SnDai,
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

    const { transaction_hash } = await hre.starknet.devnet.sendMessageToL2(
      l2GovRelayAddress,
      "relay",
      l1GovRelayAddress,
      [BigInt(classHash)],
      0n
    );

    const receipt = await hre.starknet.getTransactionReceipt(transaction_hash);
    expect(receipt.status).toEqual("ACCEPTED_ON_L2");
  } finally {
    fs.rmSync(spellFileName);
  }
}
