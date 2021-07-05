<template>
  <div class="modal-card markdown-modal tag-and-mint">
    <section class="modal-card-body has-background-white">
      <div class="tile">
        <div class="tile is-5">
          <!-- 1/3 -->
          <div class="card">
            <div class="card-image">
              <figure class="image">
                <img
                  v-if="this.nft"
                  :src="this.nft.metadataImageURI"
                  alt="Image"
                />
              </figure>
            </div>
            <div class="card-content">
              <span
                class="has-text-weight-bold is-size-6 is-block"
                v-if="this.nft"
                >{{ this.nft.metadataName }}</span
              >
              <Span class="is-size-7 is-block">Known Origin</Span>
            </div>
          </div>
        </div>
        <div class="tile">
          <div class="content form-wrapper">
            <h2 class="is-title is-size-4 is-block">Tag this asset</h2>
            <p class="is-block is-size-6">
              Choose a HASHTAG to describe this digital asset.
            </p>

            <form>
              <div class="field">
                <div class="control">
                  <b-field v-if="hashtags">
                    <b-taginput
                      v-model="hashtag"
                      :data="hashtagInputTags"
                      attached
                      autocomplete
                      :allow-new="false"
                      maxtags="1"
                      field="name"
                      id="tagginginput"
                      ref="tagginginput"
                      icon="pound"
                      size="is-medium"
                      :has-counter="false"
                      placeholder="Enter hashtag"
                      :before-adding="selectExistingTag"
                      @typing="getFilteredTags"
                      @keyup.native="checkIfEnterKey"
                    >
                      <template slot-scope="props">
                        <b-taglist attached>
                          <b-tag type="is-primary" size="is-medium"
                            >{{ props.option.displayHashtag }}
                          </b-tag>
                          <b-tag type="is-dark" size="is-medium"
                            >{{ props.option.tagCount }}
                          </b-tag>
                        </b-taglist>
                      </template>
                      <template slot="empty">
                        <span class="new-hashtag"
                          >Unique HASHTAG! Press enter to continue...</span
                        >
                      </template>
                    </b-taginput>
                  </b-field>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FIRST_THOUSAND_HASHTAGS } from "~/apollo/queries";
import HashtagValidationService from "~/services/HashtagValidationService";
//import TxnModalPreconfirmed from "~/components/TxnModalPreconfirmed";
//import TxnModalConfirmed from "~/components/TxnModalConfirmed";
//import TxnModalRejected from "~/components/TxnModalRejected";
//import TxnModalTxSent from "~/components/TxnModalTxSent";
//import TxnModalTxConfirmed from "~/components/TxnModalTxConfirmed";
export default {
  name: "TaggingModal",
  components: {
    //TxnModalConfirmed,
    //TxnModalRejected,
    //TxnModalPreconfirmed,
    //TxnModalTxConfirmed,
    //TxnModalTxSent,
  },
  data() {
    return {
      hashtag: null,
      newHashtag: null,
      mintAndTag: false,
      hashtagInput: null,
      hashtagInputTags: [],
      nameContains: [],
      isFetching: false,
      tagForm: {
        hashtag: null,
        nft: null,
        nftName: null,
      },
    };
  },
  props: {
    nft: Object,
  },
  computed: {
    ...mapGetters("wallet", ["address", "transactionState"]),
    isTaggable() {
      return (
        this.nftName &&
        this.nftName.length > 0 &&
        this.hashtag &&
        this.hashtag.length > 0
      );
    },
  },
  apollo: {
    hashtags: {
      query: FIRST_THOUSAND_HASHTAGS,
      pollInterval: 1000, // ms
    },
  },
  methods: {
    // Updates the transaction fees grid.
    async updateFees() {
      await this.$store.dispatch("transactionFees/updateFees");
    },
    async connectWallet() {
      await this.$store.dispatch("wallet/connectWallet");
    },
    /**
     * Search for existing tags in tagging widget.
     *
     * @param string text entered into tagging widget
     */
    getFilteredTags: function (text) {
      const hashtags = this.hashtags || [];
      console.log("getFilteredTags", hashtags.length);
      this.hashtagInputTags = hashtags.filter((tag) => {
        //console.log("getFilteredTags", tag);
        return (
          tag && `${tag.name.toLowerCase()}`.indexOf(text.toLowerCase()) === 1
        );
      });
    },
    /**
     * Function to handle when user selects existing tag in minting widget.
     *
     * Will return a toast error that the tag is already minted.
     */
    selectExistingTag: function (tag) {
      console.log("select existing", tag);
      if (this.validateTag(tag.hashtagWithoutHash)) {
        console.log("lets tag with existing tag!");
      }
    },
    /**
     * Capture the enter key and pop the transaction modal.
     *
     * Function to capture the input field when user hits "Enter."
     * Passes value to validateTag service and pops the
     * transaction modal if it passes validation. Otherwise
     * validateTag shows toast errors.
     */
    checkIfEnterKey: function (event) {
      // User is hitting enter.
      if (event.which === 13) {
        this.newHashtag = document.getElementById("tagginginput").value;
        if (this.validateTag(this.newHashtag)) {
          console.log("enter");

          console.log("lets go mint and tag!");
          //const mintModal = this.$buefy.modal.open({
          //  parent: this,
          //  component: TxnModal,
          //  animation: "zoom-in",
          //  hasModalCard: true,
          //  trapFocus: true,
          //  props: {
          //    newHashtag: this.newHashtag,
          //    txnType: "mint",
          //  },
          //});
          //this.$store.dispatch("wallet/captureOpenModalCloseFn", mintModal.close);
        }
      }
    },
    async tagNft() {
      if (this.mintAndTag) {
        await this.$store.dispatch("wallet/mintAndTag", {
          hashtag: this.hashtag[0],
          nftContract: this.nft.contractAddress,
          nftId: this.nft.tokenId,
        });
      } else {
        const hashtag = this.hashtag[0];
        let hashtagValue = hashtag && hashtag.name ? hashtag.name : hashtag;
        if (hashtagValue.charAt(0) !== "#") {
          hashtagValue = `#${hashtagValue}`;
        }

        const hashtags = this.hashtags || [];
        const findExistingHashtagResult = hashtags.filter(
          (tag) => tag.name.toLowerCase() === hashtagValue.toLowerCase()
        );

        await this.$store.dispatch("wallet/tag", {
          hashtagId: findExistingHashtagResult[0].id,
          nftContract: this.nft.contractAddress,
          nftId: this.nft.tokenId,
        });
      }

      this.resetModalForm();
      this.isTagModalActive = false;
    },
    resetModalForm() {
      this.hashtag = null;
      this.nft = null;
      this.nftName = null;
    },
    validateTag(hashtag) {
      return this.hashtagValidationService.validateTag(hashtag);
    },
    tagAssetValidation(hashtag) {
      const tagContentValid = this.validateTag(hashtag);
      if (tagContentValid) {
        const hashtagValue =
          this.hashtag[0] && this.hashtag[0].name
            ? this.hashtag[0].name
            : this.hashtag[0];

        const isNewHashtag =
          (this.hashtagInputTags || []).filter((option) => {
            return (
              option.name.toLowerCase().indexOf(hashtagValue.toLowerCase()) >= 0
            );
          }).length === 0;

        this.mintAndTag = isNewHashtag;
      }
    },
    // Mint new hashtag button is clicked.
    async mintHashtag() {
      try {
        await this.$store.dispatch("wallet/mint", `#${this.newHashtag}`);
      } catch (e) {
        if (e.code == 4001) {
          // user rejected txn in metamask.
          await this.$store.dispatch("wallet/updateTransactionState", {
            eventCode: "rejected",
          });
        }
      }
    },
  },
  async mounted() {
    this.updateFees();
    this.$store.dispatch("wallet/updateTransactionState", {
      eventCode: "mintPreconfirmed",
    });
  },
  created() {
    this.hashtagValidationService = new HashtagValidationService(
      this.$buefy.toast
    );
  },
};
</script>
<style lang="scss" scoped>
.tag-and-mint {
  .form-wrapper {
    padding: 1rem;
  }
}
</style>
