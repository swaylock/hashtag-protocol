<template>
  <section class="hero has-background-grey-dark is-bold">
    <div
      class="beta-warning has-background-primary has-text-white has-text-weight-medium has-text-centered"
    >
      <p>This protocol & interface is in beta. Use it at your own risk.</p>
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
export default {
  name: "Header",
  components: {
    Navbar,
  },
};
</script>
<style scoped lang="scss">
.beta-warning {
  padding: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
}
</style>
