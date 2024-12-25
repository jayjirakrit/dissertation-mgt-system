<template>
  <Navbar />
  <div class="container mt-5">
    <h2 class="text-center mb-4">Submit Reports</h2>

    <!-- Report Submission -->
    <div class="report-section mb-5">
      <h4 class="mb-4">
        {{ type ? type.charAt(0).toUpperCase() + type.slice(1) : "" }} Report
      </h4>
      <div
        class="drag-drop-area border border-primary rounded p-4 text-center"
        @dragover.prevent="handleDragOver('progress')"
        @dragleave.prevent="handleDragLeave('progress')"
        @drop.prevent="handleFileDrop('progress', $event)"
        :class="{ 'bg-light': isDragging.progress }"
      >
        <p class="mb-3">Drag and drop your file here, or click to browse</p>
        <input
          type="file"
          ref="progressFileInput"
          class="d-none"
          @change="handleFileSelect('progress', $event)"
        />
        <button
          class="btn btn-outline-primary"
          @click="triggerFileInput('progress')"
        >
          Browse File
        </button>
      </div>
      <div v-if="submittedFiles.progress" class="mt-3">
        <h6>Selected Report:</h6>
        <p>{{ submittedFiles.progress.name }}</p>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="d-flex justify-content-end mt-4">
      <button
        class="btn btn-primary"
        :disabled="!submittedFiles.progress"
        @click="submitReports"
      >
        Submit Report
      </button>

      <button class="btn btn-secondary ms-3" @click="goBack">Back</button>
    </div>
  </div>
</template>


<script>
import { UploadReportDocument } from "@/composables/ReportService";
import Navbar from "@/components/Navbar";

export default {
  name: "SubmitFile",
  components: { Navbar },

  data() {
    return {
      submittedFiles: {
        progress: null, // Holds the Progress Report file
      },
      isDragging: {
        progress: false, // Tracks drag-and-drop state for Progress Report
      },
      base64Content: null,
    };
  },
  computed: {
    userId() {
      return this.$route.query.userId;
    },
    assignmentId() {
      return this.$route.query.assignmentId;
    },
    type() {
      return this.$route.query.type;
    },
  },
  methods: {
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Define the onload event handler
        reader.onload = function (e) {
          resolve(e.target.result); // The result will be the file content in base64
        };
        reader.onerror = function () {
          reject(new Error("Failed to read the file."));
        };
        reader.readAsDataURL(file);
      });
    },
    // Trigger the hidden file input
    triggerFileInput(reportType) {
      this.$refs[`${reportType}FileInput`].click();
    },

    handleFileSelect(reportType, event) {
      const file = event.target.files[0]; // Get the selected file
      if (file && file.type === "application/pdf") {
        this.submittedFiles[reportType] = file; // Store selected file if PDF
        this.convertFileToBase64(file)
          .then((base64Content) => {
            this.base64Content = base64Content; // Store base64 content in variable
            console.log("Base64 Content:", this.base64Content); // For debugging
          })
          .catch((error) => {
            console.error("Error converting file to base64:", error.message);
          });
      } else {
        alert("Please select a PDF file.");
      }
    },

    // Handle drag-over event for drag-and-drop area
    handleDragOver(reportType) {
      this.isDragging[reportType] = true; // Set dragging state
    },

    // Handle drag-leave event
    handleDragLeave(reportType) {
      this.isDragging[reportType] = false; // Reset dragging state
    },

    // Handle file drop
    handleFileDrop(reportType, event) {
      this.isDragging[reportType] = false; // Reset dragging state
      if (event.dataTransfer.files.length) {
        this.submittedFiles[reportType] = event.dataTransfer.files[0]; // Store dropped file
        this.convertFileToBase64(this.submittedFiles[reportType]) // Convert the dropped file to base64
          .then((base64Content) => {
            this.base64Content = base64Content; // Store base64 content in variable
            console.log("Base64 Content:", this.base64Content); // For debugging
          })
          .catch((error) => {
            console.error("Error converting file to base64:", error.message);
          });
      }
    },

    // Submit the selected file
    submitReports() {
      const progressFile = this.submittedFiles.progress
        ? this.submittedFiles.progress.name
        : "No file";
      const file = { name: progressFile, content: this.base64Content };
      UploadReportDocument(file, this.type, this.$route.query.assignmentId)
        .then((data) => console.log("Success: " + data))
        .catch((err) => console.log(err.message));
      // Display the submitted progress file as an alert (or handle server upload here)
      alert(`Submitted Report:\nProgress Report: ${progressFile}`);

      // Clear the form after submission
      this.submittedFiles.progress = null;
      this.base64Content = null;
      this.$refs.progressFileInput.value = "";
      setTimeout(() => {
        this.$router.push("/view-student-report/" + this.userId);
      }, 2000);
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>


<style scoped>
.drag-drop-area {
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}
.drag-drop-area.bg-light {
  background-color: #f8f9fa; /* Light gray background when dragging */
}

.btn {
  width: 150px;
}
</style>
