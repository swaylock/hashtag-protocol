import Vue from "vue";
import AppConfig from "@/appconfig";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import BlocknativeSdk from "bnc-sdk";
import { ToastProgrammatic as Toast } from "buefy";
import HashtagProtocolTruffleConf from "../../truffleconf/HashtagProtocol";
import ERC721HashtagRegistry from "../../truffleconf/ERC721HashtagRegistry";
import utils from "../../utils";
import eventMap from "../../data/blocknativeEventMap";
import onBoardChainMap from "../../data/onBoardChainMap";

let provider;
let onboard = {};
let blocknative = {};

const localstorageWalletKey = AppConfig.localstorageWalletKey;

/**
 * The Vuex 'state' object.
 * @name State
 * @type {object}
 * @property {string} address Address of currently connected wallet.
 * @property {number} networkId Id of connected Ethereum network.
 * @property {number} balance Ethereum balance for connected address.
 * @property {object} wallet
 * @property {object} web3Objects
 * @property {object} fees Fees charged by protocol for actions.
 * @property {number} fees.protocol
 * @property {number} fees.tagging Fee to tag content with HASHTAG.
 * @property {number} fees.mintAndTag Fee to tag when minting at same time.
 * @property {number} accrued Amount of revenue in Eth accrued for address from using protocol.
 * @property {function} openModalCloseFn Name of function to close accrued modal.
 */
const state = {
  address: null,
  networkId: null,
  balance: null,
  wallet: {},
  web3Objects: {},
  fees: {
    protocol: 0,
    // @ todo: pull fee from contract.
    tagging: null,
    mintAndTag: null,
  },
  accrued: null,
  openModalCloseFn: () => {},
};

const getters = {
  homesteadProvider: (state) => state.web3Objects.homesteadProvider,
  accrued: (state) => state.accrued,
  address: (state) => state.address,
  networkId: (state) => state.networkId,
  networkInfo: (state) => {
    return onBoardChainMap[state.networkId];
  },
  balance: (state) => state.balance,
  wallet: (state) => state.wallet,
};

const actions = {
  async initOnboard({ dispatch, commit }) {
    // Initialize onboard.
    onboard = Onboard({
      dappId: AppConfig.blocknativeApiKey,
      networkId: AppConfig.onboardNetworkID,
      networkName: AppConfig.onboardNetworkName,
      subscriptions: {
        address: (address) => {
          commit("setWalletAddress", address);
        },
        network: (networkId) => {
          commit("setWalletNetworkId", networkId);
        },
        balance: (balance) => {
          commit("setWalletBalance", balance);
        },
        wallet: (wallet) => {
          dispatch("setWallet", wallet);
        },
      },
      walletSelect: {
        heading: "Connect wallet",
        description: " ",
      },
    });

    // Initialize blocknative SDK for mempool notifications.
    blocknative = new BlocknativeSdk({
      dappId: AppConfig.blocknativeApiKey,
      networkId: AppConfig.onboardNetworkID,
      name: AppConfig.onboardNetworkName,
    });

    dispatch("reconnectWallet");
  },

  async initProtocol({ state, commit, dispatch }) {
    const signer = provider.getSigner();
    const chain = state.networkId;

    const hashtagProtocolContractAddress = utils.getContractAddressFromTruffleConf(
      HashtagProtocolTruffleConf,
      chain
    );

    const hashtagProtocolContract = new ethers.Contract(
      hashtagProtocolContractAddress,
      HashtagProtocolTruffleConf.abi,
      signer
    );

    const erc721HashtagRegistryAddress = utils.getContractAddressFromTruffleConf(
      ERC721HashtagRegistry,
      chain
    );

    const erc721HashtagRegistryContract = new ethers.Contract(
      erc721HashtagRegistryAddress,
      ERC721HashtagRegistry.abi,
      signer
    );

    commit("setWeb3Objects", {
      provider,
      homesteadProvider: ethers.getDefaultProvider("homestead"),
      signer: signer,
      contracts: {
        hashtagProtocolContract,
        erc721HashtagRegistryContract,
      },
      publisher: AppConfig.publisherWalletAddress,
    });

    dispatch("getTaggingFee");
    dispatch("getMintAndTagFee");
    dispatch("getAccruedEthFromRegistry");
  },

  setWallet({ commit }, wallet) {
    if (wallet.provider) {
      commit("setWallet", wallet);
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
      provider = ethersProvider;
      // store the selected wallet name to be retrieved next time the app loads.
      localStorage.setItem(localstorageWalletKey, wallet.name);
    } else {
      provider = null;
      commit("setWallet", {});
    }
  },

  // Called any time page is loaded. If a wallet
  // has been previously selected, it initializes
  // and checks the wallet.
  async reconnectWallet() {
    const previouslySelectedWallet = window.localStorage.getItem(
      localstorageWalletKey
    );
    if (!previouslySelectedWallet) {
      return false;
    }

    if (previouslySelectedWallet && onboard) {
      const walletSelected = await onboard.walletSelect(
        previouslySelectedWallet
      );
      return walletSelected;
    }
  },

  async connectWallet({ dispatch }) {
    if (!provider) {
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) {
        return false;
      }
    }

    const ready = await onboard.walletCheck();
    if (!ready) {
      dispatch("disconnectWallet");
    }
    return ready;
  },

  async changeWallet() {
    await onboard.walletSelect();
  },

  disconnectWallet({ state, commit }) {
    localStorage.removeItem(localstorageWalletKey);
    onboard.walletReset();
    state.openModalCloseFn();
    commit("setOpenModalCloseFn", () => {});
  },

  async readyToTransact({ dispatch }) {
    if (!provider) {
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) {
        return false;
      }
    }

    const ready = await onboard.walletCheck();
    if (!ready) {
      dispatch("disconnectWallet");
    }
    return ready;
  },

  captureOpenModalCloseFn({ commit }, openModalCloseFn) {
    commit("setOpenModalCloseFn", openModalCloseFn);
  },

  async mint({ state, dispatch }, payload) {
    const ready = await dispatch("readyToTransact");
    if (!ready) return;

    const { contracts, publisher } = state.web3Objects;
    const { hashtagProtocolContract } = contracts;

    const tx = await hashtagProtocolContract.mint(
      payload,
      publisher,
      state.address
    );

    const { emitter } = blocknative.transaction(tx.hash);

    emitter.on("all", (transaction) => {
      Toast.open({
        duration: 5000,
        message: eventMap[transaction.eventCode].msg,
        position: "is-bottom",
        type: eventMap[transaction.eventCode].type,
      });
    });
  },

  async tag({ state, dispatch }, payload) {
    const ready = await dispatch("readyToTransact");
    if (!ready) return;

    const { web3Objects, fees } = state;
    const { contracts, publisher } = web3Objects;
    const { erc721HashtagRegistryContract } = contracts;
    const { hashtagId, nftContract, nftId } = payload;

    // function tag(uint256 _hashtagId, address _nftContract, uint256 _nftId, address _publisher, address _tagger) payable public {
    const tx = await erc721HashtagRegistryContract.tag(
      hashtagId,
      nftContract,
      nftId,
      publisher,
      state.address,
      {
        value: ethers.utils.bigNumberify(fees.tagging),
      }
    );

    const { emitter } = blocknative.transaction(tx.hash);

    emitter.on("all", (transaction) => {
      Toast.open({
        duration: 5000,
        message: eventMap[transaction.eventCode].msg,
        position: "is-bottom",
        type: eventMap[transaction.eventCode].type,
      });
    });
  },

  async mintAndTag({ state, dispatch }, payload) {
    const ready = await dispatch("readyToTransact");
    if (!ready) return;

    const { web3Objects, fees } = state;
    const { contracts, publisher } = web3Objects;
    const { erc721HashtagRegistryContract } = contracts;
    const { hashtag, nftContract, nftId } = payload;

    const tx = await erc721HashtagRegistryContract.mintAndTag(
      hashtag.indexOf("#") === 0 ? hashtag : `#${hashtag}`,
      nftContract,
      nftId,
      publisher,
      state.address,
      {
        value: ethers.utils.bigNumberify(fees.tagging),
      }
    );

    const { emitter } = blocknative.transaction(tx.hash);

    emitter.on("all", (transaction) => {
      Toast.open({
        duration: 5000,
        message: eventMap[transaction.eventCode].msg,
        position: "is-bottom",
        type: eventMap[transaction.eventCode].type,
      });
    });
  },

  async getProtocolFee({ commit }) {
    commit("setProtocolFee", "0");
  },

  async getTaggingFee({ state, commit }) {
    const { erc721HashtagRegistryContract } = state.web3Objects.contracts;
    const fee = (await erc721HashtagRegistryContract.tagFee()).toString();
    commit("setTaggingFee", fee);
  },

  async getAccruedEthFromRegistry({ state, commit }) {
    const { contracts } = state.web3Objects;
    const { erc721HashtagRegistryContract } = contracts;
    const accrued = await erc721HashtagRegistryContract.totalDue(state.address);

    commit("setAccrued", accrued);
  },

  async getMintAndTagFee({ commit }) {
    const { erc721HashtagRegistryContract } = state.web3Objects.contracts;
    const fee = (await erc721HashtagRegistryContract.tagFee()).toString();

    commit("setMintAndTagFee", fee);
  },

  async drawDownFromRegistry({ state, dispatch, commit }) {
    const { contracts } = state.web3Objects;
    const { erc721HashtagRegistryContract } = contracts;
    const tx = await erc721HashtagRegistryContract.drawDown(state.address);

    const { emitter } = blocknative.transaction(tx.hash);

    emitter.on("all", function (transaction) {
      Toast.open({
        duration: 5000,
        message: eventMap[transaction.eventCode].msg,
        position: "is-bottom",
        type: eventMap[transaction.eventCode].type,
      });

      if (transaction.eventCode === "txConfirmed") {
        state.openModalCloseFn();
        dispatch("getAccruedEthFromRegistry");
        commit("setOpenModalCloseFn", () => {});
      }
    });
  },
};

const mutations = {
  async setProtocolFee(state, fee) {
    //Vue.set(state, "fees.platform", fee);
    state.fees.platform = fee;
  },

  async setTaggingFee(state, fee) {
    //Vue.set(state, "fees.tagging", fee);
    state.fees.tagging = fee;
  },

  async setMintAndTagFee(state, fee) {
    //Vue.set(state, "fees.mintAndTag", fee);
    state.fees.mintAndTag = fee;
  },

  setWeb3Objects(state, payload) {
    Vue.set(state, "web3Objects", payload);
  },

  setAccrued(state, accrued) {
    Vue.set(state, "accrued", accrued);
  },

  setOpenModalCloseFn(state, openModalCloseFn) {
    Vue.set(state, "openModalCloseFn", openModalCloseFn);
  },

  setWalletAddress(state, address) {
    Vue.set(state, "address", address);
  },

  setWalletNetworkId(state, networkId) {
    Vue.set(state, "networkId", networkId);
  },

  setWalletBalance(state, balance) {
    Vue.set(state, "balance", balance);
  },

  setWallet(state, wallet) {
    Vue.set(state, "wallet", wallet);
  },

  setProvider(state, provider) {
    Vue.set(state, "provider", provider);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
