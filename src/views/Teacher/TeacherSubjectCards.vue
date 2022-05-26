<template>
  <div>
    <!-- {{ semCards }} -->
    {{ subjects }}
    <!-- {{ classroom_slug }} -->
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
      @submit.prevent="addSubject"
    >
      <div class="form-section">
        <label class="label">subject_code</label>
        <input
          class="subject-edit-input"
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
    class="mt-5 grid min-h-screen grid-flow-row grid-cols-1 items-center justify-evenly gap-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
  >
    <template v-if="loader">
      <template v-for="i in 4" :key="i">
        <LoaderCard class="col-span-1 row-span-1 place-self-center" />
      </template>
    </template>
    <!-- Priyesh make own card -->
    <section
      class="SubjectCard group col-span-1 row-span-1 place-self-center"
      v-for="subject in subjects"
      :key="subject.slug"
      :class="{ 'h-5/6 w-4/6 overflow-auto scrollbar-hide': !subjectEdit }"
    >
      <!-- #FIXME: Edit card opening all at same time -->
      <div
        class="absolute top-5 right-5 z-30 flex flex-col items-center justify-evenly"
        :class="{ 'rounded-xl bg-bgdark-base p-3': !subjectEdit }"
      >
        <PencilIcon
          v-if="subjectEdit"
          @click="subjectEdit = !subjectEdit"
          class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
        />
        <CheckIcon
          v-else
          @click="editPatch(subject)"
          class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
        />
        <div class="tooltip" data-tip="Delete Subject">
          <TrashIcon
            @click="deleteSubject(subject.slug)"
            class="slow-effect h-7 w-5 text-pink-500 hover:text-pink-300"
          />
        </div>
      </div>
      <!-- TODO:Dynamic v-model : LINK: https://stackoverflow.com/questions/60703994/how-do-you-conditional-bind-v-model-in-vue -->
      <div class="table-auto">
        <tr>
          <td
            class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
            v-show="subjectEdit"
          >
            Title:
          </td>
          <td>
            <input
              type="text"
              v-model="subject.title"
              class="bg-bglight-shade font-body text-lg"
              :class="{
                'subject-edit-input': !subjectEdit,
              }"
              :disabled="subjectEdit"
              placeholder="subject title"
            />
          </td>
        </tr>
        <tr>
          <td
            class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
            v-show="subjectEdit"
          >
            Code:
          </td>
          <td>
            <input
              type="text"
              v-model="subject.subject_code"
              class="bg-bglight-shade font-body text-lg"
              :class="{ 'subject-edit-input': !subjectEdit }"
              :disabled="subjectEdit"
              placeholder="subject code"
            />
          </td>
        </tr>
        <tr>
          <td
            class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
            v-show="subjectEdit"
          >
            Type:
          </td>
          <td class="bg-bglight-shade font-body text-lg" v-if="subjectEdit">
            {{ subjTypeMap[subject.subject_type] }}
          </td>
          <td v-else>
            <select
              name="subject_type"
              id="subject_type"
              class="w-full bg-bglight-shade font-body text-lg"
              :class="{ 'subject-edit-input': !subjectEdit }"
              :disabled="subjectEdit"
              v-model="subject.subject_type"
            >
              <option class="font-body" value="TH">Theory</option>
              <option class="font-body" value="PRC">Practical</option>
              <option class="font-body" value="PRJ">Project</option>
              <option class="font-body" value="ELC">Elective</option>
            </select>
          </td>
        </tr>

        <tr>
          <td
            class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
            v-show="subjectEdit"
          >
            Credit Point:
          </td>
          <td>
            <input
              type="number"
              min="1"
              max="15"
              placeholder="between 1 to 15"
              v-model="subject.credit_points"
              class="w-full bg-bglight-shade text-lg text-zinc-700 decoration-transparent"
              :class="{ 'subject-edit-input': !subjectEdit }"
              :disabled="subjectEdit"
            />
          </td>
        </tr>
        <!-- #TODO: @priyesh :- make proper design -->
      </div>

      <button
        v-show="subjectEdit"
        class="bttn group-hover:bg-warning-light"
        @click="handelOpen(classroom_slug, semester_no, subject.slug)"
      >
        Open
      </button>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/vue/solid";
import LoaderCard from "../../components/LoaderCard.vue";
export default {
  data() {
    return {
      subjTypeMap: {
        PRJ: "Project",
        TH: "Theory",
        ELC: "Elective",
        PRC: "Practical",
      },
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
    TrashIcon,
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  props: ["semester_no", "classroom_slug"],
  // beforeUpdate() {
  //   this.$router.replace({
  //     name: "TeacherSubjectCards",
  //     params: {
  //       semester_no: this.semester_no,
  //     },
  //   });
  // },
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
    async deleteSubject(slug) {
      try {
        // this.subjectEdit = !this.subjectEdit;
        console.log(slug);
        this.subjects = this.subjects.filter(function (obj) {
          return obj.slug !== slug;
        });
        await axios.delete(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/${slug}/`
        );
      } catch (e) {
        console.log(e);
      }
    },
    async editPatch(subject) {
      try {
        this.subjectEdit = !this.subjectEdit;
        const slug = subject.slug;
        delete subject.slug;
        delete subject.created_at;
        console.log(subject);
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/${slug}/`,
          subject
        );
        this.$router.go();
      } catch (e) {
        console.log(e);
      }
    },
    async addSubject() {
      this.isFormOpen = !this.isFormOpen;
      try {
        const res = await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/`,
          this.formValues
        );
        this.subjects.push(res.data);
      } catch (e) {
        console.log(e);
      }
    },
    handelOpen(classroom_slug, semester_no, subject_slug) {
      this.$router.push({
        name: "particularSubjectView",
        params: {
          classroom_slug,
          semester_no,
          subject_slug,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
