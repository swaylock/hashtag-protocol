<template>
  <div class="modal-card hashtag-modal">
    <header class="modal-card-head">
      <p class="modal-card-title has-text-centered">
        Earnings summary for {{ address | shortEth }}
      </p>
    </header>
    <section class="modal-card-body">
      <div class="summary has-text-centered">
        <p class="title is-2">{{ accrued | toEth }} ETH</p>
        <p class="subtitle is-6">TOTAL EARNED</p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary" @click="drawDownFromRegistry">
        Withdraw
      </button>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("wallet", ["address", "accrued"]),
  },
  methods: {
    drawDownFromRegistry() {
      this.$store.dispatch("wallet/drawDownFromRegistry");
    },
  },
};
</script>

<style lang="scss" scoped></style>
