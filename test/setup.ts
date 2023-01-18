import hre from "hardhat";
import { Address } from "@wagmi/core";
import { deploy } from "./dss-teleport/dssTeleport";
import { getDaiJoin } from "./dss/dss";

export async function setup() {
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

  const [deployer, owner] = await hre.ethers.getSigners();

  const daiJoin = await getDaiJoin(
    "0x9759A6Ac90977b93B58547b4A71c78317f391A28"
  );

  const teleport = await deploy(
    deployer.address as Address,
    owner.address as Address,
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000",
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000",
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000",
    daiJoin
  );

  // console.log("daiJoin", await daiJoin.vat());

  // const l1TeleportJoin = await deployTeleportJoin(
  //   hre,
  //   (
  //     await hre.ethers.getSigners()
  //   )[0],
  //   await daiJoin.vat(),
  //   daiJoin.address,
  //   "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000",
  //   "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000"
  // );

  return {
    teleport,
  };
}
