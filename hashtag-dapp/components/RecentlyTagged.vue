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
        <video
          v-if="props.row.nftImage.includes('mp4')"
          autoplay=""
          controlslist="nodownload"
          loop=""
          playsinline=""
          poster=""
          preload="metadata"
          muted=""
          class="nft-thumb"
        >
          <source :src="props.row.nftImage" @error="setPendingImage" type="video/mp4" />
        </video>
        <img v-else :src="props.row.nftImage" @error="setPendingImage" class="nft-thumb" :alt="props.row.nftName" />
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
    <b-table-column field="projectName" label="Chain" :visible="$screen.widescreen" v-slot="props">
      {{ props.row.nftChain }}
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
    pullTagsFromAPI: async function () {
      let taggedData = await this.$apollo.queries.tags.refetch();
      taggedData = taggedData.data.tags;
      const promises = [];
      const headers = {
        Authorization: this.$config.nftPortAPIKey,
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
            data: {
              tagInfo: nft,
            },
            headers: headers,
          }),
        );
      });
      await axios.all(promises).then((response) => {
        let nftData = [];
        response.forEach((nft) => {
          if (nft.data.response == "OK") {
            const config = JSON.parse(nft.config.data);
            nft.data.nft.nftId = nft.data.nft.token_id;
            nft.data.nft.nftName = nft.data.nft.metadata.name;
            nft.data.nft.hashtagDisplayHashtag = config.tagInfo.hashtagDisplayHashtag;
            nft.data.nft.nftContract = nft.data.nft.contract_address;
            nft.data.nft.nftChain = nft.config.params.chain;
            let res = nft.data.nft.cached_image_url.split("//");
            if (res[0] == "ipfs:") {
              nft.data.nft.image_url = "https://ipfs.io/" + res[1];
            }
            nft.data.nft.nftImage = nft.data.nft.cached_image_url;
            nftData.push(nft.data.nft);
          }
        });
        this.data = nftData;
      });
    },
  },
};
</script>
