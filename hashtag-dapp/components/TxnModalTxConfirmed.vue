<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head">
      <p class="modal-card-title has-text-weight-semibold has-text-centered">
        {{ title }}
      </p>
    </header>
    <section class="modal-card-body has-background-white">
      <div class="has-text-centered">
        <span class="box py-6 px-5 mb-6 hashtag-token" v-if="isNewHashtag">
          <b-tag
            type="is-primary"
            size="is-large"
            class="has-text-weight-medium"
            >{{ hashtag.displayHashtag }}</b-tag
          >
        </span>
        <p class="title is-4 has-text-weight-medium">So what next?</p>
        <p v-if="isTagging">
          <a @click="tagAgain"
            >Tag
            <em
              ><strong>{{ targetNftTitle }}</strong></em
            >
            again</a
          >
        </p>
        <p v-if="isNewHashtag">
          <a @click="$emit('close-modal')">Mint another token</a>
        </p>
        <p v-if="isTagging">
          <nuxt-link @click.native="$emit('close-modal')" :to="targetNftRoute"
            >View tagged NFT</nuxt-link
          >
        </p>
        <p v-if="isNewHashtag">
          <nuxt-link
            @click.native="$emit('close-modal')"
            :to="{
              name: 'hashtag-hashtag',
              params: { hashtag: hashtag.hashtagWithoutHash },
            }"
            >View <strong>{{ hashtag.displayHashtag }}</strong></nuxt-link
          >
        </p>
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
export default {
  name: "TxnModalTxConfirmed",
  computed: {
    ...mapGetters("protocolAction", [
      "protocolAction",
      "newHashtag",
      "targetNft",
      "targetHashtag",
    ]),
    ...mapGetters("wallet", ["transactionState"]),
    /**
     * Show txn complete title depending on transaction type.
     */
    title: function () {
      return protocolActionMap[this.protocolAction].txnConfirmedMsg;
    },
    hashtag: function () {
      /* eslint-disable-next-line no-console */
      console.log(this.newHashtag);
      return this.isNewHashtag ? this.newHashtag : null;
    },
    isNewHashtag: function () {
      return this.protocolAction == "mintHashtag" ||
        this.protocolAction == "mintAndTagContent"
        ? true
        : false;
    },
    isTagging: function () {
      return this.protocolAction == "tagContent" ||
        this.protocolAction == "mintAndTagContent"
        ? true
        : false;
    },
    targetNftRoute: function () {
      return `/nft/${this.targetNft.contractAddress}/${this.targetNft.tokenId}`;
    },
    targetNftTitle: function () {
      return this.targetNft.metadataName;
    },
  },
  methods: {
    async tagAgain() {
      // Resets the tagging form.
      await this.$store.dispatch("wallet/updateTransactionState", {
        eventCode: "taggingSelectHashtag",
      });
      await this.$store.dispatch("protocolAction/updateTargetHashtag", {});
    },
  },
};
</script>
