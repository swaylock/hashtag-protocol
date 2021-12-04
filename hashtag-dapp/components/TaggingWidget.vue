<template>
  <section>
    <b-field @keyup.native.enter="onEnter">
      <b-autocomplete
        placeholder='Search NFTs by name; eg "Dog"'
        icon="magnify"
        field="name"
        size="is-medium"
        :loading="isFetching"
        @select="onNftSelected"
        :data="nameContains"
        :value="this.searchString"
      >
        <template slot-scope="props">
          <div class="media">
            <div class="media-left">
              <video
                v-if="props.option.metadataImageURI.includes('mp4')"
                autoplay=""
                controlslist="nodownload"
                loop=""
                playsinline=""
                poster=""
                preload="metadata"
                width="32"
                muted=""
              >
                <source :src="props.option.metadataImageURI" @error="setPendingImage" type="video/mp4" />
              </video>
              <img v-else :src="props.option.metadataImageURI" @error="setPendingImage" width="32" />
            </div>
            <div class="media-content">
              {{ props.option.metadataName }}
              <br />
              <small
                >{{ props.option.contractName }}
                <b>{{ props.option.tokenId }}</b>
              </small>
            </div>
          </div>
        </template>
      </b-autocomplete>
    </b-field>
    <p class="is-7 pl-2 has-text-white">
      search powered by <a href="https://www.nftport.xyz/" target="_blank">NFTPort</a>
    </p>
  </section>
</template>
<script>
import axios from "axios";
import debounce from "lodash/debounce";
import TxnModal from "~/components/TxnModal";
//import TaggingModal from "~/components/TaggingModal";

export default {
  name: "TaggingWidget",
  data() {
    return {
      nameContains: [],
      isFetching: false,
      searchString: null,
    };
  },
  mounted() {
    this.searchString = this.$route.query.value;
  },
  methods: {
    onEnter: function (event) {
      this.$router.push({
        name: "search",
        params: { value: event.target.value },
        query: { value: event.target.value },
      });
    },
    getAsyncData: debounce(async function (name) {
      this.isFetching = true;
      if (!name.length) {
        this.nameContains = [];
        return;
      }

      const headers = {
        Authorization: this.$config.nftPortAPIKey,
      };
      axios
        .get("https://api.nftport.xyz/text_search", {
          params: {
            chain: "all-chains",
            text: name,
            page_number: 1,
            page_size: 50,
          },
          headers: headers,
        })
        .then((response) => {
          if (response.data.response == "OK") {
            const jsonArr = response.data.search_results;
            const saveInfo = [];
            for (var i = 0; i < jsonArr.length; i++) {
              const arrInfo = {};
              arrInfo["contractAddress"] = jsonArr[i].contract_address;
              arrInfo["contractName"] = jsonArr[i].name;
              arrInfo["contractSymbol"] = "test";
              arrInfo["id"] = jsonArr[i].token_id;
              arrInfo["metadataImageURI"] = jsonArr[i].image_url;
              arrInfo["metadataName"] = jsonArr[i].name;
              arrInfo["tokenId"] = jsonArr[i].token_id;
              if (jsonArr[i].chain === "ethereum") {
                arrInfo["chain"] = 1;
              } else if (jsonArr[i].chain === "polygon") {
                arrInfo["chain"] = 137;
              }
              saveInfo.push(arrInfo);
            }
            this.nameContains = saveInfo;
            this.isFetching = false;
            return saveInfo;
          } else {
            this.isFetching = false;
            return [];
          }
        });
    }, 300),
    async onNftSelected(nft) {
      await this.$store.dispatch("protocolAction/updateTargetNft", nft);
      await this.$store.dispatch("wallet/updateTransactionState", {
        eventCode: "taggingSelectHashtag",
      });
      /* eslint-disable-next-line no-console */
      console.log("onNftSelected", nft);
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
  },
};
</script>
<style lang="scss">
nav.search-bar {
  margin-bottom: 2rem;
}
.level .search-widget {
  flex: auto;
  margin: 2rem 0;
  @include from($tablet) {
    margin: 0 3rem;
  }

  section {
    .field {
      margin: 0;
    }
    p {
      display: none;
    }
  }
}
</style>
