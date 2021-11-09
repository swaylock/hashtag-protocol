<template>
  <span class="has-text-weight-bold">
    <nuxt-link
      :to="{
        name: 'type-contract-id',
        params: { type: type, contract: contract, id: id, value: value },
      }"
    >
      {{ value }}
    </nuxt-link>
  </span>
</template>

<script>
export default {
  name: "NftLink",
  props: ["type", "contract", "id", "value"],
};
</script>
