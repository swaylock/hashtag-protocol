import Vue from "vue";

// Make sure to pick a unique name for the flag
// so it won't conflict with any other mixin.
if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true;
  Vue.mixin({
    methods: {
      setPendingImage(event) {
        if (event.target.type === "video/mp4") {
          event.target.parentElement.poster = require("~/assets/pending.png");
        } else {
          event.target.src = require("~/assets/pending.png");
        }
      },
    },
  }); // Set up your mixin then
}
