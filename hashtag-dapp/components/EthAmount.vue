<template>
  <span>{{ value | toEth | toDp }} {{ currencyName }}</span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EthAmount",
  props: ["value"],
  computed: {
    ...mapGetters("wallet", ["currencyName"]),
  },
};
</script>
