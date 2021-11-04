<template>
  <section class="hero has-background-grey-dark is-bold">
    <div class="beta-warning has-text-white has-text-weight-medium has-text-centered">
      <p>
        Hashtag Protocol is migrating to Polygon
        <span class="icon">
          <i class="mdi mdi-truck-fast mdi-24px"></i>
        </span>
        <a
          @click="
            cardModal({
              type: 'faq',
              content: '020-what-is-hashtag-token',
            })
          "
          >Learn more</a
        >
        or visit our new testnet at <a href="https://dev.hashtag-protocol.org">dev.hashtag-protocol.org</a>
      </p>
    </div>
    <div class="hero-head">
      <div class="container">
        <Navbar />
      </div>
    </div>
  </section>
</template>

<script>
import Navbar from "~/components/Navbar";
import MarkdownModal from "~/components/MarkdownModal";
export default {
  name: "Header",
  components: {
    Navbar,
  },
  methods: {
    cardModal(props) {
      this.$buefy.modal.open({
        parent: this,
        component: MarkdownModal,
        props: props,
        hasModalCard: true,
        trapFocus: true,
      });
    },
  },
};
</script>
<style scoped lang="scss">
.beta-warning {
  background-color: $purple;
  padding: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
}
</style>
