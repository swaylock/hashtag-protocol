<template>
  <div class="body">
    <Header />
    <section class="main" v-if="ownerByAcc">
      <div class="container">
        <h1 class="title is-1">
          Owner: <eth-account :value="owner"></eth-account>
        </h1>
        <h2 class="subtitle">
          Hashtag Protocol Token Owner
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'owners' }">Browse owners</nuxt-link>&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <help-modal
                  modal="isOwnerInfoModalActive"
                  @popModalFromChild="popModal"
                  class="is-pulled-right"
                ></help-modal>
                <h2 class="title is-4">Owner information</h2>
                <div class="b-table">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Owner address</td>
                          <td>
                            <eth-account :value="owner"></eth-account>
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
                <help-modal
                  modal="isMarketSummaryActive"
                  @popModalFromChild="popModal"
                  class="is-pulled-right"
                ></help-modal>
                <h2 class="title is-4">Market summary</h2>
                <div class="b-table" v-if="ownerByAcc">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Hashtags</td>
                          <td>
                            {{ ownerByAcc.mintCount }}
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagged content</td>
                          <td>
                            {{ ownerByAcc.tagCount }}
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagging revenue</td>
                          <td>
                            <eth-amount
                              :value="ownerByAcc.tagFees"
                            ></eth-amount>
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Total revenue</td>
                          <td>
                            <eth-amount-sum
                              :value1="ownerByAcc.tagFees"
                              :value2="0"
                            ></eth-amount-sum>
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
              <b-tooltip
                label="Help"
                position="is-bottom"
                class="is-pulled-right"
                type="is-dark"
              >
                <button
                  class="button is-white"
                  @click="isActivityModalActive = true"
                >
                  <b-icon icon="help-circle-outline" type="is-dark"> </b-icon>
                </button>
              </b-tooltip>
              <h2 class="title is-4 is-spaced">
                Activity for <eth-account :value="owner"></eth-account>
              </h2>
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
                              <div class="th-wrap">Creator</div>
                            </th>
                            <th>
                              <div class="th-wrap">Publisher</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            draggable="false"
                            class=""
                            v-for="hashtag in hashtagsByOwner"
                            v-bind:key="hashtag.id"
                          >
                            <td data-label="Hashtag" class="">
                              <hashtag
                                :value="hashtag.displayHashtag"
                              ></hashtag>
                            </td>
                            <td data-label="Created" class="">
                              <timestamp-from
                                :value="hashtag.timestamp"
                              ></timestamp-from>
                            </td>
                            <td data-label="Creator" class="">
                              <eth-account
                                :value="hashtag.owner"
                                route="owner-address"
                              ></eth-account>
                            </td>
                            <td data-label="Publisher" class="">
                              <eth-account
                                :value="hashtag.publisher"
                                route="publisher-address"
                              ></eth-account>
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
                              <div class="th-wrap">Asset Name</div>
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
                        <tbody>
                          <tr v-for="tag in tagsByTagger" v-bind:key="tag.id">
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
      <b-modal :active.sync="isOwnerInfoModalActive" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <markdown-doc
                doc-type="help"
                filename="owner-detail-owner-info"
              ></markdown-doc>
              <b-collapse
                :open="false"
                position="is-top"
                aria-id="contentIdForA11y1"
                animation="slide"
                class="py-4"
              >
                <a
                  slot="trigger"
                  slot-scope="props"
                  aria-controls="MarketOverview"
                  class="has-text-weight-bold"
                >
                  <b-icon
                    :icon="!props.open ? 'menu-down' : 'menu-up'"
                  ></b-icon>
                  {{
                    !props.open ? 'What\'s an "Owner"?' : 'What\'s an "Owner"?'
                  }}
                </a>
                <markdown-doc
                  doc-type="faq"
                  filename="050-what-is-an-owner"
                  class="py-4"
                ></markdown-doc>
              </b-collapse>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal :active.sync="isMarketSummaryActive" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <markdown-doc
                doc-type="help"
                filename="owner-detail-market-summary"
              ></markdown-doc>
              <b-collapse
                :open="false"
                position="is-top"
                aria-id="contentIdForA11y1"
                animation="slide"
                class="py-4"
              >
                <a
                  slot="trigger"
                  slot-scope="props"
                  aria-controls="MarketOverview"
                  class="has-text-weight-bold"
                >
                  <b-icon
                    :icon="!props.open ? 'menu-down' : 'menu-up'"
                  ></b-icon>
                  {{
                    !props.open
                      ? 'What is the "Hashtag Market"?'
                      : 'What is the "Hashtag Market"?'
                  }}
                </a>
                <markdown-doc
                  doc-type="faq"
                  filename="070-what-is-the-hashtag-market"
                  class="py-4"
                ></markdown-doc>
              </b-collapse>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal :active.sync="isActivityModalActive" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <markdown-doc
                doc-type="help"
                filename="owner-detail-recent-activity"
              ></markdown-doc>
            </div>
          </div>
        </div>
      </b-modal>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import EthAccount from "~/components/EthAccount";
import Footer from "hashtag-components/src/components/Footer.vue";
import Header from "~/components/Header";
import HelpModal from "~/components/HelpModal";
import {
  PAGED_HASHTAGS_BY_OWNER,
  OWNER_BY_ACC,
  PAGED_TAGS_BY_TAGGER,
  ALL_TAG_IDS_BY_TAGGER,
  ALL_HASHTAG_IDS_BY_OWNER,
} from "~/apollo/queries";
import EthAmount from "~/components/EthAmount";
import EthAmountSum from "~/components/EthAmountSum";
import Hashtag from "~/components/Hashtag";
import TimestampFrom from "~/components/TimestampFrom";
import MarkdownDoc from "~/components/MarkdownDoc";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";

const PAGE_SIZE = 10;

export default {
  name: "OwnerDetail",
  components: {
    EthAmountSum,
    EthAmount,
    EthAccount,
    Footer,
    Hashtag,
    Header,
    HelpModal,
    MarkdownDoc,
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
      owner: params.address,
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
    };
  },
  apollo: {
    ownerByAcc: {
      query: OWNER_BY_ACC,
      variables() {
        return {
          id: this.owner,
        };
      },
    },
    hashtagsByOwner: {
      query: PAGED_HASHTAGS_BY_OWNER,
      variables() {
        return {
          owner: this.owner,
          first: this.hashtagsTab.first,
          skip: this.hashtagsTab.skip,
        };
      },
    },
    hashtagsByOwnerCount: {
      query: ALL_HASHTAG_IDS_BY_OWNER,
      manual: true,
      result({ data }) {
        this.hashtagsTab.hashtagsCount = data.allHashtagsByOwner.length;
      },
      variables() {
        return {
          owner: this.owner,
        };
      },
    },
    tagsByTagger: {
      query: PAGED_TAGS_BY_TAGGER,
      variables() {
        return {
          tagger: this.owner,
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
          tagger: this.owner,
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
};
</script>

<style lang="scss"></style>
