<template>
  <span>{{ sum() | toEth | toDp }} {{ currencyName }}</span>
</template>

<script>
import { ethers } from "ethers";
import { mapGetters } from "vuex";

export default {
  name: "EthAmountSum",
  props: ["value1", "value2"],
  computed: {
    ...mapGetters("wallet", ["currencyName"]),
  },
  methods: {
    sum() {
      return ethers.BigNumber.from(this.value1).add(ethers.BigNumber.from(this.value2));
    },
  },
};
</script>
