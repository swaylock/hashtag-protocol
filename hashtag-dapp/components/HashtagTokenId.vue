<template>
  <div>
    {{ value }}
    <b-tooltip
      :label="this.label"
      position="is-bottom"
      type="is-dark"
      size="is-small"
      :animated="true"
    >
      <a :href="this.tokenUrl" target="_blank">
        <b-icon icon="ethereum" type="is-grey-light" size="is-small"> </b-icon>
      </a>
    </b-tooltip>
  </div>
</template>

<script>
export default {
  name: "HashtagTokenId",
  props: ["value", "hashtag"],
  data() {
    return {
      tokenUrl: "",
      label: "",
    };
  },
  created() {
    this.tokenUrl = `${process.env.etherscanBaseUrl}/token/${process.env.hashtagProtocolContractAddress}?a=${this.value}`;
    this.label = `View ${this.hashtag} on Etherscan`;
  },
};
</script>
