import hre from "hardhat";

export async function setup() {
  console.log("setup");
  console.log("hre.starknet.network", hre.starknet.network);
  return {
    a: 1,
    b: "abc",
  };
}
