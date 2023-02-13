import { Address } from "@wagmi/core";
import hre from "hardhat";

import { SnDomainHost } from "../dss-bridge/dssBridge";
import { currentSnAccount } from "../helpers/starknet/prank";
import { Felt } from "../helpers/starknet/types";
import { WrappedStarknetContract, wrapTyped } from "../helpers/starknet/wrap";
import { l2String } from "../helpers/utils";
import { SnDaiJoin, SNDssInstance, SnToken } from "../starknet-dss/starknetDss";
import { SNTeleportRouter } from "../starknet-dss-teleport/starknetDssTeleport";
import domainGuestAbi from "./abi/domainGuestAbi";

export type SNDomainGuest = WrappedStarknetContract<typeof domainGuestAbi>;

export async function deploySnDomainGuest(
  daiJoin: SnDaiJoin,
  claimToken: SnToken,
  router: SNTeleportRouter,
  host: Felt
): Promise<SNDomainGuest> {
  const factory = await hre.starknet.getContractFactory("domain_guest");
  await currentSnAccount().declare(factory);
  const contract = await currentSnAccount().deploy(factory, {
    ward: currentSnAccount().address,
    daiJoin: daiJoin.address,
    claimToken: claimToken.address,
    router: router.address,
    host,
  });
  return wrapTyped(hre, contract);
}

export interface BridgeInstance {
  guest: SNDomainGuest;
  host: SnDomainHost;
}

export interface DssBridgeHostConfig {
  escrow: Address;
  debtCeiling: bigint; // RAD
}

export async function initGuest(
  { vat, end }: SNDssInstance,
  guest: SNDomainGuest
) {
  await end.file(l2String("vow"), guest.address);
  await guest.file(l2String("end"), end.address);
  await guest.rely(end.address);
  await vat.rely(guest.address);
  await end.rely(guest.address);
}
