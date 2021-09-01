import Vue from "vue";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import BlocknativeSdk from "bnc-sdk";
import { ToastProgrammatic as Toast } from "buefy";

const eventMap = {
  txSent: {
    msg: "Transaction has been sent to the network",
    type: "is-dark",
  },
  txPool: {
    msg: "Transaction is in the mempool and is pending",
    type: "is-dark",
  },
  txConfirmed: {
    msg: "Transaction has been mined",
    type: "is-success",
  },
  txFailed: {
    msg: "Transaction has failed",
    type: "is-danger",
  },
  txSpeedUp: {
    msg: "Transaction been speeded up",
    type: "is-dark",
  },
  txCancel: {
    msg: "Transaction been cancelled",
    type: "is-warning",
  },
  txDropped: {
    msg: "Transaction been dropped",
    type: "is-warning",
  },
};

let provider;

const onboard = Onboard({
  dappId: "773ba398-31f9-4816-a3b3-960a075a0f31", // Hashtag API key
  networkId: 4, // Dapp currently only supports Rinkeby
  subscriptions: {
    wallet: (wallet) => {
      provider = new ethers.providers.Web3Provider(wallet.provider);

      // store the selected wallet name to be retrieved next time the app loads
      localStorage.setItem("selectedWallet", wallet.name);
    },
  },
});

// create options object
const options = {
  dappId: "8bf348fd-d9df-4b54-b8b1-1ad14d15e4c3",
  networkId: 4, // Dapp currently only supports Rinkeby
  // Optional. See docs.
  // transactionHandlers: [(event) => console.log(event.transaction)],
};

// initialize and connect to the api
const blocknative = new BlocknativeSdk(options);

import HashtagProtocolTruffleConf from "../../truffleconf/HashtagProtocol";
import ERC721HashtagRegistry from "../../truffleconf/ERC721HashtagRegistry";
import utils from "../../utils";

const KO_RINKEBY_ADDRESS = "0x2df6816286c583a7ef8637cd4b7cc1cc62f6161e";

import nftCache from "../../data/nfts";

const state = {
  web3Objects: {},
  fees: {
    protocol: ethers.utils.parseEther("0.01"),
    tagging: ethers.utils.parseEther("0.01"),
  },
  supportedNfts: [
    {
      name: "KnownOriginDigitalAsset",
      contractAddress: KO_RINKEBY_ADDRESS,
    },
  ],
  nftAssetCache: nftCache,
};

const getters = {
  supportedNfts: (state) => state.supportedNfts,
  nftAssetCache: (state) => state.nftAssetCache,
  homesteadProvider: (state) => state.web3Objects.homesteadProvider,
  account: (state) => {
    return state.web3Objects && state.web3Objects.account
      ? state.web3Objects.account
      : "Connect wallet";
  },
};

const actions = {
  async bootstrap({ commit, dispatch }) {
    // check if a wallet was previously selected and use that
    const previouslySelectedWallet = localStorage.getItem("selectedWallet");

    let userSelectedAWallet;
    if (
      previouslySelectedWallet != null &&
      previouslySelectedWallet !== "null"
    ) {
      userSelectedAWallet = await onboard.walletSelect(
        previouslySelectedWallet
      );
    } else {
      userSelectedAWallet = await onboard.walletSelect();
    }

    // True if either a wallet was previously selected or was now selected from the modal
    // Will be false if the user closes the modal before selecting a wallet
    if (userSelectedAWallet) {
      // Check wallet is ready to transact
      const readyToTransact = await onboard.walletCheck();

      if (readyToTransact) {
        const onboardState = onboard.getState();

        const signer = provider.getSigner();
        const chain = await provider.getNetwork();

        const hashtagProtocolContractAddress = utils.getContractAddressFromTruffleConf(
          HashtagProtocolTruffleConf,
          chain.chainId
        );
        const hashtagProtocolContract = new ethers.Contract(
          hashtagProtocolContractAddress,
          HashtagProtocolTruffleConf.abi,
          signer
        );

        const erc721HashtagRegistryAddress = utils.getContractAddressFromTruffleConf(
          ERC721HashtagRegistry,
          chain.chainId
        );

        const erc721HashtagRegistryContract = new ethers.Contract(
          erc721HashtagRegistryAddress,
          ERC721HashtagRegistry.abi,
          signer
        );

        commit("setWeb3Objects", {
          provider,
          homesteadProvider: ethers.getDefaultProvider("homestead"),
          signer,
          chain,
          contracts: {
            hashtagProtocolContract,
            erc721HashtagRegistryContract,
          },
          account: onboardState.address,
          publisher: "0xd677aed0965ac9b54e709f01a99ceca205aebc4b", //FIXME - hardcoded for now for rinkeby testing
          readyToTransact,
        });

        dispatch("getProtocolFee");
        dispatch("getTaggingFee");
      }
    }

    // dispatch("cacheNFTAssets");
  },

  async changeWallet() {
    await onboard.walletSelect();
  },

  async mint({ state, dispatch }, payload) {
    if (!state.web3Objects.readyToTransact) {
      await dispatch("bootstrap");
    }

    const { contracts, account, publisher } = state.web3Objects;
    const { hashtagProtocolContract } = contracts;

    const tx = await hashtagProtocolContract.mint(payload, publisher, account, {
      value: ethers.utils.bigNumberify(state.fees.protocol),
    });

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
    if (!state.web3Objects.readyToTransact) {
      await dispatch("bootstrap");
    }

    const { web3Objects, fees } = state;
    const { account, contracts, publisher } = web3Objects;
    const { erc721HashtagRegistryContract } = contracts;
    const { hashtagId, nftContract, nftId } = payload;

    // function tag(uint256 _hashtagId, address _nftContract, uint256 _nftId, address _publisher, address _tagger) payable public {
    const tx = await erc721HashtagRegistryContract.tag(
      hashtagId,
      nftContract,
      nftId,
      publisher,
      account,
      {
        value: ethers.utils.bigNumberify(fees.protocol),
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
    const { hashtagProtocolContract } = state.web3Objects.contracts;
    const fee = (await hashtagProtocolContract.fee()).toString();

    commit("setProtocolFee", fee);
  },

  async getTaggingFee({ commit }) {
    const { erc721HashtagRegistryContract } = state.web3Objects.contracts;
    const fee = (
      await erc721HashtagRegistryContract.calculateTagFeeAfterDiscount()
    ).toString();

    commit("setTaggingFee", fee);
  },

  async cacheNFTAssets({ commit }) {
    // just cache KO assets for now...
    const res = await Vue.axios.get(
      `https://rinkeby-api.opensea.io/api/v1/assets?asset_contract_addresses=${KO_RINKEBY_ADDRESS}&order_direction=asc&offset=0&limit=50`
    );

    commit("setNFTAssets", res.data);
  },
};

const mutations = {
  async setProtocolFee(state, fee) {
    Vue.set(state, "fees.platform", fee);
  },

  async setTaggingFee(state, fee) {
    Vue.set(state, "fees.tagging", fee);
  },

  setWeb3Objects(state, payload) {
    Vue.set(state, "web3Objects", payload);
  },

  setNFTAssets(state, payload) {
    Vue.set(state, "nftAssetCache", payload);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
