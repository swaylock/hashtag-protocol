<template>
  <div class="mb-5">
    <table class="table is-fullwidth radius is-size-7">
      <tr>
        <td><strong>Fastest</strong><br />below 30 seconds (next block)</td>
        <td class="is-vcentered">
          {{ feeETH.fastest }} ETH (≈${{ feeUSD.fastest }})
        </td>
      </tr>
      <tr>
        <td><strong>Fast</strong><br />below 2 minutes (&lt;10 blocks)</td>
        <td class="is-vcentered">
          {{ feeETH.fast }} ETH (≈${{ feeUSD.fast }})
        </td>
      </tr>
      <tr>
        <td><strong>Average</strong><br />around 5 minutes (&lt;20 blocks)</td>
        <td class="is-vcentered">
          {{ feeETH.average }} ETH (≈${{ feeUSD.average }})
        </td>
      </tr>
      <tr>
        <td>
          <strong>Slow</strong><br />below 30 minutes (a.k.a safe-low, &lt;120
          blocks)
        </td>
        <td class="is-vcentered">
          {{ feeETH.slow }} ETH (≈${{ feeUSD.slow }})
        </td>
      </tr>
      <tfoot align="center">
        <tr>
          <th colspan="2" class="has-text-weight-normal">
            <p>
              <strong>Ouch that's expensive!</strong> We get it -- and we're
              working on this right now.<br />
              <a
                href="https://hashtagprotocol.substack.com/welcome"
                target="_blank"
                >Subscribe to our Substack</a
              >
              to keep updated with our progress
            </p>
            <p>
              <span>Gas price | Updated: {{ gasUpdated }}</span
              >&nbsp;-&nbsp;
              <span>Exchange rate | Updated: {{ exchangeRateUpdated }}</span>
              <br />
            </p>
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "TransactionFees",
  computed: {
    ...mapGetters("transactionFees", [
      "feeETH",
      "feeUSD",
      "gasUpdated",
      "exchangeRateUpdated",
    ]),
    ...mapGetters("protocolAction", ["protocolAction"]),
  },
};
</script>
