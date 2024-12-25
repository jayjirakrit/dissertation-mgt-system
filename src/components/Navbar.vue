<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand ms-3" @click="navigateHome">HKU Dissertation</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <div
              class="nav-link"
              active-class="active"
              exact
              @click="navigateLanding"
            >
              Disseration
            </div>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto me-3">
          <li class="nav-item">
            <div class="nav-link" active-class="active" @click="logout">
              Logout
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      role: null,
      token: null,
    };
  },
  created() {
    this.role = sessionStorage.getItem("role");
    this.token = JSON.parse(sessionStorage.getItem("token"));
  },
  methods: {
    navigateLanding() {
      if (this.role === "student") {
        this.$router.push("/view-student-report/" + this.token.id);
      } else {
        this.$router.push("/view-student");
      }
    },
    navigateHome() {
      this.$router.push("/");
    },
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
