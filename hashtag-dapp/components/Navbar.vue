<template>
  <b-navbar :transparent="true">
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
        <img
          src="~/assets/logo-white.svg"
          alt="Content tagging for the decentralized web"
        />
        <h1>Hashtag Protocol</h1>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons" v-if="address !== null && address !== undefined">
          <b-button
            icon-left="bank"
            type="is-primary"
            @click="drawdown"
            outlined
          >
            {{ accrued | toEth }} ETH
          </b-button>
          <b-button
            v-if="address !== null && address !== undefined"
            class="button is-primary is-outlined wallet-info"
            @click="walletInfo"
            ><b-tag type="is-primary">{{ balance | toEth(4) }} ETH</b-tag>
            <span class="address">
              {{ address | shortEth }}
            </span>
          </b-button>
        </div>
        <div class="buttons" v-else>
          <b-button
            icon-left="power-plug"
            class="button is-primary is-outlined"
            @click="connectWallet"
          >
            Connect wallet
          </b-button>
        </div>
      </b-navbar-item>

      <b-navbar-dropdown :right="true" :arrowless="true">
        <template slot="label">
          <b-button
            class="button is-primary is-hidden-mobile"
            type="button"
            icon-left="menu"
          >
          </b-button>
        </template>
        <b-navbar-item
          v-for="(value, key) in sectionsMenuArr"
          :key="key"
          :to="value.path"
          tag="nuxt-link"
          :active="value.path === $nuxt.$route.path"
        >
          {{ value.text }}
        </b-navbar-item>
        <hr class="dropdown-divider" />
        <b-navbar-item
          tag="div"
          class="has-text-grey-dark has-text-weight-light is-capitalized is"
        >
          DEVELOPER RESOURCES
        </b-navbar-item>
        <b-navbar-item
          v-for="(value, key) in supportMenuArr"
          :key="key"
          :href="value.path"
        >
          {{ value.text }}
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import Drawdown from "~/components/Drawdown";
import WalletInfo from "~/components/WalletInfo";
import { mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {
      sectionsMenuArr: {
        dashboard: {
          text: "Dashboard",
          path: "/",
        },
        hashtags: {
          text: "Hashtags",
          path: "/hashtags",
        },
        creators: {
          text: "Creators",
          path: "/creators",
        },
        publishers: {
          text: "Publishers",
          path: "/publishers",
        },
        taggers: {
          text: "Taggers",
          path: "/taggers",
        },
        nfts: {
          text: "Tagged content",
          path: "/nfts",
        },
        auction: {
          text: "Auction",
          path: "/auction",
        },
      },
      supportMenuArr: {
        docs: {
          text: "Docs",
          path: process.env.docs,
        },
        discord: {
          text: "Discord",
          path: process.env.discordServer,
        },
        substack: {
          text: "Substack",
          path: process.env.substack,
        },
        website: {
          text: "Website",
          path: process.env.website,
        },
      },
    };
  },
  mounted() {
    // Start a mutation subscriber to watch for
    // an initialized/changed wallet address.
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type == "wallet/setWalletAddress") {
        if (typeof mutation.payload !== "undefined") {
          // Wallet address has changed, initialize the protocol.
          this.initProtocol();
        }
      }
    });

    // Initialize OnBoard. If a previously connected wallet
    // is found the subscriber above will be fired and
    // the protocol will be initialized.
    this.initOnboard();
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    ...mapGetters("wallet", ["accrued", "balance", "address", "onboard"]),
  },
  methods: {
    async initOnboard() {
      await this.$store.dispatch("wallet/initOnboard");
    },
    async initProtocol() {
      await this.$store.dispatch("wallet/initProtocol");
    },
    async connectWallet() {
      await this.$store.dispatch("wallet/connectWallet");
    },
    async disconnectWallet() {
      await this.$store.dispatch("wallet/disconnectWallet");
    },
    walletInfo() {
      const result = this.$buefy.modal.open({
        parent: this,
        component: WalletInfo,
        hasModalCard: true,
        customClass: "custom-class",
        trapFocus: true,
        width: 550,
      });
      this.$store.dispatch("wallet/captureOpenModalCloseFn", result.close);
    },
    drawdown() {
      const result = this.$buefy.modal.open({
        parent: this,
        component: Drawdown,
        hasModalCard: true,
        customClass: "custom-class",
        trapFocus: true,
        width: 550,
      });

      this.$store.dispatch("wallet/captureOpenModalCloseFn", result.close);
    },
  },
};
</script>
<style scoped lang="scss">
.navbar {
  .navbar-end {
    a.navbar-item:focus,
    a.navbar-item:focus-within,
    a.navbar-item:hover,
    a.navbar-item.is-active {
      background-color: $primary !important;
      color: $white;
    }

    .navbar-item {
      .buttons {
        button {
          font-weight: $weight-medium;

          &.wallet-info {
            padding-left: 5px;

            span {
              &.tag {
                position: relative;
                top: -1px;
              }
            }

            span.address {
              padding-left: 8px;
            }
          }
        }
      }
    }

    .dropdown-menu {
      .dropdown-item {
        font-weight: $weight-medium;
      }
    }
  }
}
</style>
