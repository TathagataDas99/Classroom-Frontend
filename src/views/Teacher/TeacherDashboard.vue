<template>
  <div>
    <div v-if="loader">
      <LoaderCard />
    </div>
    <section v-else>
      <!-- {{ userProfile.classroom_list }} -->
      <div
        class="card"
        v-for="classroom in userProfile.classroom_list"
        :key="classroom.slug"
      >
        <div class="card-title text-2xl text-zinc-700">
          {{ classroom.stream }}
        </div>
        <div class="card-title text-2xl text-zinc-700">
          {{ classroom.title }}
        </div>
        <div class="card-title text-2xl text-zinc-700">
          {{ classroom.start_year }}
        </div>
        <div class="card-title text-2xl text-zinc-700">
          {{ classroom.end_year }}
        </div>
        <div class="card-title text-2xl text-zinc-700">
          {{ classroom.section }}
        </div>
        <div class="card-title text-2xl text-zinc-700">
          {{ classroom.level }}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
// import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import LoaderCard from "../../components/LoaderCard.vue";
export default {
  name: "StudentDashboard",
  data() {
    return {
      msg: "",
      loader: "",
    };
  },
  components: {
    LoaderCard,
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
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
        `/classroom-app/teacher/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);
      console.log(this.userProfile);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    handelOpen(no) {
      this.$router.push({
        name: "SubjectCards",
        params: {
          no: no,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
