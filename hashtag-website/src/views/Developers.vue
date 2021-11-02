<template>
  <div class="body">
    <div class="content-wrapper">
      <section class="section nav">
        <div class="container">
          <Navbar></Navbar>
        </div>
      </section>
      <section class="section" id="overview">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-5">
              <h1 class="is-size-1 title is-spaced">
                Provide users rich, decentralized content tagging stored to a
                global, immutable database.
              </h1>
              <div class="is-size-5 is-spaced">
                <strong>Demo</strong>&nbsp;
                <a :href="this.app" type="is-primary"> Hashtag dApp </a>
                <br />
                <strong>Technical</strong>&nbsp; <a :href="this.docs">Docs</a>,
                <a :href="designNotes" download="hashtag-protocol.pdf"
                  >Design notes</a
                >,
                <a href="/build">Github repo</a>
                <br />
                <strong>Connect</strong>&nbsp;
                <a href="mailto:contact@hashtag-protocol.org">Email us</a>,
                <a href="/build">Discord</a>,
                <a href="https://hashtagprotocol.substack.com">Substack</a>
              </div>
            </div>
            <div class="column is-7">
              <span class="image">
                <img :src="require(`../assets/img/wordcloud.png`)" />
              </span>
            </div>
          </div>
          <b-button
            outlined
            class="is-pulled-right is-hidden-touch"
            type="is-primary"
            icon-right="arrow-down"
            onClick="document.getElementById('create').scrollIntoView({block: 'start', behavior: 'smooth'});"
          />
        </div>
      </section>
      <section class="section is-medium has-background-dark" id="create">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-5">
              <h2 class="title is-size-3 is-spaced has-text-white-ter">
                Create HASHTAG tokens
              </h2>
              <div class="content is-medium has-text-white-ter">
                <p>
                  Hashtag Tokens (HASHTAG) are digital representations of
                  hashtag text strings stored as non-fungible tokens (NFTs) on
                  the Ethereum blockchain.
                </p>
                <p>
                  As a whitelisted publisher, you can generate revenue from
                  HASHTAG tokens minted in your application.
                </p>
                <p>
                  <a
                    href="https://docs.hashtag-protocol.org/essentials/#hashtag-token-hashtag"
                    >Learn about HASHTAG token cryptoeconomics</a
                  >
                  <span class="icon has-text-primary">
                    <i class="mdi mdi-arrow-right mdi-18px"></i>
                  </span>
                </p>
              </div>
            </div>
            <div class="column is-offset-1 is-6">
              <div class="is-size-7 create-tokens line-numbers">
                <b-tabs type="is-boxed" :animated="false">
                  <b-tab-item label="mint()">
                    <prism language="solidity">
                      {{ mint }}
                    </prism>
                  </b-tab-item>
                  <b-tab-item label="mintAndTag()">
                    <prism language="solidity">
                      {{ mintAndTag }}
                    </prism>
                  </b-tab-item>
                </b-tabs>
              </div>
            </div>
          </div>
          <b-button
            outlined
            inverted
            class="is-pulled-right is-hidden-touch"
            icon-right="arrow-down"
            type="is-primary"
            onClick="document.getElementById('tagging').scrollIntoView({block: 'start', behavior: 'smooth'});"
          />
        </div>
      </section>
      <section class="section is-medium has-background-white" id="tagging">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-6">
              <div class="content">
                <template>
                  <b-carousel
                    :autoplay="false"
                    :indicator-inside="false"
                    animated="fade"
                    indicator-style="is-boxes"
                  >
                    <b-carousel-item
                      v-for="(schema, i) in taggingSchema"
                      :key="i"
                    >
                      <span class="image">
                        <img
                          :src="require(`../assets/img/${schema.img}.png`)"
                        />
                      </span>
                    </b-carousel-item>
                  </b-carousel>
                </template>
              </div>
            </div>
            <div class="column is-4 is-offset-1">
              <h2 class="title is-size-3 is-spaced">
                Tag content with HASHTAG tokens
              </h2>
              <div class="content is-medium">
                <p>
                  Generate revenue for yourself, token creators & owners when
                  users tag content in your application.
                </p>
                <p>
                  Our first tagging contract supports on-chain tagging of other
                  ERC-721 non-fungible tokens.
                </p>
                <p>
                  <a
                    href="https://docs.hashtag-protocol.org/essentials/#tagging-digital-content"
                    alt="on-chain tagging cryptoeconomics"
                    >Learn about on-chain tagging</a
                  >
                  <span class="icon has-text-primary">
                    <i class="mdi mdi-arrow-right mdi-18px"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <b-button
            outlined
            class="is-pulled-right is-hidden-touch"
            icon-right="arrow-down"
            type="is-primary"
            onClick="document.getElementById('subgraph').scrollIntoView({block: 'start', behavior: 'smooth'});"
          />
        </div>
      </section>
      <section
        class="section is-medium has-background-dark subgraph"
        id="subgraph"
      >
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-5">
              <h2 class="title is-size-3 is-spaced has-text-white-ter">
                Surface and display tagging data in new and meaningful ways.
              </h2>
              <div class="content is-medium has-text-white-ter">
                <p>
                  Minting and tagging events from all publishers are captured by
                  the
                  <a
                    target="_blank"
                    href="https://thegraph.com/explorer/subgraph/hashtag-protocol/hashtag-mainnet"
                    >Hashtag Protocol subgraph</a
                  >.
                </p>
                <p>
                  Rapidly query Hashtag Protocol transaction data and present it
                  in your own way.
                </p>
              </div>
            </div>
            <div class="column is-6 is-offset-1">
              <div class="is-size-7 create-tokens line-numbers">
                <b-tabs type="is-boxed" :animated="false">
                  <b-tab-item label="Query">
                    <prism language="javascript">
                      {{ query }}
                    </prism>
                  </b-tab-item>
                  <b-tab-item label="Result">
                    <prism language="javascript">
                      {{ queryReturn }}
                    </prism>
                  </b-tab-item>
                  <b-tab-item label="Display" class="nftDisplay">
                    <div data-v-11db82f8="" class="b-table">
                      <!---->
                      <!---->
                      <!---->
                      <!----><!----><!---->
                      <div class="table-wrapper has-mobile-cards">
                        <table tabindex="0" class="table is-hoverable">
                          <thead>
                            <tr>
                              <!----><!---->
                              <th draggable="false" class="">
                                <div class="th-wrap is-centered">
                                  <span class="is-relative">
                                    <span
                                      class="icon sort-icon is-small is-invisible"
                                      ><i class="mdi mdi-arrow-up"></i></span
                                  ></span>
                                </div>
                              </th>
                              <th draggable="false" class="">
                                <div class="th-wrap">
                                  <span class="is-relative">
                                    Asset Name
                                    <span
                                      class="icon sort-icon is-small is-invisible"
                                      ><i class="mdi mdi-arrow-up"></i></span
                                  ></span>
                                </div>
                              </th>
                              <th draggable="false" class="">
                                <div class="th-wrap">
                                  <span class="is-relative">
                                    Chain
                                    <span
                                      class="icon sort-icon is-small is-invisible"
                                      ><i class="mdi mdi-arrow-up"></i></span
                                  ></span>
                                </div>
                              </th>
                              <th draggable="false" class="">
                                <div class="th-wrap">
                                  <span class="is-relative">
                                    Hashtag
                                    <span
                                      class="icon sort-icon is-small is-invisible"
                                      ><i class="mdi mdi-arrow-up"></i></span
                                  ></span>
                                </div>
                              </th>
                              <!---->
                            </tr>
                            <!----><!---->
                          </thead>
                          <tbody>
                            <tr draggable="false" class="">
                              <!----><!---->
                              <td class="has-text-centered">
                                <a
                                  href="/nft/0x2aea4add166ebf38b63d09a75de1a7b94aa24163/15"
                                  class="keychainify-checked"
                                  ><img
                                    src="https://storage.googleapis.com/sentinel-nft/raw-assets/c_0x2aea4add166ebf38b63d09a75de1a7b94aa24163_t_15_raw_asset.svg+xml"
                                    alt="Drupal Brainiac"
                                    class="nft-thumb"
                                /></a>
                              </td>
                              <td data-label="Asset Name" class="">
                                <span
                                  class="has-text-weight-bold"
                                  name="Drupal Brainiac"
                                  ><a
                                    href="/nft/0x2aea4add166ebf38b63d09a75de1a7b94aa24163/15"
                                    class="keychainify-checked"
                                  >
                                    Drupal Brainiac
                                  </a></span
                                >
                              </td>
                              <td data-label="Chain" class="">
                                ethereum
                              </td>
                              <td data-label="Hashtag" class="">
                                <span class="has-text-weight-bold"
                                  ><a
                                    href="/hashtag/drupal"
                                    class="keychainify-checked"
                                  >
                                    #drupal
                                  </a></span
                                >
                              </td>
                              <!---->
                            </tr>
                            <!----><!---->
                            <tr draggable="false" class="">
                              <!----><!---->
                              <td class="has-text-centered">
                                <a href="#" class="keychainify-checked"
                                  ><img
                                    src="https://storage.googleapis.com/sentinel-nft/raw-assets/c_0x8853b05833029e3cf8d3cbb592f9784fa43d2a79_t_117443_raw_asset.jpeg"
                                    alt="RARE 1972 Schwinn Apple Krate Disc Brake Bicycle"
                                    class="nft-thumb"
                                /></a>
                              </td>
                              <td data-label="Asset Name" class="">
                                <span
                                  class="has-text-weight-bold"
                                  name="RARE 1972 Schwinn Apple Krate Disc Brake Bicycle"
                                  ><a
                                    href="/nft/0x8853b05833029e3cf8d3cbb592f9784fa43d2a79/117443"
                                    class="keychainify-checked"
                                  >
                                    RARE 1972 Schwinn Apple Krate Disc Brake
                                    Bicycle
                                  </a></span
                                >
                              </td>
                              <td data-label="Chain" class="">
                                ethereum
                              </td>
                              <td data-label="Hashtag" class="">
                                <span class="has-text-weight-bold"
                                  ><a
                                    href="/hashtag/schwinn"
                                    class="keychainify-checked"
                                  >
                                    #schwinn
                                  </a></span
                                >
                              </td>
                              <!---->
                            </tr>
                            <!----><!---->
                            <tr draggable="false" class="">
                              <!----><!---->
                              <td class="has-text-centered">
                                <a
                                  href="/nft/0xc37f78553046462969cca20e1daa372963a32f7c/1"
                                  class="keychainify-checked"
                                  ><img
                                    src="https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xc37f78553046462969cca20e1daa372963a32f7c_t_1_raw_asset.jpeg"
                                    alt="Polygon Crypto Donut #1"
                                    class="nft-thumb"
                                /></a>
                              </td>
                              <td data-label="Asset Name" class="">
                                <span
                                  class="has-text-weight-bold"
                                  name="Polygon Crypto Donut #1"
                                  ><a
                                    href="/nft/0xc37f78553046462969cca20e1daa372963a32f7c/1"
                                    class="keychainify-checked"
                                  >
                                    Polygon Crypto Donut #1
                                  </a></span
                                >
                              </td>
                              <td data-label="Chain" class="">
                                polygon
                              </td>
                              <td data-label="Hashtag" class="">
                                <span class="has-text-weight-bold"
                                  ><a
                                    href="/hashtag/donut"
                                    class="keychainify-checked"
                                  >
                                    #donut
                                  </a></span
                                >
                              </td>
                              <!---->
                            </tr>
                            <!----><!---->
                            <tr draggable="false" class="">
                              <!----><!---->
                              <td class="has-text-centered">
                                <a
                                  href="/nft/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/436593"
                                  class="keychainify-checked"
                                  ><img
                                    src="https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xd07dc4262bcdbf85190c01c996b4c06a461d2430_t_436593_raw_asset.gif"
                                    alt="¢яуρтσвιт¢αѕѕσ Punk #3011 (pipe smoker #2)"
                                    class="nft-thumb"
                                /></a>
                              </td>
                              <td data-label="Asset Name" class="">
                                <span
                                  class="has-text-weight-bold"
                                  name="¢яуρтσвιт¢αѕѕσ Punk #3011 (pipe smoker #2)"
                                  ><a
                                    href="/nft/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/436593"
                                    class="keychainify-checked"
                                  >
                                    ¢яуρтσвιт¢αѕѕσ Punk #3011 (pipe smoker #2)
                                  </a></span
                                >
                              </td>
                              <td data-label="Chain" class="">
                                ethereum
                              </td>
                              <td data-label="Hashtag" class="">
                                <span class="has-text-weight-bold"
                                  ><a
                                    href="/hashtag/pipe"
                                    class="keychainify-checked"
                                  >
                                    #pipe
                                  </a></span
                                >
                              </td>
                              <!---->
                            </tr>
                            <!----><!---->
                            <tr draggable="false" class="">
                              <!----><!---->
                              <td class="has-text-centered">
                                <a
                                  href="/nft/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/436593"
                                  class="keychainify-checked"
                                  ><img
                                    src="https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xd07dc4262bcdbf85190c01c996b4c06a461d2430_t_436593_raw_asset.gif"
                                    alt="¢яуρтσвιт¢αѕѕσ Punk #3011 (pipe smoker #2)"
                                    class="nft-thumb"
                                /></a>
                              </td>
                              <td data-label="Asset Name" class="">
                                <span
                                  class="has-text-weight-bold"
                                  name="¢яуρтσвιт¢αѕѕσ Punk #3011 (pipe smoker #2)"
                                  ><a
                                    href="/nft/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/436593"
                                    class="keychainify-checked"
                                  >
                                    ¢яуρтσвιт¢αѕѕσ Punk #3011 (pipe smoker #2)
                                  </a></span
                                >
                              </td>
                              <td data-label="Chain" class="">
                                ethereum
                              </td>
                              <td data-label="Hashtag" class="">
                                <span class="has-text-weight-bold"
                                  ><a
                                    href="/hashtag/punks"
                                    class="keychainify-checked"
                                  >
                                    #punks
                                  </a></span
                                >
                              </td>
                              <!---->
                            </tr>
                            <!----><!----><!---->
                          </tbody>
                          <tfoot>
                            <tr class="table-footer">
                              <th colspan="4"></th>
                            </tr>
                          </tfoot>
                        </table>
                        <!---->
                      </div>
                      <!---->
                    </div>
                  </b-tab-item>
                </b-tabs>
              </div>
            </div>
          </div>
          <b-button
            outlined
            inverted
            class="is-pulled-right is-hidden-touch"
            icon-right="arrow-down"
            type="is-primary"
            onClick="document.getElementById('revenue').scrollIntoView({block: 'start', behavior: 'smooth'});"
          />
        </div>
      </section>
      <section class="section is-medium has-background-white" id="revenue">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-5">
              <h2 class="title is-size-3 is-spaced">
                Generate revenue from Hashtag Protocol's permissionless,
                decentralized tagging protocol.
              </h2>
              <div class="content is-size-5">
                <p>
                  While our mission is to serve application developers, stitched
                  into Hashtag Protocol are game-theory incentive mechanisms
                  that harness the self-interest of at least six key market
                  participants to drive positive network growth.
                </p>
                <p>
                  <a
                    href="https://docs.hashtag-protocol.org/essentials/participants.html"
                  >
                    View key participants</a
                  >
                  <span class="icon has-text-primary">
                    <i class="mdi mdi-arrow-right mdi-18px"></i>
                  </span>
                </p>
              </div>
            </div>
            <div class="column is-5 is-offset-1">
              <span class="image participants">
                <img :src="require(`../assets/img/participants.png`)" />
              </span>
            </div>
          </div>
          <b-button
            outlined
            class="is-pulled-right is-hidden-touch"
            icon-right="arrow-down"
            type="is-primary"
            onClick="document.getElementById('build').scrollIntoView({block: 'start', behavior: 'smooth'});"
          />
        </div>
      </section>
      <section class="section is-medium has-background-dark" id="build">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-4"></div>
            <div class="column is-4">
              <h2 class="title is-spaced has-text-white-ter">
                Build with us.<br />
              </h2>
              <div class="content is-medium has-text-white-ter">
                <p>
                  Help create a future where hashtags are mediated by a
                  decentralized crypto-economic network rather than a few
                  central authorities.
                </p>
                <div class="buttons">
                  <b-button
                    size="is-medium"
                    tag="a"
                    href="https://docs.hashtag-protocol.org"
                    type="is-primary"
                    outlined
                  >
                    View docs
                  </b-button>
                  <b-button
                    size="is-medium"
                    tag="a"
                    href="/build"
                    type="is-primary"
                    outlined
                  >
                    Whitelist my application
                  </b-button>
                </div>
              </div>
            </div>
            <div class="column is-offset-1 is-1"></div>
          </div>
          <b-button
            outlined
            class="is-pulled-right is-hidden-touch"
            icon-right="arrow-up"
            type="is-primary"
            onClick="window.scrollTo({top: 0, behavior: 'smooth'});"
          />
        </div>
      </section>
    </div>
    <Newsletter />
    <Footer />
  </div>
</template>

<script>
import Footer from "hashtag-components/src/components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";

export default {
  name: "Developers",
  components: {
    Footer,
    Navbar,
    Newsletter,
  },
  data() {
    // prettier-ignore
    return {
      query: `// Fetch recently tagged NFTs
query {
  tags(first: 5, orderBy: timestamp, orderDirection: desc) {
    id
    hashtagId
    hashtagDisplayHashtag
    hashtag
    hashtagWithoutHash
    nftContract
    nftId
    nftContractName
    nftTokenUri
    nftName
    nftDescription
    nftImage
    tagger
    timestamp
    publisher
  }
}`,
      queryReturn: `// json returned from graph query
{
  "data": {
    "tags": [
      {
        "hashtag": "#drupal",
        "hashtagDisplayHashtag": "#drupal",
        "hashtagId": "6",
        "hashtagWithoutHash": "drupal",
        "id": "0x5798f3ffb5d0240ab7c7ca6f2bddab05736a36e7fccf37fd0b15b46abc03f443",
        "nftContract": "0x2aea4add166ebf38b63d09a75de1a7b94aa24163",
        "nftContractName": null,
        "nftDescription": null,
        "nftId": "15",
        "nftImage": null,
        "nftName": null,
        "nftTokenUri": null,
        "publisher": "0xe9fbc1a1925f6f117211c59b89a55b576182e1e9",
        "tagger": "0x07bd3b64f9f51fe1d5c79f81dfc0460fff305b0e",
        "timestamp": "1635784316"
      },
      {
        "hashtag": "#schwinn",
        "hashtagDisplayHashtag": "#schwinn",
        "hashtagId": "5",
        "hashtagWithoutHash": "schwinn",
        "id": "0xaa00b8251ea7d71a02fee4d936b193fdc559d61f556348d7f4db72dd421a45f9",
        "nftContract": "0x8853b05833029e3cf8d3cbb592f9784fa43d2a79",
        "nftContractName": null,
        "nftDescription": null,
        "nftId": "117443",
        "nftImage": null,
        "nftName": null,
        "nftTokenUri": null,
        "publisher": "0xe9fbc1a1925f6f117211c59b89a55b576182e1e9",
        "tagger": "0x07bd3b64f9f51fe1d5c79f81dfc0460fff305b0e",
        "timestamp": "1635548066"
      },
      {
        "hashtag": "#donut",
        "hashtagDisplayHashtag": "#donut",
        "hashtagId": "4",
        "hashtagWithoutHash": "donut",
        "id": "0xe73385589f895286cb81f8b36d4a79a7b69e269a698bcd59a906df9effb9e8da",
        "nftContract": "0xc37f78553046462969cca20e1daa372963a32f7c",
        "nftContractName": null,
        "nftDescription": null,
        "nftId": "1",
        "nftImage": null,
        "nftName": null,
        "nftTokenUri": null,
        "publisher": "0xe9fbc1a1925f6f117211c59b89a55b576182e1e9",
        "tagger": "0x93a5f58566d436cae0711ed4d2815b85a26924e6",
        "timestamp": "1635546586"
      },
      {
        "hashtag": "#pipe",
        "hashtagDisplayHashtag": "#pipe",
        "hashtagId": "3",
        "hashtagWithoutHash": "pipe",
        "id": "0xbf3b00cee81f360bfc9349a55a3cf04749a6f6dae74276bb57bcf5626e35adfe",
        "nftContract": "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
        "nftContractName": null,
        "nftDescription": null,
        "nftId": "436593",
        "nftImage": null,
        "nftName": null,
        "nftTokenUri": null,
        "publisher": "0xe9fbc1a1925f6f117211c59b89a55b576182e1e9",
        "tagger": "0x93a5f58566d436cae0711ed4d2815b85a26924e6",
        "timestamp": "1635546442"
      },
      {
        "hashtag": "#punks",
        "hashtagDisplayHashtag": "#punks",
        "hashtagId": "2",
        "hashtagWithoutHash": "punks",
        "id": "0x35fee11d2c6f25a85ca374c29aa84545ad15c7c5d69a1c2cd84b891bd1f1cce6",
        "nftContract": "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
        "nftContractName": null,
        "nftDescription": null,
        "nftId": "436593",
        "nftImage": null,
        "nftName": null,
        "nftTokenUri": null,
        "publisher": "0xe9fbc1a1925f6f117211c59b89a55b576182e1e9",
        "tagger": "0x93a5f58566d436cae0711ed4d2815b85a26924e6",
        "timestamp": "1635546346"
      }
    ]
  }
}`,
      mintAndTag: `
  /**
   * @notice Combines the action of creating a new hashtag and then tagging an NFT asset with this new tag.
   * @dev Only a whitelisted publisher can execute this with the required fee unless the caller / sender has admin privileges.
   * @param _hashtag string value of the hashtag to be minted
   * @param _nftContract address of nft contract
   * @param _nftId ID of the nft to link from the above nft contract
   * @param _publisher the publisher attributed to the tagging
   * @param _tagger the ethereum account that made the original tagging request
   */
  function mintAndTag(
    string calldata _hashtag,
    address _nftContract,
    uint256 _nftId,
    address payable _publisher,
    address _tagger) payable external {
      uint256 mintAndTagFee = calculateMintAndTagFee();
      require(msg.value >= mintAndTagFee, "Mint and tag: You must send the fee");
      require(accessControls.isPublisher(_publisher), "Mint and tag: The publisher must be whitelisted");

      uint256 hashtagId = hashtagProtocol.mint{value: hashtagProtocol.fee()}(_hashtag, _publisher, _tagger);
      tag(hashtagId, _nftContract, _nftId, _publisher, _tagger);
  }`,
      mint: `
  /**
   * @notice Method that a publisher can call to create a hashtag
   * @dev A fee is required unless the caller has an admin role
   * @param _hashtag String version of the hashtag to mint
   * @param _publisher Address of the publisher through which the hashtag is being created
   * @param _recipient Address that will receive the hashtag
   * @return _tokenId ID of the new hashtag
   */
  function mint(
    string memory _hashtag,
    address payable _publisher,
    address _recipient) payable public returns (uint256 _tokenId) {
      require(
        accessControls.isPublisher(_publisher),
        "Mint: The publisher must be whitelisted"
      );
      require(
        accessControls.isAdmin(_msgSender()) || msg.value >= fee,
        "Mint: Must send the platform fee"
      );

      _assertHashtagIsValid(_hashtag);

      // generate the new hashtag token id
      tokenPointer = tokenPointer.add(1);
      uint256 tokenId = tokenPointer;

      // create the hashtag
      string memory hashtagKey = _lower(_hashtag);
      tokenIdToHashtag[tokenId] = Hashtag({
          value : hashtagKey,
          displayVersion : _hashtag,
          created : now,
          originalPublisher : _publisher,
          creator : _msgSender()
          });

      // store a reverse lookup and mint the tag
      hashtagToTokenId[hashtagKey] = tokenId;
      displayHashtagToTokenId[_hashtag] = tokenId;

      _mint(_recipient, tokenId);

      // As long as the sender is not admin, a fee is required to mint
      uint256 platformFee;
      uint256 publisherFee;
      if (msg.value > 0) {
          // split fee
          platformFee = fee.div(modulo).mul(platformPercentage);
          (bool platformSuccess,) = platform.call{value : platformFee}("");
          require(platformSuccess, "Failed to transfer commission to platform");

          publisherFee = msg.value.sub(platformFee);
          (bool publisherSuccess,) = _publisher.call{value : publisherFee}("");
          require(publisherSuccess, "Failed to transfer commission to publisher");
      }

      // send the user any change / unexpected funds back
      _refundRemainingBalance();

      // log the minting event
      emit MintHashtag(tokenId, _recipient, hashtagKey, _hashtag, _publisher, platformFee, publisherFee);

      return tokenId;
  }
      `,
      taggingContracts: [
        {
          img: "tagging-contracts-today",
        },
        {
          img: "tagging-contracts-roadmap",
        },
      ],
      taggingSchema: [
        {
          img: "tagging-contracts-roadmap",
        },
        {
          img: "tagging-schema-one-one",
        },
        {
          img: "tagging-schema-one-many",
        },
        {
          img: "tagging-schema-many-one",
        },
        {
          img: "tagging-schema-many-many",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
code {
  .token.number {
    color: $dark;
    height: auto;
  }

  .number {
    background: none;
    font-size: inherit;
    padding: 0;
    margin: 0;
    min-width: inherit;
  }
}

.create-tokens {
  .tabs {
    li {
      a {
        font-weight: bold;
      }
    }

    li:not(.is-active) {
      a {
        color: $white;
      }

      a:hover {
        background: none;
      }
    }
  }

  .tab-content {
    padding: 0;

    pre {
      height: 400px;
      overflow-y: scroll;
      margin: 0;
    }
  }
}

.participants {
  img {
    width: 90%;
  }
}

.subgraph {
  .nftDisplay {
    img {
      max-width: 75px;
      max-height: 75px;
    }
  }
}
</style>
