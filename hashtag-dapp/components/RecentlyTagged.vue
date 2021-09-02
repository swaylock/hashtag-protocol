<template>
  <b-table :data="pullTagsFromAPI(tags) || []" focusable>
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
        <img
          :src="props.row.nftImage"
          :alt="props.row.nftName"
          class="nft-thumb"
        />
      </nuxt-link>
    </b-table-column>
    <b-table-column field="nftName" label="Asset Name" v-slot="props">
      <nft-link
        type="nft"
        :name="props.row.nftName"
        :contract="props.row.nftContract"
        :id="props.row.nftId"
      ></nft-link>
    </b-table-column>
    <b-table-column
      field="projectName"
      label="Project"
      :visible="$screen.widescreen"
      v-slot="props"
    >
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
  methods: {
    pullTagsFromAPI: async function (taggedData) {
      console.log(taggedData);
      const promises = [];
      const headers = {
        Authorization: "32097857-1c85-4b19-b4d6-f79c86c7d2e9",
      };
      taggedData.forEach((nft) => {
        promises.push(
          axios.get(
            "https://api.nftport.xyz/nfts/" + nft.nftContract + "/" + nft.nftId,
            {
              params: {
                chain: "polygon",
                page_number: 1,
                page_size: 50,
              },
              headers: headers,
            }
          )
        );
      });
      await axios.all(promises).then((response) => {
        if (response.response === "NOK") {
          taggedData.forEach((nft) => {
            promises.push(
              axios.get("https://" + nft.nftContract + "/" + nft.nftId, {
                params: {
                  chain: "polygon",
                  page_number: 1,
                  page_size: 50,
                },
                headers: headers,
              })
            );
          });
          axios.all(promises).then((response) => {
            console.log(response);
          });
        } else {
          console.log(response);
        }
      });
    },
  },
};
</script>
