<template>
  <div class="h-screen text-lg">
    <h1 v-if="!$store.state.user">Unauthorize</h1>
    <h1 v-else>{{ $store.state.user }}</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DashBoard",
  async created() {
    try {
      const response = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      this.$store.state.user =
        response.data.first_name + " " + response.data.last_name;
    } catch (e) {
      console.log(e.message);
    }
  },
};
</script>
