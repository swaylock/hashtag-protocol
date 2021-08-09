const platformConfig = require("platformsh-config").config();

export default (context) => {
  //console.log("apollo-config-default", context);

  if (platformConfig.isValidPlatform()) {
    console.log(
      "hashtag-config plugin onProduction():",
      platformConfig.onProduction()
    );
    console.log("hashtag-config plugin branch:", platformConfig.branch);
    console.log(
      "hashtag-config plugin TEST_PLATFORM_VARIABLE",
      platformConfig.variable("TEST_PLATFORM_VARIABLE")
    );
  }

  return {
    httpEndpoint: process.env.VUE_APP_HASHTAG_SUBGRAPH_URL,
  };
};
