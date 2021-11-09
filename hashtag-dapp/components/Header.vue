<template>
  <section class="hero has-background-grey-dark is-bold">
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

.beta-warning a {
  color: $white;
  text-decoration: underline;
}

.beta-warning .icon {
  margin: 0 1rem;
}
</style>
