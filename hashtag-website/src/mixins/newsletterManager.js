const axios = require("axios");

export default {
  methods: {
    /**
     * Add a subscriber to the Substack mailing list.
     *
     * This method is highly procedural for both Substack
     * and Hashtag sign up flow. Most likely, you'll need to
     * modify for yours.
     *
     * @TODO: I'm pretty sure the error catching needs to be
     * reviewed. Also, some functional tests would be helpful.
     *
     * @param {*} payload json key value pair.
     * @return  json with key of "error" or a boolean
     *          with key of "requires_confirmation"
     */
    async addSubscriber(payload) {
      try {
        let response = await axios.post(
          // See /hashtag-website .env.example
          process.env.VUE_APP_NEWSLETTER_SUBSCRIBE,
          payload
        );
        return response.data;
      } catch (error) {
        return error.data;
      }
    },
  },
};
