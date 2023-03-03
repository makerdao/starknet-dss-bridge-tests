import { Context } from "mocha";

import { setup } from "../setup";
import { loadSnapshot } from "./utils";

export type IntegrationContext = Context & Awaited<ReturnType<typeof setup>>;

export const mochaHooks = {
  async beforeAll(this: Context) {
    // console.log("beforeAll");
    // preparation
    const setupConfig = loadSnapshot();
    console.log(setupConfig);
    const load = Object.keys(setupConfig).length > 0;
    Object.assign(this, { integrationSetup: await setup(load, setupConfig) });
  },
  // beforeEach() {
  //   console.log("beforeEach");
  // },
};
