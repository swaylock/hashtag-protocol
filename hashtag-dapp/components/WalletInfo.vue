<template>
  <div class="modal-card hashtag-modal">
    <header class="modal-card-head">
      <p class="modal-card-title">Connected account</p>
    </header>
    <section class="modal-card-body">
      <nav class="level box has-background-grey">
        <div class="level-item has-text-centered">
          <div>
            <img src="~/assets/logo-white.svg" width="45" />
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Balance</p>
            <p class="subtitle">{{ balance | toEth(4) }} ETH</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Network</p>
            <p class="subtitle" v-if="networkInfo">{{ networkInfo.Name }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Wallet</p>
            <p class="subtitle" v-if="name">{{ name }}</p>
          </div>
        </div>
      </nav>
      <p
        class="box has-text-weight-medium has-background-dark has-text-white address has-text-centered"
      >
        {{ address }}
      </p>
    </section>
    <footer class="modal-card-foot">
      <nav class="level">
        <div class="level-item has-text-centered">
          <a :href="this.addressUrl" target="_blank">
            <b-icon icon="ethereum" size="is-small"> </b-icon>
            View on Etherscan
          </a>
        </div>
        <div class="level-item has-text-centered">
          <a @click="disconnectWallet">
            <b-icon icon="power-plug-off" size="is-small"> </b-icon>
            Disconnect wallet
          </a>
        </div>
      </nav>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      addressUrl: "",
    };
  },
  computed: {
    ...mapGetters("wallet", [
      "address",
      "balance",
      "name",
      "networkId",
      "networkInfo",
    ]),
  },
  methods: {
    disconnectWallet() {
      this.$store.dispatch("wallet/disconnectWallet");
    },
  },
  async created() {
    this.addressUrl = `${this.networkInfo.url}/address/${this.address}`;
  },
};
</script>

<style lang="scss" scoped></style>
