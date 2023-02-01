export default {
  "domains": {
    "root": {
      "type": "root",
      "rpc": "ETH_RPC_URL",
      "chainlog": "0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F",
      "admin": "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB",
      "domain": "ETH-MAIN-A",
      "teleportIlk": "TELEPORT-A",
      "teleportParentDomain": "",
      "daiJoin": "0x9759A6Ac90977b93B58547b4A71c78317f391A28"
    },
    "starknet": {
      "type": "starknet",
      "starknetCoreContract": "",
      "ilk": "XD-STA-MAIN-A",
      "teleportIlk": "TELEPORT-A",
      "teleportParentDomain": "ETH-MAIN-A",
      "domain": "STA-MAIN-A",
      "escrow": "0x0437465dfb5B79726e35F08559B0cBea55bb585C",
      "dai": "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3"
    }
  }
} as const;
