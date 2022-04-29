<template>
  <div class="h-3/4 text-lg">
    <h1 v-if="!user">Unauthorize</h1>
    <h1 v-else>{{ user }}</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DashBoard",
  data() {
    return {
      user: null,
    };
  },
  async created() {
    try {
      const response = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      this.user = response.data.first_name + " " + response.data.last_name;
    } catch (e) {
      console.log(e.message);
    }
  },
};
</script>
