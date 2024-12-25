<template>
  <header class="home-header">
    <h1 class="text-center mt-5 fw-bold">Dissertation Management System</h1>
  </header>
  <div class="mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white text-center">
            <h2>Login</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label text-start d-block"
                  >Username</label
                >
                <input
                  type="text"
                  id="username"
                  class="form-control"
                  v-model="username"
                  placeholder="Enter your username"
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
                  v-model="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-50">Login</button>
            </form>
            <p v-if="errorMessage" class="text-danger text-center mt-3">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoginPost } from "@/composables/AuthToken";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      const { success, token } = await LoginPost(this.username, this.password);
      if (success) {
        sessionStorage.setItem("token", JSON.stringify(token));
        sessionStorage.setItem("role", token.type?.toString());
        this.navigateLanding(token);
      } else {
        this.errorMessage = "Invalid username or password.";
      }
    },
    navigateLanding(token) {
      if (token.type === "student") {
        this.$router.push("/view-student-report/" + token.id);
      } else {
        this.$router.push("/view-student");
      }
    },
  },
};
</script>
