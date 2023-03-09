// import daiAbi from "../abis/dai_abi_simple";
import { TransactionReceipt } from "hardhat/types/runtime";

import { Abi } from "./abi";

type Functions<C extends Abi> = Extract<C[number], { type: "function" }>;

type Structs<C extends Abi> = Extract<C[number], { type: "struct" }>;

type Param<N extends string, T> = {
  name: N;
  type: T;
};

type MapInputType<C extends Abi, T> = T extends "felt"
  ? bigint | string
  : T extends "Uint256"
  ? bigint | string
  : T extends Structs<C>["name"]
  ? Struct<C, T>
  : never

type MapOutputType<C extends Abi, T> = T extends "felt"
  ? bigint
  : T extends "Uint256"
  ? bigint
  : T extends Structs<C>["name"]
  ? Struct<C, T>
  : never;

// type MapInputParams<T> = T extends [infer P, ...infer R]
//   ? P extends Param<infer N, infer T>
// // named tuples does not work in ts as expected(yet?)
// //     ? [MapInputType<T>, MapParams<R>]
//     ? [N: T, ...rest: MapInputType<R>]
//     : never
//   : [];

// Another mapper idea(typing problems)
type MapInputParams<C extends Abi, T> = {
  [K in keyof T]: T[K] extends Param<infer _, infer M>
    ? MapInputType<C, M>
    : never;
};

type MapOutputParams<C extends Abi, T> = {
  [K in keyof T]: T[K] extends Param<infer _, infer M>
    ? MapOutputType<C, M>
    : never;
};

type FlattenIfSingle<T> = T extends readonly [infer A, ...infer R]
  ? R extends []
    ? A
    : T
  : never;

type Struct<C extends Abi, N> = {
  [M in Extract<Structs<C>, {name: N}>["members"][number] as M["name"]]:
  MapInputType<C, M["type"]>
};

export type Contract<C extends Abi> = {
  [F in Functions<C> as F["name"]]: F["stateMutability"] extends "view"
    ? (
        ...args: MapInputParams<C, F["inputs"]>
      ) => Promise<FlattenIfSingle<MapOutputParams<C, F["outputs"]>>>
    : (...args: MapInputParams<C, F["inputs"]>) => Promise<TransactionReceipt>;
};
