import hre from "hardhat";
import { hostname } from "os";




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

  return {
    a: 1,
    b: "abc",
  };
}
