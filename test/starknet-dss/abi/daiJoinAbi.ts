export const daiJoinAbi = [
  {
    members: [
      {
        name: "low",
        offset: 0,
        type: "felt",
      },
      {
        name: "high",
        offset: 1,
        type: "felt",
      },
    ],
    name: "Uint256",
    size: 2,
    type: "struct",
  },
  {
    data: [
      {
        name: "usr",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Join",
    type: "event",
  },
  {
    data: [
      {
        name: "usr",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Exit",
    type: "event",
  },
  {
    inputs: [],
    name: "vat",
    outputs: [
      {
        name: "res",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dai",
    outputs: [
      {
        name: "res",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "vat",
        type: "felt",
      },
      {
        name: "dai",
        type: "felt",
      },
    ],
    name: "constructor",
    outputs: [],
    type: "constructor",
  },
  {
    inputs: [
      {
        name: "usr",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    name: "join",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "usr",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    name: "exit",
    outputs: [],
    type: "function",
  },
] as const;
