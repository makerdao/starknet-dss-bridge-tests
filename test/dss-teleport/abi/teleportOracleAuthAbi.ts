export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "teleportJoin_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "usr",
        type: "address",
      },
    ],
    name: "Deny",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "data",
        type: "uint256",
      },
    ],
    name: "File",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "usr",
        type: "address",
      },
    ],
    name: "Rely",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "signers",
        type: "address[]",
      },
    ],
    name: "SignersAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "signers",
        type: "address[]",
      },
    ],
    name: "SignersRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers_",
        type: "address[]",
      },
    ],
    name: "addSigners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
    ],
    name: "deny",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "data",
        type: "uint256",
      },
    ],
    name: "file",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "sourceDomain",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "targetDomain",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "receiver",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "operator",
            type: "bytes32",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
          {
            internalType: "uint80",
            name: "nonce",
            type: "uint80",
          },
          {
            internalType: "uint48",
            name: "timestamp",
            type: "uint48",
          },
        ],
        internalType: "struct TeleportGUID",
        name: "teleportGUID",
        type: "tuple",
      },
    ],
    name: "getSignHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "signHash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "signHash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signatures",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "threshold_",
        type: "uint256",
      },
    ],
    name: "isValid",
    outputs: [
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
    ],
    name: "rely",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers_",
        type: "address[]",
      },
    ],
    name: "removeSigners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "sourceDomain",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "targetDomain",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "receiver",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "operator",
            type: "bytes32",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
          {
            internalType: "uint80",
            name: "nonce",
            type: "uint80",
          },
          {
            internalType: "uint48",
            name: "timestamp",
            type: "uint48",
          },
        ],
        internalType: "struct TeleportGUID",
        name: "teleportGUID",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signatures",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "maxFeePercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "operatorFee",
        type: "uint256",
      },
    ],
    name: "requestMint",
    outputs: [
      {
        internalType: "uint256",
        name: "postFeeAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalFee",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "signers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "teleportJoin",
    outputs: [
      {
        internalType: "contract TeleportJoinLike",
        name: "",
        type: "address",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
