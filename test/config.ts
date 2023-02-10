export default {
  domains: {
    root: {
      type: "root",
      rpc: "ETH_RPC_URL",
      chainlog: "0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F",
      admin: "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB",
      domain: "ETH-MAIN-A",
      teleportIlk: "TELEPORT-A",
      teleportParentDomain: "",
      // below addresses should be read from chainlog
      daiJoin: "0x9759A6Ac90977b93B58547b4A71c78317f391A28",
      vat: "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B",
      jug: "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
      cure: "0x0085c9feAb2335447E1F4DC9bf3593a8e28bdfc7",
      vow: "0xA950524441892A31ebddF91d3cEEFa04Bf454466",
      dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      govRelay: "0x2385C60D2756Ed8CA001817fC37FDa216d7466c0",
    },
    starknet: {
      type: "starknet",
      starknetCoreContract: "",
      ilk: "XD-STA-MAIN-A",
      teleportIlk: "TELEPORT-A",
      teleportParentDomain: "ETH-MAIN-A",
      domain: "STA-MAIN-A",
      escrow: "0x0437465dfb5B79726e35F08559B0cBea55bb585C",
      dai: "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
      govRelay:
        "0x05f4d9b039f82e9a90125fb119ace0531f4936ff2a9a54a8598d49a4cd4bd6db",
    },
  },
} as const;
