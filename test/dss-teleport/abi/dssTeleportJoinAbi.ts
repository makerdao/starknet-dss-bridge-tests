export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "vat_",
        type: "address",
      },
      {
        internalType: "address",
        name: "daiJoin_",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "ilk_",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domain_",
        type: "bytes32",
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
        internalType: "address",
        name: "data",
        type: "address",
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
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "domain",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "data",
        type: "address",
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
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "domain",
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
        internalType: "bytes32",
        name: "hashGUID",
        type: "bytes32",
      },
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
        indexed: false,
        internalType: "struct TeleportGUID",
        name: "teleportGUID",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxFeePercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "operatorFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "originator",
        type: "address",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "hashGUID",
        type: "bytes32",
      },
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
        indexed: false,
        internalType: "struct TeleportGUID",
        name: "teleportGUID",
        type: "tuple",
      },
    ],
    name: "Register",
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
        indexed: true,
        internalType: "bytes32",
        name: "sourceDomain",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Settle",
    type: "event",
  },
  {
    inputs: [],
    name: "RAY",
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
    name: "WAD",
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
    name: "cure",
    outputs: [
      {
        internalType: "uint256",
        name: "cure_",
        type: "uint256",
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
        internalType: "contract DaiJoinLike",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "debt",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
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
    name: "deny",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "domain",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "fees",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
        internalType: "bytes32",
        name: "domain_",
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
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "data",
        type: "address",
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
        internalType: "bytes32",
        name: "what",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domain_",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "data",
        type: "address",
      },
    ],
    name: "file",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ilk",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "line",
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
    name: "mintPending",
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
    name: "registerMint",
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
    name: "rely",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "settle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "teleports",
    outputs: [
      {
        internalType: "bool",
        name: "blessed",
        type: "bool",
      },
      {
        internalType: "uint248",
        name: "pending",
        type: "uint248",
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
        internalType: "contract VatLike",
        name: "",
        type: "address",
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
        internalType: "address",
        name: "",
        type: "address",
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
