<template>
  <div class="p-3 border rounded">
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="searchName" class="form-label">Search by Name</label>
        <input
          type="text"
          id="searchName"
          class="form-control"
          placeholder="Enter Name ..."
          v-model="filters.name"
        />
      </div>

      <div class="col-md-6 mb-3">
        <label for="searchGrade" class="form-label">Search by Grade</label>
        <input
          type="text"
          id="searchGrade"
          class="form-control"
          placeholder="Enter Grade (e.g. A, B, C)..."
          v-model="filters.grade"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  emits: ["update:filters"],
  props: {
    filters: {
      type: Object,
      default: () => ({ name: "", grade: "" }),
    },
  },
  watch: {
    filters: {
      handler(newFilters) {
        this.$emit("update:filters", newFilters);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.border {
  border: 2px solid #ccc !important;
}
</style>
