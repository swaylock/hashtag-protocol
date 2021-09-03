const config = require("platformsh-config").config();

async function getHashtagImage(hashtagId) {
  const hashtagMetadata = await getHashtagMetadata(hashtagId);
  if (hashtagMetadata.image) {
    console.log("getHashtagImage", hashtagMetadata.image);
    return hashtagMetadata.image;
  }

  return require("~/assets/pending.png");
}

async function getHashtagMetadata(hashtagId) {
  let metadataURL;
  if ((metadataURL = getMetadataApiUrl())) {
    try {
      const endpoint = metadataURL + "/" + hashtagId;
      let response = await fetch(endpoint);
      return await response.json();
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  return false;
}

/**
 * Get Hashtag Metadata API server URL
 *
 * @returns {string | boolean} Hashtag Metadata API base url
 * @see https://github.com/platformsh/config-reader-nodejs
 */
function getMetadataApiUrl() {
  // If we are on Platform.sh
  if (config.isValidPlatform() && config.inRuntime()) {
    try {
      // "hashtag-api" is the application name for the metadata api up on Platform.sh
      // getRoute() will return the baseurl for hashtag api specific to the PR or
      // Git branch the environment is built from.
      let route = config.getRoute("hashtag-api");
      route = route.url.replace(/\/$/, "");
      return route;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // If we aren't on Platform, return our locally set metadata api
  // otherwise return false.
  return process.env.HTP_METADATA_API_URL || false;
}

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
  getMetadataApiUrl,
  getHashtagImage,
};
