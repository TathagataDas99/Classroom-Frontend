<template>
  <div>
    <h1>{{ userProfile }}</h1>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  async created() {
    this.loader = true;
    try {
      const response1 = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + sessionStorage.getItem("token"),
        },
      });
      const userId = response1.data.id;
      const userTypeResponse = await axios.get(
        `/classroom-app/user-type/${userId}`
      );
      const userTypeObj = {
        userType: userTypeResponse.data.user_type,
        userTypeId: Object.values(userTypeResponse.data)[1],
      };
      this.$store.dispatch("userType", userTypeObj);

      const userProfileResponse = await axios.get(
        `/classroom-app/dba/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
};
</script>

<style lang="scss" scoped></style>
