<template>
  <section>
    <b-field>
      <b-autocomplete
        placeholder='Search NFTs by name; eg "Dog"'
        icon="magnify"
        field="name"
        size="is-medium"
        :loading="isFetching"
        @select="onNftSelected"
        @typing="getAsyncData"
        :data="nameContains"
      >
        <template slot-scope="props">
          <div class="media">
            <div class="media-left">
              <img :src="props.option.metadataImageURI" width="32" />
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
    };
  },
  methods: {
    getAsyncData: debounce(async function (name) {
      if (!name.length) {
        this.nameContains = [];
        return;
      }

      const headers = {
        Authorization: "32097857-1c85-4b19-b4d6-f79c86c7d2e9",
      };
      const { data } = await axios
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
            console.log(response);
            const jsonArr = response.data.search_results;
            const saveInfo = [];
            for (var i = 0; i < jsonArr.length; i++) {
              const arrInfo = {};
              arrInfo["contractAddress"] = jsonArr[i].contract_id;
              arrInfo["contractName"] = jsonArr[i].name;
              arrInfo["contractSymbol"] = "test";
              arrInfo["id"] = jsonArr[i].token_id;
              arrInfo["metadataImageURI"] = jsonArr[i].image_url;
              arrInfo["metadataName"] = jsonArr[i].name;
              arrInfo["tokenId"] = jsonArr[i].token_id;
              arrInfo["chain"] = jsonArr[i].chain;
              saveInfo.push(arrInfo);
            }
            console.log("save info", saveInfo);
            this.nameContains = saveInfo;
            return saveInfo;
          } else {
            return [];
          }
        });
      console.log(data);
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

      this.$store.dispatch(
        "wallet/captureOpenModalCloseFn",
        taggingModal.close
      );
    },
  },
};
</script>
