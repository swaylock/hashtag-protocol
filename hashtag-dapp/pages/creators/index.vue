<template>
  <div class="body auction">
    <Header />
    <section class="main">
      <div class="container">
        <h1 class="title is-1">Creators</h1>
        <h2 class="subtitle">
          Hashtag Creators
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
                            Creator
                            <!---->
                          </div>
                        </th>
                        <th class="">
                          <div class="th-wrap is-centered">
                            Hashtags
                            <!---->
                          </div>
                        </th>
                        <th class="">
                          <div class="th-wrap is-centered">
                            Tag count
                            <!---->
                          </div>
                        </th>
                        <th class="">
                          <div class="th-wrap is-centered">
                            Revenue
                            <!---->
                          </div>
                        </th>
                        <!---->
                      </tr>
                      <!---->
                      <!---->
                    </thead>
                    <tbody v-if="pagedCreators">
                      <tr
                        draggable="false"
                        class=""
                        v-for="creator in pagedCreators"
                        v-bind:key="creator.id"
                      >
                        <!---->
                        <!---->
                        <td data-label="Owner" class="">
                          <eth-account
                            :value="creator.id"
                            route="creator-address"
                          ></eth-account>
                        </td>
                        <td data-label="Hashtags" class="has-text-centered">
                          {{ creator.mintCount }}
                        </td>
                        <td data-label="Tag count" class="has-text-centered">
                          {{ creator.tagCount }}
                        </td>
                        <td data-label="Revenue" class="has-text-centered">
                          <eth-amount :value="creator.tagFees"></eth-amount>
                        </td>
                        <!---->
                      </tr>
                      <!---->
                      <!---->
                    </tbody>
                  </table>
                </div>
                <!---->
              </div>
              <Pagination
                :entity-count="creatorsCount"
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
import EthAmount from "~/components/EthAmount";
import Footer from "hashtag-components/src/components/Footer.vue";
import Header from "~/components/Header";
import Pagination from "~/components/Pagination";
import { PAGED_CREATORS, ALL_CREATORS } from "~/apollo/queries";

const PAGE_SIZE = 10;

export default {
  name: "Creators",
  components: {
    EthAmount,
    EthAccount,
    Footer,
    Header,
    Pagination,
  },
  data() {
    return {
      pageSize: PAGE_SIZE,
      first: PAGE_SIZE,
      skip: 0,
      creatorsCount: 0,
    };
  },
  apollo: {
    pagedCreators: {
      query: PAGED_CREATORS,
      variables() {
        return {
          first: this.first,
          skip: this.skip,
        };
      },
    },
    creatorsCount: {
      query: ALL_CREATORS,
      manual: true,
      result({ data }) {
        this.creatorsCount = data.creators.length;
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
