import onBoardChainMap from "./data/onBoardChainMap.json";
import utils from "./common/utils";

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "Hashtag Protocol Demo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.materialdesignicons.com/5.4.55/css/materialdesignicons.min.css",
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/css/theme.scss"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/vue-axios",
    "~/plugins/vue-buefy",
    "~/plugins/vue-filter",
    "~/plugins/vue-timeago",
    "~/plugins/vue-screen",
    "~/plugins/htp-metadata-api",
    "~/plugins/fallback-image",
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    ["nuxt-buefy", { css: false }],
    "@nuxtjs/apollo",
    "@nuxtjs/gtm",
    "@nuxtjs/style-resources",
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  styleResources: {
    scss: ["~/assets/css/variables.scss"],
  },

  publicRuntimeConfig: {
    hashtagProtocolContractAddress: utils.getContractAddress("HashtagProtocol", process.env.VUE_APP_ONBOARD_NETWORK_ID),
    erc721HashtagRegistryAddress: utils.getContractAddress(
      "ERC721HashtagRegistry",
      process.env.VUE_APP_ONBOARD_NETWORK_ID,
    ),
    hashtagSubgraph:
      process.env.VUE_APP_HASHTAG_SUBGRAPH_URL ||
      "https://api.thegraph.com/subgraphs/name/hashtag-protocol/hashtag-rinkeby",
    nftSearchSubgraph:
      process.env.VUE_APP_TOP_NFTS_SUBGRAPH_URL || "https://api.thegraph.com/subgraphs/name/blockrockettech/nft-tokens",
    nftPortAPIKey: process.env.NFTPORT_API_KEY,

    // These are set for local development purposes only. See store/index.js
    metadataApiBaseUrl: process.env.VUE_APP_HTP_METADATA_API_URL || false,
    websiteBaseUrl: process.env.VUE_APP_WEBSITE_URL || "https://www.hashtag-protocol.org",
    dappBaseUrl: process.env.VUE_APP_DAPP_URL || "https://app.hashtag-protocol.org",
    docsBaseUrl: process.env.VUE_APP_DOCS_URL || "https://docs.hashtag-protocol.org",

    etherscanBaseUrl: onBoardChainMap[process.env.VUE_APP_ONBOARD_NETWORK_ID].url,
    blocknativeApiKey: process.env.VUE_APP_BLOCKNATIVE_API_KEY || "",
    onboardNetworkID: Number(process.env.VUE_APP_ONBOARD_NETWORK_ID) || Number(5777),
    publisherWalletAddress: process.env.VUE_APP_PUBLISHER_ADDRESS || "0xD677AEd0965AC9B54e709F01A99cEcA205aebC4B",
    localstorageWalletKey: process.env.VUE_APP_ONBOARD_LOCALSTORAGE_WALLET_KEY || "HashtagSelectedWallet",

    discordServer: process.env.VUE_APP_DISCORD_SERVER || "https://discord.gg/EyTJFRm",
    substack: "https://hashtagprotocol.substack.com",
  },
  privateRuntimeConfig: {},

  gtm: {
    id: "GTM-MRK383F",
    enabled: true,
    debug: true,
    pageTracking: true,
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint:
          process.env.VUE_APP_HASHTAG_SUBGRAPH_URL ||
          "https://api.thegraph.com/subgraphs/name/hashtag-protocol/hashtag-polygon-mumbai",
      },
      hashtagClient: {
        httpEndpoint:
          process.env.VUE_APP_HASHTAG_SUBGRAPH_URL ||
          "https://api.thegraph.com/subgraphs/name/hashtag-protocol/hashtag-polygon-mumbai",
      },
      nftsClient: {
        httpEndpoint:
          process.env.VUE_APP_TOP_NFTS_SUBGRAPH_URL ||
          "https://api.thegraph.com/subgraphs/name/blockrockettech/nft-tokens",
      },
    },
  },
};
