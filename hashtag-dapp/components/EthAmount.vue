<template>
  <span>{{ value | toEth | toDp }} Ξ</span>
</template>

<script>
export default {
  name: "EthAmount",
  props: ["value"],
};
</script>
