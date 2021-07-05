<template>
  <div class="modal-card markdown-modal">
    <section class="modal-card-body">
      <markdown-doc :doc-type="type" :filename="content"></markdown-doc>
    </section>
  </div>
</template>
<script>
import MarkdownDoc from "~/components/MarkdownDoc";

export default {
  name: "MarkdownModal",
  components: {
    MarkdownDoc,
  },
  props: {
    type: String,
    content: String,
  },
};
</script>

<style lang="scss"></style>
