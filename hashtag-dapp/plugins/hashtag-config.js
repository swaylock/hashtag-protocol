const platformConfig = require("platformsh-config").config();

export default ({ app }, inject) => {
  const config = {
    testVariable: platformConfig.variable("TEST_PLATFORM_VARIABLE"),
  };

  inject("hashtagConfig", config);
};
