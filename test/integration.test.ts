import { Address } from "@wagmi/core";
import { expect } from "earljs";
import { starknet } from "hardhat";

import { _100_ETH,l2StringAsUint256, RAD, starknetInt256 } from "./helpers/utils";

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
      _100_ETH
    );
    // dss.dai.approve(address(host), 100 ether);
    await this.integrationSetup.dss.dai.approve(
      this.integrationSetup.host.address as Address,
      _100_ETH
    );
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await this.integrationSetup.dss.dai.balanceOf(
      this.integrationSetup.escrow.address
    );
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await this.integrationSetup.snDss.vat.surf();
    // hostDomain.selectFork();

    // hostDeposit(address(123), 100 ether);
    await this.integrationSetup.host.deposit(_100_ETH, 123n);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(
      await this.integrationSetup.dss.dai.balanceOf(
        this.integrationSetup.escrow.address
      )
    ).toEqual(escrowDai + _100_ETH);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(100 * RAD));
    expect(await this.integrationSetup.snDss.vat.surf()).toEqual(
      existingSurf + starknetInt256(100n * RAD)
    );
    // assertEq(rdss.dai.balanceOf(address(123)), 100 ether);
    expect(await this.integrationSetup.snDss.dai.balanceOf(123n)).toEqual(
      _100_ETH
    );
  });

  it("test withdraw", async function () {
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await this.integrationSetup.dss.dai.balanceOf(
      this.integrationSetup.escrow.address
    );
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await this.integrationSetup.snDss.vat.surf();
    // hostDomain.selectFork();
    // dss.dai.mint(address(this), 100 ether);
    await this.integrationSetup.dss.dai.mint(
      this.integrationSetup.deployer.address as Address,
      _100_ETH
    );
    // dss.dai.approve(address(host), 100 ether);
    await this.integrationSetup.dss.dai.approve(
      this.integrationSetup.host.address as Address,
      _100_ETH
    );
    // hostDeposit(address(this), 100 ether);
    await this.integrationSetup.host.deposit(
      _100_ETH,
      l2StringAsUint256(this.integrationSetup.deployer.address)
    );
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(
      await this.integrationSetup.dss.dai.balanceOf(
        this.integrationSetup.escrow.address
      )
    ).toEqual(escrowDai + _100_ETH);
    // assertEq(dss.dai.balanceOf(address(123)), 0);
    expect(await this.integrationSetup.dss.dai.balanceOf("0x123")).toEqual(0n);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();

    // rdss.vat.hope(address(rdss.daiJoin));
    await this.integrationSetup.snDss.vat.hope(
      this.integrationSetup.snDss.daiJoin.address
    );
    // rdss.dai.approve(address(guest), 100 ether);
    await this.integrationSetup.snDss.dai.approve(
      this.integrationSetup.guest.address,
      _100_ETH
    );
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(100 * RAD));
    expect(await this.integrationSetup.snDss.vat.surf()).toEqual(
      existingSurf + starknetInt256(100n * RAD)
    );
    // assertEq(rdss.dai.balanceOf(address(this)), 100 ether);
    // TODO: What should address(this) be? in the context of the guest?
    expect(
      await this.integrationSetup.snDss.dai.balanceOf(
        this.integrationSetup.deployer.address
      )
    ).toEqual(_100_ETH);
    // guestWithdraw(address(123), 100 ether);
    await this.integrationSetup.guest.withdraw("0x123", _100_ETH);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf);
    expect(await this.integrationSetup.snDss.vat.surf()).toEqual(existingSurf);
    // assertEq(rdss.dai.balanceOf(address(this)), 0);
    expect(
      await this.integrationSetup.snDss.dai.balanceOf(
        this.integrationSetup.deployer.address
      )
    ).toEqual(0n);
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();
    // assertEq(dss.dai.balanceOf(escrow), escrowDai);
    expect(
      await this.integrationSetup.dss.dai.balanceOf(
        this.integrationSetup.escrow.address
      )
    ).toEqual(escrowDai);
    // assertEq(dss.dai.balanceOf(address(123)), 100 ether);
    expect(await this.integrationSetup.dss.dai.balanceOf("0x123")).toEqual(
      _100_ETH
    );
  });
});
