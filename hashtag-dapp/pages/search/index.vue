<template>
  <section class="main">
    <div class="container">
      <h1 class="title is-1">NFT search</h1>
      <nav class="level search-bar">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item" v-if="this.searchString">
            <h2 class="subtitle">
              showing results for <strong>"{{ this.searchString }}"</strong>
            </h2>
          </div>
        </div>
        <!-- Right side -->
        <div class="level search-widget">
          <TaggingWidget />
        </div>
        <div class="level-right">
          <div class="level-item">
            <span class="is-size-6 has-text-weight-bold">
              <nuxt-link :to="{ name: 'index' }">Dashboard</nuxt-link>&nbsp;
              <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
            </span>
          </div>
        </div>
      </nav>
    </div>
    <div class="container pt-3">
      <div class="columns is-multiline">
        <div v-for="tag in nftInfo" v-bind:key="tag.id" class="column is-one-quarter">
          <div class="card" @click="onNftSelected(tag)">
            <div class="card-image">
              <figure class="image is-square">
                <video
                  class="has-ratio"
                  v-if="tag.metadataImageURI.includes('mp4')"
                  autoplay=""
                  controls=""
                  controlslist="nodownload"
                  loop=""
                  playsinline=""
                  poster=""
                  preload="metadata"
                  muted=""
                >
                  <source :src="tag.metadataImageURI" @error="setPendingImage" type="video/mp4" />
                </video>
                <img
                  class="auto-size-image"
                  v-else
                  :src="tag.metadataImageURI"
                  @error="setPendingImage"
                  :alt="tag.nftName"
                />
              </figure>
            </div>
            <div class="card-content">
              <h2 class="title is-5">
                <div class="text-overflow">{{ tag.nftName }}</div>
              </h2>
              <div class="b-table">
                <div class="table-wrapper">
                  <table class="table">
                    <tbody>
                      <tr draggable="false" class="">
                        <td class="has-text-weight-bold">Chain</td>
                        <td>
                          {{ tag.chainName }}
                        </td>
                      </tr>
                      <tr draggable="false" class="">
                        <td class="has-text-weight-bold">Contract Address</td>
                        <td>
                          <eth-account :value="tag.contractAddress" route="tagger-address"></eth-account>
                        </td>
                      </tr>
                      <tr draggable="false" class="">
                        <td class="has-text-weight-bold">Asset Id</td>
                        <td>
                          <div v-if="tag.nftId.length < 20">{{ tag.nftId }}</div>
                          <div v-else>{{ tag.nftId.substring(0, 16) + "..." }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TaggingWidget from "~/components/TaggingWidget";
import TxnModal from "~/components/TxnModal";
import axios from "axios";

const PAGE_SIZE = 10;

export default {
  name: "Nfts",
  props: ["value"],
  components: {
    TaggingWidget,
  },
  data() {
    return {
      pageSize: PAGE_SIZE,
      first: PAGE_SIZE,
      skip: 0,
      tagsCount: 0,
      nftInfo: null,
      searchString: null,
    };
  },
  computed: {
    query() {
      return this.$route.query.value;
    },
  },
  mounted() {
    this.searchString = this.$route.query.value;
    this.searchTags();
  },
  watch: {
    // Watch the computed function query() for changes to the query string.
    query(newQuery) {
      this.searchString = newQuery;
      this.searchTags();
    },
  },
  methods: {
    tabSelected(id) {
      this.skip = id * PAGE_SIZE;
    },
    async onNftSelected(nft) {
      await this.$store.dispatch("protocolAction/updateTargetNft", nft);
      await this.$store.dispatch("wallet/updateTransactionState", {
        eventCode: "taggingSelectHashtag",
      });
      const taggingModal = this.$buefy.modal.open({
        parent: this,
        component: TxnModal,
        animation: "zoom-in",
        hasModalCard: true,
        width: 960,
        trapFocus: true,
      });

      this.$store.dispatch("wallet/captureOpenModalCloseFn", taggingModal.close);
    },
    searchTags: async function () {
      this.nftInfo = null;
      const headers = {
        Authorization: this.$config.nftPortAPIKey,
      };
      axios
        .get("https://api.nftport.xyz/text_search", {
          params: {
            chain: "all-chains",
            text: this.searchString,
            page_number: 1,
            page_size: 50,
          },
          headers: headers,
        })
        .then((response) => {
          if (response.data.response == "OK") {
            const jsonArr = response.data.search_results;
            let saveInfo = [];
            for (var i = 0; i < jsonArr.length; i++) {
              const arrInfo = {};
              arrInfo["id"] = i;
              arrInfo["contractAddress"] = jsonArr[i].contract_address;
              arrInfo["nftName"] = jsonArr[i].name;
              arrInfo["contractSymbol"] = "test";
              arrInfo["nftId"] = jsonArr[i].token_id;
              arrInfo["metadataImageURI"] = jsonArr[i].image_url;
              arrInfo["metadataName"] = jsonArr[i].name;
              arrInfo["tokenId"] = jsonArr[i].token_id;
              arrInfo["chainName"] = jsonArr[i].chain;
              if (jsonArr[i].chain === "ethereum") {
                arrInfo["chain"] = 1;
              } else if (jsonArr[i].chain === "polygon") {
                arrInfo["chain"] = 137;
              }
              saveInfo.push(arrInfo);
            }
            this.nftInfo = saveInfo;
          }
        });
    },
  },
};
</script>

<style lang="scss">
.auto-size-image {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
