import hre from "hardhat";
import { hostname } from "os";
import { deployTeleportJoin } from "./dss-teleport/dssTeleportContracts";




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

  const l1TeleportJoin = await deployTeleportJoin(
    hre,
    (await hre.ethers.getSigners())[0],
    "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B", // vat
    "0x9759A6Ac90977b93B58547b4A71c78317f391A28", // daiJoin
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000",
    "0x48656c6c6f20576f726c64210000000000000000000000000000000000000000"
  )

  return {
    l1TeleportJoin
  };
}
