<template>
  <footer class="footer">
    <nav class="level container">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <p class="is-size-6">
            <small> © {{ this.year }} Hashtag Protocol, Inc. All Rights Reserved </small>
          </p>
        </div>
      </div>
      <!-- Right side -->
      <div class="level-right">
        <div class="level-item">
          <div class="level is-mobile">
            <a :href="githubUrl" target="_blank" title="Github" class="navbar-item">
              <span class="icon"><i class="mdi mdi-github mdi-24px"></i></span>
            </a>
            <a href="https://twitter.com/0xHashtag" target="_blank" title="@0xHashtag" class="is-dark navbar-item">
              <span class="icon"><i class="mdi mdi-twitter mdi-24px"></i></span>
            </a>
            <a :href="discordUrl" target="_blank" title="Discord" class="is-dark navbar-item">
              <span class="icon"><i class="mdi mdi-discord mdi-24px"></i></span>
            </a>
            <a
              href="mailto:contact@hashtag-protocol.org"
              title="contact@hashtag-protocol.org"
              class="is-dark navbar-item"
              target="_blank"
            >
              <span class="icon"><i class="mdi mdi-email mdi-24px"></i></span>
            </a>
            <a href="https://hashtagprotocol.substack.com" title="Substack" class="navbar-item" target="_blank">
              <span class="icon substack"><i></i></span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    discordUrl: {
      type: String,
      default: "https://discord.com/invite/EyTJFRm",
    },
    githubUrl: {
      type: String,
      default: "https://github.com/hashtag-protocol/hashtag-protocol",
    },
  },
  data() {
    return {
      year: "2021",
    };
  },
  mounted() {
    this.year = new Date().getFullYear();
  },
};
</script>

<style scoped lang="scss">
@import "../styles/themes/hashtag/theme";

.footer {
  padding-top: 1.5rem;

  a {
    &.navbar-item {
      display: flex;
      color: $dark;
      border-radius: 3px;

      &:hover {
        color: $primary;
        background: none;
      }
    }
  }
}

.substack {
  background-position-y: 2px;
  background-position-x: 2px;
  background-image: url("data:image/svg+xml,%3Csvg fill='%234a4a4a' width='136px' height='155px' viewBox='0 0 136 155' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Crect id='Rectangle' x='0' y='0' width='136' height='19'%3E%3C/rect%3E%3Crect id='Rectangle' x='0' y='35' width='136' height='19'%3E%3C/rect%3E%3Cpolygon id='Path' points='0 69 136 69 136 155 68 117 0 155'%3E%3C/polygon%3E%3C/svg%3E");
  background-size: 20px 20px;
  background-repeat: no-repeat;

  &:hover {
    background-image: url("data:image/svg+xml,%3Csvg fill='%2324ae60' width='136px' height='155px' viewBox='0 0 136 155' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Crect id='Rectangle' x='0' y='0' width='136' height='19'%3E%3C/rect%3E%3Crect id='Rectangle' x='0' y='35' width='136' height='19'%3E%3C/rect%3E%3Cpolygon id='Path' points='0 69 136 69 136 155 68 117 0 155'%3E%3C/polygon%3E%3C/svg%3E");
  }
}
</style>
