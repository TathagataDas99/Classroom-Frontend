<template>
  <!-- <div>
    {{ subjects }}
  </div> -->
  <div>
    <button
      class="btn rounded-full"
      @click="this.isFormOpen = !this.isFormOpen"
    >
      Add subject+
    </button>
    <form v-if="isFormOpen" class="form" @submit="addSubject">
      <div class="form-section">
        <label class="label">subject_code</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.subject_code"
          required
        />
      </div>
      <div class="form-section">
        <label class="label">title</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.title"
          required
        />
      </div>
      <div class="form-section">
        <label class="label" for="subject_type">subject_type</label>
        <select
          name="subject_type"
          id="subject_type"
          v-model="formValues.subject_type"
        >
          <option value="TH">Theory</option>
          <option value="PRC">Practical</option>
          <option value="PRJ">Project</option>
          <option value="ELC">Elective</option>
        </select>
      </div>
      <div class="form-section">
        <label class="label">credit_points</label>
        <input
          class="input-box"
          form="credit_points"
          type="integer"
          v-model="formValues.credit_points"
          placeholder="between 1-15"
          required
        />
      </div>
      <button class="bttn">Add</button>
    </form>
  </div>
  <div
    class="mt-5 grid grid-flow-row grid-cols-1 items-center justify-evenly gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3"
  >
    <template v-if="loader">
      <template v-for="i in 8" :key="i">
        <LoaderCard class="col-span-1 row-span-1 place-self-center" />
      </template>
    </template>
    <section
      class="card col-span-1 row-span-1 place-self-center"
      v-for="subject in subjects"
      :key="subject.slug"
    >
      <h1 class="card-title text-2xl text-zinc-700">
        {{ subject.title }}
      </h1>
      <h1 class="card-title text-sm text-zinc-700">
        {{ subject.subject_code }}
      </h1>
      <button class="btn" @click="handelOpen(this.no, subject.slug)">
        Open
      </button>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import LoaderCard from "../../../components/LoaderCard.vue";
export default {
  data() {
    return {
      subjects: null,
      loader: "",
      isFormOpen: false,
      formValues: {
        subject_code: "",
        title: "",
        subject_type: "TH",
        credit_points: null,
      },
    };
  },
  components: {
    LoaderCard,
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
  props: ["semester_no"],
  async created() {
    this.loader = true;
    try {
      const subjectResponse = await axios.get(
        `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.semester_no}/subject/`
      );
      this.subjects = subjectResponse.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    async addSubject() {
      try {
        await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.semester_no}/subject/`,
          this.formValues
        );
      } catch (e) {
        console.log(e);
      }
      this.$router.push({
        name: "TeacherSubjectCards",
        params: {
          semester_no: this.semester_no,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
