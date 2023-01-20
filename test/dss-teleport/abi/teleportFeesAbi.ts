export default [
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
        name: "line",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "debt",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "pending",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amtToTake",
        type: "uint256",
      },
    ],
    name: "getFee",
    outputs: [
      {
        internalType: "uint256",
        name: "fees",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
