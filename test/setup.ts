import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre from "hardhat";

import config from "./config";
import { getDss } from "./dss/dss";
import {
  deployConstantDSValue,
  deployDomainHost,
  initHost,
} from "./dss-bridge/dssBridge";
import {
  deployLinearFee,
  deployTeleport,
  initTeleport,
  initTeleportDomain,
} from "./dss-teleport/dssTeleport";
import { startL1Prank } from "./helpers/prank";
import {
  initSnPredeployedAccounts,
  snPredeployedAccounts,
  startSnPrank,
} from "./helpers/starknet/prank";
import {
  _1_HOUR,
  _6_HOURS,
  getAddressOfNextDeployedContract,
  loadSnapshot,
  RAD,
  saveSnapshot,
  setBalance,
  WAD,
} from "./helpers/utils";
import {
  deploySnDss,
  deploySnToken,
  initSnDss,
} from "./starknet-dss/starknetDss";
import {
  deploySnDomainGuest,
  initGuest,
} from "./starknet-dss-bridge/starknetDssBridge";
import {
  deploySnTeleport,
  deploySnTeleportConstantFee,
  initSnTeleport,
  initSnTeleportDomain,
} from "./starknet-dss-teleport/starknetDssTeleport";

export async function getAdmin(address: Address) {
  await hre.network.provider.request({
    method: "anvil_impersonateAccount",
    params: [address],
  });
  return await hre.ethers.getSigner(address);
}

export async function setup() {
  // based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/tests/domains/IntegrationBase.t.sol#L94

  // preparation
  const setupConfig = loadSnapshot();
  console.log(setupConfig)

  const mockStarknetMessaging = (
    await hre.starknet.devnet.loadL1MessagingContract(hre.network.config.url!)
  ).address as Address;

  await initSnPredeployedAccounts(2);

  const {
    domains: { root: rootCfg, starknet: snCfg },
  } = config;

  const [_, snOwner] = snPredeployedAccounts();

  const deployer = (await hre.ethers.getSigners())[0];
  const admin = await hre.ethers.getImpersonatedSigner(rootCfg.admin);

  // fund admin account
  await setBalance(admin.address, "10");

  // deploy on l1
  console.log("getDss");
  const dss = await getDss(rootCfg);

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

  expect(host.address).toEqual(hostAddress);

  // await saveSnapshot();

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

  await saveSnapshot(
    teleport,
    snTeleport,
    snDss,
    snClaimToken,
    fees,
    snFee,
    host,
    guest,
    bridgeOracle
  );

  return {
    dss,
    teleport,
    fees,
    host,
    snDss,
    snTeleport,
    snFee,
    guest,
  };
}
