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
				name: "sender",
				type: "felt",
			},
			{
				name: "recipient",
				type: "felt",
			},
			{
				name: "value",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Transfer",
		type: "event",
	},
	{
		data: [
			{
				name: "owner",
				type: "felt",
			},
			{
				name: "spender",
				type: "felt",
			},
			{
				name: "value",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Approval",
		type: "event",
	},
	{
		inputs: [],
		name: "decimals",
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
		name: "name",
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
		name: "symbol",
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
		name: "totalSupply",
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
		name: "balanceOf",
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
				name: "owner",
				type: "felt",
			},
			{
				name: "spender",
				type: "felt",
			},
		],
		name: "allowance",
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
				name: "account",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "mint",
		outputs: [],
		type: "function",
	},
	{
		inputs: [
			{
				name: "account",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "burn",
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
				name: "recipient",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "transfer",
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
				name: "sender",
				type: "felt",
			},
			{
				name: "recipient",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "transferFrom",
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
				name: "spender",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "approve",
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
				name: "spender",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "increaseAllowance",
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
				name: "spender",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "decreaseAllowance",
		outputs: [
			{
				name: "res",
				type: "felt",
			},
		],
		type: "function",
	},
] as const;
