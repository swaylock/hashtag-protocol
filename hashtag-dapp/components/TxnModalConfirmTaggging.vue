<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head p-0" />
    <section class="modal-card-body has-background-white">
      <div class="tile">
        <div class="tile is-6" v-if="!detailsOpen">
          <!-- 1/3 -->
          <nft v-bind:nft="this.targetNft" />
        </div>
        <div class="tile hashtag-search-wrapper">
          <div class="content">
            <p class="is-title is-size-4 is-block" v-if="!detailsOpen">
              Tag
              <em
                ><strong>{{ this.targetNft.metadataName }}</strong></em
              >
              with
              <span class="nowrap">
                <b-tag
                  type="is-primary"
                  size="is-large"
                  class="has-text-weight-medium"
                  >{{ this.targetHashtag.displayHashtag }}</b-tag
                >&nbsp;?</span
              >
            </p>
            <div class="has-text-centered">
              <b-collapse
                v-model="detailsOpen"
                position="is-bottom"
                aria-id="contentIdForA11y1"
              >
                <template #trigger></template>
                <explain-protocol />
              </b-collapse>
            </div>
          </div>
        </div>
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
          transactionState.eventCode == 'taggingSelectHashtag'
        "
      >
        <b-button type="is-primary" outlined @click="$emit('cancel-tagging')">
          Back
        </b-button>
        <b-button type="is-primary" v-on:click="tagContent"
          >{{ actionButtonLabel }}
        </b-button>

        <b-icon
          v-if="!detailsOpen"
          icon="help-circle-outline"
          type="is-primary"
          @click="detailsOpen = !detailsOpen"
        ></b-icon>
        <a
          class="has-text-weight-medium"
          aria-controls="contentIdForA11y1"
          @click="detailsOpen = !detailsOpen"
          >{{ !detailsOpen ? "Info" : "Close info" }}
        </a>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import protocolActionMap from "~/data/protocolActionMap";
import ExplainProtocol from "~/components/Transact/ExplainProtocol";
import Nft from "~/components/Assets/Nft";
export default {
  name: "TxnModalConfirmTagging",
  components: {
    ExplainProtocol,
    Nft,
  },
  data() {
    return {
      detailsOpen: false,
    };
  },
  computed: {
    ...mapGetters("protocolAction", [
      "protocolAction",
      "targetNft",
      "targetHashtag",
    ]),
    ...mapGetters("wallet", ["address", "transactionState"]),
    actionButtonLabel: function () {
      return protocolActionMap[this.protocolAction].actionLabel;
    },
  },
  methods: {
    async connectWallet() {
      await this.$store.dispatch("wallet/connectWallet");
    },
    async tagContent() {
      this.$emit("tag-content");
    },
  },
};
</script>
<style lang="scss" scoped>
.hashtag-search-wrapper {
  flex-direction: column;
  margin: auto 0;
  text-align: center;

  .buttons {
    margin: 0 auto;
    justify-content: center;
  }
}
</style>
