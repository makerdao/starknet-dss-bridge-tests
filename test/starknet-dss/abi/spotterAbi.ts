export const spotterAbi = [
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
				name: "ilk",
				type: "felt",
			},
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
		name: "File_pip",
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
		name: "File_par",
		type: "event",
	},
	{
		data: [
			{
				name: "ilk",
				type: "felt",
			},
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
		name: "File_mat",
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
			{
				name: "val",
				type: "Uint256",
			},
			{
				name: "spot",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Poke",
		type: "event",
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
		inputs: [],
		name: "cage",
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
				name: "ilk",
				type: "felt",
			},
			{
				name: "what",
				type: "felt",
			},
			{
				name: "data",
				type: "felt",
			},
		],
		name: "file_pip",
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
		name: "file_par",
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
				name: "what",
				type: "felt",
			},
			{
				name: "data",
				type: "Uint256",
			},
		],
		name: "file_mat",
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
		name: "poke",
		outputs: [],
		type: "function",
	},
] as const;
