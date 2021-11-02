<template>
  <div>
    {{ value }}
    <b-tooltip :label="this.label" position="is-bottom" type="is-dark" size="is-small" :animated="true">
      <a :href="this.tokenUrl" target="_blank">
        <b-icon icon="ethereum" type="is-grey-light" size="is-small"> </b-icon>
      </a>
    </b-tooltip>
  </div>
</template>

<script>
import onBoardChainMap from "~/data/onBoardChainMap";

export default {
  name: "NftId",
  props: ["value", "name", "contract", "chain"],
  computed: {
    tokenUrl() {
      return `${onBoardChainMap[this.chain].url}/token/${this.contract}?a=${this.value}`;
    },
    label() {
      return `View ${this.name} on ${onBoardChainMap[this.chain].explorerName}`;
    },
  },
};
</script>
