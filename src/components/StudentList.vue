<template>
  <div class="mt-4">
    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Progress Report</th>
          <th>Final Report</th>
          <th>Grade</th>
          <th>View</th>
        </tr>
      </thead>
      <tbody v-if="students">
        <tr v-for="(student, index) in filteredStudents" :key="student.id">
          <td>{{ index + 1 }}</td>
          <td>{{ student.firstName }} {{ student.lastName }}</td>
          <td>{{ student.progressReportStatus ? student.progressReportStatus : "Not Submitted" }}</td>
          <td>{{ student.finalReportStatus ? student.finalReportStatus : "Not Submitted" }}</td>
          <td>{{ student.grade ? student.grade : "Not Graded" }}</td>
          <td @click="viewUserReport(student.userId)"><i class="fas fa-eye"></i></td>
        </tr>
        <tr v-if="filteredStudents.length === 0">
          <td colspan="4" class="text-center">No matching students found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "StudentList",
  props: ["students", "filters"],
  computed: {
    filteredStudents() {
      return this.students.filter((student) => {
        const name = student.firstName + " " + student.lastName;
        const matchesName = this.filters.name
          ? name.toLowerCase().includes(this.filters.name.toLowerCase())
          : true;

        const matchesGrade = this.filters.grade
          ? student.grade
              ?.toLowerCase()
              ?.includes(this.filters.grade.toLowerCase())
          : true;
        return matchesName && matchesGrade;
      });
    },
  },
  methods: {
    viewUserReport(id) {
      this.$router.push("/view-student-report/" + id);
    },
  },
};
</script>

<style scoped>
.table-bordered {
  border: 2px solid #ccc;
}

.table-light {
  background-color: #f9f9f9;
  font-weight: bold;
}
</style>
