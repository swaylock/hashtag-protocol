<template>
  <div class="box content mb-4 has-text-left has-background-grey-lighter">
    <!-- ***************************
    ************* MINT *************
    *****************************-->
    <div v-if="this.protocolAction == 'mintHashtag'">
      <p class="is-size-4">
        <strong>You're about to mint a HASHTAG token.</strong>
      </p>
      <p>And there's some real potential benefits for you too. So read on...</p>
      <p>
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.newHashtag.displayHashtag }}</b-tag
          ></span
        >
        <strong> is a one-of-a-kind, digital token</strong> (aka "NFT") that
        both represents and contains the hashtag.
      </p>
      <p>
        <strong>Immediately after minting</strong>
        &nbsp;<span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.newHashtag.displayHashtag }}</b-tag
          ></span
        >
        will join the global pool of HASHTAG tokens and be available for tagging
        content on any participating platform. If you're a developer and
        interested in hooking up your application
        <a href="https://www.hashtag-protocol.org/developers"
          >click here to learn more</a
        >.
      </p>
      <p>
        <strong>Minting does not imply ownership.</strong> Instead, your wallet
        address is registered within the token as the “creator”. After it’s
        minted,
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.newHashtag.displayHashtag }}</b-tag
          ></span
        >
        is held by Hashtag Protocol until released for auction.
      </p>
      <p>
        <strong>As the token creator,</strong> you are entitled to 40% of the
        initial auction revenue. In addition, you are entitled to 50% of the
        tagging revenue until
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.newHashtag.displayHashtag }}</b-tag
          ></span
        >
        is purchased.
      </p>
      <p>
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.newHashtag.displayHashtag }}</b-tag
          ></span
        >
        <strong> is not editable once minted.</strong> So be sure to double
        check spelling and casing before you proceed.
      </p>
      <p>
        <a
          class="has-text-weight-medium"
          href="https://docs.hashtag-protocol.org/essentials/protocol-overview.html"
          target="_blank"
          >Learn more about HASHTAG tokens
          <span class="icon-text has-text-primary">
            <span class="icon">
              <i class="mdi mdi-18px mdi-open-in-new"></i>
            </span>
          </span>
        </a>
      </p>
    </div>
    <!-- ***************************
    ************* TAG **************
    *****************************-->
    <div v-if="this.protocolAction == 'tagContent'">
      <p class="is-size-4">
        <strong
          >You're about to tag <em>{{ this.targetNft.metadataName }}</em> with a
          HASHTAG token.</strong
        >
      </p>
      <p>And should I do that?...</p>
      <p>
        For the same reason people use hashtags on centralized platforms: to
        promote and increase engagement in your content.
      </p>
      <p>
        Only in this case, your tagging data is saved to the blockchain making
        it uncensorable, and readily accessible to any application on the
        internet.
      </p>
      <p>
        <a
          class="has-text-weight-medium"
          href="https://docs.hashtag-protocol.org/essentials/protocol-overview.html#tagging-digital-content"
          target="_blank"
          >Learn more about decentralized content tagging
          <span class="icon-text has-text-primary">
            <span class="icon">
              <i class="mdi mdi-18px mdi-open-in-new"></i>
            </span>
          </span>
        </a>
      </p>
    </div>
    <!-- ***************************
    *******  MINT AND TAG **********
    *****************************-->
    <div v-if="this.protocolAction == 'mintAndTagContent'">
      <p class="is-size-4">
        <strong
          >You're about to mint
          <span
            ><b-tag
              type="is-primary"
              size="is-medium"
              class="has-text-weight-medium"
              >{{ this.targetHashtag.displayHashtag }}</b-tag
            ></span
          >
          and tag <em>{{ this.targetNft.metadataName }}</em> with it.</strong
        >
      </p>
      <p>We call this a "mint and tag". Here's what you need to know...</p>
      <p>
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.targetHashtag.displayHashtag }}</b-tag
          ></span
        >
        <strong> is a one-of-a-kind, digital token</strong> (aka "NFT") that
        both represents and contains the hashtag.
      </p>
      <p>
        <strong>Immediately after minting </strong>
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.targetHashtag.displayHashtag }}</b-tag
          ></span
        >
        will join the global pool of HASHTAG tokens and be available for tagging
        content on any participating platform.
      </p>
      <p>
        <strong>Minting does not imply ownership.</strong> Instead, your wallet
        address is registered within the token as the “creator”. After it’s
        minted,
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.targetHashtag.displayHashtag }}</b-tag
          ></span
        >
        is held by Hashtag Protocol until released for auction.
      </p>
      <p>
        <strong>As the token creator,</strong> you are entitled to 40% of the
        initial auction revenue. In addition, you are entitled to 50% of the
        tagging revenue until
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.targetHashtag.displayHashtag }}</b-tag
          ></span
        >
        is purchased.
      </p>
      <p>
        <span
          ><b-tag
            type="is-primary"
            size="is-medium"
            class="has-text-weight-medium"
            >{{ this.targetHashtag.displayHashtag }}</b-tag
          ></span
        >
        <strong> is not editable once minted.</strong> So be sure to double
        check spelling and casing.
      </p>
      <p>
        Your tagging data is saved to the blockchain making it uncensorable, and
        readily accessible to any application on the internet. In other words,
        this ain't your regular, every day hashtag.
      </p>
    </div>
    <h3 class="is-size-4">Transaction costs</h3>
    <p>
      It costs money to use a decentralized, global computer (Ethereum). Here’s
      some estimates of how much this transaction will cost right now:
    </p>
    <TransactionFees />
    <p>
      By clicking “confirm” you'll be prompted to sign a transaction in your
      crypto wallet. Signing the transaction will begin the minting process.
      You'll also be joining our humble movement to wrestle power from the
      social media giants.
    </p>
  </div>
</template>
<script>
import TransactionFees from "~/components/Transact/TransactionFees";
import { mapGetters } from "vuex";

export default {
  name: "ExplainProtocol",
  components: {
    TransactionFees,
  },
  computed: {
    ...mapGetters("protocolAction", [
      "protocolAction",
      "targetNft",
      "targetHashtag",
      "newHashtag",
    ]),
    ...mapGetters("wallet", ["address", "transactionState"]),
  },
};
</script>
<style lang="scss" scoped></style>
