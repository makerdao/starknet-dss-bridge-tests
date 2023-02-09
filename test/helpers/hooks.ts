import { Context } from "mocha";

import { setup } from "../setup";

export type IntegrationContext = Context & Awaited<ReturnType<typeof setup>>;

export const mochaHooks = {
  async beforeAll(this: Context) {
    // console.log("beforeAll");
    Object.assign(this, { integrationSetup: await setup() });
  },
  // beforeEach() {
  //   console.log("beforeEach");
  // },
};
