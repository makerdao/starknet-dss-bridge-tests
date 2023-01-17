import { expect } from "earljs";

describe("integration", () => {
  it("test", async function() {
    expect(this.integrationSetup.l1TeleportJoin.address).toBeDefined()
  });
});
