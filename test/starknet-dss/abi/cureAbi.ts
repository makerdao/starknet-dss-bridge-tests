export const cureAbi = [
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
    ],
    keys: [],
    name: "Rely",
    type: "event",
  },
  {
    data: [
      {
        name: "usr",
        type: "felt",
      },
    ],
    keys: [],
    name: "Deny",
    type: "event",
  },
  {
    data: [
      {
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "felt",
      },
    ],
    keys: [],
    name: "File",
    type: "event",
  },
  {
    data: [
      {
        name: "src",
        type: "felt",
      },
    ],
    keys: [],
    name: "Lift",
    type: "event",
  },
  {
    data: [
      {
        name: "src",
        type: "felt",
      },
    ],
    keys: [],
    name: "Drop",
    type: "event",
  },
  {
    data: [
      {
        name: "src",
        type: "felt",
      },
    ],
    keys: [],
    name: "Load",
    type: "event",
  },
  {
    data: [],
    keys: [],
    name: "Cage",
    type: "event",
  },
  {
    inputs: [
      {
        name: "ward",
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
        name: "user",
        type: "felt",
      },
    ],
    name: "wards",
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
    name: "tCount",
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
    name: "lCount",
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
        name: "index",
        type: "felt",
      },
    ],
    name: "srcs",
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
        name: "src",
        type: "felt",
      },
    ],
    name: "pos",
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
    name: "live",
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
    name: "say",
    outputs: [
      {
        name: "res",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wait",
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
    name: "list",
    outputs: [
      {
        name: "arr_len",
        type: "felt",
      },
      {
        name: "arr",
        type: "felt*",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tell",
    outputs: [
      {
        name: "res",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "usr",
        type: "felt",
      },
    ],
    name: "rely",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "usr",
        type: "felt",
      },
    ],
    name: "deny",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "felt",
      },
    ],
    name: "file",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "src",
        type: "felt",
      },
    ],
    name: "lift",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "src",
        type: "felt",
      },
    ],
    name: "drop",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "cage",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "src",
        type: "felt",
      },
    ],
    name: "load",
    outputs: [],
    type: "function",
  },
] as const;
