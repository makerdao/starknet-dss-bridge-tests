import hre from "hardhat";
import { Address } from "@wagmi/core";
import * as dssTeleport from "./dss-teleport/dssTeleport";
import { getDaiJoin, getVat, getJug, getCure, getVow } from "./dss/dss";
import { DssInstance, DssTeleportConfig } from "./dss-teleport/dssTeleport";
import { startPrank } from "./helpers/prank";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";

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

  // TODO: how to reset properly?
  await hre.network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: "https://mainnet.infura.io/v3/56387818e18e404a9a6d2391af0e9085",
          // blockNumber: 14390000,
        },
      },
    ],
  });

  const signers = await hre.ethers.getSigners();
  const admin = await hre.ethers.getImpersonatedSigner(
    "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB"
  );

  // fund admin account
  setBalance(admin.address, 10n**18n);

  const deployer = signers[0];

  // https://github.com/makerdao/dss-bridge/blob/4cfc84761b4bfeae747af14d3a2545377dd3304a/script/input/1/config.json

  // const admin = getAdmin("0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB");

  const daiJoin = await getDaiJoin(
    "0x9759A6Ac90977b93B58547b4A71c78317f391A28"
  );

  const teleport = await dssTeleport.deploy(
    deployer.address as Address,
    admin.address as Address,
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000", // ilk
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000", // domain
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000", // hostDomain
    daiJoin
  );

  const dss: DssInstance = {
    vat: await getVat("0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B"),
    jug: await getJug("0x19c0976f590D67707E62397C87829d896Dc0f1F1"),
    cure: await getCure("0x0085c9feAb2335447E1F4DC9bf3593a8e28bdfc7"),
    vow: await getVow("0xA950524441892A31ebddF91d3cEEFa04Bf454466"),
  };

  const teleportConfig: DssTeleportConfig = {
    debtCeiling: 10n ** 18n,
    oracleThreshold: 5n,
    oracleSigners: [],
  };

  startPrank(admin);

  await dssTeleport.init(dss, teleport, teleportConfig);

  return {
    teleport,
  };
}
