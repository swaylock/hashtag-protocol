const config = require("platformsh-config").config();

/**
 * Get Hashtag Metadata API server URL
 *
 * Returns Platform.sh environment baseurl if on Platform.sh.
 * Otherwise returns environment variable.
 *
 * @returns string Hashtag Metadata API base url
 * @see https://github.com/platformsh/config-reader-nodejs
 */
function getMetadataApiUrl() {
  // If we are on Platform.sh
  if (config.isValidPlatform()) {
    // "hashtag-api" is the named environment for the api up on Platform.sh
    // This will return the baseurl for hashtag api specific to the PR or
    // Git branch the environment is built from.
    console.log("getRoute", config.getRoute("hashtag-api"));

    return config.getRoute("hashtag-api").replace(/\/$/, "");
  }
  return process.env.HTP_METADATA_API_URL.replace(/\/$/, "");
}

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
  getMetadataApiUrl,
};
