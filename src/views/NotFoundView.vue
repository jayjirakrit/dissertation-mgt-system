<template>
  <Navbar />
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/" class="btn btn-primary">Go Back Home</router-link>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  components: { Navbar },
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}

.not-found h1 {
  font-size: 3rem;
  color: #ff6347; /* Tomato color for the error */
}

.not-found p {
  font-size: 1.25rem;
}

.btn {
  margin-top: 20px;
}
</style>