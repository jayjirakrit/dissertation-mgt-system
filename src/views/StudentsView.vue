<template>
  <Navbar />
  <div class="container mt-5">
    <!-- Header with View Student and Create User Button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- View Student Heading -->
      <h2 class="text-center flex-grow-1 mb-0">View Student</h2>

      <!-- Create User Button -->
      <button
        class="btn btn-primary"
        @click="navigateToCreateUser"
        v-if="admin"
      >
        Create Student
      </button>
    </div>

    <!-- Search Bar -->
    <SearchBar v-model:filters="filters" />

    <!-- Student List -->
    <div v-if="students">
      <StudentList :students="students" :filters="filters" />
    </div>
  </div>
</template>

<script>
import SearchBar from "@/components/Searchbar";
import StudentList from "@/components/StudentList";
import { GetAllUsers, GetUsers } from "@/composables/UserService";
import Navbar from "@/components/Navbar";

export default {
  name: "StudentViews",
  components: {
    SearchBar,
    StudentList,
    Navbar
  },
  data() {
    return {
      filters: {
        name: "",
        grade: "",
      },
      students: null,
      admin: false,
      token: null,
    };
  },
  created() {
    this.admin = sessionStorage.getItem("role") === "admin";
    this.token = JSON.parse(sessionStorage.getItem("token"));
  },
  mounted() {
    GetUsers(this.token)
      .then((data) => (this.students = data))
      .catch((err) => console.log(err.message));
  },
  methods: {
    navigateToCreateUser() {
      this.$router.push("/create-student");
    },
  },
};
</script>
