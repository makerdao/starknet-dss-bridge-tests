export default [
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
        name: "pk",
        offset: 0,
        type: "felt",
      },
      {
        name: "r",
        offset: 1,
        type: "felt",
      },
      {
        name: "s",
        offset: 2,
        type: "felt",
      },
    ],
    name: "Signature",
    size: 3,
    type: "struct",
  },
  {
    inputs: [
      {
        name: "usr",
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
        name: "address",
        type: "felt",
      },
    ],
    name: "signers",
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
    name: "teleport_join",
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
    name: "threshold",
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
        name: "signers_len",
        type: "felt",
      },
      {
        name: "signers",
        type: "felt*",
      },
    ],
    keys: [],
    name: "SignersAdded",
    type: "event",
  },
  {
    data: [
      {
        name: "signers_len",
        type: "felt",
      },
      {
        name: "signers",
        type: "felt*",
      },
    ],
    keys: [],
    name: "SignersRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        name: "ward",
        type: "felt",
      },
      {
        name: "teleport_join_",
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
        name: "signers__len",
        type: "felt",
      },
      {
        name: "signers_",
        type: "felt*",
      },
    ],
    name: "add_signers",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "signers__len",
        type: "felt",
      },
      {
        name: "signers_",
        type: "felt*",
      },
    ],
    name: "remove_signers",
    outputs: [],
    type: "function",
  },
  {
    inputs: [
      {
        name: "teleport_GUID",
        type: "TeleportGUID",
      },
      {
        name: "signatures_len",
        type: "felt",
      },
      {
        name: "signatures",
        type: "Signature*",
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
    name: "request_mint",
    outputs: [
      {
        name: "post_fee_amount",
        type: "Uint256",
      },
      {
        name: "operator_fee",
        type: "Uint256",
      },
    ],
    type: "function",
  },
  {
    inputs: [
      {
        name: "message",
        type: "felt",
      },
      {
        name: "signatures_len",
        type: "felt",
      },
      {
        name: "signatures",
        type: "Signature*",
      },
      {
        name: "threshold_",
        type: "felt",
      },
      {
        name: "previous",
        type: "felt",
      },
    ],
    name: "validate",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
] as const;
