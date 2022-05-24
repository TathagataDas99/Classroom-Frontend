<template>
  <main class="flex flex-col items-center justify-evenly bg-bglight-base">
    <div
      class="mt-6 flex w-3/5 flex-col items-center justify-between rounded-2xl border-l-8 border-b-4 border-danger-dark px-10 py-3 font-heading text-2xl shadow-lg md:flex-row"
    >
      <p>Semester - {{ no }}</p>
      <router-link
        class="link-danger slow-effect text-center font-body font-medium underline shadow-md"
        :to="{ name: 'StudentDashboard' }"
        >Go To Semester Page</router-link
      >
    </div>
    <div
      class="mt-5 grid min-h-screen w-screen grid-flow-row grid-cols-1 items-center justify-evenly gap-3 bg-bglight-base md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3"
    >
      <template v-if="loader">
        <template v-for="i in 8" :key="i">
          <LoaderCard class="col-span-1 row-span-1 place-self-center" />
        </template>
      </template>
      <section
        class="SubjectCard group place-self-center"
        v-for="subject in subjects"
        :key="subject.slug"
      >
        <div class="SubjectCard-section">
          <h1
            class="subject-card-title text-primary-light group-hover:text-warning-dark"
          >
            Subject :
          </h1>
          <h2 class="subject-card-title">
            {{ subject.title }}
          </h2>
        </div>
        <div class="SubjectCard-section">
          <h1
            class="subject-card-title text-primary-light group-hover:text-warning-dark"
          >
            Code :
          </h1>
          <h2 class="subject-card-title">
            {{ subject.subject_code }}
          </h2>
        </div>
        <div class="SubjectCard-section">
          <h1
            class="subject-card-title text-primary-light group-hover:text-warning-dark"
          >
            Credit Points :
          </h1>
          <h2 class="subject-card-title">
            {{ subject.credit_points }}
          </h2>
        </div>
        <div class="SubjectCard-section">
          <h1
            class="subject-card-title text-primary-light group-hover:text-warning-dark"
          >
            Teacher :
          </h1>
          <h2 class="subject-card-title">
            {{ subject.created_by.user.first_name }}
            {{ subject.created_by.user.last_name }}
          </h2>
        </div>
        <button
          class="bttn place-self-end group-hover:bg-warning-dark"
          @click="handelOpen(this.no, subject.slug)"
        >
          View
        </button>
      </section>
      <!-- {{ subjects }} -->
    </div>
  </main>
</template>

<script>
import axios from "axios";
// import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import LoaderCard from "../../components/LoaderCard.vue";
// import { mapActions } from "vuex";
export default {
  data() {
    return {
      loader: false,
      subjects: [],
      id: "",
    };
  },
  props: ["no"],
  components: {
    LoaderCard,
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  async created() {
    this.loader = true;
    for (let semCard of this.semCards) {
      if (`${semCard.sem_no}` === this.no) {
        this.id = semCard.id;
      }
    }
    try {
      const subjectResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject`
      );
      this.subjects = subjectResponse.data;
      // console.log(this.semCards);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    handelOpen(no, slug) {
      // this.$router.push(`/student-dashboard/semester-${no}/subjects/${slug}`)
      this.$router.push({
        name: "ParticularSubject",
        params: {
          no: no,
          subject_slug: slug,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
