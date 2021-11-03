<template>
  <span>
    <TxnModalConfirmMint
      v-if="this.transactionState.eventCode == 'mintConfirm'"
      v-on:mint-hashtag="mintHashtag"
      v-on:close-modal="closeModal"
    />
    <TxnModalTaggingSelectHashtag
      v-if="
        transactionState.eventCode == 'taggingSelectHashtag' &&
        !hashtagSelectedForTagging
      "
      v-on:close-modal="closeModal"
    />
    <TxnModalConfirmTagging
      v-if="hashtagSelectedForTagging"
      v-on:tag-content="tagContent"
      v-on:cancel-tagging="cancelTagging"
    />
    <TxnModalProtocolActionConfirmed
      v-if="transactionState.eventCode == 'protocolActionConfirmed'"
      v-on:close-modal="closeModal"
    />
    <TxnModalTxRejected
      v-if="transactionState.eventCode == 'rejected'"
      v-on:close-modal="closeModal"
    />
    <TxnModalTxSent
      v-if="
        transactionState.eventCode == 'txSent' ||
        transactionState.eventCode == 'txPool'
      "
      v-on:close-modal="closeModal"
    />
    <TxnModalTxConfirmed
      v-if="transactionState.eventCode == 'txConfirmed'"
      v-on:close-modal="closeModal"
    />
  </span>
</template>

<script>
/**
 * Primary protocol transaction modal
 *
 * Opened from the primary protocol action widgets (minting & tagging).
 * Orchestrates the screen (component) shown in the transaction modal depending
 * on transaction status and transaction type.
 */
import { mapGetters } from "vuex";
import TxnModalConfirmMint from "~/components/TxnModalConfirmMint";
import TxnModalTaggingSelectHashtag from "~/components/TxnModalTaggingSelectHashtag";
import TxnModalConfirmTagging from "~/components/TxnModalConfirmTaggging";
import TxnModalProtocolActionConfirmed from "~/components/TxnModalProtocolActionConfirmed";
import TxnModalTxRejected from "~/components/TxnModalTxRejected";
import TxnModalTxSent from "~/components/TxnModalTxSent";
import TxnModalTxConfirmed from "~/components/TxnModalTxConfirmed";
export default {
  name: "TxnModal",
  components: {
    TxnModalConfirmMint,
    TxnModalTaggingSelectHashtag,
    TxnModalConfirmTagging,
    TxnModalTxRejected,
    TxnModalProtocolActionConfirmed,
    TxnModalTxConfirmed,
    TxnModalTxSent,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("protocolAction", [
      "protocolAction",
      "newHashtag",
      "targetNft",
      "targetHashtag",
    ]),
    ...mapGetters("wallet", ["address", "transactionState"]),
    /**
     * Boolean on whether a hashtag was selected for tagging an NFT.
     */
    hashtagSelectedForTagging: function () {
      return (this.protocolAction == "tagContent" ||
        this.protocolAction == "mintAndTagContent") &&
        this.transactionState.eventCode == "taggingSelectHashtag" &&
        this.targetHashtag.displayHashtag
        ? true
        : false;
    },
  },
  methods: {
    // Update the transaction fees grid.
    async updateFees() {
      await this.$store.dispatch("transactionFees/updateFees");
    },
    async connectWallet() {
      await this.$store.dispatch("wallet/connectWallet");
    },
    // Mint new hashtag button is clicked.
    async mintHashtag(hashtag) {
      try {
        /* eslint-disable-next-line no-console */
        console.log("mintHashtag", hashtag);
        await this.$store.dispatch("wallet/mint", hashtag);
      } catch (e) {
        if (e.code == 4001) {
          // user rejected txn in metamask.
          await this.$store.dispatch("wallet/updateTransactionState", {
            eventCode: "rejected",
          });
        }
      }
    },
    async tagContent() {
      const hashtag = this.targetHashtag;
      /* eslint-disable-next-line no-console */
      console.log("tagContent", hashtag);
      if (hashtag.id) {
        // Tag with existing HASHTAG.
        try {
          await this.$store.dispatch("wallet/tag", {
            hashtagId: hashtag.id,
            nftContract: this.targetNft.contractAddress,
            nftId: this.targetNft.tokenId,
          });
        } catch (e) {
          if (e.code == 4001) {
            // user rejected txn in metamask.
            await this.$store.dispatch("wallet/updateTransactionState", {
              eventCode: "rejected",
            });
          }
        }
      } else {
        /* eslint-disable-next-line no-console */
        console.log("mint and tag");
        /* eslint-disable-next-line no-console */
        console.log("nft", this.targetNft);
        /* eslint-disable-next-line no-console */
        console.log("hashtag", hashtag.displayHashtag);
        // Mint new HASHTAG and tag with that.
        try {
          await this.$store.dispatch("wallet/mintAndTag", {
            hashtag: hashtag.displayHashtag,
            nftContract: this.targetNft.contractAddress,
            nftId: this.targetNft.tokenId,
          });
        } catch (e) {
          if (e.code == 4001) {
            // user rejected txn in metamask.
            await this.$store.dispatch("wallet/updateTransactionState", {
              eventCode: "rejected",
            });
          }
        }
      }
    },
    async cancelTagging() {
      await this.$store.dispatch("protocolAction/updateTargetHashtag", {});
    },
    async closeModal() {
      this.$parent.close();
      await this.$store.dispatch("protocolAction/updateTargetHashtag", {});
    },
  },
  async mounted() {
    this.updateFees();
  },
};
</script>
<style lang="scss" scoped></style>
