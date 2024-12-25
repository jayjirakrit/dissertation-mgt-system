<template>
  <Navbar />
  <div class="container mt-5">
    <h2 class="text-center mb-4">Add New Student</h2>

    <!-- Add Student Form -->
    <form @submit.prevent="addStudent">
      <div class="mb-3">
        <label for="firstName" class="form-label text-start d-block"
          >First Name</label
        >
        <input
          type="text"
          id="firstName"
          class="form-control"
          v-model="newStudent.firstName"
          placeholder="Enter First Name"
          required
        />
      </div>

      <div class="mb-3">
        <label for="lastName" class="form-label text-start d-block"
          >Last Name</label
        >
        <input
          type="text"
          id="lastName"
          class="form-control"
          v-model="newStudent.lastName"
          placeholder="Enter Last Name"
          required
        />
      </div>

      <div class="mb-3">
        <label for="major" class="form-label text-start d-block">Major</label>
        <input
          type="text"
          id="major"
          class="form-control"
          v-model="newStudent.major"
          placeholder="Enter Major"
          required
        />
      </div>

      <div class="mb-3">
        <label for="username" class="form-label text-start d-block"
          >Username</label
        >
        <input
          type="text"
          id="username"
          class="form-control"
          v-model="newStudent.username"
          placeholder="Enter Username"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label text-start d-block"
          >Password</label
        >
        <input
          type="password"
          id="password"
          class="form-control"
          v-model="newStudent.password"
          placeholder="Enter Password"
          required
        />
      </div>

      <div class="mb-3">
        <label for="teacher" class="form-label text-start d-block"
          >Supervisor</label
        >
        <select
          id="teacher"
          class="form-control"
          v-model="studentAssignment.teacherId"
          required
        >
          <option disabled value="">Select Supervisor</option>
          <option
            v-for="teacher in teachers"
            :key="teacher.id"
            :value="teacher.id"
          >
            {{ teacher.firstName }} {{ teacher.lastName }}
          </option>
        </select>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary">Add Student</button>
        <button class="btn btn-secondary ms-3" @click="goBack">Back</button>
      </div>
    </form>

    <!-- Toast Message -->
    <div
      v-if="isToastVisible"
      class="toast-message custom-toast"
      :class="toastType"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>



<script>
import {
  CreateUserDemo,
} from "@/composables/UserService";
import Navbar from "@/components/Navbar";

export default {
  name: "CreateStudent",
  components: { Navbar },
  data() {
    return {
      newStudent: {
        firstName: null,
        lastName: null,
        major: null,
        role: null,
        username: null,
        password: null,
        teacherId: null,
        createdDatetime: null,
      },
      studentAssignment: {
        userId: null,
        progressReportId: null,
        progressReportStatus: null,
        finalReportId: null,
        finalReportStatus: null,
        teacherId: null,
        teacherName: null,
        grade: null,
        createdDatetime: null,
      },
      teachers: [],
      toastMessage: "",
      toastType: "",
      isToastVisible: false,
    };
  },
  methods: {
    addStudent() {
      // Add new student to the students list
      this.$emit("add-student", { ...this.newStudent });
      this.newStudent.role = "student";
      this.newStudent.createdDatetime = new Date().toISOString();
      this.newStudent.teacherId = this.studentAssignment.teacherId;
      this.studentAssignment.createdDatetime = new Date().toISOString();
      this.studentAssignment.teacherName = this.teachers.find(
        (teacher) => teacher.id === this.studentAssignment.teacherId
      )?.name;
      this.studentAssignment.finalReportStatus = "Not Submitted";
      this.studentAssignment.progressReportStatus = "Not Submitted";
      CreateUserDemo(this.newStudent, this.studentAssignment)
        .then((result) => {
          if (result.error) {
            // Display error toast
            this.showToast("Error: " + result.error, "danger");
            console.error("Error:", result.error);
          } else {
            // Display success toast
            this.showToast(
              "User and assignment created successfully!",
              "success"
            );
            console.log("User and assignment created:", result);
            setTimeout(() => {
              this.$router.push("/view-student");
            }, 2000);
          }
        })
        .catch((err) => {
          // Handle unexpected errors
          this.showToast("Unexpected error: " + err.message, "danger");
          console.error("Unexpected error:", err);
        });

      // Clear the form after submission
      this.newStudent = {
        firstName: null,
        lastName: null,
        major: null,
        role: null,
        username: null,
        password: null,
        createdDatatime: null,
      };

      this.studentAssignment = {
        userId: null,
        progressReportId: null,
        progressReportStatus: null,
        finalReportId: null,
        finalReportStatus: null,
        teacherId: null,
        teacherName: null,
        grade: null,
        createdDatetime: null,
      };
    },
    showToast(message, type) {
      // Display a Bootstrap toast with the specified message and type
      this.toastMessage = message;
      this.toastType = type;
      this.isToastVisible = true;
      setTimeout(() => {
        this.isToastVisible = false;
      }, 5000);
    },
    goBack() {
      this.$router.back();
    },
  },
  created() {
    // Fetch the list of teachers when the component is created
    fetch("http://localhost:3000/users?role=teacher")
      .then((res) => res.json())
      .then((data) => {
        this.teachers = data;
      })
      .catch((err) => {
        console.error("Failed to fetch teachers:", err.message);
      });
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.custom-toast {
  position: fixed;
  top: 50px;
  right: 50px;
  z-index: 1050;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
}

.btn {
  width: 120px;
}
</style>
