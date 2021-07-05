<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head">
      <p class="modal-card-title has-text-weight-semibold has-text-centered">
        Confirm mint
      </p>
    </header>
    <section class="modal-card-body has-background-white">
      <div class="summary has-text-centered confirm-mint">
        <div v-if="!isOpen">
          <span class="box hashtag-token">
            <b-tag
              type="is-primary"
              size="is-large"
              class="has-text-weight-medium"
              >{{ this.newHashtag.displayHashtag }}</b-tag
            >
          </span>
        </div>
        <b-collapse
          v-model="isOpen"
          position="is-bottom"
          aria-id="contentIdForA11y1"
        >
          <template #trigger></template>
          <explain-protocol />
        </b-collapse>
        <a
          class="has-text-weight-medium"
          aria-controls="contentIdForA11y1"
          @click="isOpen = !isOpen"
        >
          <b-icon v-if="isOpen" size="is-small" icon="menu-up"></b-icon>
          {{ !isOpen ? "What's going on here?" : "Close details" }}
        </a>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons" v-if="address == null && address == undefined">
        <b-button
          icon-left="power-plug"
          class="button is-primary is-outlined"
          @click="connectWallet"
        >
          Connect wallet
        </b-button>
      </div>
      <div
        class="buttons"
        v-else-if="
          address !== null &&
          address !== undefined &&
          transactionState.eventCode == 'mintConfirm'
        "
      >
        <b-button type="is-primary" outlined @click="$emit('close-modal')">
          Cancel
        </b-button>
        <b-button type="is-primary" v-on:click="mintHashtag">Confirm </b-button>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ExplainProtocol from "~/components/Transact/ExplainProtocol.vue";

export default {
  name: "TxnModalConfirmMint",
  components: {
    ExplainProtocol,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapGetters("protocolAction", ["protocolAction", "newHashtag"]),
    ...mapGetters("wallet", ["address", "transactionState"]),
  },
  methods: {
    async connectWallet() {
      await this.$store.dispatch("wallet/connectWallet");
    },
    async mintHashtag() {
      await this.$emit("mint-hashtag", this.newHashtag.displayHashtag);
    },
  },
};
</script>
<style lang="scss" scoped></style>
