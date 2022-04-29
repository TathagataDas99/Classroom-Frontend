<template>
  <div class="h-3/4 text-lg">
    <h1 v-if="!user">Unauthorize</h1>
    <h1 v-else>{{user}}</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomeView",
  data() {
    return {
      user: null,
    };
  },
  async created() {
    const response = await axios.get("/auth/users/me/");
    console.log(response);
    this.user = response.data.first_name + " " + response.data.last_name;
  },
};
</script>
