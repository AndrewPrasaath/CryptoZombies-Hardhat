require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

module.exports = {
  //solidity: "0.8.8",
  solidity: {
    compilers: [{ version: "0.8.9" }, { version: "0.5.9" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: Thanks hardhat,
      chainID: 31337,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColor: true,
    currency: "USD",
    coinmarketCap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      //5: 1,
    },
    user: {
      default: 1,
    },
  },
};
