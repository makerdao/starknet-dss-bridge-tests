import { expect } from "earljs";

describe("integration", () => {
  it("test", async function () {
    expect(this.integrationSetup.teleport.join.address).toBeDefined();
    expect(this.integrationSetup.teleport.oracleAuth.address).toBeDefined();
    expect(this.integrationSetup.teleport.router.address).toBeDefined();
  });
});
