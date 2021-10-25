const state = () => ({
  publisherDirectory: [
    {
      address: "0xd677aed0965ac9b54e709f01a99ceca205aebc4b",
      name: "KnownOrigin",
      registration: "https://#",
      website: "https://knownorigin.io",
    },
    {
      address: "0xE9FBC1a1925F6f117211C59b89A55b576182e1e9",
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
