<template>
  <div class="modal-card transaction-modal">
    <header class="modal-card-head" />
    <section class="modal-card-body has-background-white">
      <div class="has-text-centered">
        <b-icon icon="cancel" size="is-large" type="is-danger" class="mb-6">
        </b-icon>
        <p class="is-size-4 has-text-weight-semibold">Transaction rejected</p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <div
        class="buttons"
        v-if="
          address !== null &&
          address !== undefined &&
          (transactionState.eventCode == 'rejected' ||
            transactionState.eventCode == 'txSent')
        "
      >
        <b-button type="is-primary" @click="$emit('close-modal')">
          Close
        </b-button>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "TxnModalRejected",
  props: {
    newHashtag: String,
    txnType: String,
  },
  computed: {
    ...mapGetters("wallet", ["address", "transactionState"]),
  },
};
</script>
