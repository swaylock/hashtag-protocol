<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head" />
    <section class="modal-card-body has-background-white">
      <div class="has-text-centered has-background-white">
        <div class="mb-6">
          <lottie-animation :path="animation" />
        </div>
        <p class="title has-text-weight-semibold">{{ title }}</p>
        <p class="mb-6">
          When complete, this screen will update or you may close this window
          and receive updates in the main site.
        </p>
        <a :href="etherscanUrl" target="_blank">view on Etherscan</a>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <b-button type="is-primary" @click="$emit('close-modal')">
          Close
        </b-button>
      </div>
    </footer>
  </div>
</template>
<script>
/**
 * Transaction sent to be mined in blockchain
 *
 * Modal card displayed when web3 transaction is sent and/or pending
 * in the mempool. eg. Immediately after clicking the tx. approve
 * button in metamask or equivalent wallet.
 *
 * @see TxnModal.vue for transaction screen sequence.
 */
import { mapGetters } from "vuex";
import protocolActionMap from "~/data/protocolActionMap";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs
export default {
  name: "TxnModalSent",
  components: {
    LottieAnimation,
  },
  computed: {
    ...mapGetters("protocolAction", [
      "protocolAction",
      "newHashtag",
      "targetNft",
    ]),
    ...mapGetters("wallet", ["address", "transactionState"]),
    etherscanUrl: function () {
      return `${process.env.etherscanBaseUrl}/tx/${this.transactionState.hash}`;
    },
    /**
     * Show txn complete title & animation depending on transaction type.
     */
    title: function () {
      return protocolActionMap[this.protocolAction].txnSentMsg;
    },
    animation: function () {
      return `./animations/${
        protocolActionMap[this.protocolAction].animationFile
      }`;
    },
  },
};
</script>
