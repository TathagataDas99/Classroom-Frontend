<template>
  <div
    class="grid min-h-screen w-screen grid-rows-1 gap-2 pb-10 text-lg lg:grid-cols-3"
  >
    <main
      v-if="loader"
      class="col-span-2 mt-4 grid justify-items-center gap-y-4 lg:grid-cols-2"
    >
      <LoaderCard></LoaderCard>
      <LoaderCard></LoaderCard>
      <LoaderCard></LoaderCard>
      <LoaderCard></LoaderCard>
    </main>
    <!-- <LoaderView /> -->
    <main
      v-else
      class="col-span-2 mt-4 grid justify-items-center gap-y-4 lg:grid-cols-2"
    >
      <div class="card" v-for="semCard in semCards" :key="semCard.id">
        <button title="This is the on going semester">
          <BadgeCheckIcon class="sem-badge" v-show="semCard.is_current_sem" />
        </button>
        <h1 class="card-title text-2xl text-primary-light">
          Semester-{{ semCard.sem_no }}
        </h1>
        <button class="btn" @click="handelOpen(semCard.sem_no, semCard.id)">
          Open
        </button>
      </div>
    </main>
    <aside class="mt-4 mr-4 grid h-screen grid-cols-1 gap-2">
      <section
        tabindex="0"
        class="collapse-plus collapse rounded-box border border-base-300 bg-base-100"
      >
        <div
          class="slow-effect collapse-title text-xl font-medium hover:text-danger-dark"
        >
          <span class="font-semibold text-danger-dark">Welcome</span>
          {{ userProfile.user.first_name }} {{ userProfile.user.last_name }}
        </div>
        <div class="collapse-content text-lg">
          <p>
            <span class="text-primary-dark">Universit Roll: </span>
            {{ userProfile.university_roll }}
          </p>
          <p>
            <span class="text-primary-dark">Email : </span>
            {{ userProfile.user.email }}
          </p>
          <p>
            <span class="text-primary-dark">Contact No : </span>
            <template v-if="userProfile.user.contact_no">
              {{ userProfile.user.contact_no }}
            </template>
            <template v-else>
              <span>Not Availabel</span>
            </template>
          </p>
        </div>
      </section>
      <section
        tabindex="1"
        class="collapse-plus collapse rounded-box border border-base-300 bg-base-100"
      >
        <div
          class="slow-effect collapse-title text-xl font-medium hover:text-danger-dark"
        >
          <span class="font-semibold text-danger-dark">College : </span>
          {{ userProfile.classroom.college.name }}
        </div>
        <div class="collapse-content text-lg">
          <p>
            <span class="text-primary-dark">City : </span>
            {{ userProfile.classroom.college.city }}
          </p>
          <p>
            <span class="text-primary-dark">State : </span>
            {{ userProfile.classroom.college.state }}
          </p>
          <p>
            <span class="text-primary-dark">Address: </span>
            {{ userProfile.classroom.college.address }}
          </p>
        </div>
      </section>
      <section
        tabindex="3"
        class="collapse-plus collapse rounded-box border border-base-300 bg-base-100"
      >
        <div
          class="slow-effect collapse-title text-xl font-medium hover:text-danger-dark"
        >
          <span class="font-semibold text-danger-dark">Classroom : </span>
          {{ userProfile.classroom.title }}
        </div>
        <div class="collapse-content text-lg">
          <p>
            <span class="text-primary-dark">Level : </span>
            {{ userProfile.classroom.level }}
          </p>
          <p>
            <span class="text-primary-dark">Stream : </span>
            {{ userProfile.classroom.stream }}
          </p>
          <p>
            <span class="text-primary-dark">Section : </span>
            {{ userProfile.classroom.section }}
          </p>
          <p>
            <span class="text-primary-dark">Number of Sems: </span>
            {{ userProfile.classroom.no_of_semesters }}
          </p>
          <p>
            <span class="text-primary-dark">Batch of: </span>
            {{ userProfile.classroom.start_year }} -
            {{ userProfile.classroom.end_year }}
          </p>
        </div>
      </section>
    </aside>
  </div>
</template>

<script>
import axios from "axios";
// import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import { BadgeCheckIcon } from "@heroicons/vue/solid";
import LoaderCard from "../../components/LoaderCard.vue";
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
    // LoaderView,
    BadgeCheckIcon,
    LoaderCard,
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
  methods: {
    handelOpen(no, id) {
      this.$router.push({
        name: "SubjectCards",
        params: {
          no: no,
          id: id,
        },
      });
    },
  },
};
</script>
