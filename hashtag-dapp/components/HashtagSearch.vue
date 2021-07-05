<template>
  <form>
    <div class="field">
      <div class="control">
        <b-field v-if="hashtags">
          <b-taginput
            v-model="hashtag"
            :data="hashtagInputTags"
            attached
            autocomplete
            :allow-new="false"
            maxtags="1"
            field="name"
            :id="this.widget"
            ref="hashtag-search"
            icon="pound"
            size="is-medium"
            :has-counter="false"
            placeholder="Search for hashtag"
            :before-adding="selectHashtag"
            @typing="getFilteredTags"
            @keyup.native="checkIfEnterKey"
          >
            <template slot-scope="props">
              <b-taglist attached>
                <b-tag type="is-primary" size="is-medium"
                  >{{ props.option.displayHashtag }}
                </b-tag>
                <b-tag type="is-dark" size="is-medium"
                  >{{ props.option.tagCount }}
                </b-tag>
              </b-taglist>
            </template>
            <template slot="empty">
              <span class="new-hashtag"
                >Unique HASHTAG! Press enter to continue...</span
              >
            </template>
          </b-taginput>
        </b-field>
      </div>
    </div>
  </form>
</template>
<script>
import HashtagValidationService from "~/services/HashtagValidationService";
import { FIRST_THOUSAND_HASHTAGS } from "~/apollo/queries";
export default {
  name: "HashtagSearch",
  props: ["widget"],
  data() {
    return {
      hashtagInputTags: [],
      nameContains: [],
      isFetching: false,
      hashtag: null,
    };
  },
  apollo: {
    hashtags: {
      query: FIRST_THOUSAND_HASHTAGS,
      pollInterval: 1000, // ms
    },
  },
  methods: {
    /**
     * Search for existing tags in tagging widget.
     *
     * @param string text entered into tagging widget
     */
    getFilteredTags: function (text) {
      const hashtags = this.hashtags || [];
      this.hashtagInputTags = hashtags.filter((tag) => {
        //console.log("getFilteredTags", tag);
        return (
          tag && `${tag.name.toLowerCase()}`.indexOf(text.toLowerCase()) === 1
        );
      });
    },
    /**
     * Run the hashtag entered through validation.
     */
    validateTag(hashtag) {
      return this.hashtagValidationService.validateTag(hashtag);
    },
    /**
     * Hashtag is selected.
     *
     * User has either selected an existing hashtag or
     * typed in a new one and pressed enter, in which case
     * it's "preprocessed" by checkIfEnterKey() below.
     *
     * Emits to call selectExistingTag in parent.
     *
     * @param { object } hashtag
     */
    selectHashtag(hashtag) {
      /* eslint-disable-next-line no-console */
      console.log("Hashtag Seatch selectHashtag");
      if (this.validateTag(hashtag)) {
        // Process the selected hashtag in the parent compoent.
        // Passed to parent as an hashtag object.
        this.$emit("select-hashtag", hashtag);
      }
    },
    /**
     * Handle when user hits enter key in search input.
     *
     */
    checkIfEnterKey: function (event) {
      // User is hitting enter.
      if (event.which === 13) {
        const input = document.getElementById(this.widget).value;
        /* eslint-disable-next-line no-console */
        console.log("checkIfEnterKey", input);
        // Let's skip it when user toggles down to an existing hashtag
        // and hits enter. That's handled by the "before-adding" function
        // on the buefy tag-input component. If this is the case
        // the input value is empty.
        if (input == null || input == "") {
          return;
        }

        const newHashtag = {
          name: "#" + input,
          displayHashtag: "#" + input,
          hashtagWithoutHash: input.toLowerCase(),
        };
        this.selectHashtag(newHashtag);
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
<style lang="scss" scoped></style>
