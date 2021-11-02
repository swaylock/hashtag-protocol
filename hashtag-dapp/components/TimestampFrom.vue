<template>
  <time><timeago :datetime="new Date(parseInt(value) * 1000)"></timeago></time>
</template>

<script>
export default {
  name: "TimestampFrom",
  props: ["value"],
};
</script>
