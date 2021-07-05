<template>
  <div v-if="isOpen === true" class="modalWrapper">
    <div class="modalContainer">
      <i class="close icon" @click="closeModal"></i>
      <div class="info">
        <div class="modalImageWrapper">
          <video
            v-if="modalData.image.includes('.webm')"
            autoplay
            class="modalImage"
            muted
            loop
            playsinline
          >
            <source
              :src="modalData.image"
              type='video/webm; codecs="vp8, vorbis"'
            />
          </video>
          <img v-else :src="modalData.image" type="image" class="modalImage" />
        </div>
        <div class="modalInfoContent">
          <h1>{{ modalData.name }}</h1>
          <p>KnownOrigin</p>
        </div>
      </div>
      <div class="tag">
        <h1>Tag this asset</h1>
        <p>Add one or more hashtags to describe this digital asset.</p>

        <div class="ui input push-below">
          <input
            v-model="hashtag"
            placeholder="Hashtag"
            @keyup="searchHashtags"
          />
        </div>

        <ul v-if="isHashtagListOpen === true" id="modalAssetType">
          <li v-for="h in hashtags" :key="h.id">#{{ h.hashtag }}</li>
        </ul>

        <div class="ui input push-below">
          <input placeholder="Asset Type" />
        </div>

        <div class="ui input push-below">
          <input placeholder="Token ID" />
        </div>
        <button class="ui primary button full-width">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    isOpen: Boolean,
    modalData: Object,
  },
  data() {
    return {
      isHashtagListOpen: false,
      hashtag: "",
      hashtags: ["cryptoart"],
    };
  },
  methods: {
    closeModal() {
      this.$emit("onClose");
    },
    searchHashtags() {
      if (this.hashtag.length === 0) {
        return (this.isHashtagListOpen = false);
      }
      this.hashtags = this.allHashtags.filter(
        (h) => h.hashtag.toLowerCase().indexOf(this.hashtag.toLowerCase()) > -1
      );
      if (this.hashtags.length > 0) {
        this.isHashtagListOpen = true;
      }
    },
  },
};
</script>
