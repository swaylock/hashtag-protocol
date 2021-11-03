require("dotenv").config();
const axios = require("axios");
const express = require("express");
const path = require("path");
const moment = require("moment");
const config = require("platformsh-config").config();
const cors = require("cors");
const hashtag_subgraph = process.env.VUE_APP_HASHTAG_SUBGRAPH_URL;

// If not running on platform.sh, set port manually,
// otherwise, pull from platform.sh env config.
// see https://github.com/platformsh/config-reader-nodejs
let PORT;
if (!config.isValidPlatform()) {
  PORT = 5000;
} else {
  PORT = config.port;
}
const app = express().set("port", PORT);

const corsOptions = {
  origin: "*",
  credentials: false,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));

// Disable favicon.
app.get("/favicon.ico", (req, res) => res.status(204));

/**
 * Metadata API route handler.
 *
 * @param { string } token can be either at hashtag name without hash or token id.
 * @param { boolean } rebuild Optional param flag. Set to true to rebuild image.
 */
app.get("/:token/:rebuild?", async function (req, res, next) {
  // Parse the token id from the URL.
  const token = req.params.token;
  // Verify token, return token_id if found.

  await verifyToken(token)
    .then((tokenId) => {
      return fetchHashtagData(tokenId);
    })
    .then((hashtag) => {
      const rebuildImg = req.params.rebuild == "rebuild" ? true : false;
      return buildMetadata(hashtag, rebuildImg, req);
    })
    .then((metadata) => {
      res.send(metadata);
    })
    .catch((error) => {
      // If a custom error is thrown.
      // @TODO: Better error response. See for example
      // https://stackoverflow.com/questions/12806386/is-there-any-standard-for-json-api-response-format
      if (error instanceof MetadataApiException) {
        console.error("Bubbled error.   ", error);
        res.status(error.code).send(error.msg);
      } else {
        next(error);
      }
    });
});

/**
 * Verify the token argument
 *
 * Checks if token argument string is a normal integer
 * and if so, let's it pass through, if not (ie. if it's a string/name)
 * attempts to convert it into a token id.
 *
 * @param { string } token first path argument passed into api
 * @returns { string } token id of a hashtag token.
 *
 * @TODO Run an additional verification that a token exists
 * when api argument represents a normal integer. For now this is
 * handled in fetchHashtagData().
 */
async function verifyToken(token) {
  // If token parameter is a string try to convert to a token id.
  if (isNormalInteger(token)) {
    return token;
  }
  return await fetchTokenId(token);
}

function fetchTokenId(token) {
  const data = {
    query: `
      query hashtagsByName($name: String!) {
        hashtagsByName:  hashtags(first:1, where: {hashtagWithoutHash:$name}) {
            id
        },
      }
    `,
    variables: {
      name: token,
    },
  };
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: data,
    url: hashtag_subgraph,
  };
  return axios(options).then(
    (response) => {
      if (response.data.data.hashtagsByName.length > 0) {
        return response.data.data.hashtagsByName[0].id;
      } else {
        throw new MetadataApiException(404, "HASHTAG NOT FOUND");
      }
    },
    (error) => {
      throw error;
    },
  );
}

/**
 * Fetch hashtag data from subgraph for a given token id.
 *
 * @param { string } tokenId
 * @returns { json }
 */
function fetchHashtagData(tokenId) {
  // Construct query to fetch token data from subgraph.
  const data = {
    query: `{
      hashtag(id: ${tokenId} ) {
        id, displayHashtag, hashtagWithoutHash, creator, publisher, timestamp
      }
     }`,
  };
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: data,
    url: hashtag_subgraph,
  };

  return axios(options).then(
    (response) => {
      if (response.data.data.hashtag) {
        return response.data.data.hashtag;
      } else {
        throw new MetadataApiException(404, "HASHTAG NOT FOUND");
      }
    },
    (error) => {
      throw error;
    },
  );
}

/**
 * Builds structured NFT metadata given base hashtag data
 *
 * @param { json } hashtag data about hashtag pulled from subgraph.
 * @param { boolean } rebuildImg rebuild image if set to true.
 * @param { object } req express request object.
 * @returns { json }
 *
 * @see https://docs.opensea.io/docs/metadata-standards
 */
async function buildMetadata(hashtag, rebuildImg, req) {
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

/**
 * Builds a HASHTAG token image from a template.
 *
 * @param { json } hashtag basic hashtag data from subgraph.
 * @param { boolean } rebuild if set to true, image will be rebuilt other wise
 * use existing image.
 * @returns { string } path to image.
 */
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
    const data = fs.readFileSync("./hashtag-api/assets/templates/series2021a.txt", "utf8");
    const compiled = compile(data);

    const html = resolveToString(compiled, hashtag);
    const path = `./hashtag-api/public/images/${hashtag.id}.png`;
    const puppeteer = require("puppeteer");

    let browser;
    // Connect to chrome-headless using pre-formatted puppeteer credentials
    if (config.isValidPlatform()) {
      const formattedURL = config.formattedCredentials("chromeheadlessbrowser", "puppeteer");
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
    // TODO: Better notification if puppeteer service on platform.sh fails.
    console.error(e);
    // Return a fallback image if buildImage fails.
    // from the assets folder.
    return `img/pending.png`;
  }
}

/**
 * Custom error message handler
 *
 * @param { int } code HTTP response code
 * @param { string } msg Human readable error message.
 * @returns { object }
 */
function MetadataApiException(code, msg) {
  this.code = code;
  this.msg = msg;
  return this;
}

/**
 * @param { string } str
 * @returns { boolean } true for string represents an integer, otherwise false
 */
function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

// Get PORT and start the server
app.listen(app.get("port"), function () {
  console.log(`Listening on port ${PORT}`);
});
