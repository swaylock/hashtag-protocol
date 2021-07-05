<template>
  <section class="hashtag-mint">
    <hashtag-search v-on:select-hashtag="selectHashtag" widget="minting" />
  </section>
</template>
<script>
import HashtagSearch from "~/components/HashtagSearch";
import TxnModal from "~/components/TxnModal";

export default {
  name: "MintingWidget",
  components: { HashtagSearch },
  methods: {
    /**
     * Function to handle when user selects hashtag in HashtagSearch widget.
     */
    async selectHashtag(hashtag) {
      //await this.$store.dispatch("updateTargetHashtag", hashtag);
      if (hashtag.id) {
        /* eslint-disable-next-line no-console */
        console.log("minting widget existing Hashtag", hashtag);
      } else {
        await this.$store.dispatch("protocolAction/updateNewHashtag", hashtag);
        await this.$store.dispatch(
          "protocolAction/updateProtocolAction",
          "mintHashtag"
        );
        await this.$store.dispatch("wallet/updateTransactionState", {
          eventCode: "mintConfirm",
        });
        const mintModal = await this.$buefy.modal.open({
          parent: this,
          component: TxnModal,
          animation: "zoom-in",
          hasModalCard: true,
          trapFocus: true,
        });
        this.$store.dispatch("wallet/captureOpenModalCloseFn", mintModal.close);
      }
      // Updates the transaction fees grid.
      await this.$store.dispatch("transactionFees/updateFees");
    },

    /**
     * Function to handle when user selects existing tag in minting widget.
     *
     * Will return a toast error that the tag is already minted.
     */
    selectExistingTag: function (tag) {
      this.validateTag(tag.hashtagWithoutHash);
    },
    /**
     * Capture the enter key and pop the transaction modal.
     *
     * Function to capture the input field when user hits "Enter."
     * Passes value to validateTag service and pops the
     * transaction modal if it passes validation. Otherwise
     * validateTag shows toast errors.
     */
    async checkIfEnterKey(event) {
      // User is hitting enter.
      if (event.which === 13) {
        const newHashtag = document.getElementById("mint-hashtag").value;
        /* eslint-disable-next-line no-console */
        console.log("checkIfEnterKey", newHashtag);
        if (this.validateTag(newHashtag)) {
          // This is a valid, new hashtag, update the application.
          await this.$store.dispatch("wallet/updateNewHashtag", newHashtag);
          await this.$store.dispatch(
            "protocolAction/updateProtocolAction",
            "mintHashtag"
          );
          // Web3 txn state.
          await this.$store.dispatch("wallet/updateTransactionState", {
            eventCode: "mintConfirm",
          });
          const mintModal = await this.$buefy.modal.open({
            parent: this,
            component: TxnModal,
            animation: "zoom-in",
            hasModalCard: true,
            trapFocus: true,
          });

          this.$store.dispatch(
            "wallet/captureOpenModalCloseFn",
            mintModal.close
          );
        }
      }
    },
    validateTag(hashtag) {
      return this.hashtagValidationService.validateTag(hashtag, this.hashtags);
    },
  },
};
</script>
