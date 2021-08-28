require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");

//require("@eth-optimism/hardhat-ovm");
require("@nomiclabs/hardhat-ethers");

// Used for running ERC721.test.js, using truffle.
require("@nomiclabs/hardhat-truffle5");
require("hardhat-ethernal");

const { node_url, accounts } = require("./utils/network");
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
    accountHashtagAdmin: {
      default: 0,
      mumbai: "0x93A5f58566D436Cae0711ED4d2815B85A26924e6",
    },
    accountHashtagPublisher: {
      default: 1,
      mumbai: "0xE9FBC1a1925F6f117211C59b89A55b576182e1e9",
    },
    accountHashtagPlatform: {
      default: 2,
      mumbai: "0x60F2760f0D99330A555c5fc350099b634971C6Eb",
    },
  },
  etherscan: {
    apiKey: "8UHY65TIS48GSD58N8US7JKM9Z1UYJ297U",
  },
  networks: {
    hardhat: {
      gas: "auto",
      gasPrice: "auto",
      accounts: accounts(),
    },
    localhost: {
      url: node_url("localhost"), //default port: 31337
      accounts: accounts(),
    },
    ganache: {
      url: node_url("localhost"), // default port: 5777
      accounts: accounts(),
    },
    mumbai: {
      url: node_url("mumbai"), // see .env.default
      accounts: accounts("mumbai"),
      gasPrice: 2000000000,
    },
  },
};
