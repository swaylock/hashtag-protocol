<template>
  <div class="auction">
    <section class="main" v-if="creatorByAcc">
      <div class="container">
        <h1 class="title is-1">Creator: <eth-account :value="creator"></eth-account></h1>
        <h2 class="subtitle">
          Hashtag Protocol Token Creator
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'creators' }">Browse creators</nuxt-link>&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <h2 class="title is-4">Creator information</h2>
                <div class="b-table">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Creator address</td>
                          <td>
                            <eth-account :value="creator"></eth-account>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <h2 class="title is-4">Market summary</h2>
                <div class="b-table" v-if="creatorByAcc">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Hashtags</td>
                          <td>
                            {{ creatorByAcc.mintCount }}
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagged content</td>
                          <td>
                            {{ creatorByAcc.tagCount }}
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagging revenue</td>
                          <td>
                            <eth-amount :value="creatorByAcc.tagFees"></eth-amount>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Total revenue</td>
                          <td>
                            <eth-amount-sum :value1="creatorByAcc.tagFees" :value2="0"></eth-amount-sum>
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
        <div class="columns is-tablet is-centered">
          <div class="column is-12">
            <article class="is-white box">
              <h2 class="title is-4 is-spaced">Activity for <eth-account :value="creator"></eth-account></h2>
              <b-tabs v-model="activeTab" :animated="false">
                <b-tab-item label="Hashtags">
                  <div class="b-table">
                    <div class="table-wrapper has-mobile-cards">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>
                              <div class="th-wrap">Hashtag</div>
                            </th>
                            <th>
                              <div class="th-wrap">Created</div>
                            </th>
                            <th>
                              <div class="th-wrap">Publisher</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr draggable="false" class="" v-for="hashtag in hashtagsByCreator" v-bind:key="hashtag.id">
                            <td data-label="Hashtag" class="">
                              <hashtag :value="hashtag.displayHashtag"></hashtag>
                            </td>
                            <td data-label="Created" class="">
                              <timestamp-from :value="hashtag.timestamp"></timestamp-from>
                            </td>
                            <td data-label="Publisher" class="">
                              <eth-account :value="hashtag.publisher" route="publisher-address"></eth-account>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Pagination
                        :entity-count="hashtagsTab.hashtagsCount"
                        :page-size="hashtagsTab.pageSize"
                        @tabSelected="hashtagsTabSelected"
                      />
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="Tagged content">
                  <div class="b-table">
                    <div class="table-wrapper has-mobile-cards">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>
                              <div class="th-wrap"></div>
                            </th>
                            <th>
                              <div class="th-wrap">Chain</div>
                            </th>
                            <th>
                              <div class="th-wrap">Project</div>
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
                          </tr>
                        </thead>
                        <tbody v-if="nftInfo">
                          <tr v-for="tag in nftInfo" v-bind:key="tag.id">
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
                                  muted=""
                                  class="nft-thumb"
                                >
                                  <source :src="tag.nftImage" @error="setPendingImage" type="video/mp4" />
                                </video>
                                <img
                                  v-else
                                  :src="tag.nftImage"
                                  @error="setPendingImage"
                                  class="nft-thumb"
                                  :alt="tag.nftName"
                                />
                              </nuxt-link>
                            </td>
                            <td data-label="Asset Name" class="">
                              <nft-link
                                type="nft"
                                :name="tag.nftName"
                                :contract="tag.nftContract"
                                :id="tag.nftId"
                                :value="tag.nftName"
                              ></nft-link>
                            </td>
                            <td data-label="Chain" class="">
                              {{ tag.nftChain }}
                            </td>
                            <td data-label="Hashtag" class="">
                              <hashtag :value="tag.hashtagDisplayHashtag"></hashtag>
                            </td>
                            <td data-label="Tagged" class="">
                              <timestamp-from :value="tag.timestamp"></timestamp-from>
                            </td>
                            <td data-label="Tagger" class="">
                              <eth-account :value="tag.tagger" route="tagger-address"></eth-account>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Pagination
                        :entity-count="taggedContentTab.taggedCount"
                        :page-size="taggedContentTab.pageSize"
                        @tabSelected="taggedContentTabSelected"
                      />
                    </div>
                  </div>
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import EthAccount from "~/components/EthAccount";
import {
  PAGED_HASHTAGS_BY_CREATOR,
  CREATOR_BY_ACC,
  PAGED_TAGS_BY_TAGGER,
  ALL_TAG_IDS_BY_TAGGER,
  ALL_HASHTAG_IDS_BY_CREATOR,
} from "~/apollo/queries";
import EthAmount from "~/components/EthAmount";
import EthAmountSum from "~/components/EthAmountSum";
import Hashtag from "~/components/Hashtag";
import TimestampFrom from "~/components/TimestampFrom";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import axios from "axios";

const PAGE_SIZE = 10;

export default {
  name: "CreatorDetail",
  components: {
    EthAmountSum,
    EthAmount,
    EthAccount,
    Hashtag,
    NftLink,
    Pagination,
    TimestampFrom,
  },
  asyncData({ params }) {
    return {
      activeTab: 0,
      isOwnerInfoModalActive: false,
      isMarketSummaryActive: false,
      isActivityModalActive: false,
      creator: params.address,
      tagsByHashtag: null,
      hashtagsByName: null,
      hashtagsTab: {
        pageSize: PAGE_SIZE,
        first: PAGE_SIZE,
        skip: 0,
        hashtagsCount: 0,
      },
      taggedContentTab: {
        pageSize: PAGE_SIZE,
        first: PAGE_SIZE,
        skip: 0,
        taggedCount: 0,
      },
      nftInfo: null,
    };
  },
  mounted() {
    this.pullTagsFromAPI();
  },
  watch: {
    // whenever question changes, this function will run
    tagsByTagger: function (val) {
      if (val) {
        this.pullTagsFromAPI();
      }
    },
  },
  apollo: {
    creatorByAcc: {
      query: CREATOR_BY_ACC,
      variables() {
        return {
          id: this.creator,
        };
      },
    },
    hashtagsByCreator: {
      query: PAGED_HASHTAGS_BY_CREATOR,
      variables() {
        return {
          creator: this.creator,
          first: this.hashtagsTab.first,
          skip: this.hashtagsTab.skip,
        };
      },
    },
    allHashtagsByCreator: {
      query: ALL_HASHTAG_IDS_BY_CREATOR,
      manual: true,
      result({ data }) {
        this.hashtagsTab.hashtagsCount = data.allHashtagsByCreator.length;
      },
      variables() {
        return {
          creator: this.creator,
        };
      },
    },
    tagsByTagger: {
      query: PAGED_TAGS_BY_TAGGER,
      variables() {
        return {
          tagger: this.creator,
          first: this.taggedContentTab.first,
          skip: this.taggedContentTab.skip,
        };
      },
    },
    tagsByTaggerCount: {
      query: ALL_TAG_IDS_BY_TAGGER,
      manual: true,
      result({ data }) {
        this.taggedContentTab.taggedCount = data.allTagIdsByTagger.length;
      },
      variables() {
        return {
          tagger: this.creator,
        };
      },
    },
  },
  methods: {
    hashtagsTabSelected(pageId) {
      this.hashtagsTab.skip = pageId * PAGE_SIZE;
    },
    taggedContentTabSelected(pageId) {
      this.taggedContentTab.skip = pageId * PAGE_SIZE;
    },
    pullTagsFromAPI: async function () {
      let taggedData = await this.$apollo.queries.tagsByTagger.refetch();
      taggedData = taggedData.data.tagsByTagger;
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
            nft.data.nft.nftContract = nft.data.nft.contract_address;
            nft.data.nft.nftChain = nft.config.params.chain;
            nft.data.nft.tagger = config.tagInfo.tagger;
            let res = nft.data.nft.cached_image_url.split("//");
            if (res[0] == "ipfs:") {
              nft.data.nft.cached_image_url = "https://ipfs.io/" + res[1];
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
