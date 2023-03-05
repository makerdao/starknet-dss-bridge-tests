/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address } from "@wagmi/core";
import hre from "hardhat";

import config from "./config";
import { getDss } from "./dss/dss";
import { doSetup, loadSetup, snapshotExists } from "./helpers/snapshot";
import {
  initSnPredeployedAccounts,
  snPredeployedAccounts,
} from "./helpers/starknet/prank";
import { setBalance } from "./helpers/utils";

export async function getAdmin(address: Address) {
  await hre.network.provider.request({
    method: "anvil_impersonateAccount",
    params: [address],
  });
  return await hre.ethers.getSigner(address);
}

export async function setup() {
  // based on: https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/src/tests/domains/IntegrationBase.t.sol#L94

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

  // load or deploy
  const snapshot = snapshotExists();
  const { teleport, snTeleport, snDss, fees, snFee, host, guest } = snapshot
    ? await loadSetup(snapshot, admin, snOwner, snCfg)
    : await doSetup(dss, deployer, admin, snOwner, snCfg, rootCfg);

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
