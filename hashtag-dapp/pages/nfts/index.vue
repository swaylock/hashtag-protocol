<template>
  <div class="body">
    <Header></Header>
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
                          <div class="th-wrap">Project</div>
                        </th>
                        <th>
                          <div class="th-wrap">Hashtag</div>
                        </th>
                        <th>
                          <div class="th-wrap">Tagged</div>
                        </th>
                        <th>
                          <div class="th-wrap">Publisher</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="pagedTags">
                      <tr
                        draggable="false"
                        v-for="tag in pagedTags"
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
                        <td data-label="Asset Name">
                          <nft-link
                            type="nft"
                            :name="tag.nftName"
                            :contract="tag.nftContract"
                            :id="tag.nftId"
                          ></nft-link>
                        </td>
                        <td data-label="Project">
                          {{ tag.nftContractName }}
                        </td>
                        <td data-label="Hashtag">
                          <hashtag :value="tag.hashtagDisplayHashtag"></hashtag>
                        </td>
                        <td>
                          <timestamp-from
                            :value="tag.timestamp"
                          ></timestamp-from>
                        </td>
                        <td>
                          <eth-account
                            :value="tag.publisher"
                            route="publisher-address"
                          ></eth-account>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination
                :entity-count="tagsCount"
                :page-size="pageSize"
                @tabSelected="tabSelected"
              />
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
import Hashtag from "~/components/Hashtag";
import Header from "~/components/Header";
import NftLink from "~/components/NftLink";
import Pagination from "~/components/Pagination";
import TimestampFrom from "~/components/TimestampFrom";
import { PAGED_TAGS, ALL_TAG_IDS } from "~/apollo/queries";

const PAGE_SIZE = 10;

export default {
  name: "Nfts",
  components: {
    EthAccount,
    Footer,
    Hashtag,
    Header,
    NftLink,
    Pagination,
    TimestampFrom,
  },
  data() {
    return {
      pageSize: PAGE_SIZE,
      first: PAGE_SIZE,
      skip: 0,
      tagsCount: 0,
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
  },
};
</script>

<style lang="scss"></style>
