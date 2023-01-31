export default [
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
        name: "source_domain",
        offset: 0,
        type: "felt",
      },
      {
        name: "target_domain",
        offset: 1,
        type: "felt",
      },
      {
        name: "receiver",
        offset: 2,
        type: "felt",
      },
      {
        name: "operator",
        offset: 3,
        type: "felt",
      },
      {
        name: "amount",
        offset: 4,
        type: "Uint256",
      },
      {
        name: "nonce",
        offset: 6,
        type: "felt",
      },
      {
        name: "timestamp",
        offset: 7,
        type: "felt",
      },
    ],
    name: "TeleportGUID",
    size: 8,
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
        type: "Uint256",
      },
    ],
    keys: [],
    name: "File_fdust",
    type: "event",
  },
  {
    data: [
      {
        name: "what",
        type: "felt",
      },
      {
        name: "domain",
        type: "felt",
      },
      {
        name: "data",
        type: "felt",
      },
    ],
    keys: [],
    name: "File_gateway",
    type: "event",
  },
  {
    data: [
      {
        name: "teleport",
        type: "TeleportGUID",
      },
    ],
    keys: [],
    name: "InitiateTeleport",
    type: "event",
  },
  {
    data: [
      {
        name: "target_domain",
        type: "felt",
      },
      {
        name: "dai",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Flush",
    type: "event",
  },
  {
    inputs: [
      {
        name: "ward",
        type: "felt",
      },
      {
        name: "dai",
        type: "felt",
      },
      {
        name: "domain",
        type: "felt",
      },
      {
        name: "parent_domain",
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
        name: "what",
        type: "felt",
      },
      {
        name: "domain",
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
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
      },
    ],
    name: "file_fdust",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "numDomains",
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
    name: "domainAt",
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
        name: "domain",
        type: "felt",
      },
    ],
    name: "hasDomain",
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
    inputs: [],
    name: "nonce",
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
    name: "fdust",
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
    name: "parentDomain",
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
    name: "domain",
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
        name: "domain",
        type: "felt",
      },
    ],
    name: "gateways",
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
        name: "domain",
        type: "felt",
      },
    ],
    name: "batches",
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
        name: "teleportGUID",
        type: "TeleportGUID",
      },
    ],
    name: "registerMint",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "source_domain",
        type: "felt",
      },
      {
        name: "target_domain",
        type: "felt",
      },
      {
        name: "amount",
        type: "Uint256",
      },
    ],
    name: "settle",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "target_domain",
        type: "felt",
      },
      {
        name: "receiver",
        type: "felt",
      },
      {
        name: "amount",
        type: "felt",
      },
      {
        name: "operator",
        type: "felt",
      },
    ],
    name: "initiateTeleport",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "target_domain",
        type: "felt",
      },
    ],
    name: "flush",
    outputs: [],
    type: "function",
  },
] as const;
