const platformConfig = require("platformsh-config").config();

export default function ({ app }, inject) {
  /**
   * Helper plugin for interacting with HASHTAG metadata api.
   */
  const metadataApiHelpers = {
    /**
     * Get HASHTAG token image for token id.
     *
     * If running on Platform.sh, returns image to HASHTAG token from metadata
     * api running in same environment branch as the dApp.
     *
     * @param {int} hashtagId Hashtag token id.
     * @returns URL to HASHTAG token image or back placeholder image not found.
     */
    async getHashtagImage(hashtagId) {
      const hashtagMetadata = await this.getHashtagMetadata(hashtagId);
      if (hashtagMetadata.image) {
        return hashtagMetadata.image;
      }

      return require("~/assets/pending.png");
    },

    /**
     * Fetches HASHTAG token metadata.
     *
     * If running on Platform.sh, returns metadata from metadata
     * api running in same environment branch as the dApp. Otherwise
     * will attempt to use metadata api located set at
     * process.env.VUE_APP_HTP_METADATA_API_URL
     *
     * @param { int } hashtagId Hashtag token id.
     * @returns metadata json, or false if not found.
     */
    async getHashtagMetadata(hashtagId) {
      const metadataURL = this.getMetadataApiUrl();
      console.log("getHashtagMetadata", metadataURL);
      if (metadataURL) {
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
    },

    /**
     * Get Hashtag Metadata API server URL
     *
     * @returns Hashtag Metadata API base url or false.
     * @see https://github.com/platformsh/config-reader-nodejs
     */
    getMetadataApiUrl() {
      // If we are on Platform.sh
      console.log("platformConfig.isValidPlatform()", platformConfig.isValidPlatform());
      console.log("platformConfig.inRuntime()", platformConfig.inRuntime());
      console.log(platformConfig.getRoute("hashtag-api"));

      if (platformConfig.isValidPlatform() && platformConfig.inRuntime()) {
        try {
          // "hashtag-api" is the application name for the metadata api up on Platform.sh
          // getRoute() will return the baseurl for hashtag api specific to the PR or
          // Git branch the environment is built from.
          let route = platformConfig.getRoute("hashtag-api");
          route = route.url.replace(/\/$/, "");
          return route;
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      // If we aren't on Platform, return our locally set metadata api
      // See nuxt.config.js.
      return app.$config.metadataApiUrl;
    },
  };
  inject("metadataApiHelpers", metadataApiHelpers);
}
