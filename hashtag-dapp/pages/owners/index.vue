<template>
  <div class="body">
    <Header />
    <section class="main">
      <div class="container">
        <h1 class="title is-1">Owners</h1>
        <h2 class="subtitle">
          Hashtag Protocol Token Owners
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'index' }">Dashboard</nuxt-link>&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="columns is-tablet is-centered">
          <div class="column is-12">
            <article class="is-white coming-soon">
              <h2 class="title is-5">Top owners</h2>
              <div class="coming-soon-img">
                <img src="~/assets/coming-soon-banner.png" />
              </div>
              <pseudo-owners />
            </article>
          </div>
        </div>
      </div>
      <b-modal :active.sync="isOverviewModalActive" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <markdown-doc
                doc-type="help"
                filename="owners-list-overview"
              ></markdown-doc>
              <b-collapse
                :open="false"
                aria-id="tokenOverview"
                animation="slide"
                class="py-4"
              >
                <a
                  slot="trigger"
                  slot-scope="props"
                  aria-controls="tokenOverview"
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
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "hashtag-components/src/components/Footer.vue";
import Header from "~/components/Header";
import MarkdownDoc from "~/components/MarkdownDoc";
import { PAGED_OWNERS, ALL_OWNER_ADDRESSES } from "~/apollo/queries";
import PseudoOwners from "~/components/PseudoOwners";

export default {
  name: "Owners",
  components: {
    Footer,
    Header,
    MarkdownDoc,
    PseudoOwners,
  },
  data() {
    return {
      isOverviewModalActive: false,
      skip: 0,
      ownersCount: 0,
    };
  },
  apollo: {
    pagedOwners: {
      query: PAGED_OWNERS,
      variables() {
        return {
          first: this.first,
          skip: this.skip,
        };
      },
    },
    ownersCount: {
      query: ALL_OWNER_ADDRESSES,
      manual: true,
      result({ data }) {
        this.ownersCount = data.owners.length;
      },
    },
  },
};
</script>

<style lang="scss">
article {
  &.coming-soon {
    position: relative;

    .coming-soon-img {
      position: absolute;
      height: 100%;
      width: 100%;
      bottom: 0;
      right: 0;
      z-index: 1;
      left: 0;
      top: 0;

      img {
        position: absolute;
        right: -20px;
        bottom: -20px;
      }
    }
  }
}
</style>
