import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    aeneid: {
      url: "https://aeneid.storyrpc.io",
      accounts: [PRIVATE_KEY],
      chainId: 1315,
    },
  },
};

export default config;
