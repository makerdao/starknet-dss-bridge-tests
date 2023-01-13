import { setup } from "../setup";
import { Context } from "mocha";

export type IntegrationContext = Context & Awaited<ReturnType<typeof setup>>

export const mochaHooks = {
  async beforeAll(this: Context) {
    // console.log("beforeAll");
    Object.assign(this, { integrationSetup: await setup()})
  },
  // beforeEach() {
  //   console.log("beforeEach");
  // },
};
