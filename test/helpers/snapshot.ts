import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import fs, { writeFileSync } from "fs";
import hre from "hardhat";
import { Account } from "hardhat/types";
import path from "path";

import { DssInstance } from "../dss/dss";
import {
  deployConstantDSValue,
  deployDomainHost,
  getBridgeOracle,
  getDomainHost,
  initHost,
} from "../dss-bridge/dssBridge";
import {
  deployLinearFee,
  deployTeleport,
  getLinearFee,
  getTeleport,
  initTeleport,
  initTeleportDomain,
} from "../dss-teleport/dssTeleport";
import {
  deploySnDss,
  deploySnToken,
  getSnDss,
  getSnToken,
  initSnDss,
} from "../starknet-dss/starknetDss";
import {
  deploySnDomainGuest,
  getSnDomainGuest,
  initGuest,
} from "../starknet-dss-bridge/starknetDssBridge";
import {
  deploySnTeleport,
  deploySnTeleportConstantFee,
  getSnTeleport,
  getSnTeleportConstantFee,
  initSnTeleport,
  initSnTeleportDomain,
} from "../starknet-dss-teleport/starknetDssTeleport";
import { startL1Prank } from "./prank";
import { startSnPrank } from "./starknet/prank";
import {
  _1_HOUR,
  _6_HOURS,
  getAddressOfNextDeployedContract,
  RAD,
  WAD,
} from "./utils";

export interface SnapshotAddresses {
  l1join: Address;
  l1router: Address;
  l1oracleauth: Address;
  l1fees: Address;
  domainHost: Address;
  l2cure: string;
  l2daiJoin: string;
  l2vat: string;
  l2pot: string;
  l2spotter: string;
  l2join: string;
  l2router: string;
  l2oracleauth: string;
  l2fees: string;
  l2jug: string;
  domainGuest: string;
  l2end: string;
  bridgeOracle: Address;
  claimToken: string;
  messagingContract: Address;
}

export function snapshotExists(): SnapshotAddresses | undefined {
  try {
    const setup = loadSnapshot();
    return setup;
  } catch (e) {
    return undefined;
  }
}

export async function loadSetup(
  setupConfig: SnapshotAddresses,
  admin: SignerWithAddress,
  snOwner: Account,
  snCfg: any
) {
  const mockStarknetMessaging = (
    await hre.starknet.devnet.loadL1MessagingContract(
      hre.network.config.url!,
      setupConfig.messagingContract
    )
  ).address as Address;
  // Get teleport contracts
  console.log("getTeleport");
  const teleport = await getTeleport(
    setupConfig.l1join,
    setupConfig.l1router,
    setupConfig.l1oracleauth
  );

  // Get fees contracts
  console.log("getLinearFee");
  const fees = await getLinearFee(setupConfig.l1fees);

  console.log("getSnDss");
  const snDss = await getSnDss(
    setupConfig.l2vat,
    setupConfig.l2jug,
    setupConfig.l2cure,
    snCfg.dai,
    setupConfig.l2daiJoin,
    setupConfig.l2end,
    setupConfig.l2spotter,
    setupConfig.l2pot
  );

  console.log("getSnToken");
  const snClaimToken = await getSnToken(setupConfig.claimToken);

  console.log("getSnTeleport");
  const snTeleport = await getSnTeleport(
    setupConfig.l2join,
    setupConfig.l2router,
    setupConfig.l2oracleauth
  );

  console.log("getSnDomainGuest");
  const guest = await getSnDomainGuest(setupConfig.domainGuest);

  console.log("getSnTeleportConstantFee");
  const snFee = await getSnTeleportConstantFee(setupConfig.l2fees);

  console.log("getDomainHost");
  const host = await getDomainHost(setupConfig.domainHost);

  console.log("getBridgeOracle");
  const bridgeOracle = await getBridgeOracle(setupConfig.bridgeOracle);

  startL1Prank(admin);
  startSnPrank(snOwner);

  return {
    teleport,
    snTeleport,
    snDss,
    snClaimToken,
    fees,
    snFee,
    bridgeOracle,
    host,
    guest,
    mockStarknetMessaging,
  };
}

export async function doSetup(
  dss: DssInstance,
  deployer: SignerWithAddress,
  admin: SignerWithAddress,
  snOwner: Account,
  snCfg: any,
  rootCfg: any
) {
  const mockStarknetMessaging = (
    await hre.starknet.devnet.loadL1MessagingContract(hre.network.config.url!)
  ).address as Address;

  console.log("deployTeleport");
  const teleport = await deployTeleport(
    deployer,
    admin,
    rootCfg.teleportIlk,
    snCfg.domain,
    rootCfg.domain,
    dss.daiJoin
  );

  console.log("deployLinearFee");
  const fees = await deployLinearFee(WAD / 10000n, _6_HOURS);

  const hostAddress = (await getAddressOfNextDeployedContract()) as Address;

  // deploy on Starknet
  console.log("deploySnDss");
  const snDss = await deploySnDss(snOwner, snCfg.dai);

  console.log("deploySnToken");
  const snClaimToken = await deploySnToken(snOwner.address);
  // TODO: snClaimToken rely, deny
  // claimToken.rely(radmin);
  // claimToken.deny(address(this));

  console.log("deploySnTeleport");
  const snTeleport = await deploySnTeleport(
    snOwner,
    snCfg.teleportIlk,
    snCfg.domain,
    rootCfg.domain,
    snDss.daiJoin
  );

  console.log("deploySnDomainGuest");
  const guest = await deploySnDomainGuest(
    snOwner,
    snDss.daiJoin,
    snClaimToken,
    snTeleport.router,
    hostAddress
  );

  console.log("deploySnTeleportConstantFee");
  const snFee = await deploySnTeleportConstantFee(WAD / 10000n, _6_HOURS);

  console.log("deployDomainHost");
  // deploy host on l1
  const host = await deployDomainHost(
    deployer,
    admin,
    snCfg.ilk,
    dss.daiJoin,
    snCfg.escrow,
    teleport.router,
    mockStarknetMessaging,
    guest,
    snDss.dai
  );

  const bridgeOracle = await deployConstantDSValue();

  // init on l1

  startL1Prank(admin);
  console.log("initTeleport");
  await initTeleport(dss, teleport, {
    debtCeiling: 10n ** 18n,
    oracleThreshold: 5n,
    oracleSigners: [], //TODO: ???
  });

  console.log("initTeleportDomain");
  await initTeleportDomain(teleport, {
    domain: snCfg.domain,
    fees: fees.address,
    gateway: host.address,
    debtCeiling: 1000000n * WAD,
  });

  console.log("initHost");
  await initHost(dss, host, bridgeOracle, {
    escrow: snCfg.escrow,
    debtCeiling: 1000000n * RAD,
  });
  // TODO: any special initialization?

  // init on Starknet

  console.log("init on Starknet");
  startSnPrank(snOwner);

  console.log("initSnDss");
  await initSnDss(
    snDss,
    {
      claimToken: snClaimToken.address,
      endWait: _1_HOUR,
    },
    rootCfg.govRelay,
    snCfg.govRelay
  );

  console.log("initSnTeleport");
  await initSnTeleport(snDss, snTeleport, {
    debtCeiling: 2000000n * RAD,
    oracleThreshold: 13n,
    oracleSigners: [],
  });

  console.log("initSnTeleportDomain");
  await initSnTeleportDomain(snTeleport, {
    domain: rootCfg.domain,
    fees: snFee.address as Address,
    gateway: guest.address as Address,
    debtCeiling: 1000000n * WAD,
  });

  console.log("initGuest");
  await initGuest(snDss, guest);

  expect(host.address).toEqual(hostAddress);

  await saveSnapshot(
    teleport,
    snTeleport,
    snDss,
    snClaimToken,
    fees,
    snFee,
    host,
    guest,
    bridgeOracle,
    mockStarknetMessaging
  );

  return {
    teleport,
    snTeleport,
    snDss,
    snClaimToken,
    fees,
    snFee,
    bridgeOracle,
    host,
    guest,
    mockStarknetMessaging,
  };
}

// Dump deployment data to starknet_addresses.json
export async function saveSnapshot(
  teleport: any,
  snTeleport: any,
  snDss: any,
  snClaimToken: any,
  fees: any,
  snFee: any,
  host: any,
  guest: any,
  bridgeOracle: any,
  messagingContractAddress: Address
) {
  const addresses: SnapshotAddresses = {
    l1join: teleport.join.address,
    l1router: teleport.router.address,
    l1oracleauth: teleport.oracleAuth.address,
    l1fees: fees.address,
    domainHost: host.address,
    l2cure: snDss.cure.address,
    l2daiJoin: snDss.daiJoin.address,
    l2vat: snDss.vat.address,
    l2pot: snDss.pot.address,
    l2spotter: snDss.spotter.address,
    l2jug: snDss.jug.address,
    l2end: snDss.end.address,
    claimToken: snClaimToken.address,
    l2join: snTeleport.join.address,
    l2router: snTeleport.router.address,
    l2oracleauth: snTeleport.oracleAuth.address,
    domainGuest: guest.address,
    l2fees: snFee.address,
    bridgeOracle: bridgeOracle.address,
    messagingContract: messagingContractAddress,
  };

  const addressesFile = path.join(__dirname, "../starknet_addresses.json");
  writeFileSync(addressesFile, JSON.stringify(addresses, null, 2));
}

// Load deployment data from starknet_addresses.json
export function loadSnapshot(): SnapshotAddresses {
  if (!fs.existsSync(path.join(__dirname, "../starknet_addresses.json"))) {
    throw Error("starknet_addresses.json not found. Run tests first.");
  }

  const addresses = JSON.parse(
    fs
      .readFileSync(path.join(__dirname, "../starknet_addresses.json"))
      .toString()
  );

  return addresses;
}
