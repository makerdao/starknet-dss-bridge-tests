import { Address, GetContractResult } from "@wagmi/core";
import teleportJoinAbi from "./abi/teleportJoinAbi";
import teleportRouterAbi from "./abi/teleportRouterAbi";
import teleportOracleAuthAbi from "./abi/teleportOracleAuthAbi";
import hre from "hardhat";
import { Dai, Vat, DaiJoin } from "../dss/dss";
import { expect } from "earljs";

export type TeleportJoin = GetContractResult<typeof teleportJoinAbi>;
export type TeleportRouter = GetContractResult<typeof teleportRouterAbi>;
export type TeleportOracleAuth = GetContractResult<
  typeof teleportOracleAuthAbi
>;

async function deployTeleportJoin(
  vat: Address,
  daiJoin: Address,
  ilk: string,
  domain: string
): Promise<TeleportJoin> {
  const contractFactory = await hre.ethers.getContractFactory("TeleportJoin");
  const contract = await contractFactory.deploy(vat, daiJoin, ilk, domain);
  await contract.deployed();

  // TODO: code below does not work due to some obscure ts importing problems
  // return getContract({
  //   address: await contract.address,
  //   abi: dssTeleportJoinAbi,
  //   signerOrProvider: signerOrProvider,
  // });

  return contract as TeleportJoin;
}

async function deployTeleportRouter(
  dai: Address,
  domain: string,
  parentDomain: string
): Promise<TeleportRouter> {
  const contractFactory = await hre.ethers.getContractFactory("TeleportRouter");
  const contract = await contractFactory.deploy(dai, domain, parentDomain);
  await contract.deployed();
  return contract as TeleportRouter;
}

async function deployTeleportOracleAuth(
  daiJoin: Address
): Promise<TeleportOracleAuth> {
  const contractFactory = await hre.ethers.getContractFactory(
    "TeleportOracleAuth"
  );
  const contract = await contractFactory.deploy(daiJoin);
  await contract.deployed();
  return contract as TeleportOracleAuth;
}

interface TeleportInstance {
  join: TeleportJoin;
  router: TeleportRouter;
  oracleAuth: TeleportOracleAuth;
}

export async function deploy(
  deployer: Address,
  owner: Address,
  ilk: string,
  domain: string,
  parentDomain: string,
  daiJoin: DaiJoin
): Promise<TeleportInstance> {
  const teleport: TeleportInstance = {
    join: await deployTeleportJoin(
      await daiJoin.vat(),
      daiJoin.address,
      ilk,
      domain
    ),
    router: await deployTeleportRouter(
      await daiJoin.dai(),
      domain,
      parentDomain
    ),
    oracleAuth: await deployTeleportOracleAuth(daiJoin.address),
  };
  expect(await teleport.join.wards(deployer)).toBeTruthy();
  teleport.join.rely(owner);
  teleport.join.deny(deployer);

  expect(await teleport.router.wards(deployer)).toBeTruthy();
  teleport.router.rely(owner);
  teleport.router.deny(deployer);

  expect(await teleport.oracleAuth.wards(deployer)).toBeTruthy();
  teleport.oracleAuth.rely(owner);
  teleport.oracleAuth.deny(deployer);

  return teleport;
}

// struct TeleportInstance {
//     TeleportJoin join;
//     TeleportRouter router;
//     TeleportOracleAuth oracleAuth;
// }

// struct DssTeleportConfig {
//     uint256 debtCeiling;    // RAD
//     uint256 oracleThreshold;
//     address[] oracleSigners;
// }

// struct DssTeleportDomainConfig {
//     bytes32 domain;
//     address fees;
//     address gateway;
//     uint256 debtCeiling;    // WAD
// }

// // Tools for deploying and setting up a dss-teleport instance
// library DssTeleport {

//     function switchOwner(address base, address deployer, address newOwner) internal {
//         require(WardsAbstract(base).wards(deployer) == 1, "deployer-not-authed");
//         WardsAbstract(base).rely(newOwner);
//         WardsAbstract(base).deny(deployer);
//     }

//     function deploy(
//         address deployer,
//         address owner,
//         bytes32 ilk,
//         bytes32 domain,
//         bytes32 parentDomain,
//         address daiJoin
//     ) internal returns (TeleportInstance memory teleport) {
//         teleport.join = new TeleportJoin(
//             DaiJoinAbstract(daiJoin).vat(),
//             daiJoin,
//             ilk,
//             domain
//         );
//         teleport.router = new TeleportRouter(
//             DaiJoinAbstract(daiJoin).dai(),
//             domain,
//             parentDomain
//         );
//         teleport.oracleAuth = new TeleportOracleAuth(address(teleport.join));

//         switchOwner(address(teleport.join), deployer, owner);
//         switchOwner(address(teleport.router), deployer, owner);
//         switchOwner(address(teleport.oracleAuth), deployer, owner);
//     }

//     function deployLinearFee(
//         uint256 fee,
//         uint256 ttl
//     ) internal returns (TeleportFees) {
//         return new TeleportLinearFee(fee, ttl);
//     }

//     function init(
//         DssInstance memory dss,
//         TeleportInstance memory teleport,
//         DssTeleportConfig memory cfg
//     ) internal {
//         bytes32 ilk = teleport.join.ilk();
//         dss.vat.init(ilk);
//         dss.jug.init(ilk);
//         dss.vat.file(ilk, "line", cfg.debtCeiling);
//         //dss.vat.file("Line", dss.vat.Line() + cfg.debtCeiling);
//         dss.vat.file(ilk, "spot", 10 ** 27);
//         dss.cure.lift(address(teleport.join));
//         dss.vat.rely(address(teleport.join));
//         teleport.join.rely(address(teleport.oracleAuth));
//         teleport.join.rely(address(teleport.router));
//         //teleport.join.rely(esm);
//         teleport.join.file("vow", address(dss.vow));
//         //teleport.oracleAuth.rely(esm);
//         teleport.oracleAuth.file("threshold", cfg.oracleThreshold);
//         teleport.oracleAuth.addSigners(cfg.oracleSigners);
//         //teleport.router.rely(esm);
//         teleport.router.file("gateway", teleport.join.domain(), address(teleport.join));
//     }

//     function initDomain(
//         TeleportInstance memory teleport,
//         DssTeleportDomainConfig memory cfg
//     ) internal {
//         teleport.join.file("fees", cfg.domain, cfg.fees);
//         teleport.join.file("line", cfg.domain, cfg.debtCeiling);
//         teleport.router.file("gateway", cfg.domain, cfg.gateway);
//     }
