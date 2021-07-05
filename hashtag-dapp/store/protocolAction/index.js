/**
 * @property {string} protocolAction Protocol action being performed.
 * @property {string} newHashtag String of new hashtag is being minted.
 * @property {object} targetNft Selected NFT being tagged.
 * @property {object} targetHashtag Existing Hashtag used to tag content.
 */
const state = () => ({
  protocolAction: null,
  newHashtag: null,
  targetNft: {},
  targetHashtag: {},
});

const getters = {
  protocolAction: (state) => state.protocolAction,
  newHashtag: (state) => state.newHashtag,
  targetNft: (state) => state.targetNft,
  targetHashtag: (state) => state.targetHashtag,
};

const actions = {
  async updateProtocolAction({ commit }, payload) {
    await commit("setProtocolAction", payload);
  },
  async updateNewHashtag({ commit }, payload) {
    await commit("setNewHashtag", payload);
  },
  async updateTargetNft({ commit }, payload) {
    await commit("setTargetNft", payload);
  },
  async updateTargetHashtag({ commit }, payload) {
    await commit("setTargetHashtag", payload);
  },
};

const mutations = {
  setProtocolAction(state, payload) {
    state.protocolAction = payload;
  },
  setNewHashtag(state, payload) {
    state.newHashtag = payload;
  },
  setTargetNft(state, payload) {
    state.targetNft = payload;
  },
  setTargetHashtag(state, payload) {
    state.targetHashtag = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
