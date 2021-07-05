<template>
  <div class="body">
    <Header />
    <section class="main" v-if="tagsByDigitalAsset">
      <div class="container">
        <h1 class="title is-1">{{ tagsByDigitalAsset[0].nftName }}</h1>
        <h2 class="subtitle">
          ERC-721 Digital asset
          <span class="is-pulled-right is-size-6 has-text-weight-bold">
            <nuxt-link :to="{ name: 'nfts' }">Browse tagged assets</nuxt-link
            >&nbsp;
            <b-icon icon="arrow-up" type="is-dark" size="is-small"></b-icon>
          </span>
        </h2>
        <div class="tile is-ancestor">
          <div class="tile is-horizontal">
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <div class="card">
                  <div class="card-image">
                    <figure class="image">
                      <img
                        :src="tagsByDigitalAsset[0].nftImage"
                        :alt="tagsByDigitalAsset[0].nftName"
                      />
                    </figure>
                  </div>
                  <div class="card-content">
                    <h2 class="title is-4">Asset information</h2>
                    <div class="b-table">
                      <div class="table-wrapper">
                        <table class="table">
                          <tbody>
                            <tr draggable="false" class="">
                              <td class="has-text-weight-bold">Name</td>
                              <td>
                                {{ tagsByDigitalAsset[0].nftName }}
                              </td>
                            </tr>
                            <tr draggable="false" class="">
                              <td class="has-text-weight-bold">Project</td>
                              <td>
                                {{ tagsByDigitalAsset[0].nftContractName }}
                              </td>
                            </tr>
                            <tr draggable="false" class="">
                              <td class="has-text-weight-bold">Asset Id</td>
                              <td>
                                {{ tagsByDigitalAsset[0].nftId }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tile is-parent is-6 is-12-mobile">
              <div class="tile is-child box">
                <article class="tile is-child box">
                  <p class="title is-5">Tag this asset</p>
                  <form>
                    <div class="field">
                      <div class="control">
                        <b-taginput
                          v-model="hashtag"
                          :data="hashtagInputTags"
                          autocomplete
                          :allow-new="true"
                          maxtags="1"
                          :has-counter="false"
                          field="name"
                          ref="tagginginput"
                          icon="pound"
                          placeholder="Seach for hashtag"
                          @typing="getFilteredTags"
                          @add="tagAssetValidation"
                          :before-adding="validateTag"
                        >
                          <template slot-scope="props">
                            <b-taglist attached>
                              <b-tag type="is-primary" size="is-medium">{{
                                props.option.displayHashtag
                              }}</b-tag>
                              <b-tag type="is-dark" size="is-medium">{{
                                props.option.tagCount
                              }}</b-tag>
                            </b-taglist>
                          </template>
                          <template slot="empty">
                            New hashtag! Press enter to continue...
                          </template>
                          <template slot="selected" slot-scope="props">
                            <div v-bind:class="{ box: isTaggable }">
                              <b-tag
                                v-for="(tag, index) in props.tags"
                                :key="index"
                                :tabstop="false"
                                ellipsis
                                attached
                                type="is-primary"
                                size="is-medium"
                                closable
                                close-type="is-dark"
                                @close="
                                  $refs.tagginginput.removeTag(index, $event)
                                "
                              >
                                <div v-if="tag.displayHashtag">
                                  {{ tag.displayHashtag }}
                                </div>
                                <div v-else>#{{ tag }}</div>
                              </b-tag>
                              <div class="field">
                                <div class="control">
                                  <b-button
                                    type="is-primary"
                                    class="is-outlined"
                                    @click="tagNft()"
                                    :disabled="!isTaggable"
                                    v-bind:class="{
                                      'is-hidden': !isTaggable,
                                    }"
                                    >Tag asset
                                  </b-button>
                                </div>
                              </div>
                            </div>
                          </template>
                        </b-taginput>
                      </div>
                    </div>
                  </form>
                  <hr />
                  <h2 class="title is-5">Recent tags</h2>
                  <div class="b-table">
                    <div class="table-wrapper has-mobile-cards">
                      <table tabindex="0" class="table is-hoverable">
                        <thead>
                          <tr>
                            <th class="">
                              <div class="th-wrap">Hashtag</div>
                            </th>
                            <th class="">
                              <div class="th-wrap">Tagged</div>
                            </th>
                            <th class="">
                              <div class="th-wrap">Tagger</div>
                            </th>
                            <th class="">
                              <div class="th-wrap">Publisher</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            draggable="false"
                            v-for="tag in tagsByDigitalAsset"
                            v-bind:key="tag.id"
                          >
                            <td data-label="Hashtag" class="">
                              <span class="has-text-weight-bold">
                                <hashtag
                                  :value="tag.hashtagDisplayHashtag"
                                ></hashtag>
                              </span>
                            </td>
                            <td data-label="Tagged" class="">
                              <timestamp-from
                                :value="tag.timestamp"
                              ></timestamp-from>
                            </td>
                            <td data-label="Owner" class="">
                              <eth-account
                                :value="tag.tagger"
                                route="tagger-address"
                              ></eth-account>
                            </td>
                            <td data-label="Publisher" class="">
                              <eth-account
                                :value="tag.publisher"
                                route="publisher-address"
                              ></eth-account>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-else>Loading...</section>
    <Footer></Footer>
  </div>
</template>

<script>
import EthAccount from "~/components/EthAccount";
import Footer from "hashtag-components/src/components/Footer.vue";
import Hashtag from "~/components/Hashtag";
import Header from "~/components/Header";
import TimestampFrom from "~/components/TimestampFrom";
import {
  TAGS_BY_DIGITAL_ASSET,
  FIRST_THOUSAND_HASHTAGS,
} from "~/apollo/queries";

import HashtagValidationService from "~/services/HashtagValidationService";

export default {
  name: "NftDetail",
  components: {
    EthAccount,
    Footer,
    Hashtag,
    Header,
    TimestampFrom,
  },
  asyncData({ params }) {
    return {
      name: params.name,
      type: params.type,
      contract: params.contract,
      id: params.id,
      tagsByHashtag: null,
      hashtagsByName: null,
      hashtag: null,
      hashtags: null,
      hashtagInputTags: [],
      mintAndTag: false,
    };
  },
  computed: {
    isTaggable() {
      return this.hashtag;
    },
  },
  apollo: {
    tagsByDigitalAsset: {
      query: TAGS_BY_DIGITAL_ASSET,
      variables() {
        return {
          nftContract: this.contract,
          nftId: this.id,
        };
      },
      pollInterval: 1000, // ms
    },
    hashtags: {
      query: FIRST_THOUSAND_HASHTAGS,
      pollInterval: 1000, // ms
    },
  },
  methods: {
    async tagNft() {
      if (this.mintAndTag) {
        await this.$store.dispatch("wallet/mintAndTag", {
          hashtag: `#${this.hashtag[0]}`,
          nftContract: this.tagsByDigitalAsset[0].nftContract,
          nftId: this.tagsByDigitalAsset[0].nftId,
        });
      } else {
        const hashtag = this.hashtag[0];
        let hashtagValue = hashtag && hashtag.name ? hashtag.name : hashtag;

        if (hashtagValue.charAt(0) !== "#") {
          hashtagValue = `#${hashtagValue}`;
        }
        const hashtags = this.hashtagInputTags || [];
        const findExistingHashtagResult = hashtags.filter(
          (option) => option.name.toLowerCase() === hashtagValue.toLowerCase()
        );

        await this.$store.dispatch("wallet/tag", {
          hashtagId: findExistingHashtagResult[0].id,
          nftContract: this.tagsByDigitalAsset[0].nftContract,
          nftId: this.tagsByDigitalAsset[0].nftId,
        });
      }
    },
    // Bulma taginput widget.
    getFilteredTags: function (text) {
      const hashtags = this.hashtags || [];
      this.hashtagInputTags = hashtags.filter(
        (tag) => `${tag.name.toLowerCase()}`.indexOf(text.toLowerCase()) === 1
      );
    },
    validateTag(hashtag) {
      return this.hashtagValidationService.validateTag(hashtag);
    },
    tagAssetValidation(hashtag) {
      const tagContentValid = this.validateTag(hashtag);

      if (tagContentValid) {
        let hashtagValue = hashtag && hashtag.name ? hashtag.name : hashtag;
        if (hashtagValue.charAt(0) !== "#") {
          hashtagValue = `#${hashtagValue}`;
        }

        const hashtags = this.hashtagInputTags || [];
        const findExistingHashtagResult = hashtags.filter(
          (option) => option.name.toLowerCase() === hashtagValue.toLowerCase()
        );

        const isNewHashtag = findExistingHashtagResult.length !== 1;

        this.mintAndTag = isNewHashtag;
      }
    },
  },
  created() {
    this.hashtagValidationService = new HashtagValidationService(
      this.$buefy.toast
    );
  },
};
</script>

<style lang="scss"></style>
