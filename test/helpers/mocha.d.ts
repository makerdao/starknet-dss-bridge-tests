import { setup } from "../setup";

export type IntegrationSetup = Awaited<ReturnType<typeof setup>>

declare module "mocha" {
    export interface Context {
      integrationSetup: IntegrationSetup;
    }
  }