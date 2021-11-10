// Strict mode causes a maximum call stack size exceeded error during development
const platformConfig = require("platformsh-config").config();
export const strict = false;

export const state = () => ({
  metaDataApiBaseUrl: null,
  websiteBaseUrl: null,
  docsBaseUrl: null,
  dappBaseUrl: null,
});

export const mutations = {
  SET_METADATA_API_BASE_URL(state, url) {
    state.metaDataApiBaseUrl = url;
  },
  SET_WEBSITE_BASE_URL(state, url) {
    state.websiteBaseUrl = url;
  },
  SET_DOCS_BASE_URL(state, url) {
    state.docsBaseUrl = url;
  },
  SET_DAPP_BASE_URL(state, url) {
    state.dappBaseUrl = url;
  },
};

export const actions = {
  nuxtServerInit({ commit }, { $config }) {
    // Set base paths for the entire application depending on environment.
    let metadataApiBaseUrl = $config.metadataApiBaseUrl;
    let websiteBaseUrl = $config.websiteBaseUrl;
    let docsBaseUrl = $config.docsBaseUrl;
    let dappBaseUrl = $config.dappBaseUrl;

    // If we are on Platform.sh, override the values set in nuxt.config.js /
    // .env file
    // @see https://github.com/platformsh/config-reader-nodejs
    if (platformConfig.isValidPlatform() && platformConfig.inRuntime()) {
      try {
        // "hashtag-api" is the application name for the metadata api up on Platform.sh
        // getRoute() will return the baseurl for hashtag api specific to the PR or
        // Git branch the environment is built from.
        metadataApiBaseUrl = platformConfig.getRoute("hashtag-api");
        metadataApiBaseUrl = metadataApiBaseUrl.url.replace(/\/$/, "");

        // If we on the mumbai dev server (eg. "stage" branch), let's continue to use environment
        // variables for these global base URLs. Otherwise, map them to the currently built environments.
        if (platformConfig.branch !== "stage") {
          websiteBaseUrl = platformConfig.getRoute("hashtag-web");
          websiteBaseUrl = websiteBaseUrl.url.replace(/\/$/, "");

          docsBaseUrl = platformConfig.getRoute("hashtag-docs");
          docsBaseUrl = docsBaseUrl.url.replace(/\/$/, "");

          dappBaseUrl = platformConfig.getRoute("hashtag-dapp");
          dappBaseUrl = dappBaseUrl.url.replace(/\/$/, "");
        }
      } catch (error) {
        console.error(error);
      }
    }
    commit("SET_METADATA_API_BASE_URL", metadataApiBaseUrl);
    commit("SET_WEBSITE_BASE_URL", websiteBaseUrl);
    commit("SET_DOCS_BASE_URL", docsBaseUrl);
    commit("SET_DAPP_BASE_URL", dappBaseUrl);
  },
};
