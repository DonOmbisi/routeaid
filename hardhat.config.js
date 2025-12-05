import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/I0CVCHAKx3P_Sh71KeUc74-NYbMBD7Tg",
      accounts: process.env.SEPOLIA_PRIVATE_KEY
        ? [process.env.SEPOLIA_PRIVATE_KEY]
        : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "5PK9MEEZUWMC1E19W4M1PQRFVR7P395VRG",
    },
  },
};

export default config;