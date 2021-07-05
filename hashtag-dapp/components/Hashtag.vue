<template>
  <span class="has-text-weight-bold">
    <nuxt-link :to="{ name: 'hashtag-hashtag', params: { hashtag: dest } }">
      {{ value }}
    </nuxt-link>
  </span>
</template>

<script>
export default {
  name: "Hashtag",
  props: ["value"],
  data() {
    // Modify HASHTAG for pretty url.
    let dest = this.value;
    dest = dest.replace("#", "");
    dest = dest.toLowerCase();
    return {
      dest: dest,
    };
  },
};
</script>
