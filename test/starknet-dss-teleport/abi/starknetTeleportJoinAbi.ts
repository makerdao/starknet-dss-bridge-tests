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
    members: [
      {
        name: "blessed",
        offset: 0,
        type: "felt",
      },
      {
        name: "pending",
        offset: 1,
        type: "Uint256",
      },
    ],
    name: "TeleportStatus",
    size: 3,
    type: "struct",
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
        name: "what",
        type: "felt",
      },
      {
        name: "data",
        type: "felt",
      },
    ],
    keys: [],
    name: "File_vow",
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
    name: "File_fees",
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
        type: "Uint256",
      },
    ],
    keys: [],
    name: "File_line",
    type: "event",
  },
  {
    data: [
      {
        name: "hashGUID",
        type: "felt",
      },
      {
        name: "teleportGUID",
        type: "TeleportGUID",
      },
    ],
    keys: [],
    name: "Register",
    type: "event",
  },
  {
    data: [
      {
        name: "hashGUID",
        type: "felt",
      },
      {
        name: "teleportGUID",
        type: "TeleportGUID",
      },
      {
        name: "amount",
        type: "Uint256",
      },
      {
        name: "max_fee_percentage",
        type: "Uint256",
      },
      {
        name: "operator_fee",
        type: "Uint256",
      },
      {
        name: "originator",
        type: "felt",
      },
    ],
    keys: [],
    name: "Mint",
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
    data: [
      {
        name: "source_domain",
        type: "felt",
      },
      {
        name: "amount",
        type: "Uint256",
      },
    ],
    keys: [],
    name: "Settle",
    type: "event",
  },
  {
    inputs: [
      {
        name: "ward",
        type: "felt",
      },
      {
        name: "vat_",
        type: "felt",
      },
      {
        name: "daiJoin_",
        type: "felt",
      },
      {
        name: "ilk_",
        type: "felt",
      },
      {
        name: "domain_",
        type: "felt",
      },
    ],
    name: "constructor",
    outputs: [],
    type: "constructor",
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
    inputs: [
      {
        name: "d",
        type: "felt",
      },
    ],
    name: "debt",
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
        name: "d",
        type: "felt",
      },
    ],
    name: "line",
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
    name: "daiJoin",
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
    name: "ilk",
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
        name: "hash",
        type: "felt",
      },
    ],
    name: "teleports",
    outputs: [
      {
        name: "res",
        type: "TeleportStatus",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "d",
        type: "felt",
      },
    ],
    name: "fees",
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
    name: "file_vow",
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
        name: "domain_",
        type: "felt",
      },
      {
        name: "data",
        type: "felt",
      },
    ],
    name: "file_fees",
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
        name: "domain_",
        type: "felt",
      },
      {
        name: "data",
        type: "Uint256",
      },
    ],
    name: "file_line",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "cure",
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
        name: "teleportGUID",
        type: "TeleportGUID",
      },
      {
        name: "max_fee_percentage",
        type: "Uint256",
      },
      {
        name: "operator_fee",
        type: "Uint256",
      },
    ],
    name: "requestMint",
    outputs: [
      {
        name: "post_fee_amount",
        type: "Uint256",
      },
      {
        name: "total_fee",
        type: "Uint256",
      },
    ],
    type: "function",
  },
  {
    inputs: [
      {
        name: "teleportGUID",
        type: "TeleportGUID",
      },
      {
        name: "max_fee_percentage",
        type: "Uint256",
      },
      {
        name: "operator_fee",
        type: "Uint256",
      },
    ],
    name: "mintPending",
    outputs: [
      {
        name: "post_fee_amount",
        type: "Uint256",
      },
      {
        name: "total_fee",
        type: "Uint256",
      },
    ],
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
] as const;
