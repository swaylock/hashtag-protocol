<template>
  <div>
    <section class="main">
      <div class="container">
        <h1 class="title is-1">Tagged NFTs</h1>
        <h2 class="subtitle">
          Content tagged with Hashtag Tokens
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'index' }">Dashboard</nuxt-link>&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="columns is-tablet is-centered">
          <div class="column is-12">
            <article class="is-white box">
              <h2 class="title is-4 is-spaced"></h2>
              <div class="b-table">
                <div class="table-wrapper has-mobile-cards">
                  <table tabindex="0" class="table is-hoverable">
                    <thead>
                      <tr>
                        <th>
                          <div class="th-wrap"></div>
                        </th>
                        <th>
                          <div class="th-wrap">Asset Name</div>
                        </th>
                        <th>
                          <div class="th-wrap">Chain</div>
                        </th>
                        <th>
                          <div class="th-wrap">Hashtag</div>
                        </th>
                        <th>
                          <div class="th-wrap">Tagged</div>
                        </th>
                        <th>
                          <div class="th-wrap">Tagger</div>
                        </th>
                        <th>
                          <div class="th-wrap">Publisher</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="nftInfo">
                      <tr draggable="false" v-for="tag in nftInfo" v-bind:key="tag.id">
                        <td class="has-text-centered">
                          <nuxt-link
                            :to="{
                              name: 'type-contract-id',
                              params: {
                                type: 'nft',
                                contract: tag.nftContract,
                                id: tag.nftId,
                              },
                            }"
                          >
                            <video
                              v-if="tag.nftImage.includes('mp4')"
                              autoplay=""
                              controlslist="nodownload"
                              loop=""
                              playsinline=""
                              poster=""
                              preload="metadata"
                              class="nft-thumb"
                            >
                              <source :src="tag.nftImage" @error="setPendingImage" type="video/mp4" />
                            </video>
                            <img
                              v-else
                              :src="tag.nftImage"
                              @error="setPendingImage"
                              :alt="tag.nftName"
                              class="nft-thumb"
                            />
                          </nuxt-link>
                        </td>
                        <td data-label="Asset Name">
                          <nft-link
                            type="nft"
                            :name="tag.nftName"
                            :contract="tag.nftContract"
                            :id="tag.nftId"
                            :value="tag.nftName"
                          ></nft-link>
                        </td>
                        <td data-label="Chain">
                          {{ tag.nftChain }}
                        </td>
                        <td data-label="Hashtag">
                          <hashtag :value="tag.hashtagDisplayHashtag"></hashtag>
                        </td>
                        <td>
                          <timestamp-from :value="tag.timestamp" class="nowrap"></timestamp-from>
                        </td>
                        <td data-label="Tagger">
                          <eth-account :value="tag.tagger" route="tagger-address"></eth-account>
                        </td>
                        <td>
                          <eth-account :value="tag.publisher" route="publisher-address"></eth-account>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination :entity-count="tagsCount" :page-size="pageSize" @tabSelected="tabSelected" />
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import EthAccount from "~/components/EthAccount";
import Hashtag from "~/components/Hashtag";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import TimestampFrom from "~/components/TimestampFrom";
import { PAGED_TAGS, ALL_TAG_IDS } from "~/apollo/queries";
import axios from "axios";

const PAGE_SIZE = 10;

export default {
  name: "Nfts",
  components: {
    EthAccount,
    Hashtag,
    NftLink,
    Pagination,
    TimestampFrom,
  },
  mounted() {
    this.pullTagsFromAPI();
  },
  watch: {
    // whenever the page changes, this function will run
    pagedTags: function (val) {
      if (val) {
        this.pullTagsFromAPI();
      }
    },
  },
  data() {
    return {
      pageSize: PAGE_SIZE,
      first: PAGE_SIZE,
      skip: 0,
      tagsCount: 0,
      nftInfo: null,
    };
  },
  apollo: {
    pagedTags: {
      query: PAGED_TAGS,
      variables() {
        return {
          first: this.first,
          skip: this.skip,
        };
      },
    },
    tagsCount: {
      query: ALL_TAG_IDS,
      manual: true,
      result({ data }) {
        this.tagsCount = data.tags.length;
      },
    },
  },
  methods: {
    tabSelected(id) {
      this.skip = id * PAGE_SIZE;
    },
    pullTagsFromAPI: async function () {
      let taggedData = await this.$apollo.queries.pagedTags.refetch();
      taggedData = taggedData.data.pagedTags;
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
        let count = 0;
        response.forEach((nft) => {
          if (nft.data.response == "OK") {
            const config = JSON.parse(nft.config.data);
            nft.data.nft.nftId = nft.data.nft.token_id;
            nft.data.nft.nftName = nft.data.nft.metadata.name;
            nft.data.nft.timestamp = config.tagInfo.timestamp;
            nft.data.nft.hashtagDisplayHashtag = config.tagInfo.hashtagDisplayHashtag;
            nft.data.nft.publisher = config.tagInfo.publisher;
            nft.data.nft.tagger = config.tagInfo.tagger;
            nft.data.nft.nftContract = nft.data.nft.contract_address;
            nft.data.nft.nftChain = nft.config.params.chain;
            let res = nft.data.nft.cached_image_url.split("//");
            if (res[0] == "ipfs:") {
              nft.data.nft.image_url = "https://ipfs.io/" + res[1];
            }
            nft.data.nft.nftImage = nft.data.nft.cached_image_url;
            nft.data.nft.id = count;
            count++;
            nftData.push(nft.data.nft);
          }
        });
        this.nftInfo = nftData;
      });
    },
  },
};
</script>

<style lang="scss"></style>
