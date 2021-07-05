<template>
  <div v-html="docBody" class="content"></div>
</template>
<script>
const md = require("markdown-it")();
/**
 * Load up a raw markdown file from the hashtag-docs directory,
 * and return it as HTML.
 */
export default {
  name: "MarkdownDoc",
  props: {
    /**
     * Name of the doc file to load.
     */
    filename: String,
  },
  data() {
    return {
      docBody: null,
    };
  },
  created() {
    this.getDoc();
  },
  methods: {
    async getDoc() {
      let markdown = require(`raw-loader!../../hashtag-docs/docs/shared/faqs/${this.filename}.md`);
      this.docBody = md.render(markdown.default);
    },
  },
};
</script>
