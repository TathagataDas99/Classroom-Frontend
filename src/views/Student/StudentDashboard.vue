<template>
  <div class="h-screen text-lg">
    <h1>{{ $store.state.user }}</h1>
  </div>
</template>

<script>
// import axios from "axios";
// import LoaderView from "../";
export default {
  name: "StudentDashboard",
  data() {
    return {
      msg: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
//   async created() {
//     try {
//         // const response1 = await axios.get("/auth/users/me/", {
//         //   headers: {
//         //     Authorization: "JWT " + localStorage.getItem("token"),
//         //   },
//         // });
//         // console.log(response1.data.id);
//         // const tokenId = response1.data.id;
//         // const response2 = await axios.get(`/classroom-app/user-type/${tokenId}`);
//         // console.log(response2);
//         // this.user = {
//         //     userType : response2.data.user_type,
//         //     userId : Object.values(response2.data)[1],
//         // };
//         // console.log(this.user)
//         const response1 = await axios.get("/auth/users/me/", {
//           headers: {
//             Authorization: "JWT " + localStorage.getItem("token"),
//           },
//         });
//         // console.log(response1.data.id);
//         const userId = response1.data.id;
//         const userTypeResponse = await axios.get(
//           `/classroom-app/user-type/${userId}`
//         );
//         // console.log(userTypeResponse);
//         const user = {
//           userType: userTypeResponse.data.user_type,
//           userTypeId: Object.values(userTypeResponse.data)[1],
//         };
//         // console.log(user);
//         // console.log(this.$store.state.user);
//       const profileResponse = await axios.get(
//         `/classroom-app/student/${this.user.userTypeId}/`
//     );
//       console.log(profileResponse);
//       console.log(this.user);
//     } catch (e) {
//       this.$router.push({ name: "Home" });
//     }
//   },
};
</script>
