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
     * @param {int | string } hashtag Hashtag token id as int or name as string
     * @returns URL to HASHTAG token image or placeholder image if not found.
     */
    async getHashtagImage(hashtag) {
      const hashtagMetadata = await this.getHashtagMetadata(hashtag);
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
     * @returns Hashtag Metadata API base url.
     *
     * @see nuxtServerInit() in /stores/index.js
     */
    getMetadataApiUrl() {
      return app.store.state.metaDataApiBaseUrl;
    },
  };
  inject("metadataApiHelpers", metadataApiHelpers);
}
