export const jugAbi = [
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
    members: [
      {
        name: "duty",
        offset: 0,
        type: "Uint256",
      },
      {
        name: "rho",
        offset: 2,
        type: "felt",
      },
    ],
    name: "Ilk",
    size: 3,
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
        name: "ilk",
        type: "felt",
      },
    ],
    keys: [],
    name: "Init",
    type: "event",
  },
  {
    data: [
      {
        name: "ilk",
        type: "felt",
      },
      {
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "File_duty",
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
        type: "Uint256",
      },
    ],
    keys: [],
    name: "File_base",
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
        name: "ilk",
        type: "felt",
      },
    ],
    keys: [],
    name: "Drip",
    type: "event",
  },
  {
    inputs: [
      {
        name: "i",
        type: "felt",
      },
    ],
    name: "ilks",
    outputs: [
      {
        name: "ilk",
        type: "Ilk",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    name: "vow",
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
    name: "base",
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
        name: "vat_",
        type: "felt",
      },
      {
        name: "ward_",
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
        name: "ilk",
        type: "felt",
      },
    ],
    name: "init",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "ilk",
        type: "felt",
      },
      {
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
      },
    ],
    name: "file_duty",
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
        type: "Uint256",
      },
    ],
    name: "file_base",
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
        name: "ilk",
        type: "felt",
      },
    ],
    name: "drip",
    outputs: [
      {
        name: "rate",
        type: "Uint256",
      },
    ],
    type: "function",
  },
] as const;
