import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Address } from "@wagmi/core";
import { expect } from "earljs";
import hre, { starknet } from "hardhat";

import config from "./config";
import { DssInstance } from "./dss/dss";
import { DomainHost, Escrow } from "./dss-bridge/dssBridge";
import { TeleportInstance } from "./dss-teleport/dssTeleport";
import {
  _25_ETH,
  _30_ETH,
  _50_ETH,
  _100_ETH,
  _100_RAD,
  l1String,
  l2Eth,
  l2String,
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
  let ilk: Address;

  before(async function () {
    ({ dss, snDss, deployer, host, guest, escrow, snTeleport, teleport } =
      this.integrationSetup);

    ilk = await host.ilk();
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

  it("test raise debt ceiling", async function () {
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await dss.dai.balanceOf(escrow.address);
    // (uint256 ink, uint256 art) = dss.vat.urns(ilk, address(host));
    let { ink, art } = await dss.vat.urns(await host.ilk(), host.address);
    // assertEq(ink, 0);
    expect(ink).toEqual(0n);
    // assertEq(art, 0);
    expect(art).toEqual(0n);
    // assertEq(host.grain(), 0);
    expect(await host.grain()).toEqual(0n);
    // assertEq(host.line(), 0);
    expect(await host.line()).toEqual(0n);

    // hostLift(100 ether);
    await host.lift(_100_ETH);

    // (ink, art) = dss.vat.urns(ilk, address(host));
    ({ ink, art } = await dss.vat.urns(await host.ilk(), host.address));
    // assertEq(ink, 100 ether);
    expect(ink).toEqual(_100_ETH);
    // assertEq(art, 100 ether);
    expect(art).toEqual(_100_ETH);
    // assertEq(host.grain(), 100 ether);
    expect(await host.grain()).toEqual(_100_ETH);
    // assertEq(host.line(), 100 * RAD);
    expect(await host.line()).toEqual(_100_RAD);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai + _100_ETH
    );

    // Play the message on L2
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();

    // assertEq(rdss.vat.Line(), 100 * RAD);
    // TODO: fix typings
    expect(await snDss.vat.Line()).toEqual(_100_RAD);
  });

  // eslint-disable-next-line no-only-tests/no-only-tests
  it.only("test deposit", async function () {
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

  it("test raise lower debt ceiling", async function () {
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await dss.dai.balanceOf(escrow.address);
    // (uint256 ink, uint256 art) = dss.vat.urns(ilk, address(host));
    const { ink, art } = await dss.vat.urns(ilk, host.address);
    // assertEq(ink, 0);
    expect(ink).toEqual(0n);
    // assertEq(art, 0);
    expect(art).toEqual(0n);
    // assertEq(host.grain(), 0);
    expect(await host.grain()).toEqual(0n);
    // assertEq(host.line(), 0);
    expect(await host.line()).toEqual(0n);

    // hostLift(100 ether);
    await host.lift(_100_ETH);

    // (ink, art) = dss.vat.urns(ilk, address(host));
    const { ink: ink2, art: art2 } = await dss.vat.urns(ilk, host.address);
    // assertEq(ink, 100 ether);
    expect(ink2).toEqual(_100_ETH);
    // assertEq(art, 100 ether);
    expect(art2).toEqual(_100_ETH);
    // assertEq(host.grain(), 100 ether);
    expect(await host.grain()).toEqual(_100_ETH);
    // assertEq(host.line(), 100 * RAD);
    expect(await host.line()).toEqual(100n * RAD);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai + _100_ETH
    );

    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // assertEq(rdss.vat.Line(), 100 * RAD);
    expect(await snDss.vat.Line()).toEqual(100n * RAD);
    // assertEq(rdss.vat.debt(), 0);
    expect(await snDss.vat.debt()).toEqual(0n);

    // Pre-mint DAI is not released here
    // hostDomain.selectFork();
    // hostLift(50 ether);
    await host.lift(_50_ETH);

    // (ink, art) = dss.vat.urns(ilk, address(host));
    const { ink: ink3, art: art3 } = await dss.vat.urns(ilk, host.address);
    // assertEq(ink, 100 ether);
    expect(ink3).toEqual(_100_ETH);
    // assertEq(art, 100 ether);
    expect(art3).toEqual(_100_ETH);
    // assertEq(host.grain(), 100 ether);
    expect(await host.grain()).toEqual(_100_ETH);
    // assertEq(host.line(), 50 * RAD);
    expect(await host.line()).toEqual(50n * RAD);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 100 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(escrowDai);

    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // assertEq(rdss.vat.Line(), 50 * RAD);
    expect(await snDss.vat.Line()).toEqual(50n * RAD);
    // assertEq(rdss.vat.debt(), 0);
    expect(await snDss.vat.debt()).toEqual(0n);

    // hostDomain.selectFork();
    // host.release(50 ether);
    // TODO: remove 1st param when latest dss-bridge changes have been applied
    await host.release(0n, _50_ETH);

    // (ink, art) = dss.vat.urns(ilk, address(host));
    const { ink: ink4, art: art4 } = await dss.vat.urns(ilk, host.address);
    // assertEq(ink, 50 ether);
    expect(ink4).toEqual(_50_ETH);
    // assertEq(art, 50 ether);
    expect(art4).toEqual(_50_ETH);
    // assertEq(host.grain(), 50 ether);
    expect(await host.grain()).toEqual(_50_ETH);
    // assertEq(host.line(), 50 * RAD);
    expect(await host.line()).toEqual(50n * RAD);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 50 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai + _50_ETH
    );

    // Add some debt to the guest instance, lower the DC and release some more pre-mint
    // This can only release pre-mint DAI up to the debt
    // guestDomain.selectFork();
    // rdss.vat.suck(address(guest), address(this), 40 * RAD);
    await snDss.vat.suck(guest.address, deployer.address, 40n * RAD);
    // assertEq(rdss.vat.Line(), 50 * RAD);
    expect(await snDss.vat.Line()).toEqual(50n * RAD);
    // assertEq(rdss.vat.debt(), 40 * RAD);
    expect(await snDss.vat.debt()).toEqual(40n * RAD);

    // hostDomain.selectFork();
    // hostLift(25 ether);
    await host.lift(_25_ETH);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // assertEq(rdss.vat.Line(), 25 * RAD);
    expect(await snDss.vat.Line()).toEqual(25n * RAD);
    // assertEq(rdss.vat.debt(), 40 * RAD);
    expect(await snDss.vat.debt()).toEqual(40n * RAD);
  });

  it("test push surplus", async function () {
    // uint256 vowDai = dss.vat.dai(address(dss.vow));
    const vowDai = await dss.vat.dai(dss.vow.address);
    // uint256 vowSin = dss.vat.sin(address(dss.vow));
    const vowSin = await dss.vat.sin(dss.vow.address);
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await snDss.vat.surf();
    // hostDomain.selectFork();

    // assertEq(host.ddai(), 0);
    // TODO: uncomment when latest dss-bridge changes have been applied
    // expect(await host.ddai()).toEqual(0n);

    // Set global DC and add 50 DAI surplus + 20 DAI debt to vow
    // hostLift(100 ether);
    await host.lift(_100_ETH);
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await dss.dai.balanceOf(escrow.address);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();
    // rdss.vat.suck(address(123), address(guest), 50 * RAD);
    await snDss.vat.suck(123n, guest.address, 50n * RAD);
    // rdss.vat.suck(address(guest), address(123), 20 * RAD);
    await snDss.vat.suck(guest.address, 123n, 20n * RAD);

    // assertEq(rdss.vat.dai(address(guest)), 50 * RAD);
    expect(await snDss.vat.dai(guest.address)).toEqual(50n * RAD);
    // assertEq(rdss.vat.sin(address(guest)), 20 * RAD);
    expect(await snDss.vat.sin(guest.address)).toEqual(20n * RAD);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf);
    expect(await snDss.vat.surf()).toEqual(existingSurf);

    // guestSurplus();
    await guest.surplus();
    // assertEq(rdss.vat.dai(address(guest)), 20 * RAD);
    expect(await snDss.vat.dai(guest.address)).toEqual(20n * RAD);
    // assertEq(rdss.vat.sin(address(guest)), 20 * RAD);
    expect(await snDss.vat.sin(guest.address)).toEqual(20n * RAD);
    // guest.heal();
    // TODO: uncomment when latest dss-bridge changes have been applied
    // await guest.heal();
    // assertEq(rdss.vat.dai(address(guest)), 0);
    expect(await snDss.vat.dai(guest.address)).toEqual(0n);
    // assertEq(rdss.vat.sin(address(guest)), 0);
    expect(await snDss.vat.sin(guest.address)).toEqual(0n);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf - int256(30 * RAD));
    expect(await snDss.vat.surf()).toEqual(existingSurf - 30n * RAD);
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();

    // assertEq(dss.vat.dai(address(dss.vow)), vowDai);
    expect(await dss.vat.dai(dss.vow.address)).toEqual(vowDai);
    // assertEq(dss.vat.sin(address(dss.vow)), vowSin);
    expect(await dss.vat.sin(dss.vow.address)).toEqual(vowSin);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(escrowDai);

    // assertEq(host.ddai(), 30 ether);
    // TODO: uncomment when latest dss-bridge changes have been applied
    // expect(await host.ddai()).toEqual(30n * ETH);

    // host.accrue(0);
    // TODO: uncomment when latest dss-bridge changes have been applied
    await host.accrue(0n);

    // assertEq(dss.vat.dai(address(dss.vow)), vowDai + 30 * RAD);
    expect(await dss.vat.dai(dss.vow.address)).toEqual(vowDai + 30n * RAD);
    // assertEq(dss.vat.sin(address(dss.vow)), vowSin);
    expect(await dss.vat.sin(dss.vow.address)).toEqual(vowSin);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai - 30 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai - _30_ETH
    );
  });

  it("test push deficit", async function () {
    // uint256 escrowDai = dss.dai.balanceOf(escrow);
    const escrowDai = await dss.dai.balanceOf(escrow.address);
    // uint256 vowDai = dss.vat.dai(address(dss.vow));
    const vowDai = await dss.vat.dai(dss.vow.address);
    // uint256 vowSin = dss.vat.sin(address(dss.vow));
    const vowSin = await dss.vat.sin(dss.vow.address);
    // guestDomain.selectFork();
    // int256 existingSurf = Vat(address(rdss.vat)).surf();
    const existingSurf = await snDss.vat.surf();
    // hostDomain.selectFork();

    // Set global DC and add 20 DAI surplus + 50 DAI debt to vow
    // hostLift(100 ether);
    await host.lift(_100_ETH);
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();

    // rdss.vat.suck(address(123), address(guest), 20 * RAD);
    await snDss.vat.suck(123n, guest.address, 20n * RAD);
    // rdss.vat.suck(address(guest), address(123), 50 * RAD);
    await snDss.vat.suck(guest.address, 123n, 50n * RAD);

    // assertEq(rdss.vat.dai(address(guest)), 20 * RAD);
    expect(await snDss.vat.dai(guest.address)).toEqual(20n * RAD);
    // assertEq(rdss.vat.sin(address(guest)), 50 * RAD);
    expect(await snDss.vat.sin(guest.address)).toEqual(50n * RAD);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf);
    expect(await snDss.vat.surf()).toEqual(existingSurf);

    // guestDeficit();
    await guest.deficit();
    // guestDomain.relayToHost(true);
    await starknet.devnet.flush();

    // guestDomain.selectFork();
    // assertEq(rdss.vat.dai(address(guest)), 20 * RAD);
    expect(await snDss.vat.dai(guest.address)).toEqual(20n * RAD);
    // assertEq(rdss.vat.sin(address(guest)), 50 * RAD);
    expect(await snDss.vat.sin(guest.address)).toEqual(50n * RAD);
    // guest.heal();
    // await guest.heal();
    // assertEq(rdss.vat.dai(address(guest)), 0);
    expect(await snDss.vat.dai(guest.address)).toEqual(0n);
    // assertEq(rdss.vat.sin(address(guest)), 30 * RAD);
    expect(await snDss.vat.sin(guest.address)).toEqual(30n * RAD);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf);
    expect(await snDss.vat.surf()).toEqual(existingSurf);
    // hostDomain.selectFork();

    // hostRectify();
    await host.rectify();
    // assertEq(dss.vat.dai(address(dss.vow)), vowDai);
    expect(await dss.vat.dai(dss.vow.address)).toEqual(vowDai);
    // assertEq(dss.vat.sin(address(dss.vow)), vowSin + 30 * RAD);
    expect(await dss.vat.sin(dss.vow.address)).toEqual(vowSin + 30n * RAD);
    // assertEq(dss.dai.balanceOf(escrow), escrowDai + 130 ether);
    expect(await dss.dai.balanceOf(escrow.address)).toEqual(
      escrowDai + _100_ETH + _30_ETH
    );
    // guestDomain.relayFromHost(true);
    await starknet.devnet.flush();

    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(30 * RAD));
    expect(await snDss.vat.surf()).toEqual(existingSurf + 30n * RAD);
    // assertEq(rdss.vat.dai(address(guest)), 30 * RAD);
    expect(await snDss.vat.dai(guest.address)).toEqual(30n * RAD);

    // guest.heal();
    // await guest.heal();

    // assertEq(rdss.vat.dai(address(guest)), 0);
    expect(await snDss.vat.dai(guest.address)).toEqual(0n);
    // assertEq(rdss.vat.sin(address(guest)), 0);
    expect(await snDss.vat.sin(guest.address)).toEqual(0n);
    // assertEq(Vat(address(rdss.vat)).surf(), existingSurf + int256(30 * RAD));
    expect(await snDss.vat.surf()).toEqual(existingSurf + 30n * RAD);
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
      sourceDomain: l2String(rdomain),
      targetDomain: l2String(domain),
      receiver: l2String("0x0"),
      operator: l2String("0x0"),
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
