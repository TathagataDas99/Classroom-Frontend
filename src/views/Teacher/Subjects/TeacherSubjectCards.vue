<template>
  <div>
    {{ subjects }}
  </div>
  <div>
    <button
      class="btn rounded-full"
      @click="this.isFormOpen = !this.isFormOpen"
    >
      Add subject
    </button>
    <form
      v-if="isFormOpen"
      class="form accent-primary-dark"
      @submit="addSubject"
    >
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
        <label class="label"
          >credit_points [{{ formValues.credit_points }}]</label
        >
        <input
          class="range"
          form="credit_points"
          type="range"
          min="1"
          max="15"
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
      <template v-for="i in 4" :key="i">
        <LoaderCard class="col-span-1 row-span-1 place-self-center" />
      </template>
    </template>
    <!-- Priyesh make own card -->
    <section
      class="card col-span-1 row-span-1 place-self-center"
      v-for="subject in subjects"
      :key="subject.slug"
      :class="{ 'h-5/6 w-4/5': !subjectEdit }"
    >
      <div class="absolute top-5 right-5">
        <PencilIcon
          v-if="subjectEdit"
          @click="subjectEdit = !subjectEdit"
          class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
        />
        <CheckIcon
          v-else
          @click="editPatch(subject.slug)"
          class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
        />
      </div>
      <!-- TODO:Dynamic v-model : LINK: https://stackoverflow.com/questions/60703994/how-do-you-conditional-bind-v-model-in-vue -->
      <input
        type="text"
        v-model="formValues.title"
        class="w-full bg-slate-50 text-lg text-zinc-700"
        :class="{ 'input-box': !subjectEdit }"
        :disabled="subjectEdit"
      />
      <!-- TODO: @priyesh :- make proper design -->
      <input
        type="text"
        v-model="formValues.subject_code"
        class="w-full bg-slate-50 text-lg text-zinc-700"
        :class="{ 'input-box': !subjectEdit }"
        :disabled="subjectEdit"
      />
      <select
        name="subject_type"
        id="subject_type"
        class="w-full bg-slate-50 text-lg text-zinc-700"
        :class="{ 'input-box': !subjectEdit }"
        :disabled="subjectEdit"
        v-model="formValues.subject_type"
      >
        <option class="text-zinc-700" value="TH">Theory</option>
        <option class="text-zinc-700" value="PRC">Practical</option>
        <option class="text-zinc-700" value="PRJ">Project</option>
        <option class="text-zinc-700" value="ELC">Elective</option>
      </select>

      <input
        type="number"
        min="1"
        max="15"
        placeholder="between 1 to 15"
        v-model="formValues.credit_points"
        class="w-full bg-slate-50 text-lg text-zinc-700"
        :class="{ 'input-box': !subjectEdit }"
        :disabled="subjectEdit"
      />
      <!-- #TODO: @priyesh :- make proper design -->

      <button class="btn" @click="handelOpen(this.no, subject.slug)">
        Open
      </button>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { PencilIcon, CheckIcon } from "@heroicons/vue/solid";
import LoaderCard from "../../../components/LoaderCard.vue";
export default {
  data() {
    return {
      subjects: null,
      loader: "",
      isFormOpen: false,
      id: "",
      subjectEdit: true,
      formValues: {
        subject_code: "",
        title: "",
        subject_type: "TH",
        credit_points: 1,
      },
    };
  },
  components: {
    LoaderCard,
    PencilIcon,
    CheckIcon,
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  props: ["semester_no"],
  async created() {
    this.loader = true;
    for (let semCard of this.semCards) {
      if (`${semCard.sem_no}` === this.semester_no) {
        this.id = semCard.id;
      }
    }
    try {
      const subjectResponse = await axios.get(
        `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/`
      );
      this.subjects = subjectResponse.data;
      // this.formValues = this.subjects[0]; //TODO:
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    async editPatch(subject_slug) {
      try {
        this.subjectEdit = !this.subjectEdit;
        console.log(this.formValues);
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/${subject_slug}/`,
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
    async addSubject() {
      try {
        await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/`,
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
