<template>
  <div class="body auction">
    <Header />
    <section class="main">
      <div class="container">
        <h1 class="title is-1">HASHTAG Auction</h1>
        <h2 class="subtitle">
          Purchase HASHTAG tokens
          <span
            class="has-text-primary is-italic has-text-weight-bold is-hidden-desktop"
            >COMING SOON!</span
          >
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'index' }">Dashboard</nuxt-link>&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="columns is-tablet is-centered">
          <div class="column is-12">
            <article class="is-white box coming-soon content">
              <span class="coming-soon-clip is-hidden-touch" />
              <p>
                <markdown-doc
                  doc-type="faq"
                  filename="050-what-is-an-owner"
                ></markdown-doc>
              </p>
              <p>
                <markdown-doc
                  doc-type="faq"
                  filename="083-hashtag-auction"
                ></markdown-doc>
              </p>

              <div class="coming-soon-img is-hidden-touch">
                <img src="~/assets/coming-soon-banner.png" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "hashtag-components/src/components/Footer.vue";
import Header from "~/components/Header";
import MarkdownDoc from "~/components/MarkdownDoc";

export default {
  name: "Auction",
  components: {
    Footer,
    Header,
    MarkdownDoc,
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
article.coming-soon .coming-soon-img img {
  right: 0;
  bottom: 0;
}

.coming-soon-clip {
  float: right;
  margin-right: -20px;
  margin-top: 60px;
  clip-path: polygon(100% 15%, 0% 100%, 100% 100%);
  shape-outside: polygon(100% 15%, 0% 100%, 100% 100%);
  width: 500px;
  height: 300px;
}
</style>
