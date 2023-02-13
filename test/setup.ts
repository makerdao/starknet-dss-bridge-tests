import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { Address } from "@wagmi/core";
import hre from "hardhat";

import config from "./config";
import { getDss } from "./dss/dss";
import * as dssTeleport from "./dss-teleport/dssTeleport";
import { DssTeleportConfig } from "./dss-teleport/dssTeleport";
import { startL1Prank } from "./helpers/prank";
import {
  initSnPredeployedAccounts,
  snPredeployedAccounts,
  startSnPrank,
} from "./helpers/starknet/prank";
import { _1_HOUR, _8_DAYS, l1String, reset, WAD } from "./helpers/utils";
import * as starknetDss from "./starknet-dss/starknetDss";
import { SNDssConfig } from "./starknet-dss/starknetDss";

export async function getAdmin(address: Address) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
  return await hre.ethers.getSigner(address);
}

export async function setup() {
  // based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/tests/domains/IntegrationBase.t.sol#L94
  // Setup outline:
  //  1. deploy teleport/host
  //  2. deploy bridge/host
  //  3. deploy dss/guest
  //  4. deploy claim token/guest
  //  5. deploy teleport/guest
  //  6. deploy bridge/guest
  //  7. init teleport/host
  //  8. init domain teleport/host
  //  9. init bridge/host
  // 10. init dss/guest
  // 11. init teleport/guest
  // 12. init domain dss/guest
  // 13. init guest

  await reset();

  const mockStarknetMessaging =
    await hre.starknet.devnet.loadL1MessagingContract(hre.network.config.url!);

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
    deployer.address as Address,
    admin.address as Address,
    l1String(rootCfg.teleportIlk),
    l1String(snCfg.domain),
    l1String(rootCfg.domain),
    dss.daiJoin
  );

  const fees = await dssTeleport.deployLinearFee(WAD / 10000n, _8_DAYS);

  const snDss = await starknetDss.deploy(snOwner, snCfg.dai);

  const snClaimToken = await starknetDss.deploySNToken(snOwner.address);

  startL1Prank(admin);

  const teleportCfg: DssTeleportConfig = {
    debtCeiling: 10n ** 18n,
    oracleThreshold: 5n,
    oracleSigners: [],
  };
  await dssTeleport.init(dss, teleport, teleportCfg);

  const snDssCfg: SNDssConfig = {
    claimToken: snClaimToken.address,
    endWait: _1_HOUR,
  };

  startSnPrank(snOwner);
  await starknetDss.init(snDss, snDssCfg, rootCfg.govRelay, snCfg.govRelay);

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

  // const dai = await getSNDai(snCfg.dai);
  // await breakIntoDai(currentSnAccount(), dai, rootCfg.govRelay, snCfg.govRelay)
}
