<template>
  <div class="card">
    <div class="card-image">
      <figure class="image">
        <img :src="nft.metadataImageURI" :alt="nft.metadataName" />
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
                <td class="has-text-weight-bold">Project</td>
                <td>
                  {{ nft.contractName }}
                </td>
              </tr>
              <tr draggable="false" class="">
                <td class="has-text-weight-bold">Asset Id</td>
                <td>
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
