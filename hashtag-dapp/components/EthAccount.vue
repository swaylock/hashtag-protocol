<template>
  <span class="nowrap">
    <b-tooltip :label="value" position="is-bottom" type="is-dark">
      <span v-if="route">
        <nuxt-link :to="{ name: route, params: { address: value } }">
          <span v-if="ens">
            {{ ens }}
          </span>
          <span v-else>
            {{ value | shortEth }}
          </span>
        </nuxt-link>
      </span>
      <span v-else>
        <span v-if="ens">
          {{ ens }}
        </span>
        <span v-else>
          {{ value | shortEth }}
        </span>
      </span>
    </b-tooltip>
    <b-tooltip :label="`View on ${explorerName}`" position="is-bottom" type="is-dark" size="is-small">
      <a :href="this.addressUrl" target="_blank">
        <b-icon icon="ethereum" type="is-grey-light" size="is-small"> </b-icon>
      </a>
    </b-tooltip>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EthAccount",
  props: {
    value: String,
    route: String,
  },
  computed: {
    ...mapGetters("wallet", ["homesteadProvider", "explorerName"]),
  },
  data() {
    return {
      ens: null,
      addressUrl: "",
    };
  },
  async mounted() {
    this.ens = this.homesteadProvider ? await this.homesteadProvider.lookupAddress(this.value) : null;
    this.addressUrl = `${this.$config.etherscanBaseUrl}/address/${this.value}`;
  },
};
</script>
