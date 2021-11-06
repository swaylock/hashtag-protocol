<template>
  <div class="body" v-if="!loading">
    <SocialHead :title="displayHashtag + ' | Hashtag Protocol'" :description="randomSharingMessage" :image="imageUrl" />
    <section class="main" v-if="hashtagsByName && hashtagsByName[0]">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <nuxt-link :to="{ name: 'hashtags' }"> Browse Hashtag tokens </nuxt-link>
          </div>
          <div class="column is-6 has-text-right">
            <b-dropdown aria-role="list" class="has-text-left" position="is-bottom-left">
              <template #trigger="{ active }">
                <b-button type="is-primary" inverted>
                  <b-icon icon="share-variant-outline" size="is-small" />
                  &nbsp;Share
                </b-button>
              </template>

              <b-dropdown-item aria-role="listitem" has-link>
                <a :href="twitterSharingUrl" target="_blank" rel="noopener noreferrer">
                  <b-icon icon="twitter" size="is-small" />
                  &nbsp;Tweet
                </a>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem" has-link>
                <a :href="facebookSharingUrl" target="_blank" rel="noopener noreferrer">
                  <b-icon icon="facebook" size="is-small" />
                  &nbsp;Facebook
                </a>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem" @click="copyToClipboard">
                <b-icon icon="link-variant" size="is-small" />
                &nbsp;Copy link
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-4 is-12-mobile">
              <div class="tile is-child box">
                <h1>
                  <img v-if="imageUrl" :src="imageUrl" :alt="hashtagsByName[0].displayHashtag" />
                </h1>
              </div>
            </div>
            <div class="tile is-parent is-4 is-12-mobile">
              <div class="tile is-child box">
                <h2 class="title is-4">Token overview</h2>
                <div class="b-table" v-if="hashtagsByName">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Token ID</td>
                          <td>
                            <HashtagTokenId
                              :hashtag="hashtagsByName[0].displayHashtag"
                              :value="hashtagsByName[0].id"
                            ></HashtagTokenId>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Created</td>
                          <td>
                            <timestamp-formatted :value="parseInt(hashtagsByName[0].timestamp)"></timestamp-formatted>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Creator</td>
                          <td>
                            <eth-account :value="hashtagsByName[0].creator" route="creator-address"></eth-account>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Owner</td>
                          <td>Pending auction</td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Publisher</td>
                          <td>
                            <eth-account :value="hashtagsByName[0].publisher" route="publisher-address"></eth-account>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Expires</td>
                          <td>
                            <timestamp-formatted
                              :value="parseInt(hashtagsByName[0].timestamp) + 63113904"
                            ></timestamp-formatted>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-parent is-4 is-12-mobile">
              <div class="tile is-child box">
                <h2 class="title is-4">Market summary</h2>
                <div class="b-table">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Sale price</td>
                          <td>Pending Auction</td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagged content</td>
                          <td>
                            {{ hashtagsByName[0].tagCount }}
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagging revenue</td>
                          <td>
                            {{ hashtagsByName[0].creatorRevenue | toEth }} {{ currencyName }} Creator<br />
                            {{ hashtagsByName[0].ownerRevenue | toEth }} {{ currencyName }} Owner<br />{{
                              hashtagsByName[0].publisherRevenue | toEth
                            }}
                            {{ currencyName }} Publisher<br />{{ hashtagsByName[0].protocolRevenue | toEth }}
                            {{ currencyName }} Protocol
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
              <h2 class="title is-4 is-spaced">Content tagged with #{{ hashtag }}</h2>
              <b-tabs v-model="activeTab" :animated="true">
                <b-tab-item label="ERC-721 NFTs">
                  <div class="b-table">
                    <div class="table-wrapper has-mobile-cards">
                      <table class="table">
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
                          <tr v-for="tag in nftInfo" v-bind:key="tag.id" draggable="false" class="">
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
                                  muted=""
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
                            <td data-label="Project" class="">
                              {{ tag.nftChain }}
                            </td>
                            <td data-label="Tagged" class="">
                              <timestamp-from :value="tag.timestamp"></timestamp-from>
                            </td>
                            <td data-label="Tagger" class="">
                              <eth-account :value="tag.tagger" route="tagger-address"></eth-account>
                            </td>
                            <td data-label="Publisher" class="">
                              <eth-account :value="tag.publisher" route="publisher-address"></eth-account>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Pagination :entity-count="tagsCount" :page-size="pageSize" @tabSelected="tabSelected" />
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="IPFS" :disabled="true"> Coming soon... </b-tab-item>
                <b-tab-item label="Unstoppable domains" :disabled="true"> Coming soon... </b-tab-item>
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
import HashtagTokenId from "~/components/HashtagTokenId";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import SocialHead from "~/components/SocialHead";
import { PAGED_TAGS_BY_HASHTAG, HASHTAGS_BY_NAME, ALL_TAGS_BY_HASHTAG } from "~/apollo/queries";
import TimestampFrom from "~/components/TimestampFrom";
import TimestampFormatted from "~/components/TimestampFormatted";
import axios from "axios";
import { mapGetters } from "vuex";

const PAGE_SIZE = 10;

export default {
  name: "HashtagDetail",
  components: {
    TimestampFormatted,
    TimestampFrom,
    EthAccount,
    NftLink,
    HashtagTokenId,
    Pagination,
    SocialHead,
  },
  async asyncData({ $metadataApiHelpers, params }) {
    let routeHashtag = params.hashtag;
    routeHashtag = routeHashtag.replace("#", "");
    routeHashtag = routeHashtag.toLowerCase();

    let imageUrl;
    // See /plugins/htp-metadata-api.js
    imageUrl = await $metadataApiHelpers.getHashtagImage(routeHashtag);

    return {
      activeTab: 0,
      erc721: "http://erc721.org",
      hashtag: routeHashtag,
      hashtagsByName: null,
      tagsByHashtag: null,
      first: PAGE_SIZE,
      skip: 0,
      tagsCount: 0,
      pageSize: PAGE_SIZE,
      imageUrl: imageUrl,
    };
  },
  data: function () {
    return {
      loading: 0,
      //imageUrl: require("~/assets/loader3.svg"),
      hashtagsByName: null,
      tagsByHashtag: null,
      nftInfo: null,
    };
  },
  mounted() {
    this.pullTagsFromAPI();
  },
  head() {
    return {
      title: `${this.displayHashtag} | Hashtag Protocol`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.randomSharingMessage,
        },
      ],
    };
  },
  watch: {
    // whenever question changes, this function will run
    tagsByHashtag: function (val) {
      if (val) {
        this.pullTagsFromAPI();
      }
    },
  },
  apollo: {
    $loadingKey: "loading",
    tagsByHashtag: {
      //prefetch: false,
      query: PAGED_TAGS_BY_HASHTAG,
      variables() {
        return {
          hashtag: this.hashtag,
          first: this.first,
          skip: this.skip,
        };
      },
      pollInterval: 1000, // ms
    },
    tagsByHashtagCount: {
      //prefetch: false,
      query: ALL_TAGS_BY_HASHTAG,
      variables() {
        return {
          hashtag: this.hashtag,
        };
      },
      manual: true,
      result({ data }) {
        this.tagsCount = data.allTagsByHashtag.length;
      },
      pollInterval: 1000, // ms
    },
    hashtagsByName: {
      //prefetch: false,
      query: HASHTAGS_BY_NAME,
      variables() {
        return {
          name: this.hashtag,
        };
      },
      pollInterval: 1000, // ms
    },
  },
  methods: {
    tabSelected(id) {
      this.skip = id * PAGE_SIZE;
    },
    copyToClipboard() {
      const cb = navigator.clipboard;
      const url = this.$store.state.dappBaseUrl + this.$route.path;
      cb.writeText(url);
    },
    pullTagsFromAPI: async function () {
      let taggedData = await this.$apollo.queries.tagsByHashtag.refetch();
      taggedData = taggedData.data.tagsByHashtag;
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
  computed: {
    ...mapGetters("wallet", ["currencyName"]),
    displayHashtag() {
      return this.hashtagsByName && this.hashtagsByName[0].displayHashtag;
    },
    randomSharingMessage() {
      const messages = [
        `${this.displayHashtag} stored as a non-fungible token (NFT) on the blockchain.`,
        `Not your typical hashtag. This is ${this.displayHashtag} as an NFT.`,
        `Hashtag Protocol enables social content tagging for the decentralized internet.`,
      ];
      const randomNumber = Math.floor(Math.random() * 3);
      return messages[randomNumber];
    },
    twitterSharingUrl() {
      const encodedString = encodeURIComponent(
        `Check out the hashtag ${this.displayHashtag} on @HashtagProtoHQ\n\n${
          this.$store.state.dappBaseUrl + this.$route.path
        }`,
      );
      return "https://twitter.com/intent/tweet?text=" + encodedString;
    },
    facebookSharingUrl() {
      const encodedString = encodeURIComponent(
        `Check out the hashtag ${this.displayHashtag} on Hashtag Protocol\n\n${
          this.$store.state.dappBaseUrl + this.$route.path
        }`,
      );
      return "https://www.facebook.com/share.php?u=" + encodedString;
    },
  },
};
</script>

<style lang="scss"></style>
