<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head" />
    <section class="modal-card-body has-background-white">
      <div class="has-text-centered">
        <div class="mb-6">
          <img src="~/assets/loader3.svg" />
        </div>
        <p class="is-size-4 has-text-weight-semibold">
          Please sign transaction in your wallet
        </p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <b-button type="is-primary" @click="$emit('close-modal')">
          Close
        </b-button>
      </div>
    </footer>
  </div>
</template>
<script>
/**
 * Protocol action confirmed screen
 *
 * Loaded into the primary transaction modal (TxnModal.vue)
 * once user has confirmed the protocol action they are about
 * to perform. Acts as a loading screen while
 * user decides to confirm web3 wallet transaction.
 */
</script>
