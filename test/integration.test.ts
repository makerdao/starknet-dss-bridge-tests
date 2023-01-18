import { expect } from "earljs";
import { TestContext } from "./helpers/hooks";

describe("integration", () => {
	it("test", async function (this: TestContext) {
		expect(this.integrationSetup.l1TeleportJoin.address).toBeDefined();
	});
});
