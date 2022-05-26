<template>
  <!-- <div> -->
  <!-- {{ semCards }} -->
  <!-- {{ subjects }} -->
  <!-- {{ classroom_slug }} -->
  <!-- </div> -->
  <main class="relative flex flex-col items-center">
    <!-- MODAL -->
    <div class="modal z-50" id="delete-warning" v-show="delSubId !== null">
      <div class="modal-box">
        <h3 class="text-center text-lg font-bold">
          Do you want to delete the Subject ?
        </h3>
        <div class="modal-action">
          <section class="button-section">
            <a class="bttn text-center" @click="deleteSubject(delSubId)">
              Yes
            </a>
            <a href="" class="bttn-danger text-center">No</a>
          </section>
        </div>
      </div>
    </div>
    <!-- MODAL -->
    <div class="page-header-1">
      <p class="place-self-center">Sem No - {{ semester_no }}</p>
      <router-link
        class="link-danger slow-effect text-center font-body font-medium underline shadow-md"
        :to="{ name: 'ClassroomView' }"
      >
        <ReplyIcon class="mr-2 inline-block w-7 font-body text-danger-dark" />
        Semesters
      </router-link>
    </div>
    <section
      class="mt-5 grid min-h-screen w-screen grid-flow-row grid-cols-1 items-center justify-evenly gap-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
    >
      <template v-if="loader">
        <template v-for="i in 3" :key="i">
          <LoaderView
            class="SubjectCard col-span-1 row-span-1 place-self-center"
          />
        </template>
      </template>
      <!-- Priyesh make own card -->
      <section
        class="SubjectCard group col-span-1 row-span-1 place-self-center"
        v-for="(subject, index) in subjects"
        :key="subject.slug"
        :class="{
          'h-5/6 w-4/6 overflow-auto scrollbar-hide': !subjectEditArr[index],
        }"
      >
        <!-- #FIXME: Edit card opening all at same time -->
        <div
          class="absolute top-5 right-5 z-30 flex flex-col items-center justify-evenly"
          :class="{ 'rounded-xl bg-bgdark-base p-3': !subjectEditArr[index] }"
        >
          <PencilIcon
            v-if="subjectEditArr[index]"
            @click="subjectEditArr[index] = !subjectEditArr[index]"
            class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
          />
          <CheckIcon
            v-else
            @click="editPatch(subject, index)"
            class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
          />
          <div class="tooltip" data-tip="Delete Subject">
            <a href="#delete-warning">
              <!-- @click="deleteSubject(subject.slug)" -->
              <TrashIcon
                @click="delSubId = subject.slug"
                class="slow-effect h-7 w-5 text-pink-500 hover:text-pink-300"
              />
            </a>
          </div>
        </div>
        <!-- TODO:Dynamic v-model : LINK: https://stackoverflow.com/questions/60703994/how-do-you-conditional-bind-v-model-in-vue -->
        <div class="table-auto">
          <tr>
            <td
              class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
              v-show="subjectEditArr[index]"
            >
              Title:
            </td>
            <td>
              <input
                type="text"
                v-model="subject.title"
                class="bg-bglight-shade font-body text-lg"
                :class="{
                  'subject-edit-input': !subjectEditArr[index],
                }"
                :disabled="subjectEditArr[index]"
                placeholder="subject title"
              />
            </td>
          </tr>
          <tr>
            <td
              class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
              v-show="subjectEditArr[index]"
            >
              Code:
            </td>
            <td>
              <input
                type="text"
                v-model="subject.subject_code"
                class="bg-bglight-shade font-body text-lg"
                :class="{ 'subject-edit-input': !subjectEditArr[index] }"
                :disabled="subjectEditArr[index]"
                placeholder="subject code"
              />
            </td>
          </tr>
          <tr>
            <td
              class="px-1 font-heading font-bold text-primary-dark group-hover:text-warning-light"
              v-show="subjectEditArr[index]"
            >
              Type:
            </td>
            <td
              class="bg-bglight-shade font-body text-lg"
              v-if="subjectEditArr[index]"
            >
              {{ subjTypeMap[subject.subject_type] }}
            </td>
            <td v-else>
              <select
                name="subject_type"
                id="subject_type"
                class="w-full bg-bglight-shade font-body text-lg"
                :class="{ 'subject-edit-input': !subjectEditArr[index] }"
                :disabled="subjectEditArr[index]"
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
              v-show="subjectEditArr[index]"
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
                :class="{ 'subject-edit-input': !subjectEditArr[index] }"
                :disabled="subjectEditArr[index]"
              />
            </td>
          </tr>
          <!-- #TODO: @priyesh :- make proper design -->
        </div>
        <div class="button-section">
          <button
            v-show="subjectEditArr[index]"
            class="bttn group-hover:bg-warning-light"
            @click="handelOpen(classroom_slug, semester_no, subject.slug)"
          >
            Open
          </button>
        </div>
      </section>
    </section>
    <aside class="absolute top-7 right-2 md:right-10">
      <button
        class="add-subject"
        v-show="!this.isFormOpen"
        @click="this.isFormOpen = !this.isFormOpen"
      >
        <PlusCircleIcon class="inline-block w-8" />
        Subject
      </button>
      <form
        v-if="isFormOpen"
        class="form border-2 border-primary-dark accent-primary-dark"
        @submit.prevent="addSubject"
      >
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
          <label class="label">subject code</label>
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.subject_code"
            required
          />
        </div>
        <div class="form-section">
          <label class="label" for="subject_type">subject type</label>
          <select
            class="input-box"
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
          <label class="label">
            credit points
            <!-- [{{ formValues.credit_points }}] -->
          </label>
          <input
            class="input-box"
            form="credit_points"
            type="number"
            min="1"
            max="15"
            v-model="formValues.credit_points"
            placeholder="between 1-15"
            required
          />
        </div>
        <section class="flex flex-col justify-evenly md:flex-row">
          <button class="bttn">Add</button>
          <button class="bttn-danger" @click="isFormOpen = !isFormOpen">
            Cancel
          </button>
        </section>
      </form>
    </aside>
  </main>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import {
  PencilIcon,
  CheckIcon,
  TrashIcon,
  PlusCircleIcon,
  ReplyIcon,
} from "@heroicons/vue/solid";
import LoaderView from "../../components/LoaderView.vue";
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
      delSubId: null,
      id: "",
      // subjectEdit: true,
      subjectEditArr: [],
      formValues: {
        subject_code: "",
        title: "",
        subject_type: "TH",
        credit_points: 1,
      },
    };
  },
  components: {
    LoaderView,
    PlusCircleIcon,
    PencilIcon,
    CheckIcon,
    TrashIcon,
    ReplyIcon,
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
      for (let i = 0; i < this.subjects.length; i++) {
        this.subjectEditArr.push(true);
      }
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
        this.delSubId = null;
      } catch (e) {
        console.log(e);
      }
    },
    async editPatch(subject, index) {
      try {
        // this.loader = true;
        this.subjectEditArr[index] = !this.subjectEditArr[index];
        const slug = subject.slug;
        delete subject.slug;
        delete subject.created_at;
        console.log(subject);
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/${slug}/`,
          subject
        );
        const subjectResponse = await axios.get(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/sem/${this.id}/subject/`
        );
        this.subjects = subjectResponse.data;
        // this.$router.go();
        // this.loader = false;
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
        this.subjectEditArr.push(true);
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
