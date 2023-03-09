import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre, { starknet } from "hardhat";

import config from "./config";
import { DssInstance } from "./dss/dss";
import { DomainHost, Escrow } from "./dss-bridge/dssBridge";
import { TeleportInstance } from "./dss-teleport/dssTeleport";
import {
  _100_ETH,
  _100_RAD,
  l1String,
  l2Eth,
  l2StringAsUint256,
  RAD,
  // toUint256,
} from "./helpers/utils";
import { SnDssInstance } from "./starknet-dss/starknetDss";
import { SnDomainGuest } from "./starknet-dss-bridge/starknetDssBridge";
import { SnTeleportInstance } from "./starknet-dss-teleport/starknetDssTeleport";

const {
  domains: { root: rootCfg, starknet: snCfg },
} = config;

const domain = l1String(rootCfg.domain);
const rdomain = l1String(snCfg.domain);

describe("integration", () => {
  let dss: DssInstance;
  let snDss: SnDssInstance;
  let deployer: SignerWithAddress;
  let host: DomainHost;
  let guest: SnDomainGuest;
  let escrow: Escrow;
  let snTeleport: SnTeleportInstance;
  let teleport: TeleportInstance;

  before(function () {
    ({ dss, snDss, deployer, host, guest, escrow, snTeleport, teleport } =
      this.integrationSetup);
  });

  // eslint-disable-next-line no-only-tests/no-only-tests
  it("test", async function () {
    // @ts-ignore
    // expect(teleport.join.address).toBeDefined();
    // expect(teleport.oracleAuth.address).toBeDefined();
    // expect(teleport.router.address).toBeDefined();
    // expect(fees.address).toBeDefined();
    // expect(snVat.address).toBeDefined();
  });

  it("test deposit", async function () {
    // dss.dai.mint(address(this), 100 ether);
    await dss.dai.mint(deployer.address as Address, _100_ETH);
    // dss.dai.approve(address(host), 100 ether);
    await dss.dai.approve(host.address, _100_ETH);
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await dss.dai.balanceOf(escrow.address);
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await snDss.vat.surf();
    // hostDomain.selectFork();

    // hostDeposit(address(123), 100 ether);
    await host.deposit(_100_ETH, 123n);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai + _100_ETH
    );
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(100 * RAD));
    // TODO: Fix Uint256 return typing
    expect(await snDss.vat.surf()).toEqual(existingSurf - 100n * RAD);
    // assertEq(rdss.dai.balanceOf(address(123)), 100 ether);
    // TODO: Fix Uint256 return typing
    expect(await snDss.dai.balanceOf(123n)).toEqual(_100_ETH);
  });

  it("test withdraw", async function () {
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await dss.dai.balanceOf(escrow.address);
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await snDss.vat.surf();
    // hostDomain.selectFork();
    // dss.dai.mint(address(this), 100 ether);
    await dss.dai.mint(deployer.address as Address, _100_ETH);
    // dss.dai.approve(address(host), 100 ether);
    await dss.dai.approve(host.address, _100_ETH);
    // hostDeposit(address(this), 100 ether);
    await host.deposit(_100_ETH, l2StringAsUint256(deployer.address));
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai + _100_ETH
    );
    // assertEq(dss.dai.balanceOf(address(123)), 0);
    expect(await dss.dai.balanceOf("0x123")).toEqual(0n);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();

    // rdss.vat.hope(address(rdss.daiJoin));
    await snDss.vat.hope(snDss.daiJoin.address);
    // rdss.dai.approve(address(guest), 100 ether);
    await snDss.dai.approve(guest.address, _100_ETH);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(100 * RAD));
    // TODO: Fix Uint256 return typing
    expect(await snDss.vat.surf()).toEqual(existingSurf - 100n * RAD);
    // assertEq(rdss.dai.balanceOf(address(this)), 100 ether);
    // TODO: What should address(this) be? in the context of the guest?
    // TODO: Fix Uint256 return typing
    expect(await snDss.dai.balanceOf(deployer.address)).toEqual(_100_ETH);
    // guestWithdraw(address(123), 100 ether);
    await guest.withdraw("0x123", _100_ETH);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf);
    expect(await snDss.vat.surf()).toEqual(existingSurf);
    // assertEq(rdss.dai.balanceOf(address(this)), 0);
    // TODO: Fix Uint256 return typing
    expect(await snDss.dai.balanceOf(deployer.address)).toEqual(0n);
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();
    // assertEq(dss.dai.balanceOf(escrow), escrowDai);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(escrowDai);
    // assertEq(dss.dai.balanceOf(address(123)), 100 ether);
    expect(await dss.dai.balanceOf("0x123")).toEqual(_100_ETH);
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
      sourceDomain: domain,
      targetDomain: rdomain,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const teleportToHost = {
      sourceDomain: rdomain,
      targetDomain: domain,
      receiver: l1String("0x0"),
      operator: l1String("0x0"),
      amount: _100_ETH,
      nonce: 0n,
      timestamp: (await starknet.getBlock()).timestamp,
    };

    // Host -> Guest
    // host.registerMint(teleportToGuest);
    await host.registerMint(teleportToGuest);
    // hostInitializeRegisterMint(teleportToGuest);
    await host.initializeRegisterMint(teleportToGuest);
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
    // TODO: Fix ABI typing issue
    // await guest.registerMint(teleportToHost);
    // guestInitializeRegisterMint(teleportToHost);
    // await guest.initializeRegisterMint(teleportToHost);
    // TODO: check for emitted events
    // vm.expectEmit(true, true, true, true);
    // emit FinalizeRegisterMint(teleportToHost);
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();
  });

  it("test settle", async function () {
    // Host -> Guest
    // dss.dai.mint(address(host), 100 ether);
    await dss.dai.mint(host.address, _100_ETH);
    // host.settle(domain, rdomain, 100 ether);
    await host.settle(domain, rdomain, _100_ETH);
    // hostInitializeSettle(domain, rdomain);
    await host.initializeSettle(domain, rdomain);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // assertEq(rdss.vat.dai(address(rteleport.join)), 100 * RAD);
    // TODO: Fix Uint256 return typing
    expect(await snDss.dai.balanceOf(snTeleport.join.address)).toEqual(
      _100_RAD
    );

    // Guest -> Host
    // rdss.dai.setBalance(address(guest), 50 ether);
    // TODO: Fix typing issues
    await snDss.dai.mint(guest.address, l2Eth(50n).low);
    // guest.settle(rdomain, domain, 50 ether);
    // TODO: Fix typing issues
    await guest.settle(rdomain, domain, l2Eth(50n).low);
    // guestInitializeSettle(rdomain, domain);
    await guest.initializeSettle(rdomain, domain);
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();
    // assertEq(dss.vat.dai(address(teleport.join)), 50 * RAD);
    expect(await dss.dai.balanceOf(teleport.join.address)).toEqual(
      _100_RAD / 2n
    );
  });
});
