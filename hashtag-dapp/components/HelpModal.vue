<template>
  <b-tooltip label="Help" position="is-bottom" type="is-dark">
    <a class="has-text-grey">
      <span class="icon"
        ><i class="mdi mdi-help-circle-outline mdi-24px"></i
      ></span>
    </a>
  </b-tooltip>
</template>

<script>
/**
 * Popup a help / information modal.
 *
 * Pop a targeted modal in parent when
 * help icon in HelpModaltemplate is clicked.
 */
export default {
  name: "HelpModal",
  props: {
    /**
     * Name of the modal visibility boolean variable.
     * Set in parent.
     */
    modal: String,
  },
  methods: {
    /**
     * Emit the popModalFromChild event.
     */
    popModal() {
      /**
       * PopModalFromChild event.
       *
       * @event popModalFromChild
       * @param {string} modal prop value passed down from parent.
       */
      this.$emit("popModalFromChild", this.modal);
    },
  },
};
</script>
