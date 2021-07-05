<template>
  <div class="body">
    <Header />
    <section class="main" v-if="foundPublisher">
      <div class="container">
        <h1 class="title is-1">Publisher: {{ foundPublisher.name }}</h1>
        <h2 class="subtitle">
          Hashtag Protocol Publisher
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'publishers' }">Browse publishers</nuxt-link
            >&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <h2 class="title is-4">Publisher information</h2>
                <div class="b-table">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td class="has-text-weight-bold">Name</td>
                          <td>
                            {{ foundPublisher.name }}
                          </td>
                        </tr>
                        <tr>
                          <td class="has-text-weight-bold">
                            Publisher address
                          </td>
                          <td>
                            <eth-account
                              :value="foundPublisher.address"
                            ></eth-account>
                          </td>
                        </tr>
                        <tr>
                          <td class="has-text-weight-bold">Official website</td>
                          <td>
                            <a v-bind:href="foundPublisher.website"
                              >{{ foundPublisher.website }}
                              <b-icon icon="open-in-new" size="is-small">
                              </b-icon
                            ></a>
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
                <h2 class="title is-4">
                  Market summary for {{ foundPublisher.name }}
                </h2>
                <div class="b-table" v-if="publisherByAcc">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td class="has-text-weight-bold">Hashtags</td>
                          <td>
                            {{ publisherByAcc.mintCount }}
                          </td>
                        </tr>
                        <tr>
                          <td class="has-text-weight-bold">Hashtag revenue</td>
                          <td>Pending auction</td>
                        </tr>
                        <tr>
                          <td class="has-text-weight-bold">Tag count</td>
                          <td>
                            {{ publisherByAcc.tagCount }}
                          </td>
                        </tr>
                        <tr>
                          <td class="has-text-weight-bold">Tagging revenue</td>
                          <td>
                            <eth-amount
                              :value="publisherByAcc.tagFees"
                            ></eth-amount>
                          </td>
                        </tr>
                        <tr>
                          <td class="has-text-weight-bold">Total revenue</td>
                          <td>
                            <eth-amount
                              :value="publisherByAcc.tagFees"
                            ></eth-amount>
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
                Recent activity on {{ foundPublisher.name }}
              </h2>
              <b-tabs v-model="activeTab" :animated="false">
                <b-tab-item label="Hashtags">
                  <div class="b-table">
                    <!---->
                    <!---->
                    <div class="table-wrapper has-mobile-cards">
                      <table class="table">
                        <thead>
                          <tr>
                            <!---->
                            <!---->
                            <th class="">
                              <div class="th-wrap">
                                Hashtag
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Created
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Creator
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Owner
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Tag count
                                <!---->
                              </div>
                            </th>
                          </tr>
                          <!---->
                          <!---->
                        </thead>
                        <tbody v-if="hashtagsByPublisher">
                          <tr
                            v-for="hashtag in hashtagsByPublisher"
                            v-bind:key="hashtag.id"
                          >
                            <!---->
                            <!---->
                            <td data-label="Hashtag" class="">
                              <hashtag
                                :value="hashtag.displayHashtag"
                              ></hashtag>
                            </td>
                            <td data-label="Minted" class="">
                              <timestamp-from
                                :value="hashtag.timestamp"
                              ></timestamp-from>
                            </td>
                            <td data-label="Creator" class="">
                              <eth-account
                                :value="hashtag.creator"
                                route="owner-address"
                              ></eth-account>
                            </td>
                            <td data-label="Owner" class="">Pending Auction</td>
                            <td data-label="tag-count" class="">
                              {{ hashtag.tagCount }}
                            </td>
                          </tr>
                          <!---->
                          <!---->
                        </tbody>
                        <!---->
                      </table>
                      <Pagination
                        :entity-count="hashtagsTab.hashtagsCount"
                        :page-size="hashtagsTab.pageSize"
                        @tabSelected="hashtagsTabSelected"
                      />
                    </div>
                    <!---->
                  </div>
                </b-tab-item>
                <b-tab-item label="Tagged content">
                  <div class="b-table">
                    <!---->
                    <!---->
                    <div class="table-wrapper has-mobile-cards">
                      <table class="table">
                        <thead>
                          <tr>
                            <!---->
                            <!---->
                            <th>
                              <div class="th-wrap"><!----></div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Asset Name
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Project
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Hashtag
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Tagged
                                <!---->
                              </div>
                            </th>
                            <th class="">
                              <div class="th-wrap">
                                Tagger
                                <!---->
                              </div>
                            </th>
                          </tr>
                          <!---->
                          <!---->
                        </thead>
                        <tbody v-if="tagsByPublisher">
                          <tr
                            v-for="tag in tagsByPublisher"
                            v-bind:key="tag.id"
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
                            <td data-label="Asset Name" class="">
                              <nft-link
                                type="nft"
                                :name="tag.nftName"
                                :contract="tag.nftContract"
                                :id="tag.nftId"
                              ></nft-link>
                            </td>
                            <td data-label="Asset Name" class="">
                              {{ tag.nftContractName }}
                            </td>
                            <td data-label="Hashtag" class="">
                              <hashtag
                                :value="tag.hashtagDisplayHashtag"
                              ></hashtag>
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
                          </tr>
                        </tbody>
                        <!---->
                      </table>
                      <Pagination
                        :entity-count="taggedContentTab.taggedCount"
                        :page-size="taggedContentTab.pageSize"
                        @tabSelected="taggedContentTabSelected"
                      />
                    </div>
                    <!---->
                  </div>
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
import Header from "~/components/Header";
import {
  ALL_HASHTAG_IDS_BY_PUBLISHER,
  PAGED_HASHTAGS_BY_PUBLISHER,
  PUBLISHER_BY_ACC,
  ALL_TAG_IDS_BY_PUBLISHER,
  PAGED_TAGS_BY_PUBLISHER,
} from "~/apollo/queries";
import EthAmount from "~/components/EthAmount";
import Hashtag from "~/components/Hashtag";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import TimestampFrom from "~/components/TimestampFrom";
import { mapGetters } from "vuex";
import { ethers } from "ethers";

const PAGE_SIZE = 10;

export default {
  name: "PublisherDetail",
  components: {
    NftLink,
    TimestampFrom,
    Hashtag,
    EthAmount,
    EthAccount,
    Footer,
    Header,
    Pagination,
  },
  asyncData({ params }) {
    return {
      activeTab: 0,
      hashtagsByName: null,
      publisher: params.address,
      tagsByHashtag: null,
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
    };
  },
  apollo: {
    publisherByAcc: {
      query: PUBLISHER_BY_ACC,
      variables() {
        return {
          id: this.publisher,
        };
      },
    },
    hashtagsByPublisherCount: {
      query: ALL_HASHTAG_IDS_BY_PUBLISHER,
      manual: true,
      variables() {
        return {
          publisher: this.publisher,
        };
      },
      result({ data }) {
        this.hashtagsTab.hashtagsCount = data.hashtagIdsByPublisher.length;
      },
    },
    hashtagsByPublisher: {
      query: PAGED_HASHTAGS_BY_PUBLISHER,
      variables() {
        return {
          publisher: this.publisher,
          first: this.hashtagsTab.first,
          skip: this.hashtagsTab.skip,
        };
      },
    },
    tagsByPublisherCount: {
      query: ALL_TAG_IDS_BY_PUBLISHER,
      manual: true,
      variables() {
        return {
          publisher: this.publisher,
        };
      },
      result({ data }) {
        this.taggedContentTab.taggedCount = data.allTagIdsByPublisher.length;
      },
    },
    tagsByPublisher: {
      query: PAGED_TAGS_BY_PUBLISHER,
      variables() {
        return {
          publisher: this.publisher,
          first: this.taggedContentTab.first,
          skip: this.taggedContentTab.skip,
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
  },
  computed: {
    ...mapGetters("publishers", ["publisherDirectory"]),
    foundPublisher() {
      if (this.publisherDirectory) {
        const filteredResults = this.publisherDirectory.filter(
          (publisher) =>
            ethers.utils.getAddress(publisher.address) ===
            ethers.utils.getAddress(this.$route.params.address)
        );
        return filteredResults.length === 1 ? filteredResults[0] : null;
      }

      return null;
    },
  },
};
</script>

<style lang="scss"></style>
