export const potAbi = [
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
		name: "File",
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
		data: [],
		keys: [],
		name: "Cage",
		type: "event",
	},
	{
		data: [],
		keys: [],
		name: "Drip",
		type: "event",
	},
	{
		data: [
			{
				name: "usr",
				type: "felt",
			},
			{
				name: "wad",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Join",
		type: "event",
	},
	{
		data: [
			{
				name: "usr",
				type: "felt",
			},
			{
				name: "wad",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Exit",
		type: "event",
	},
	{
		inputs: [],
		name: "live",
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
		name: "dsr",
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
		name: "chi",
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
		name: "rho",
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
		name: "Pie",
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
				name: "u",
				type: "felt",
			},
		],
		name: "pie",
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
				name: "vat",
				type: "felt",
			},
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
		inputs: [],
		name: "cage",
		outputs: [],
		type: "function",
	},
	{
		inputs: [],
		name: "drip",
		outputs: [
			{
				name: "tmp",
				type: "Uint256",
			},
		],
		type: "function",
	},
	{
		inputs: [
			{
				name: "wad",
				type: "Uint256",
			},
		],
		name: "join",
		outputs: [],
		type: "function",
	},
	{
		inputs: [
			{
				name: "wad",
				type: "Uint256",
			},
		],
		name: "exit",
		outputs: [],
		type: "function",
	},
] as const;
