import EthGasFeeService from "~/services/EthGasFeeService";
import ExchangeRateService from "~/services/ExchangeRateService";
import protocolActionMap from "~/data/protocolActionMap";
import { format } from "timeago.js";

const state = () => ({
  gasFastest: null,
  gasFast: null,
  gasMedium: null,
  gasSlow: null,
  gasUpdated: null,
  ethUsdExchange: null,
  exchangeRateUpdated: null,
  feeETH: {},
  feeUSD: {},
});

const getters = {
  gasFastest: (state) => state.gasFastest,
  gasFast: (state) => state.gasFast,
  gasMedium: (state) => state.gasMedium,
  gasSlow: (state) => state.gasSlow,
  gasUpdated: (state) => state.gasUpdated,
  ethUsdExchange: (state) => state.ethUsdExchange,
  exchangeRateUpdated: (state) => state.exchangeRateUpdated,
  feeETH: (state) => state.feeETH,
  feeUSD: (state) => state.feeUSD,
};

const actions = {
  async updateFees({ commit, dispatch }) {
    if (!this.state.protocolAction.protocolAction) {
      return;
    }
    this.ethGasFeeService = new EthGasFeeService();
    /* eslint-disable no-console */
    this.ethGasFees = await this.ethGasFeeService
      .fetchGasFees()
      .catch((e) => console.log(e));
    /* eslint-enable no-console */

    if (this.ethGasFees.success) {
      commit("setGasFastest", this.ethGasFees.estimates.fastest);
      commit("setGasFast", this.ethGasFees.estimates.fast);
      commit("setGasMedium", this.ethGasFees.estimates.medium);
      commit("setGasSlow", this.ethGasFees.estimates.slow);
      commit("setGasUpdated", format(new Date(this.ethGasFees.updated)));
    } else {
      // @todo set values to null so as not to have stale prices?
      // or show last updated prices in UI otherwise null.
    }

    this.exchangeRateService = new ExchangeRateService();
    /* eslint-disable no-console */
    this.ethUsdExchangeRate = await this.exchangeRateService
      .fetchEthUsd()
      .catch((e) => console.log(e));
    /* eslint-enable no-console */

    if (this.ethUsdExchangeRate.data.rateUsd) {
      commit("setEthUsdExchange", this.ethUsdExchangeRate.data.rateUsd);

      // Format formats date as "time ago".
      // see https://github.com/hustcc/timeago.js
      commit(
        "setExchangeRateUpdated",
        format(this.ethUsdExchangeRate.timestamp)
      );
    }

    if (this.ethGasFees.success && this.ethUsdExchangeRate.data.rateUsd) {
      dispatch("updateTransactionFees");
    }
    return true;
  },

  async updateTransactionFees({ state, commit }) {
    const ethUsdRate = state.ethUsdExchange / 1000000000;
    const protocolAction = this.state.protocolAction.protocolAction;
    const gasLimit = protocolActionMap[protocolAction].ethGasLimit;

    let fastest, fast, average, slow;
    //let mintingFeeUSD, mintingFeeETH;
    //const gasLimitTagging = 150000;
    //const gasLimitMintAndTag = 190000;

    fastest = (state.gasFastest * gasLimit * 0.000000001).toFixed(4);
    fast = (state.gasFast * gasLimit * 0.000000001).toFixed(4);
    average = (state.gasMedium * gasLimit * 0.000000001).toFixed(4);
    slow = (state.gasSlow * gasLimit * 0.000000001).toFixed(4);

    commit("setFeeETH", {
      fastest: fastest,
      fast: fast,
      average: average,
      slow: slow,
    });

    fastest = (state.gasFastest * gasLimit * ethUsdRate).toFixed(2);
    fast = (state.gasFast * gasLimit * ethUsdRate).toFixed(2);
    average = (state.gasMedium * gasLimit * ethUsdRate).toFixed(2);
    slow = (state.gasSlow * gasLimit * ethUsdRate).toFixed(2);

    commit("setFeeUSD", {
      fastest: fastest,
      fast: fast,
      average: average,
      slow: slow,
    });
  },
};

const mutations = {
  setGasFastest(state, payload) {
    state.gasFastest = payload;
  },
  setGasFast(state, payload) {
    state.gasFast = payload;
  },
  setGasMedium(state, payload) {
    state.gasMedium = payload;
  },
  setGasSlow(state, payload) {
    state.gasSlow = payload;
  },
  setGasUpdated(state, payload) {
    state.gasUpdated = payload;
  },
  setEthUsdExchange(state, payload) {
    state.ethUsdExchange = payload;
  },
  setExchangeRateUpdated(state, payload) {
    state.exchangeRateUpdated = payload;
  },
  setFeeETH(state, payload) {
    state.feeETH = payload;
  },
  setFeeUSD(state, payload) {
    state.feeUSD = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
