import { expect } from "earljs";

describe("integration", () => {
  it("test", async function () {
    expect(this.integrationSetup.teleport.join).toBeDefined();
    expect(this.integrationSetup.teleport.oracleAuth).toBeDefined();
    expect(this.integrationSetup.teleport.router).toBeDefined();
  });
});
