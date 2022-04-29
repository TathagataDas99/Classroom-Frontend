<template>
  <div class="h-3/4 text-lg">
    <h1>Hello Home.</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomeView",
  async beforeMount() {
    const response = await axios.get("/auth/users/me/");
    console.log(response);
  },
};
</script>
