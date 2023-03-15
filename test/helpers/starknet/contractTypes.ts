// import daiAbi from "../abis/dai_abi_simple";
import { TransactionReceipt } from "hardhat/types/runtime";

import { Abi } from "./abi";

type Functions<C extends Abi> = Extract<C[number], { type: "function" }>;

type Structs<C extends Abi> = Extract<C[number], { type: "struct" }>;

type Struct<C extends Abi, N> = Extract<Structs<C>, { name: N }>;

type Param<N extends string, T> = {
  name: N;
  type: T;
};

type InputStruct<C extends Abi, N> = {
  // eslint-disable-next-line no-use-before-define
  [M in Struct<C, N>["members"][number] as M["name"]]: MapInputType<
    C,
    M["type"]
  >;
};

type OutputStruct<C extends Abi, N> = {
  // eslint-disable-next-line no-use-before-define
  [M in Struct<C, N>["members"][number] as M["name"]]: MapOutputType<
    C,
    M["type"]
  >;
};

type ArrayPointer<T extends string> = `${T}*`;

type MapInputType<C extends Abi, T> = T extends "felt"
  ? bigint | string
  : T extends "Uint256"
  ? bigint | string
  : T extends Structs<C>["name"]
  ? InputStruct<C, T>
  : T extends ArrayPointer<infer A>
  ? InputStruct<C, A>[]
  : never;

type MapOutputType<C extends Abi, T> = T extends "felt"
  ? bigint
  : T extends "Uint256"
  ? bigint
  : T extends Structs<C>["name"]
  ? OutputStruct<C, T>
  : never;

// type MapInputParams<T> = T extends [infer P, ...infer R]
//   ? P extends Param<infer N, infer T>
// // named tuples does not work in ts as expected(yet?)
// //     ? [MapInputType<T>, MapParams<R>]
//     ? [N: T, ...rest: MapInputType<R>]
//     : never
//   : [];

type ArrayLen<T extends string> = `${T}_len`;
type RemoveReadonly<A> = A extends readonly [...infer I] ? [...I] : A;

type FixArrays<T> = RemoveReadonly<T> extends [infer P, ...infer R]
  ? P extends Param<infer N, infer _>
    ? N extends ArrayLen<infer _>
      ? FixArrays<R>
      : [P, ...FixArrays<R>]
    : never
  : [];

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

export type Contract<C extends Abi> = {
  [F in Functions<C> as F["name"]]: F["stateMutability"] extends "view"
    ? (
        ...args: MapInputParams<C, FixArrays<F["inputs"]>>
      ) => Promise<FlattenIfSingle<MapOutputParams<C, F["outputs"]>>>
    : (
        ...args: MapInputParams<C, FixArrays<F["inputs"]>>
      ) => Promise<TransactionReceipt>;
};
