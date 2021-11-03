require("dotenv").config();

require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("@openzeppelin/hardhat-upgrades");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

require("hardhat-abi-exporter");
require("hardhat-ethernal");
require("@nomiclabs/hardhat-etherscan");

const { node_url, accounts } = require("./utils/network");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    enabled: false,
  },
  abiExporter: {
    path: "./abi",
    clear: true,
    spacing: 0,
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
      saveDeployments: false,
      accounts: accounts(),
    },
    localhost: {
      url: node_url("localhost"), //default port: 31337
      chainId: 31337,
      saveDeployments: false,
      accounts: accounts(),
    },
    mumbai: {
      url: node_url("mumbai"), // see .env.default
      chainId: 80001,
      saveDeployments: false,
      accounts: accounts("mumbai"),
      gasPrice: 2000000000,
    },
  },
};
