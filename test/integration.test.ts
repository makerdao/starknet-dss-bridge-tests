import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre, { starknet } from "hardhat";

import config from "./config";
import {
  _100_ETH,
  l1String,
  l2StringAsUint256,
  RAD,
  starknetInt256,
} from "./helpers/utils";

const {
  domains: { root: rootCfg, starknet: snCfg },
} = config;

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

  it("test register mint", async function () {
    // TeleportGUID memory teleportToGuest = TeleportGUID({
    //         sourceDomain: domain,
    //         targetDomain: rdomain,
    //         receiver: bytes32(0),
    //         operator: bytes32(0),
    //         amount: 100 ether,
    //         nonce: 0,
    //         timestamp: uint48(block.timestamp)
    //     });
    const teleportToGuest = {
      sourceDomain: l1String(rootCfg.domain),
      targetDomain: l1String(snCfg.domain),
      receiver: l1String("0x0"),
      operator: l1String("0x0"),
      amount: _100_ETH,
      nonce: 0n,
      timestamp: (await hre.ethers.provider.getBlock("latest")).timestamp,
    };
    // TeleportGUID memory teleportToHost = TeleportGUID({
    //     sourceDomain: rdomain,
    //     targetDomain: domain,
    //     receiver: bytes32(0),
    //     operator: bytes32(0),
    //     amount: 100 ether,
    //     nonce: 0,
    //     timestamp: uint48(block.timestamp)
    // });

    // Host -> Guest
    // host.registerMint(teleportToGuest);
    await this.integrationSetup.host.registerMint(teleportToGuest);
    // hostInitializeRegisterMint(teleportToGuest);
    await this.integrationSetup.host.initializeRegisterMint(teleportToGuest);
    // vm.expectEmit(true, true, true, true);
    // TODO: check for emitted events
    // const receipt = await tx.wait();
    // const events = receipt.events;
    // expect(events).toBeAContainerWith(...);
    // emit FinalizeRegisterMint(teleportToGuest);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();

    // Guest -> Host
    // guest.registerMint(teleportToHost);
    // await this.integrationSetup.guest.registerMint(teleportToHost);
    // guestInitializeRegisterMint(teleportToHost);
    // await this.integrationSetup.guest.initializeRegisterMint(teleportToHost);
    // TODO: check for emitted events
    // vm.expectEmit(true, true, true, true);
    // emit FinalizeRegisterMint(teleportToHost);
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();
  });
});
