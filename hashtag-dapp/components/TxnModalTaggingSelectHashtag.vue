<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head p-0" />
    <section class="modal-card-body has-background-white">
      <div class="tile">
        <div class="tile is-6">
          <!-- 1/3 -->
          <nft v-bind:nft="this.targetNft" />
        </div>
        <div class="tile hashtag-search-wrapper">
          <div class="box content form-wrapper">
            <p class="title is-5">Tag this asset</p>
            <hashtag-search
              v-on:select-hashtag="selectHashtag"
              widget="tagging"
            />
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons has-text-centered">
        <b-button type="is-primary" outlined @click="$emit('close-modal')">
          Cancel
        </b-button>
      </div>
    </footer>
  </div>
</template>
<script>
/**
 *
 */
import { mapGetters } from "vuex";
import Nft from "~/components/Assets/Nft";
import HashtagSearch from "~/components/HashtagSearch";
export default {
  components: { Nft, HashtagSearch },
  name: "TxnModalTaggingSelectHashtag",
  data() {
    return {
      hashtagInputTags: [],
      nameContains: [],
    };
  },
  computed: {
    ...mapGetters("protocolAction", [
      "protocolAction",
      "targetNft",
      "targetHashtag",
    ]),
    ...mapGetters("wallet", ["address", "transactionState"]),
  },
  methods: {
    async connectWallet() {
      await this.$store.dispatch("wallet/connectWallet");
    },
    /**
     * Function to handle when user selects hashtag in HashtagSearch widget.
     */
    async selectHashtag(hashtag) {
      /* eslint-disable-next-line no-console */
      console.log("tagging selectHashtag", hashtag);
      await this.$store.dispatch("protocolAction/updateTargetHashtag", hashtag);
      if (hashtag.id) {
        await this.$store.dispatch(
          "protocolAction/updateProtocolAction",
          "tagContent"
        );
      } else {
        await this.$store.dispatch(
          "protocolAction/updateProtocolAction",
          "mintAndTagContent"
        );
        await this.$store.dispatch("protocolAction/updateNewHashtag", hashtag);
      }
      // Updates the transaction fees grid.
      await this.$store.dispatch("transactionFees/updateFees");
    },
  },
};
</script>
<style lang="scss" scoped>
.hashtag-search-wrapper {
  flex-direction: column;

  .box {
    margin: auto 0;
  }
}
</style>
