<template>
  <Navbar />
  <div class="home-view">
    <!-- Header Section -->
    <header class="home-header">
      <h1 class="text-center">Dissertation Management System</h1>
      <p class="text-center">Manage your dissertation tasks efficiently</p>
    </header>

    <!-- Main Dashboard Section -->
    <div class="dashboard-section">
      <div class="dashboard-card">
        <h3>Manage Student</h3>
        <p>Manage your dissertation journey from submission to final review.</p>
      </div>

      <div class="dashboard-card">
        <h3>Submit a New Dissertation</h3>
        <p>Start a new dissertation by submitting your details and research work.</p>
      </div>

      <div class="dashboard-card">
        <h3>View Submitted Dissertations</h3>
        <p>Check the status of your dissertation submissions.</p>
      </div>
      
      <div class="dashboard-card">
        <h3>Dissertation Result</h3>
        <p>Check the Score of your dissertation.</p>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      username: "John Doe", // Example username, replace with dynamic user data if needed
    };
  },
  methods: {
    goToProfile() {
      this.$router.push("/profile");
    },
    goToSubmitDissertation() {
      this.$router.push("/submit-dissertation");
    },
    goToViewDissertations() {
      this.$router.push("/view-dissertations");
    },
    goToStatusPage() {
      this.$router.push("/status");
    },
  },
};
</script>

<style scoped>
.home-view {
  padding: 20px;
}

.home-header {
  background-color: #f4f7fc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.dashboard-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.dashboard-card h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.dashboard-card p {
  margin-bottom: 20px;
}

.dashboard-card button {
  width: 80%;
  padding: 10px;
}

.home-footer {
  padding: 10px;
  margin-top: 20px;
  background-color: #f4f7fc;
  border-top: 1px solid #ddd;
}
</style>
