<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <div class="h-screen text-lg">
    <h1>{{ userProfile }}</h1>
    <br />
    <section
      class="flex flex-col flex-wrap items-center justify-evenly md:flex-row"
    >
      <div
        class="card relative flex h-44 w-44 flex-col items-center justify-evenly bg-base-100 shadow-xl"
        v-for="semCard in semCards"
        :key="semCard.id"
      >
        <BadgeCheckIcon
          class="absolute top-3 right-3 z-20 h-7 w-7 text-primary-light"
          v-show="semCard.is_current_sem"
        />
        <h1 class="card-title">Semester-{{ semCard.sem_no }}</h1>
        <div class="card-actions justify-end">
          <button class="btn w-full bg-primary-dark">Open</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import { BadgeCheckIcon } from "@heroicons/vue/solid";
// import { mapActions } from "vuex";
export default {
  name: "StudentDashboard",
  data() {
    return {
      msg: "",
      loader: "",
      semCards: [],
    };
  },
  components: {
    LoaderView,
    BadgeCheckIcon,
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
  // methods: {
  //   ...mapActions(["userType", "userProfile"]),
  // },
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
      const userTypeObj = {
        userType: userTypeResponse.data.user_type,
        userTypeId: Object.values(userTypeResponse.data)[1],
      };
      this.$store.dispatch("userType", userTypeObj);

      const userProfileResponse = await axios.get(
        `/classroom-app/student/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);

      const semCardsResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/`
      );
      this.semCards = semCardsResponse.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
};
</script>
