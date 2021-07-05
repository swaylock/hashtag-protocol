const axios = require("axios");
const express = require("express");
const path = require("path");
const moment = require("moment");
const config = require("platformsh-config").config();
require("dotenv").config();
const hashtag_subgraph = process.env.VUE_APP_HASHTAG_SUBGRAPH_URL;

let PORT;

// If not running on platform.sh, set port manually,
// otherwise, pull from platform.sh env config.
// see https://github.com/platformsh/config-reader-nodejs
if (!config.isValidPlatform()) {
  PORT = 5000;
} else {
  PORT = config.port;
}

const app = express().set("port", PORT);
app.use(express.static(path.join(__dirname, "public")));
// Disable favicon.
app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/:token_id/:rebuild?", async function (req, res) {
  // Parse the token id from the URL.
  const tokenId = parseInt(req.params.token_id).toString();
  if (!tokenId) {
    return;
  }

  let rebuildImg = false;
  console.log("param rebuild", req.params.rebuild);
  if (req.params.rebuild == "rebuild") {
    rebuildImg = true;
  }

  buildMetadata(tokenId, rebuildImg, req)
    .then((metadata) => {
      res.send(metadata);
    })
    .catch((e) => console.log(e));
});

async function buildMetadata(tokenId, rebuildImg, req) {
  if (!tokenId) {
    return;
  }

  let response = await axios({
    url: hashtag_subgraph,
    method: "post",
    data: {
      query: `{
      hashtag(id: ${tokenId} ) {
        id,
        displayHashtag,
        hashtagWithoutHash,
        creator,
        publisher,
        timestamp
      }
     }`,
    },
  });

  if (response.statusText != "OK") {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let hashtag = response.data.data.hashtag;

  // Stitch in nicely formatted token creation date.
  hashtag.date = moment.unix(hashtag.timestamp).format("MMM Do YYYY");
  hashtag.image = await buildImage(hashtag, rebuildImg);

  // Form the base URL to the hashtag.image
  const fullUrl = req.protocol + "://" + req.get("host") + "/";

  // Next, create the "external url", which should lead back to the
  // hashtag protocol dApp. If we are running on platform.sh
  // let's pull route to the hashtag-dapp from the platform config.
  // otherwise, let's use the fullUrl formed above, which
  // will default to the localhost.
  let external_url;

  if (config.isValidPlatform()) {
    const dapp = config.getRoute("hashtag-dapp");
    external_url = `${dapp.url}hashtag/${hashtag.hashtagWithoutHash}`;
  } else {
    external_url = `${fullUrl}hashtag/${hashtag.hashtagWithoutHash}`;
  }

  // Form our metadata json.
  const metadata = {
    name: hashtag.displayHashtag,
    external_url: external_url,
    image: `${fullUrl}${hashtag.image}`,
    description: "",
    attributes: [
      {
        display_type: "date",
        trait_type: "minted",
        value: hashtag.timestamp,
      },
      {
        trait_type: "hashtag",
        value: hashtag.displayHashtag,
      },
      {
        trait_type: "series",
        value: moment.unix(hashtag.timestamp).format("YYYY"),
      },
      {
        trait_type: "creator",
        value: hashtag.creator,
      },
      {
        trait_type: "publisher",
        value: hashtag.publisher,
      },
    ],
  };

  return metadata;
}

async function buildImage(hashtag, rebuild) {
  const fs = require("fs");
  const path = `./hashtag-api/public/images/${hashtag.id}.png`;

  // Build the image if the image doesn't exist, or it exists and
  // the rebuild flag was passed.
  if (fs.existsSync(path) && !rebuild) {
    return `images/${hashtag.id}.png`;
  }

  try {
    // Use es6-template-strings to parse hashtag data
    // into a template, and return as a string
    // to pass to the nodeHtmlToImage processor.
    const compile = require("es6-template-strings/compile"),
      resolveToString = require("es6-template-strings/resolve-to-string");
    const data = fs.readFileSync(
      "./hashtag-api/assets/templates/series2021a.txt",
      "utf8"
    );
    const compiled = compile(data);

    const html = resolveToString(compiled, hashtag);
    const path = `./hashtag-api/public/images/${hashtag.id}.png`;
    const puppeteer = require("puppeteer");

    let browser;
    // Connect to chrome-headless using pre-formatted puppeteer credentials
    if (config.isValidPlatform()) {
      const formattedURL = config.formattedCredentials(
        "chromeheadlessbrowser",
        "puppeteer"
      );
      browser = await puppeteer.connect({ browserURL: formattedURL });
    } else {
      browser = await puppeteer.launch({ headless: true });
    }

    let page = await browser.newPage();
    const loaded = page.waitForNavigation({
      waitUntil: "load",
    });
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle2"],
    });
    await loaded;
    await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });
    await page.screenshot({
      path: path,
      type: "png",
      fullPage: true,
    });
    await page.close();
    await browser.close();

    return `images/${hashtag.id}.png`;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}

// Get PORT and start the server
app.listen(app.get("port"), function () {
  console.log(`Listening on port ${PORT}`);
});
