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
				name: "what",
				type: "felt",
			},
			{
				name: "data",
				type: "Uint256",
			},
		],
		keys: [],
		name: "File_dust",
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
		data: [
			{
				name: "to",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Deposit",
		type: "event",
	},
	{
		data: [
			{
				name: "sender",
				type: "felt",
			},
			{
				name: "to",
				type: "felt",
			},
			{
				name: "amount",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Withdraw",
		type: "event",
	},
	{
		data: [
			{
				name: "wad",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Lift",
		type: "event",
	},
	{
		data: [
			{
				name: "burned",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Release",
		type: "event",
	},
	{
		data: [
			{
				name: "wad",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Surplus",
		type: "event",
	},
	{
		data: [
			{
				name: "wad",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Deficit",
		type: "event",
	},
	{
		data: [
			{
				name: "wad",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Rectify",
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
				name: "value",
				type: "Uint256",
			},
		],
		keys: [],
		name: "Tell",
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
		name: "RegisterMint",
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
		name: "InitializeRegisterMint",
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
		name: "FinalizeRegisterMint",
		type: "event",
	},
	{
		data: [
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
		keys: [],
		name: "Settle",
		type: "event",
	},
	{
		data: [
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
		keys: [],
		name: "InitializeSettle",
		type: "event",
	},
	{
		data: [
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
		keys: [],
		name: "FinalizeSettle",
		type: "event",
	},
	{
		inputs: [
			{
				name: "daiJoin",
				type: "felt",
			},
			{
				name: "claimToken",
				type: "felt",
			},
			{
				name: "router",
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
				name: "what",
				type: "felt",
			},
			{
				name: "data",
				type: "Uint256",
			},
		],
		name: "file_dust",
		outputs: [],
		type: "function",
	},
	{
		inputs: [
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "heal",
		outputs: [],
		type: "function",
	},
	{
		inputs: [
			{
				name: "amount",
				type: "Uint256",
			},
		],
		name: "heal_",
		outputs: [],
		type: "function",
	},
	{
		inputs: [
			{
				name: "teleport",
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
	{
		inputs: [],
		name: "get_domain_host",
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
				name: "from_address",
				type: "felt",
			},
			{
				name: "to",
				type: "felt",
			},
			{
				name: "amount_low",
				type: "felt",
			},
			{
				name: "amount_high",
				type: "felt",
			},
			{
				name: "sender",
				type: "felt",
			},
		],
		name: "handle_deposit",
		outputs: [],
		type: "l1_handler",
	},
	{
		inputs: [
			{
				name: "from_address",
				type: "felt",
			},
			{
				name: "rid_low",
				type: "felt",
			},
			{
				name: "rid_high",
				type: "felt",
			},
			{
				name: "wad_low",
				type: "felt",
			},
			{
				name: "wad_high",
				type: "felt",
			},
		],
		name: "handle_lift",
		outputs: [],
		type: "l1_handler",
	},
	{
		inputs: [
			{
				name: "from_address",
				type: "felt",
			},
			{
				name: "rid_low",
				type: "felt",
			},
			{
				name: "rid_high",
				type: "felt",
			},
			{
				name: "wad_low",
				type: "felt",
			},
			{
				name: "wad_high",
				type: "felt",
			},
		],
		name: "handle_rectify",
		outputs: [],
		type: "l1_handler",
	},
	{
		inputs: [
			{
				name: "from_address",
				type: "felt",
			},
			{
				name: "rid_low",
				type: "felt",
			},
			{
				name: "rid_high",
				type: "felt",
			},
		],
		name: "handle_cage",
		outputs: [],
		type: "l1_handler",
	},
	{
		inputs: [
			{
				name: "from_address",
				type: "felt",
			},
			{
				name: "usr_low",
				type: "felt",
			},
			{
				name: "usr_high",
				type: "felt",
			},
			{
				name: "wad_low",
				type: "felt",
			},
			{
				name: "wad_high",
				type: "felt",
			},
			{
				name: "sender",
				type: "felt",
			},
		],
		name: "handle_exit",
		outputs: [],
		type: "l1_handler",
	},
	{
		inputs: [
			{
				name: "from_address",
				type: "felt",
			},
			{
				name: "src_low",
				type: "felt",
			},
			{
				name: "src_high",
				type: "felt",
			},
			{
				name: "trg_low",
				type: "felt",
			},
			{
				name: "trg_high",
				type: "felt",
			},
			{
				name: "receiver",
				type: "felt",
			},
			{
				name: "operator",
				type: "felt",
			},
			{
				name: "amount",
				type: "felt",
			},
			{
				name: "nonce",
				type: "felt",
			},
			{
				name: "timestamp",
				type: "felt",
			},
		],
		name: "handle_initializeRegisterMint",
		outputs: [],
		type: "l1_handler",
	},
	{
		inputs: [
			{
				name: "from_address",
				type: "felt",
			},
			{
				name: "src_low",
				type: "felt",
			},
			{
				name: "src_high",
				type: "felt",
			},
			{
				name: "trg_low",
				type: "felt",
			},
			{
				name: "trg_high",
				type: "felt",
			},
			{
				name: "amount_low",
				type: "felt",
			},
			{
				name: "amount_high",
				type: "felt",
			},
		],
		name: "handle_initializeSettle",
		outputs: [],
		type: "l1_handler",
	},
] as const;
