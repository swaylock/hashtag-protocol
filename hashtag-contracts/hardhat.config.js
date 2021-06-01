require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require("solidity-coverage");

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
  networks: {
    hardhat: {
      //gasPrice: 00000000000, // 0 gwei
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`${PRIVATE_KEY}`],
      gasPrice: 140000000000, // 140 gwei
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 2000000000, // 2 gwei
    },
    coverage: {
      url: "http://localhost:8555",
      gasPrice: 8000000000, // 8 gwei
    },
  },
};
