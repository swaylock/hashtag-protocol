<template>
  <div id="app" class="body" :class="{ dashboard: $nuxt.$route.path === '/' }">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from "~/components/Header";
import Footer from "hashtag-components/src/components/Footer.vue";

export default {
  name: "App",
  components: {
    Footer,
    Header,
  },
};
</script>
