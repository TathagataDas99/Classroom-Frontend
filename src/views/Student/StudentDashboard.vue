<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <div class="h-screen text-lg">
    <h1>{{ $store.state.user }}</h1>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
export default {
  name: "StudentDashboard",
  data() {
    return {
      msg: "",
      loader: "",
    };
  },
  components: {
    LoaderView,
  },
  async created() {
    this.loader = true;
    try {
      const response1 = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + localStorage.getItem("token"),
        },
      });
      const userId = response1.data.id;
      const userTypeResponse = await axios.get(
        `/classroom-app/user-type/${userId}`
      );
      const user = {
        userType: userTypeResponse.data.user_type,
        userTypeId: Object.values(userTypeResponse.data)[1],
      };
      this.$store.state.user = user;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
};
</script>
