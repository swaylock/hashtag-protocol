<template>
  <div class="body">
    <Header />
    <section class="main">
      <div class="container">
        <h1 class="title is-1">
          Tagger: <eth-account :value="tagger"></eth-account>
        </h1>
        <h2 class="subtitle">
          Hashtag Protocol Tagger
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'taggers' }">Browse taggers</nuxt-link
            >&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <h2 class="title is-4">Tagger information</h2>
                <div class="b-table">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagger address</td>
                          <td>
                            <eth-account :value="tagger"></eth-account>
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
                <div class="b-table" v-if="taggerByAcc">
                  <div class="table-wrapper">
                    <table class="table">
                      <tbody>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tag count</td>
                          <td>
                            {{ taggerByAcc.tagCount }}
                          </td>
                        </tr>
                        <tr draggable="false" class="">
                          <td class="has-text-weight-bold">Tagging fees</td>
                          <td>
                            <EthAmount :value="taggerByAcc.feesPaid" />
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
                Content tagged by <eth-account :value="tagger"></eth-account>
              </h2>
              <b-tabs v-model="activeTab" :animated="false">
                <b-tab-item label="ERC-721 NFTs">
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
                                Publisher
                                <!---->
                              </div>
                            </th>
                          </tr>
                          <!---->
                          <!---->
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
                              <eth-account :value="tag.tagger"></eth-account>
                            </td>
                          </tr>
                        </tbody>
                        <!---->
                      </table>
                      <Pagination
                        :entity-count="tagsCount"
                        :page-size="pageSize"
                        @tabSelected="tabSelected"
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
import EthAmount from "~/components/EthAmount";
import Footer from "hashtag-components/src/components/Footer.vue";
import Hashtag from "~/components/Hashtag";
import Header from "~/components/Header";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import {
  TAGGER_BY_ACC,
  PAGED_TAGS_BY_TAGGER,
  ALL_TAG_IDS_BY_TAGGER,
} from "~/apollo/queries";
import TimestampFrom from "~/components/TimestampFrom";

const PAGE_SIZE = 10;

export default {
  name: "TaggerDetail",
  components: {
    EthAccount,
    EthAmount,
    Footer,
    Hashtag,
    Header,
    NftLink,
    Pagination,
    TimestampFrom,
  },
  asyncData({ params }) {
    return {
      activeTab: 0,
      tagger: params.address,
      tagsByHashtag: null,
      hashtagsByName: null,
      pageSize: PAGE_SIZE,
      first: PAGE_SIZE,
      skip: 0,
      tagsCount: 0,
    };
  },
  apollo: {
    taggerByAcc: {
      query: TAGGER_BY_ACC,
      variables() {
        return {
          id: this.tagger,
        };
      },
    },
    tagsByTagger: {
      query: PAGED_TAGS_BY_TAGGER,
      variables() {
        return {
          tagger: this.tagger,
          first: this.first,
          skip: this.skip,
        };
      },
    },
    tagsByTaggerCount: {
      query: ALL_TAG_IDS_BY_TAGGER,
      manual: true,
      result({ data }) {
        this.tagsCount = data.allTagIdsByTagger.length;
      },
      variables() {
        return {
          tagger: this.tagger,
        };
      },
    },
  },
  methods: {
    tabSelected(id) {
      this.skip = id * PAGE_SIZE;
    },
  },
};
</script>

<style lang="scss"></style>
