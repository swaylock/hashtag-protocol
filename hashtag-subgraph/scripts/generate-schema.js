const contractConfig = require("../../hashtag-contracts/htp-config.json");
const fs = require("fs-extra");
const Handlebars = require("handlebars");

const args = process.argv.slice(2);
const deployment = args[1];

if (!deployment) {
  console.error(`missing --deployment [target] argument`);
  return;
}

const deployments = {
  mainnet: {
    chainId: 1,
    network: "mainnet",
  },
  mumbai: {
    chainId: 80001,
    network: "mumbai",
  },
  localhost: {
    chainId: 31337,
    network: "mainnet", // Subgraph localhost uses "mainnet"
  },
};

const chainId = deployments[deployment].chainId;
const contractsInfo = {
  contracts: contractConfig.networks[chainId].contracts,
  network: deployments[deployment].network,
};

const template = Handlebars.compile(fs.readFileSync("./templates/subgraph.yaml").toString());
const result = template(contractsInfo);
fs.writeFileSync("./subgraph.yaml", result);

console.log(deployment + " configuration file written to /hashtag-subgraph/subgraph.yaml");
