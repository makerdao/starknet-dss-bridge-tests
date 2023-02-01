export const vatAbi = [
  {
    members: [
      {
        name: "Art",
        offset: 0,
        type: "Uint256",
      },
      {
        name: "rate",
        offset: 2,
        type: "Uint256",
      },
      {
        name: "spot",
        offset: 4,
        type: "Uint256",
      },
      {
        name: "line",
        offset: 6,
        type: "Uint256",
      },
      {
        name: "dust",
        offset: 8,
        type: "Uint256",
      },
    ],
    name: "Ilk",
    size: 10,
    type: "struct",
  },
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
        name: "ink",
        offset: 0,
        type: "Uint256",
      },
      {
        name: "art",
        offset: 2,
        type: "Uint256",
      },
    ],
    name: "Urn",
    size: 4,
    type: "struct",
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
    inputs: [
      {
        name: "b",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "can",
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
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "urns",
    outputs: [
      {
        name: "urn",
        type: "Urn",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "dai",
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
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "gem",
    outputs: [
      {
        name: "gem",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "sin",
    outputs: [
      {
        name: "sin",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "debt",
    outputs: [
      {
        name: "debt",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "surf",
    outputs: [
      {
        name: "surf",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vice",
    outputs: [
      {
        name: "vice",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Line",
    outputs: [
      {
        name: "Line",
        type: "Uint256",
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
        name: "live",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    data: [
      {
        name: "user",
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
        name: "user",
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
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
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
    name: "File_ilk",
    type: "event",
  },
  {
    data: [],
    keys: [],
    name: "Cage",
    type: "event",
  },
  {
    data: [
      {
        name: "from_",
        type: "felt",
      },
      {
        name: "to",
        type: "felt",
      },
    ],
    keys: [],
    name: "Hope",
    type: "event",
  },
  {
    data: [
      {
        name: "from_",
        type: "felt",
      },
      {
        name: "to",
        type: "felt",
      },
    ],
    keys: [],
    name: "Nope",
    type: "event",
  },
  {
    data: [
      {
        name: "ilk",
        type: "felt",
      },
      {
        name: "user",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Slip",
    type: "event",
  },
  {
    data: [
      {
        name: "ilk",
        type: "felt",
      },
      {
        name: "src",
        type: "felt",
      },
      {
        name: "dst",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Flux",
    type: "event",
  },
  {
    data: [
      {
        name: "src",
        type: "felt",
      },
      {
        name: "dst",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Move",
    type: "event",
  },
  {
    data: [
      {
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
      {
        name: "v",
        type: "felt",
      },
      {
        name: "w",
        type: "felt",
      },
      {
        name: "dink",
        type: "Uint256",
      },
      {
        name: "dart",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Frob",
    type: "event",
  },
  {
    data: [
      {
        name: "ilk",
        type: "felt",
      },
      {
        name: "src",
        type: "felt",
      },
      {
        name: "dst",
        type: "felt",
      },
      {
        name: "dink",
        type: "Uint256",
      },
      {
        name: "dart",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Fork",
    type: "event",
  },
  {
    data: [
      {
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
      {
        name: "v",
        type: "felt",
      },
      {
        name: "w",
        type: "felt",
      },
      {
        name: "dink",
        type: "Uint256",
      },
      {
        name: "dart",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Grab",
    type: "event",
  },
  {
    data: [
      {
        name: "u",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Heal",
    type: "event",
  },
  {
    data: [
      {
        name: "u",
        type: "felt",
      },
      {
        name: "v",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Suck",
    type: "event",
  },
  {
    data: [
      {
        name: "u",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Swell",
    type: "event",
  },
  {
    data: [
      {
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
      {
        name: "rate",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Fold",
    type: "event",
  },
  {
    inputs: [
      {
        name: "bit",
        type: "felt",
      },
      {
        name: "user",
        type: "felt",
      },
    ],
    name: "wish",
    outputs: [
      {
        name: "res",
        type: "felt",
      },
    ],
    type: "function",
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
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
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
      {
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
      },
    ],
    name: "file_ilk",
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
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "ink",
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
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
    ],
    name: "art",
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
        name: "user",
        type: "felt",
      },
    ],
    name: "hope",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "user",
        type: "felt",
      },
    ],
    name: "nope",
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
        name: "usr",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    name: "slip",
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
        name: "src",
        type: "felt",
      },
      {
        name: "dst",
        type: "felt",
      },
      {
        name: "wad",
        type: "Uint256",
      },
    ],
    name: "flux",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "src",
        type: "felt",
      },
      {
        name: "dst",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    name: "move",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
      {
        name: "v",
        type: "felt",
      },
      {
        name: "w",
        type: "felt",
      },
      {
        name: "dink",
        type: "Uint256",
      },
      {
        name: "dart",
        type: "Uint256",
      },
    ],
    name: "frob",
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
        name: "src",
        type: "felt",
      },
      {
        name: "dst",
        type: "felt",
      },
      {
        name: "dink",
        type: "Uint256",
      },
      {
        name: "dart",
        type: "Uint256",
      },
    ],
    name: "fork",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
      {
        name: "v",
        type: "felt",
      },
      {
        name: "w",
        type: "felt",
      },
      {
        name: "dink",
        type: "Uint256",
      },
      {
        name: "dart",
        type: "Uint256",
      },
    ],
    name: "grab",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    name: "heal",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "u",
        type: "felt",
      },
      {
        name: "v",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    name: "suck",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "u",
        type: "felt",
      },
      {
        name: "rad",
        type: "Uint256",
      },
    ],
    name: "swell",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "i",
        type: "felt",
      },
      {
        name: "u",
        type: "felt",
      },
      {
        name: "rate",
        type: "Uint256",
      },
    ],
    name: "fold",
    outputs: [],
    type: "function",
  },
] as const;
