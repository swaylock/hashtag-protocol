const state = () => ({
  publisherDirectory: [
    {
      address: "0xd677aed0965ac9b54e709f01a99ceca205aebc4b",
      name: "KnownOrigin",
      registration: "https://#",
      website: "https://knownorigin.io",
    },
    {
      address: "0xf6423a8769292bbeef9335c5a26254c759e3bfbe",
      name: "Hashtag Protocol",
      registration: "https://#",
      website: "https://hashtag-protocol.org",
    },
  ],
});

const getters = {
  publisherDirectory: (state) => state.publisherDirectory,
};

const actions = {};
const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
