import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre from "hardhat";

import { RAD } from "../lib/starknet-dss/test/utils";
import config from "./config";
import { getDss } from "./dss/dss";
import { deploySnDomainHost, initHost } from "./dss-bridge/dssBridge";
import * as dssTeleport from "./dss-teleport/dssTeleport";
import {
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
  reset,
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
    method: "hardhat_impersonateAccount",
    params: [address],
  });
  return await hre.ethers.getSigner(address);
}

export async function setup() {
  // based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/tests/domains/IntegrationBase.t.sol#L94

  await reset();

  const mockStarknetMessaging = (
    await hre.starknet.devnet.loadL1MessagingContract(hre.network.config.url!)
  ).address as Address;

  console.log(mockStarknetMessaging);

  await initSnPredeployedAccounts(2);

  const {
    domains: { root: rootCfg, starknet: snCfg },
  } = config;

  const [_, snOwner] = snPredeployedAccounts();

  const deployer = (await hre.ethers.getSigners())[0];
  const admin = await hre.ethers.getImpersonatedSigner(rootCfg.admin);

  // fund admin account
  await setBalance(admin.address, 10n ** 18n);

  const dss = await getDss(rootCfg);

  const teleport = await dssTeleport.deploy(
    deployer,
    admin,
    rootCfg.teleportIlk,
    snCfg.domain,
    rootCfg.domain,
    dss.daiJoin
  );

  const fees = await dssTeleport.deployLinearFee(WAD / 10000n, _6_HOURS);

  const hostAddress = (await getAddressOfNextDeployedContract()) as Address;

  startL1Prank(admin);

  const snDss = await deploySnDss(snOwner, snCfg.dai);

  const snClaimToken = await deploySnToken(snOwner.address);
  // TODO: snClaimToken rely, deny

  const snTeleport = await deploySnTeleport(
    snOwner,
    snCfg.ilk,
    snCfg.domain,
    rootCfg.domain,
    snDss.daiJoin
  );

  const guest = await deploySnDomainGuest(
    snDss.daiJoin,
    snClaimToken,
    snTeleport.router,
    hostAddress
  );

  const host = await deploySnDomainHost(
    rootCfg.teleportIlk,
    dss.daiJoin,
    snCfg.escrow,
    teleport.router,
    mockStarknetMessaging,
    guest,
    snDss.dai
  );

  expect(host.address).toEqual(hostAddress);

  await initTeleport(dss, teleport, {
    debtCeiling: 10n ** 18n,
    oracleThreshold: 5n,
    oracleSigners: [], //TODO: ???
  });

  await initTeleportDomain(teleport, {
    domain: snCfg.domain,
    fees: fees.address,
    gateway: host.address,
    debtCeiling: 1000000n * WAD,
  });

  await initHost(dss, host, {
    escrow: snCfg.escrow,
    debtCeiling: 1000000n * RAD,
  });
  // TODO: any special initialization?

  // sn init

  startSnPrank(snOwner);

  await initSnDss(
    snDss,
    {
      claimToken: snClaimToken.address,
      endWait: _1_HOUR,
    },
    rootCfg.govRelay,
    snCfg.govRelay
  );

  await initSnTeleport(snDss, snTeleport, {
    debtCeiling: 2000000n * RAD,
    oracleThreshold: 13n,
    oracleSigners: [],
  });

  const snFee = await deploySnTeleportConstantFee(WAD / 10000n, _6_HOURS);

  await initSnTeleportDomain(snTeleport, {
    domain: rootCfg.domain,
    fees: snFee.address as Address,
    gateway: guest.address as Address,
    debtCeiling: 1000000n * WAD,
  });

  await initGuest(snDss, guest);

  return {
    teleport,
    fees,
    snVat: snDss.vat,
  };

  // const snClaimToken = await starknetDss.deploySNToken(snOwner.address);
  // const snDssCfg: SNDssConfig = {
  //   claimToken: snClaimToken.address,
  //   endWait: _1_HOUR,
  // };
  //
  // const snDss = await starknetDss.deploy(snOwner, snCfg.dai);
  // startSnPrank(snOwner);
  // await starknetDss.init(snDss, snDssCfg, rootCfg.govRelay, snCfg.govRelay);
}
