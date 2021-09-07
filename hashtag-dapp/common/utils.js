/**
 *
 * @param {string} truffleConf
 * @param {int} chainId
 * @returns
 */
function getContractAddressFromTruffleConf(truffleConf, chainId) {
  if (!truffleConf || !chainId) return "";
  const { networks } = truffleConf;
  if (networks[chainId.toString()]) {
    const address = networks[chainId.toString()].address;
    return address ? address : "";
  }
  return "";
}

export default {
  getContractAddressFromTruffleConf,
};
