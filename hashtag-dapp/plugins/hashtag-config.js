const platformConfig = require("platformsh-config").config();

export default ({ app }, inject) => {
  //console.log(app);
  const hashtagConfig = {
    testVariable: platformConfig.variable("TEST_PLATFORM_VARIABLE", "fallback"),
  };

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

  let host = null;
  if (app.context.req) {
    host = app.context.req.headers.host;
  }
  console.log(host);

  // if (host != null && host == "localhost:3000") {
  //   console.log("hashtagSubgraph", app.$config.hashtagSubgraph);
  //   app.$config.hashtagSubgraph =
  //     "https://api.thegraph.com/subgraphs/name/hashtag-protocol/hashtag-mainnet";
  // }
  // console.log("host:", host);

  inject("hashtagConfig", hashtagConfig);
};
