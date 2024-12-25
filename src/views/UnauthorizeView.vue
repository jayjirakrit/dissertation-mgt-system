<template>
  <Navbar />
  <div class="unauthorized">
    <h1>401 - Unauthorized</h1>
    <p>You do not have permission to view this page.</p>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "Unauthorized",
  components: { Navbar },
};
</script>

<style scoped>
.unauthorized {
  text-align: center;
  margin-top: 50px;
}

.unauthorized h1 {
  font-size: 3rem;
  color: #ff6347; /* Tomato color for the error */
}

.unauthorized p {
  font-size: 1.25rem;
}

.btn {
  margin-top: 20px;
}
</style>
