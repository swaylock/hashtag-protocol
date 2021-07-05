<template>
  <div class="level">
    <div class="level-left"></div>
    <div class="level-right">
      <div class="level-item">
        <nav class="pagination">
          <b-button
            role="button"
            :disabled="currentPage === 0"
            @click="previousPage"
            class="pagination-link pagination-previous"
            ><span class="icon" aria-hidden="true"
              ><i class="mdi mdi-chevron-left mdi-24px"></i></span
          ></b-button>
          <b-button
            role="button"
            :disabled="currentPage === Math.ceil(entityCount / pageSize) - 1"
            @click="nextPage"
            class="pagination-link pagination-next"
            ><span class="icon" aria-hidden="true"
              ><i class="mdi mdi-chevron-right mdi-24px"></i></span
          ></b-button>
          <ul class="pagination-list">
            <li
              v-for="(page, idx) in Array.from(
                {
                  length: Math.ceil(entityCount / pageSize),
                },
                (v, k) => k
              )"
              :key="idx"
              @click="tabSelected(page)"
            >
              <b-button
                role="button"
                class="pagination-link"
                v-bind:class="{
                  'is-current': currentPage === page,
                }"
                >{{ page + 1 }}</b-button
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    entityCount: {
      required: true,
      type: Number,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: 0,
    };
  },
  methods: {
    nextPage() {
      const pageId = this.currentPage + 1;
      this.$emit("tabSelected", pageId);
      this.currentPage = pageId;
    },
    previousPage() {
      const pageId = this.currentPage - 1;
      this.$emit("tabSelected", pageId);
      this.currentPage = pageId;
    },
    tabSelected(pageId) {
      this.currentPage = pageId;
      this.$emit("tabSelected", pageId);
    },
  },
};
</script>

<style scoped></style>
