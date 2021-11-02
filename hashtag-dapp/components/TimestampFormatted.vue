<template>
  <time>{{ formatDate(parseInt(value) * 1000) }} </time>
</template>

<script>
export default {
  name: "TimestampFormatted",
  props: ["value"],
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en-us", options);
    },
  },
};
</script>
