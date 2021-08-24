require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");

//require("@eth-optimism/hardhat-ovm");
require("@nomiclabs/hardhat-ethers");

// Used for running ERC721.test.js, using truffle.
require("@nomiclabs/hardhat-truffle5");
require("hardhat-ethernal");

const { accounts } = require("./utils/network");

//import { accounts } from "./utils/network";

//require("@nomiclabs/hardhat-solhint");
//require("@nomiclabs/hardhat-etherscan");
//require("hardhat-abi-exporter");
//require("hardhat-gas-reporter");
//require("solidity-coverage");
//const { utils } = require("ethers");
//const { isAddress, getAddress, formatUnits, parseUnits } = utils;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async ({ ethers }) => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

//usePlugin("hardhat-deploy-ethers");

// task action function receives the Hardhat Runtime Environment as second argument
task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    await ethers.provider.getBlockNumber().then((blockNumber) => {
      console.log("Current block number: " + blockNumber);
    });
  }
);

module.exports = {};

const INFURA_PROJECT_ID = process.env.PROTOTYPE_BR_INFURA_KEY || "";
const PRIVATE_KEY =
  process.env.HASHTAG_PRIVATE_KEY ||
  "0000000000000000000000000000000000000000000000000000000000000000";
const MATICVIGIL_PROJECT_ID = process.env.MATICVIGIL_PROJECT_ID || "";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: false,
  },
  // For named accounts see https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
  namedAccounts: {
    accountHashtagAdmin: 0,
    accountHashtagPublisher: 1,
    accountHashtagPlatform: 2,
  },
  networks: {
    hardhat: {
      gas: "auto",
      gasPrice: "auto",
      accounts: accounts(),
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: accounts(),
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: accounts(),
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      //accounts: [`${PRIVATE_KEY}`],
      gasPrice: 140000000000, // 140 gwei
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      //accounts: [`0x${PRIVATE_KEY}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      //accounts: [`0x${PRIVATE_KEY}`],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      //accounts: [`0x${PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_PROJECT_ID}`,
      //accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 2000000000, // 2 gwei
    },
    coverage: {
      url: "http://localhost:8555",
      gasPrice: 8000000000, // 8 gwei
    },
  },
};
