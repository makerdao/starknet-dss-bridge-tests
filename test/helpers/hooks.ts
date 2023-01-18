import { Context } from "mocha";
import { setupIntegration } from "../setup";

export type InjectableContext = Readonly<{
	// properties injected using the Root Mocha Hooks
	integrationTest: typeof setupIntegration;
}>;

// TestContext will be used by all the test
export type TestContext = Mocha.Context & Context;

export const mochaHooks = (): Mocha.RootHookObject => {
	return {
		beforeAll(this: Mocha.Context) {
			// asynchronously initialize (testable) system components

			const context: InjectableContext = {
				// pass the system components here
				integrationTest: setupIntegration,
			};

			Object.assign(this, context);
		},
		beforeEach(this: TestContext) {
			// the contents of the Before Each hook
		},
		afterAll(this: TestContext) {
			// the contents of the After All hook
		},
		afterEach(this: TestContext) {
			// the contents of the After Each hook
		},
	};
};
