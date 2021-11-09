# Hashtag Protocol Overview

<!-- markdownlint-disable MD013 -->
| Conventions used in documentation |                                                         |
| -------------                     | -------------                                           |
| **_bold italic_**                 | References [key participants](/essentials/participants.html) |
| `Constant width`                  | References protocol code and codish concepts            |
|                                   |                                                         |

## Hashtag Token (`HASHTAG`)

| Tokenomics |                                              |
| -----------| -------------                                |
| **Type**   | Ethereum ERC- 721 non-fungible token (NFT)   |
| **Symbol** | `HASHTAG`                                      |
| **Supply** | Unlimited                                    |
|            |                                              |
<!-- markdownlint-enable -->

The centerpiece of Hashtag Protocol is the `HASHTAG` token (`HASHTAG`), an
Ethereum ERC-721 non-fungible token.  HASHTAG tokens have the following
features:

1. Each `HASHTAG` both contains and represents a unique hashtag string. There is
   only one instance of each `HASHTAG` token - no two may contain the same
   string.
2. Minting contract validates that the unique string contained and referenced by
   a `HASHTAG` adheres to the following:
    1. Must begin with hashtag symbol (#).
    2. Alphanumeric characters only (a-z, A-Z, 0-9). No punctuation, spaces or
       special characters.
    3. Uppercase and lowercase characters are permitted.
    4. Minimum 3 characters with at least 1 alphabetic character.
    5. Maximum 32 characters.
3. There is no upper limit to the number of `HASHTAG` that can be minted; the
   only requirement is that the text string they contain must be _unique_ and
   _valid_.
4. New `HASHTAG` are “minted” on enabled **_Publisher_** platforms by users
   interacting with their application or programmatically by the **_Publisher_**
   itself.
5. Tokens cost nothing to create (no **_Protocol_** fee) except for the standard
   Ethereum network gas fee to execute the minting contract.
6. The wallet address that pays the minting transaction fee is recorded as the
   token **_Creator_**.
7. New `HASHTAG` may be created alone or at the point of content tagging via the
   `mint_and_tag()` function. (see [Tagging Digital
   Content](#tagging-digital-content) below).
8. When a `HASHTAG` is created, ownership is transferred to the **_Protocol_**
   where they are held until released for auction.
9. While pending release for auction, a `HASHTAG` may be used to tag digital
   assets by any user on any **_Publisher_** platform. The `HASHTAG` token
   auction commences in Phase 3 of the [project roadmap](/essentials/roadmap.html)
   and will run continually thereafter.
10. Once released for auction, anyone may bid on a `HASHTAG` on any platform
    hosting auctions. See [`HASHTAG` Auction](#hashtag-auction) for more details
    on the auction itself.
11. When the auction ends, the `HASHTAG` token is transferred to the wallet of
    the winning bidder, and that wallet address represents the `HASHTAG` token
    **_Owner_**.
12. Auction proceeds are divided up held by the **_Protocol_** in participant
    accrual accounts mapped to their wallet address as follows:
    1. 40% **_Creator_** (ETH address that created `HASHTAG`)
    2. 40% **_Publisher_** (ETH address of publisher platform that minted
       `HASHTAG`)
    3. 20% **_**_Protocol_**_**

    See [revenue sharing](#revenue-sharing) and [key
    participants](/essentials/participants.html) for more details.
13. Participants may draw down earnings from their accrual account to their
    wallet at any time. Transaction gas fees apply.
14. An **_Owner_** may sell/trade their `HASHTAG` tokens on the open market
    peer-to-peer or on standard NFT platforms such as OpenSea.
15. **_Owner_** receives 100% of resale revenue.
16. `HASHTAG` **_Owner_** must renew, without cost, their claim on a `HASHTAG`
    token every two years. Tokens that are not renewed return to the
    **_Protocol_** and are re-released for auction.

## Tagging Digital Content

`HASHTAG` token utility is extended by smart contracts (Fig. 1 below) for
linking a `HASHTAG` to any online artifact, effectively “tagging” that content
with a hashtag string. Tagging data is saved on-chain.

<!-- markdownlint-disable MD013 MD033 -->
<br /> <SchemaSlideshow /> <br />
<!-- markdownlint-enable -->

This design pattern permits great flexibility in how `HASHTAG` utility can be
extended by the **_Protocol_** and third-party developers. We envision and hope
new and novel tagging contracts will be developed as the **_Protocol_** matures.

Hashtag Protocol is launching with a single tagging contract with the following
features:

1. Tagging is restricted to other ERC-721 NFTs. (ie. Contract validates that the
   content being tagged is a ERC-721 NFT.)
2. Contract utilizes a many-to-many `HASHTAG`-to-ERC-721 NFT relationship. In
   other words, an ERC-721 NFT can be tagged with any number of `HASHTAG`s and
   conversely, a single `HASHTAG` may tag any number of ERC-721 NFTs. See figure
   2 above.
3. **_Tagger_** may tag any ERC-721 NFT (except other `HASHTAG` tokens) with any
   `HASHTAG`.
4. **_Tagger_** may also create a new `HASHTAG` and tag at the same time via
   `mintAndTag()` method. This makes the **_Tagger_** also the **_Creator_**.
5. **_Tagger_** pays the Ethereum transaction gas fee plus a small `tagging fee`
   set by the **_Protocol_**.
6. The `tagging fee` is small, fixed in the contract and identical for all
   tagging events.
7. Immediately upon tagging event completion, the `tagging fee` is divided up
    held by the **_Protocol_** in participant accrual accounts mapped to their
    wallet address as follows:
    1. 50% **_Creator_** before first auction of token; 50% to **_Owner_**
       post-auction
    2. 30% **_Publisher_** hosting tagging event
    3. 20% **_Protocol_**

    See [revenue sharing](#revenue-sharing) and [key
    participants](/essentials/participants.html) for more details.

8. Participants may draw down earnings from their accrual account to their
   personal wallet at any time. Transaction gas fees apply.

## Surfacing Tagging & Market Data

The Minting and tagging transactions are captured by the Hashtag Protocol
Subgraph hosted on The Graph. This permits querying Hashtag Protocol data in
extremely efficient and targeted ways.

More details coming soon.

## Hashtag Token Auction

To ensure fair and accurate pricing of newly minted `HASHTAG`, we will utilize
an auction. Whether we utilize a third party auction platform (eg. OpenSea) or
develop our own is TBD in [Phase
2](/essentials/roadmap.html#phase-2-platform-promotion).

At this point, we believe it would be advantageous to develop our own for
greater control over statuses and to provide APIs to enable **_Publishers_** to
also act as **_Auctioneers_**. This model is similar to modern DNS registry and
its network of third party registrars (eg. GoDaddy).

### Auction summary

The following is some high-level thinking of our take on a potential `HASHTAG`
Auction:

* **_Creator_** can mint new `HASHTAG` at no cost (only Ethereum txn fees) on
    any **_Publisher_** platform.
* Upon minting, **_Creator_** address is recorded in `HASHTAG` and ownership is
    transferred to **_Protocol_**.
* Token status goes to “Unreleased” and Token is added to the next scheduled
    “Release batch”. Next batch “Release date” should be based on block height,
    in such a way that batches are released every x blocks (thinking 2-4 weeks).
    If there are no gas / txn benefits to “batching” the release, consider
    releasing tokens continuously after they have been Unreleased for 2-4 weeks.
* Once a `HASHTAG` is released (either in a batch or individually) the status of
    the `HASHTAG` moves to “Released”.
* Once “Released”, the `HASHTAG` can be bid on by any user on any
    **_Auctioneer_** platform. **_Publishers_** may also act as
    **_Auctioneers_**.
* Once the `HASHTAG` receives a bid, status of the `HASHTAG` moves to “In
    auction” and the auction begins.
* If a “Released” `HASHTAG` receives no bid, it simply stays in the “Released”
    status indefinitely, available for tagging. Tagging revenues will flow to
    pre-auction participants as outlined below in [revenue
    sharing](#revenue-sharing).
* `HASHTAG` auctions last for TBD blocks. Thinking 1-2 weeks.
* `HASHTAG` is transferred to winning bidder wallet, and that wallet is now the
  **_Owner_**.

### Bidding details

Seems like the simplest way to handle the auction process, is to use an“English
auction” in which users bid up the price of the Token, having full visibility of
all bids (at least their values). There can be some parameters added to prevent
“swooping in” at the end of the auction. For example, Opensea enforces the
following on bids:

* Bids must be at least 5% higher than the previous bid. Only bids in the same
    payment token (e.g. wrapped ETH or DAI) as the auction will be counted
    towards the winning bid.
* If someone bids in the last 5 minutes of an auction, and if their bid exceeds
    all others, the auction will automatically extend by 5 minutes. This can
    continue for up to a week of extensions.

With the Hashtag Protocol auction, when a user bids, their funds are locked in
the auction contract. Not sure what this means for handling additional bids. Ie.
do we edit the first bid, or create a completely separate bid, locking up
additional funds.

When auction finishing block height is reached (thus triggering the end of
auction), the `HASHTAG` is transferred to the winning bidder, and locked funds
of losing bidders are unlocked and can be pulled down.

## Revenue sharing
<!-- markdownlint-disable MD013 MD033 -->
<RevenueModel />
<!-- markdownlint-enable -->

Note: A participant may perform several roles at the same time. For example, a
**_Publisher_** could mint a `HASHTAG` on their own platform and auction it
there. That would make this participant **_Creator_**, **_Publisher_** &
**_Auctioneer_** and would receive 80% of the initial token auction revenue.

**_Publishers_** and **_Auctioneers_** must be enabled to run the Protocol.
Please contact us at
[contact@hashtag-protocol.org](mailto:contact@hashtag-protocol.org) if you would
like to have your application enabled.

See [Key Participants](/essentials/participants.html) for more details on participant
use cases and financial incentives.
