<template>
  <div class="body">
    <Header />
    <section class="main">
      <div class="container">
        <h1 class="title is-1">Hashtags</h1>
        <h2 class="subtitle">
          Hashtag Protocol Tokens
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
                <!---->
                <!---->
                <div class="table-wrapper has-mobile-cards">
                  <table tabindex="0" class="table is-hoverable">
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
                            Publisher
                            <!---->
                          </div>
                        </th>
                        <th class="">
                          <div class="th-wrap">
                            Tag count
                            <!---->
                          </div>
                        </th>
                        <!---->
                      </tr>
                      <!---->
                      <!---->
                    </thead>
                    <tbody v-if="pagedHashtags">
                      <tr
                        draggable="false"
                        class=""
                        v-for="hashtag in pagedHashtags"
                        v-bind:key="hashtag.id"
                      >
                        <!---->
                        <!---->
                        <td data-label="Hashtag" class="">
                          <hashtag :value="hashtag.displayHashtag"></hashtag>
                        </td>
                        <td data-label="Minted" class="">
                          <timestamp-from
                            :value="hashtag.timestamp"
                          ></timestamp-from>
                        </td>
                        <td data-label="Creator" class="">
                          <eth-account :value="hashtag.creator"></eth-account>
                        </td>
                        <td data-label="Owner" class="">Pending Auction</td>
                        <td data-label="Publisher" class="">
                          <eth-account :value="hashtag.publisher"></eth-account>
                        </td>
                        <td data-label="Count" class="">
                          {{ hashtag.tagCount }}
                        </td>
                        <!---->
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!---->
              </div>
              <Pagination
                :entity-count="hashtagCount"
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
import Pagination from "~/components/Pagination";
import TimestampFrom from "~/components/TimestampFrom";
import { PAGED_HASHTAGS, ALL_HASHTAG_TOKEN_IDS } from "~/apollo/queries";

const PAGE_SIZE = 10;

export default {
  name: "Hashtags",
  components: {
    EthAccount,
    TimestampFrom,
    Hashtag,
    Footer,
    Header,
    Pagination,
  },
  data() {
    return {
      pageSize: PAGE_SIZE,
      first: PAGE_SIZE,
      skip: 0,
      hashtagCount: 0,
    };
  },
  apollo: {
    pagedHashtags: {
      query: PAGED_HASHTAGS,
      variables() {
        return {
          first: this.first,
          skip: this.skip,
        };
      },
    },
    hashtagCount: {
      query: ALL_HASHTAG_TOKEN_IDS,
      manual: true,
      result({ data }) {
        this.hashtagCount = data.hashtags.length;
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
