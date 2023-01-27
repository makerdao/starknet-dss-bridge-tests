export const endAbi = [
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
				type: "felt",
			},
		],
		keys: [],
		name: "File",
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
				name: "ilk",
				type: "felt",
			},
		],
		keys: [],
		name: "Cage_ilk",
		type: "event",
	},
	{
		data: [
			{
				name: "ilk",
				type: "felt",
			},
			{
				name: "urn",
				type: "felt",
			},
			{
				name: "wad",
				type: "Uint256",
			},
			{
				name: "art",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Skim",
		type: "event",
	},
	{
		data: [
			{
				name: "ilk",
				type: "felt",
			},
			{
				name: "usr",
				type: "felt",
			},
			{
				name: "ink",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Free",
		type: "event",
	},
	{
		data: [],
		keys: [],
		name: "Thaw",
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
		name: "Flow",
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
		name: "Pack",
		type: "event",
	},
	{
		data: [
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
		keys: [],
		name: "Cash",
		type: "event",
	},
	{
		inputs: [
			{
				name: "ward",
				type: "felt",
			},
			{
				name: "vat",
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
		inputs: [
			{
				name: "ilk",
				type: "felt",
			},
		],
		name: "fix",
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
				name: "ilk",
				type: "felt",
			},
			{
				name: "user",
				type: "felt",
			},
		],
		name: "out",
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
				name: "ilk",
				type: "felt",
			},
		],
		name: "gap",
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
				name: "ilk",
				type: "felt",
			},
		],
		name: "Art",
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
		inputs: [],
		name: "cage",
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
		name: "cage_ilk",
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
				name: "urn",
				type: "felt",
			},
		],
		name: "skim",
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
		name: "free",
		outputs: [],
		type: "function",
	},
	{
		inputs: [],
		name: "thaw",
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
		name: "flow",
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
		name: "pack",
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
				name: "wad",
				type: "Uint256",
			},
		],
		name: "cash",
		outputs: [],
		type: "function",
	},
] as const;
