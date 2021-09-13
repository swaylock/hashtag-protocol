<template>
  <b-table :data="data" focusable>
    <template slot="footer" v-if="!isCustom">
      <div class="has-text-right">
        <nuxt-link :to="{ name: 'nfts' }"> Browse tagged assets </nuxt-link>
        &nbsp;
        <b-icon icon="arrow-right" type="is-dark" size="is-small"> </b-icon>
      </div>
    </template>
    <b-table-column field="nftId" centered v-slot="props">
      <nuxt-link
        :to="{
          name: 'type-contract-id',
          params: {
            type: 'nft',
            contract: props.row.nftContract,
            id: props.row.nftId,
          },
        }"
      >
        <img :src="props.row.nftImage" :alt="props.row.nftName" class="nft-thumb" />
      </nuxt-link>
    </b-table-column>
    <b-table-column field="nftName" label="Asset Name" v-slot="props">
      <nft-link
        type="nft"
        :name="props.row.nftName"
        :contract="props.row.nftContract"
        :id="props.row.nftId"
        :value="props.row.nftName"
      ></nft-link>
    </b-table-column>
    <b-table-column field="projectName" label="Project" :visible="$screen.widescreen" v-slot="props">
      {{ props.row.nftContractName }}
    </b-table-column>
    <b-table-column field="hashtagName" label="Hashtag" v-slot="props">
      <hashtag :value="props.row.hashtagDisplayHashtag"></hashtag>
    </b-table-column>
    <template #empty>
      <div class="has-text-centered">No records</div>
    </template>
  </b-table>
</template>
<script>
import { SNAPSHOT } from "~/apollo/queries";
import axios from "axios";

export default {
  name: "TaggingWidget",
  data() {
    return {
      data: [],
      isCustom: false,
    };
  },
  apollo: {
    tags: {
      query: SNAPSHOT,
      pollInterval: 1000, // ms
    },
  },
  mounted() {
    this.pullTagsFromAPI(this.tags);
  },
  methods: {
    pullTagsFromAPI: async function (taggedData) {
      //let taggedData = await this.$apollo.queries.tags.refetch();
      //taggedData = taggedData.data.tags;
      console.log(taggedData);
      const promises = [];
      const headers = {
        Authorization: "32097857-1c85-4b19-b4d6-f79c86c7d2e9",
      };
      taggedData.forEach((nft) => {
        let chain = "";
        if (nft.nftChainId === "1") {
          chain = "ethereum";
        } else if (nft.nftChainId === "137") {
          chain = "polygon";
        }
        promises.push(
          axios.get("https://api.nftport.xyz/nfts/" + nft.nftContract + "/" + nft.nftId, {
            params: {
              chain: chain,
              page_number: 1,
              page_size: 50,
            },
            headers: headers,
          }),
        );
      });
      await axios.all(promises).then((response) => {
        let nftData = [];
        response.forEach((nft) => {
          if (nft.data.response == "OK") {
            nft.data.nft.nftID = nft.data.nft.token_id;
            nft.data.nft.nftName = nft.data.nft.metadata.name;
            taggedData.forEach((elem) => {
              if (nft.data.nft.contract_address == elem.nftContract && nft.data.nft.token_id == elem.nftId) {
                nft.data.nft.hashtagDisplayHashtag = elem.hashtagDisplayHashtag;
              }
            });
            nft.data.nft.nftContract = nft.data.nft.contract_address;
            let res = nft.data.nft.image_url.split("//");
            console.log(res);
            if (res[0] == "ipfs:") {
              nft.data.nft.image_url = "https://ipfs.io/" + res[1];
            }
            nft.data.nft.nftImage = nft.data.nft.image_url;
            nftData.push(nft.data.nft);
          }
        });
        console.log(nftData);
        this.data = nftData;
      });
    },
  },
};
</script>
