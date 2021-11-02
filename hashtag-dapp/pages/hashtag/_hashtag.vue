<template>
  <div class="body" v-if="!loading">
    <SocialHead
      :title="hashtagsByName[0].displayHashtag + ' | Hashtag Protocol'"
      :description="randomSharingMessage"
      :image="image"
    />
    <Header />
    <section class="main" v-if="hashtagsByName && hashtagsByName[0]">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <nuxt-link :to="{ name: 'hashtags' }">
              Browse Hashtag tokens
            </nuxt-link>
          </div>
          <div class="column is-6 has-text-right">
            <b-dropdown
              aria-role="list"
              class="has-text-left"
              position="is-bottom-left"
            >
              <template #trigger="{ active }">
                <b-button type="is-primary" inverted>
                  <b-icon icon="share-variant-outline" size="is-small" />
                  &nbsp;Share
                </b-button>
              </template>

              <b-dropdown-item aria-role="listitem" has-link>
                <a
                  :href="twitterSharingUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b-icon icon="twitter" size="is-small" />
                  &nbsp;Tweet
                </a>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem" has-link>
                <a
                  :href="facebookSharingUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    :alt="hashtagsByName[0].displayHashtag"
                  />
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
                            <timestamp-formatted
                              :value="parseInt(hashtagsByName[0].timestamp)"
                            ></timestamp-formatted>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Creator</td>
                          <td>
                            <eth-account
                              :value="hashtagsByName[0].creator"
                              route="creator-address"
                            ></eth-account>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Owner</td>
                          <td>Pending auction</td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Publisher</td>
                          <td>
                            <eth-account
                              :value="hashtagsByName[0].publisher"
                              route="publisher-address"
                            ></eth-account>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Expires</td>
                          <td>
                            <timestamp-formatted
                              :value="
                                parseInt(hashtagsByName[0].timestamp) + 63113904
                              "
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
                            {{ hashtagsByName[0].creatorRevenue | toEth }} Ξ
                            Creator<br />
                            {{ hashtagsByName[0].ownerRevenue | toEth }} Ξ
                            Owner<br />{{
                              hashtagsByName[0].publisherRevenue | toEth
                            }}
                            Ξ Publisher<br />{{
                              hashtagsByName[0].protocolRevenue | toEth
                            }}
                            Ξ Protocol
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
              <h2 class="title is-4 is-spaced">
                Content tagged with {{ hashtag }}
              </h2>
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
                              <div class="th-wrap">Project</div>
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
                        <tbody v-if="tagsByHashtag">
                          <tr
                            v-for="tag in tagsByHashtag"
                            v-bind:key="tag.id"
                            draggable="false"
                            class=""
                          >
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
                                <img
                                  :src="tag.nftImage"
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
                              ></nft-link>
                            </td>
                            <td data-label="Project" class="">
                              {{ tag.nftContractName }}
                            </td>
                            <td data-label="Tagged" class="">
                              <timestamp-from
                                :value="tag.timestamp"
                              ></timestamp-from>
                            </td>
                            <td data-label="Tagger" class="">
                              <eth-account
                                :value="tag.tagger"
                                route="tagger-address"
                              ></eth-account>
                            </td>
                            <td data-label="Publisher" class="">
                              <eth-account
                                :value="tag.publisher"
                                route="publisher-address"
                              ></eth-account>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Pagination
                        :entity-count="tagsCount"
                        :page-size="pageSize"
                        @tabSelected="tabSelected"
                      />
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="IPFS" :disabled="true">
                  Coming soon...
                </b-tab-item>
                <b-tab-item label="Unstoppable domains" :disabled="true">
                  Coming soon...
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import EthAccount from "~/components/EthAccount";
import Footer from "hashtag-components/src/components/Footer.vue";
import HashtagTokenId from "~/components/HashtagTokenId";
import Header from "~/components/Header";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import SocialHead from "~/components/SocialHead";
import {
  PAGED_TAGS_BY_HASHTAG,
  HASHTAGS_BY_NAME,
  ALL_TAGS_BY_HASHTAG,
} from "~/apollo/queries";
import TimestampFrom from "~/components/TimestampFrom";
import TimestampFormatted from "~/components/TimestampFormatted";

const PAGE_SIZE = 10;

export default {
  name: "HashtagDetail",
  components: {
    TimestampFormatted,
    TimestampFrom,
    EthAccount,
    NftLink,
    Footer,
    HashtagTokenId,
    Header,
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
      hashtagsByName: null,
      tagsByHashtag: null,
      nftInfo: null,
    };
  },
  head() {
    return {
      title: `${this.hashtagsByName[0].displayHashtag} | Hashtag Protocol`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.randomSharingMessage,
        },
      ],
    };
  },
  apollo: {
    $loadingKey: "loading",
    tagsByHashtag: {
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
      const url = this.$config.app + this.$route.path;
      cb.writeText(url);
    },
  },
  computed: {
    image() {
      return this.$config.imageApi + this.hashtagsByName[0].id + ".png";
    },
    randomSharingMessage() {
      const messages = [
        `${this.hashtagsByName[0].displayHashtag} stored as a non-fungible token (NFT) on the blockchain.`,
        `Not your typical hashtag. This is ${this.hashtagsByName[0].displayHashtag} as an NFT.`,
        `Hashtag Protocol enables social content tagging for the decentralized internet.`,
      ];
      const randomNumber = Math.floor(Math.random() * 3);
      return messages[randomNumber];
    },
    twitterSharingUrl() {
      const encodedString = encodeURIComponent(
        `Check out the hashtag ${
          this.hashtagsByName[0].displayHashtag
        } on @HashtagProtoHQ\n\n${this.$config.app + this.$route.path}`
      );
      return "https://twitter.com/intent/tweet?text=" + encodedString;
    },
    facebookSharingUrl() {
      const encodedString = encodeURIComponent(
        `Check out the hashtag ${
          this.hashtagsByName[0].displayHashtag
        } on Hashtag Protocol\n\n${this.$config.app + this.$route.path}`
      );
      return "https://www.facebook.com/share.php?u=" + encodedString;
    },
  },
};
</script>

<style lang="scss"></style>
