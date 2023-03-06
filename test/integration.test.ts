import { Address } from "@wagmi/core";
import { expect } from "earljs";
import { utils } from "ethers";

import { RAD, starknetInt256 } from "./helpers/utils";

describe("integration", () => {
  it("test", async function () {
    // @ts-ignore
    // expect(this.integrationSetup.teleport.join.address).toBeDefined();
    // expect(this.integrationSetup.teleport.oracleAuth.address).toBeDefined();
    // expect(this.integrationSetup.teleport.router.address).toBeDefined();
    // expect(this.integrationSetup.fees.address).toBeDefined();
    // expect(this.integrationSetup.snVat.address).toBeDefined();
  });

  it("test deposit", async function () {
    // dss.dai.mint(address(this), 100 ether);
    await this.integrationSetup.dss.dai.mint(
      this.integrationSetup.deployer.address as Address,
      100000000000000000000n
    );
    // dss.dai.approve(address(host), 100 ether);
    await this.integrationSetup.dss.dai.approve(
      this.integrationSetup.host.address as Address,
      100000000000000000000n
    );
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await this.integrationSetup.dss.dai.balanceOf(
      this.integrationSetup.host.address as Address
    );
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await this.integrationSetup.snDss.vat.surf();
    // hostDomain.selectFork();

    // hostDeposit(address(123), 100 ether);
    await this.integrationSetup.host.deposit(100000000000000000000n, 123n);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(await this.integrationSetup.dss.dai.balanceOf(this.integrationSetup.escrow.address)).toEqual(
      escrowDai + utils.parseEther("100").toBigInt()
    );
    // guestDomain.relayFromHost(true);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(100 * RAD));
    expect(await this.integrationSetup.snDss.vat.surf()).toEqual(
      existingSurf + starknetInt256(100n * RAD)
    );
    // assertEq(rdss.dai.balanceOf(address(123)), 100 ether);
    expect(await this.integrationSetup.snDss.dai.balanceOf(123n)).toEqual(
      utils.parseEther("100").toBigInt()
    );
  });
});
