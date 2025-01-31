import { BigInt } from "@graphprotocol/graph-ts";
import { MintHashtag, HashtagProtocol } from "../generated/HashtagProtocol/HashtagProtocol";
import { Hashtag } from "../generated/schema";
import {
  toLowerCase,
  safeLoadOwner,
  safeLoadPlatform,
  safeLoadPublisher,
  ONE,
  safeLoadCreator,
} from "../utils/helpers";

/*
 * Track the minting of a hashtag
 *
 * event.params.tokenId NFT ID of the hashtag
 * event.params.hashtag Hashtag text
 * event.params.owner Owner of the new hashtag
 * event.params.publisher Publisher which facilitated the hashtag
 * event.params.publisherFee Fee earned by the publisher
 * event.params.platformFee Fee earned by the Hashtag Protocol
 *
 * Notes
 *  In addition to the data generated by a hashtag, further data points are generated:
 *   - Count of how many hashtags owned by an Ethereum address
 *   - Fees earned by the platform and publishers across all minting events
 */
export function handleMintHashtag(event: MintHashtag): void {
  let hashtagEntity = new Hashtag(event.params.tokenId.toString());
  let hashtagContract = HashtagProtocol.bind(event.address);
  let hashtag = hashtagContract.tokenIdToHashtag(event.params.tokenId);

  hashtagEntity.name = hashtag.value2;
  hashtagEntity.displayHashtag = event.params.displayHashtag;

  let displayHashtag: string = event.params.displayHashtag;
  let lowerHashtag: string = toLowerCase(displayHashtag);

  hashtagEntity.hashtag = lowerHashtag;
  hashtagEntity.hashtagWithoutHash = lowerHashtag.substring(1, lowerHashtag.length);

  hashtagEntity.owner = hashtagContract.platform();
  hashtagEntity.creator = hashtag.value1;
  hashtagEntity.publisher = event.params.publisher;
  hashtagEntity.timestamp = event.block.timestamp;
  hashtagEntity.tagCount = BigInt.fromI32(0);
  hashtagEntity.ownerRevenue = BigInt.fromI32(0);
  hashtagEntity.publisherRevenue = BigInt.fromI32(0);
  hashtagEntity.protocolRevenue = BigInt.fromI32(0);
  hashtagEntity.creatorRevenue = BigInt.fromI32(0);
  hashtagEntity.save();

  let owner = safeLoadOwner(event.params.creator.toHexString());
  owner.mintCount = owner.mintCount.plus(ONE);
  owner.save();

  // publisher
  let publisher = safeLoadPublisher(event.params.publisher.toHexString());
  publisher.mintCount = publisher.mintCount.plus(ONE);
  publisher.save();

  // platform
  let platform = safeLoadPlatform("platform");
  platform.save();

  // creator
  let creator = safeLoadCreator(hashtag.value1.toHexString());
  creator.mintCount = creator.mintCount.plus(ONE);
  creator.save();
}
