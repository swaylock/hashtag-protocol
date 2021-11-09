<template>
  <div class="card">
    <div class="card-image">
      <figure class="image">
        <video
          v-if="nft.metadataImageURI.includes('mp4')"
          autoplay=""
          controlslist="nodownload"
          loop=""
          playsinline=""
          poster=""
          preload="metadata"
          class=""
        >
          <source :src="nft.metadataImageURI" @error="setPendingImage" type="video/mp4" />
        </video>
        <img v-else :src="nft.metadataImageURI" @error="setPendingImage" :alt="nft.metadataName" />
      </figure>
    </div>
    <div class="card-content">
      <h2 class="title is-6">Asset information</h2>
      <div class="b-table" narrowed>
        <div class="table-wrapper">
          <table class="table is-size-7">
            <tbody>
              <tr draggable="false" class="">
                <td class="has-text-weight-bold">Name</td>
                <td>
                  {{ nft.metadataName }}
                </td>
              </tr>
              <tr draggable="false" class="">
                <td class="has-text-weight-bold">Chain</td>
                <td>
                  {{ nft.chain == 1 ? "ethereum" : "polygon" }}
                </td>
              </tr>
              <tr draggable="false" class="">
                <td class="has-text-weight-bold">Asset Id</td>
                <td style="word-break: break-word;">
                  {{ nft.tokenId }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Nft",
  props: {
    nft: Object,
  },
};
</script>
<style lang="scss" scoped></style>
