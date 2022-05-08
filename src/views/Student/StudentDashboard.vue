<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <div class="h-screen text-lg">
    <h1>{{ userProfile }}</h1>
    <br />
    <section
      class="flex flex-col flex-wrap items-center justify-evenly space-y-2 md:flex-row md:space-y-4 md:space-x-2 lg:space-y-0"
    >
      <div class="card" v-for="semCard in semCards" :key="semCard.id">
        <button title="This is the on going semester">
          <BadgeCheckIcon class="sem-badge" v-show="semCard.is_current_sem" />
        </button>
        <h1 class="card-title text-2xl text-primary-light">
          Semester-{{ semCard.sem_no }}
        </h1>
        <button
          class="btn"
          @click="$router.push(`/student-dashboard/semester-${semCard.sem_no}`)"
        >
          Open
        </button>
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
