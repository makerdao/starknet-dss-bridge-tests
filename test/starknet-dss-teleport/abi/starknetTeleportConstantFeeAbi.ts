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
    inputs: [
      {
        name: "fee_",
        type: "Uint256",
      },
      {
        name: "ttl_",
        type: "felt",
      },
    ],
    name: "constructor",
    outputs: [],
    type: "constructor",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [
      {
        name: "fee",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ttl",
    outputs: [
      {
        name: "ttl",
        type: "felt",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "guid",
        type: "TeleportGUID",
      },
      {
        name: "line",
        type: "Uint256",
      },
      {
        name: "debt",
        type: "Uint256",
      },
      {
        name: "pending",
        type: "Uint256",
      },
      {
        name: "amtToTake",
        type: "Uint256",
      },
    ],
    name: "getFee",
    outputs: [
      {
        name: "fees",
        type: "Uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
