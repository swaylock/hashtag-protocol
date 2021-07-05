<template>
  <time>{{
    new Date(parseInt(value) * 1000) | moment(format || "MMM Do YYYY")
  }}</time>
</template>

<script>
export default {
  name: "TimestampFormatted",
  props: ["value", "format"],
};
</script>
