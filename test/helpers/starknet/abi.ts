type StateMutability = "view" | "external";

export type AbiParameter = {
  type: string;
  name: string;
};

export type AbiFunction = {
  name: string;
  inputs: readonly AbiParameter[];
  outputs: readonly AbiParameter[];
} & (
  | { type: "function"; stateMutability?: StateMutability }
  | { type: "constructor" }
  | { type: "l1_handler" }
);

export type AbiMember = {
  name: string;
  offset: number;
  type: string;
};

export type AbiStruct = {
  type: "struct";
  name: string;
  size: number;
  members: readonly AbiMember[];
};

export type AbiEvent = {
  type: "event";
  name: string;
  keys: readonly [];
  data: readonly AbiParameter[];
};

export type Abi = readonly (AbiFunction | AbiStruct | AbiEvent)[];
