import contractConfig from "./../../hashtag-contracts/htp-config.json";

function getContractAddress(contractName, chainId) {
  if (!contractName || !chainId) return "";
  const chainIdString = chainId.toString();
  const { networks } = contractConfig;
  if (networks[chainIdString]) {
    const address = networks[chainIdString].contracts[contractName].address;
    return address ? address : "";
  }
  return "";
}

export default {
  getContractAddress,
};
