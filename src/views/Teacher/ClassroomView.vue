<template>
  <div v-if="loader">
    <LoaderCard />
  </div>
  <section v-else>
    {{ subjects }}
    <div
      class="card"
      v-for="semCard in subjects.semesters_list"
      :key="semCard.id"
    >
      <button title="This is the on going semester">
        <BadgeCheckIcon class="sem-badge" v-show="semCard.is_current_sem" />
      </button>
      <h1 class="card-title text-2xl text-zinc-700">
        Semester-{{ semCard.sem_no }}
      </h1>
      <button class="btn" @click="handelOpen(semCard.sem_no)">Open</button>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import LoaderCard from "../../components/LoaderCard.vue";
import { BadgeCheckIcon } from "@heroicons/vue/solid";
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
