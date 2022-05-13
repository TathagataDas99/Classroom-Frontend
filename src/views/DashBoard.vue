<template>
  <div class="h-screen text-lg">
    <h1>{{ $store.state.user }}</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DashBoard",
  data() {
    return {
      msg: "",
    };
  },
  async created() {
    try {
      const response = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + sessionStorage.getItem("token"),
        },
      });
      console.log(response);
      this.$store.state.user =
        response.data.first_name + " " + response.data.last_name;
      console.log(this.$store.state.user);
      console.log(this.$store.state.isAuth);
    } catch (e) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>
