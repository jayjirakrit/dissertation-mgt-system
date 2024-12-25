<template>
  <Navbar />
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <h2 class="mb-4 col-md-4">Progress Report</h2>
      <button
        v-if="role != 'teacher'"
        class="btn btn-primary sm-btn"
        @click="submitReport('progress')"
      >
        Submit Report
      </button>
    </div>
    <!-- Progress Report Section -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">File Name:</div>
          <div class="col-md-8">
            {{ progressReport?.name ? progressReport.name : "" }}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">Submission status:</div>
          <div class="col-md-8 text-success">
            {{ progressReportStatus }}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">Last modified:</div>
          <div class="col-md-8">{{ progressReport?.time_stamp }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">File submissions:</div>
          <div class="col-md-8">
            <a
              href="#"
              class="text-decoration-none"
              @click.prevent="downloadPDF('progress')"
            >
              <i class="fas fa-file-pdf text-danger"></i>
              {{
                progressReport?.document ? progressReport.name : "Not Submitted"
              }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Final Report Section -->
    <div class="d-flex justify-content-between">
      <h2 class="mb-4 col-md-4">Final Report</h2>
      <button
        v-if="role != 'teacher'"
        class="btn btn-primary sm-btn"
        @click="submitReport('final')"
      >
        Submit Report
      </button>
    </div>
    <div class="card mb-4">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">File Name:</div>
          <div class="col-md-8">
            {{ finalReport?.name ? finalReport.name : "" }}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">Submission status:</div>
          <div class="col-md-8 text-success">
            {{ finalReportStatus }}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">Last modified:</div>
          <div class="col-md-8">{{ finalReport?.time_stamp }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4 font-weight-bold">File submissions:</div>
          <div class="col-md-8">
            <a
              href="#"
              class="text-decoration-none"
              @click.prevent="downloadPDF('final')"
            >
              <i class="fas fa-file-pdf text-danger"></i>
              {{ finalReport?.name ? finalReport.name : "Not Submitted" }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <h2 class="mb-4 col-md-4">Assignment Score</h2>
    </div>
    <!-- Score Section -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 font-weight-bold">Score:</div>
          <div class="col-md-8">
            <template v-if="editingScore && role === 'teacher'">
              <!-- Input field for editing -->
              <input
                v-model="grade"
                type="text"
                class="form-control form-control-sm d-inline-block"
                style="width: auto"
              />
              <!-- Save button -->
              <button class="btn btn-success btn-sm ms-2" @click="saveScore">
                Save
              </button>
            </template>
            <template v-else>
              <!-- Display score -->
              {{ grade ? grade : "" }}
              <!-- Edit button -->
              <span
                class="ms-3 text-primary"
                style="cursor: pointer"
                @click="editScore"
                v-if="role === 'teacher'"
              >
                Edit
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-4 mb-4" v-if="role === 'teacher'">
      <button class="btn btn-primary sm-btn me-3" @click="submitScoreReport">
        Submit
      </button>
      <button class="btn btn-secondary sm-btn" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script>
import {
  SaveGrade,
  GetReportsWithAssignments,
} from "@/composables/ReportService";
import Navbar from "@/components/Navbar";

export default {
  name: "StudentReportsView",
  components: { Navbar },

  data() {
    return {
      progressReport: null,
      progressReportStatus: null,
      finalReport: null,
      finalReportStatus: null,
      userId: null,
      role: null,
      editingScore: false,
      grade: null,
      assignmentId: null,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    submitScoreReport() {
      SaveGrade(this.assignmentId, this.grade, true)
        .then((data) => {
          alert(`report submitted!`);
        })
        .catch((err) => console.error("Error:", err));
    },
    editScore() {
      this.editingScore = true;
    },
    saveScore() {
      console.log("Saved Score:", this.progressReport.grade);
      this.editingScore = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    submitReport(reportType) {
      this.$router.push({
        path: "/submit-report",
        query: {
          userId: this.userId,
          assignmentId: this.assignmentId,
          type: reportType,
        },
      });
    },
    downloadPDF(reportType) {
      const report =
        reportType === "progress"
          ? this.progressReport?.document
          : this.finalReport?.document;

      if (!report) {
        console.error("No base64 content available to download.");
        return;
      }

      // Extract the base64 content after the 'data:application/pdf;base64,' prefix
      const base64Data = report.split(",")[1];

      // Convert base64 to a Blob
      const byteCharacters = atob(base64Data); // Decode base64 string to binary
      const byteArrays = [];

      // Create a byte array from the decoded binary data
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      // Create a Blob from the byte array
      const blob = new Blob(byteArrays, { type: "application/pdf" });

      // Create an anchor element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "report.pdf"; // Set the filename for the downloaded file
      link.click(); // Trigger the download
    },
  },
  created() {
    this.role = sessionStorage.getItem("role");
  },
  mounted() {
    this.userId = this.$route.params.userId;
    GetReportsWithAssignments(this.userId)
      .then((data) => {
        console.log("Mapped data:", data);
        this.finalReport = data[0].finalReport;
        this.finalReportStatus = data[0].finalReportStatus;
        this.progressReport = data[0].progressReport;
        this.progressReportStatus = data[0].progressReportStatus;
        this.assignmentId = data[0].id;
        this.grade = data[0].grade;
      })
      .catch((err) => console.error("Error:", err));
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #dee2e6;
}
.font-weight-bold {
  font-weight: 600;
}
.text-success {
  color: #28a745;
}

.sm-btn {
  width: 200px;
  height: 50px;
}
</style>
