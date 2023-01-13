// import hre from "hardhat";

import { any } from "hardhat/internal/core/params/argumentTypes";
import { IntegrationContext } from "./helpers/hooks";

describe("integration", () => {
  it("test", function() {
    this.integrationSetup.a
    console.log("a", this.integrationSetup.a);
    console.log("a", this.integrationSetup.b);
  });
});
