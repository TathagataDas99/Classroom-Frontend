<template>
  <main
    class="flex min-h-screen flex-col items-center justify-evenly bg-bglight-base"
  >
    <div class="page-header-1">
      <p class="place-self-center">Classroom title - {{ subjects.title }}</p>
      <router-link
        class="link-danger slow-effect text-center font-body font-medium underline shadow-md"
        :to="{ name: 'TeacherDashboard' }"
      >
        <ReplyIcon class="mr-2 inline-block w-7 font-body text-danger-dark" />
        Dashboard
      </router-link>
    </div>
    <section class="student-dashboard-card-section w-screen" v-if="loader">
      <div class="SemCard">
        <LoaderCard />
      </div>
    </section>
    <section v-else class="student-dashboard-card-section h-screen w-screen">
      <!-- {{ subjects.title }} -->
      <div
        class="SemCard"
        v-for="semCard in subjects.semesters_list"
        :key="semCard.id"
      >
        <button title="This is the on going semester">
          <BadgeCheckIcon class="sem-badge" v-show="semCard.is_current_sem" />
        </button>
        <h1 class="text-center font-heading text-2xl text-zinc-700">
          Semester-{{ semCard.sem_no }}
        </h1>
        <section class="button-section">
          <button class="bttn" @click="handelOpen(semCard.sem_no)">Open</button>
        </section>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import LoaderCard from "../../components/LoaderCard.vue";
import { BadgeCheckIcon, ReplyIcon } from "@heroicons/vue/solid";
export default {
  data() {
    return {
      msg: "",
      loader: "",
      subjects: null,
    };
  },
  props: ["classroom_slug"],
  components: {
    LoaderCard,
    BadgeCheckIcon,
    ReplyIcon,
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
  async created() {
    this.loader = true;
    try {
      const subjectResponse = await axios.get(
        `/classroom-app/teacher/${this.userProfile.teacher_id}/teacher-classrooms/${this.classroom_slug}/`
      );
      this.subjects = subjectResponse.data;
      this.$store.dispatch("semCards", this.subjects.semesters_list);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    handelOpen(semester_no) {
      this.$router.push({
        name: "TeacherSubjectCards",
        params: {
          semester_no,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
