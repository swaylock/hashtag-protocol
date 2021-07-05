<template>
  <time>{{ new Date(parseInt(value) * 1000) | moment("from") }}</time>
</template>

<script>
export default {
  name: "TimestampFrom",
  props: ["value"],
};
</script>
