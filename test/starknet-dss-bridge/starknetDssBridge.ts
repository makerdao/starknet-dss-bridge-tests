import { Account } from "@shardlabs/starknet-hardhat-plugin/dist/src/account";
import { Address } from "@wagmi/core";
import hre from "hardhat";

import { DomainHost } from "../dss-bridge/dssBridge";
import { currentSnAcc, starknetPrankTyped } from "../helpers/starknet/prank";
import { Felt } from "../helpers/starknet/types";
import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { l2String } from "../helpers/utils";
import { SnDaiJoin, SnDssInstance, SnToken } from "../starknet-dss/starknetDss";
import { SnTeleportRouter } from "../starknet-dss-teleport/starknetDssTeleport";
import domainGuestAbi from "./abi/domainGuestAbi";

export type SnDomainGuest = WrappedStarknetContract<typeof domainGuestAbi>;

export async function deploySnDomainGuest(
  owner: Account,
  daiJoin: SnDaiJoin,
  claimToken: SnToken,
  router: SnTeleportRouter,
  host: Felt
): Promise<SnDomainGuest> {
  const factory = await hre.starknet.getContractFactory("domain_guest");
  await currentSnAcc().declare(factory);
  const contract = await currentSnAcc().deploy(factory, {
    ward: owner.address,
    dai_join: daiJoin.address,
    claim_token: claimToken.address,
    router: router.address,
    host,
  });
  return starknetPrankTyped(wrapTyped(hre, contract));
}

export interface BridgeInstance {
  guest: SnDomainGuest;
  host: DomainHost;
}

export interface DssBridgeHostConfig {
  escrow: Address;
  debtCeiling: bigint; // RAD
}

export async function initGuest(
  { vat, end }: SnDssInstance,
  guest: SnDomainGuest
) {
  await end.file(l2String("vow"), guest.address);
  await guest.file(l2String("end"), end.address);
  await guest.rely(end.address);
  await vat.rely(guest.address);
  await end.rely(guest.address);
}
