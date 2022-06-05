<template>
  <!-- <h1>{{ assignments }}</h1> -->
  <main
    class="mx-2 grid w-screen grid-flow-col grid-cols-12 gap-2"
    @click="openedNotes = -1"
  >
    <!-- <h1>{{attached_files}}</h1> -->
    <!-- notes add form -->
    <aside class="absolute bottom-7 right-2 z-50 md:right-10">
      <button
        class="add-subject"
        @click="this.isFormOpen = !this.isFormOpen"
        v-show="!this.isFormOpen"
      >
        <PlusCircleIcon class="my-auto inline-block w-7" />
        Assignment
      </button>
      <form
        v-if="isFormOpen"
        class="form z-30 border-2 border-primary-dark accent-primary-dark"
        @submit.prevent="addAssignment"
        enctype="multipart/form-data"
      >
        <div class="form-section">
          <label class="label">Title</label>
          <section class="input-section">
            <input
              class="input-box"
              type="text"
              v-model.trim.lazy="formValues.title"
              required
            />
          </section>
        </div>
        <div class="form-section">
          <label class="label">Description</label>
          <section class="input-section">
            <input
              class="input-box"
              type="text"
              v-model.trim.lazy="formValues.description"
            />
          </section>
        </div>
        <div class="form-section">
          <label class="label">Marks</label>
          <section class="input-section">
            <input
              class="input-box"
              type="number"
              min="0"
              max="100"
              v-model.trim.lazy="formValues.alloted_marks"
              required
            />
          </section>
        </div>
        <div class="form-section">
          <label class="label">Due Date & Time</label>
          <section
            class="col-span-2 grid grid-flow-col place-content-stretch gap-3"
          >
            <Datepicker
              date
              :minDate="new Date()"
              showNowButton
              v-model="formValues.due_date"
              :enableTimePicker="false"
              :format="'yyyy-MM-dd'"
              @update:modelValue="changeMinTime"
              required
            />
            <!-- is24="true" -->
            <Datepicker
              :format="'HH:mm'"
              :minTime="min_time"
              timePicker
              showNowButton
              placeholder="Select Time"
              v-model="formValues.due_time"
              required
            />
          </section>
        </div>
        <div class="form-section">
          <label class="label">Attachment (1 PDF only, Max Size: 5 MB)</label>
          <section class="input-section-file">
            <input
              required
              title="1 PDF only, Max Size: 5 MB"
              class="input-file"
              ref="file"
              accept="application/pdf"
              @change="handleFileUpload"
              type="file"
            />
            <!-- accept="application/pdf" -->
          </section>
          <!-- multiple -->
        </div>
        <section class="flex flex-col justify-evenly md:flex-row">
          <button class="bttn">Add</button>
          <button class="bttn-danger" @click="isFormOpen = !isFormOpen">
            Cancel
          </button>
        </section>
      </form>
    </aside>
    <!-- notes add form -->

    <!-- MODAL -->
    <div class="modal z-50" id="delete-warning" v-show="tempVal !== null">
      <div class="modal-box">
        <h3 class="text-center text-lg font-bold">
          Do you want to delete the announcement ?
        </h3>
        <div class="modal-action">
          <section class="button-section">
            <a class="bttn text-center" @click="deleteNote(tempVal)"> Yes </a>
            <a href="#" class="bttn-danger text-center">No</a>
          </section>
        </div>
      </div>
    </div>
    <!-- MODAL -->
    <!-- Assignment Cards -->
    <section class="col-span-7 mt-4">
      <template v-if="loader">
        <template v-for="i in 4" :key="i">
          <LoaderView class="col-span-1 row-span-1 place-self-center" />
        </template>
      </template>

      <section
        v-else
        :tabindex="index"
        class="slow-effect collapse mx-10 my-5 shadow-md md:mx-20"
        v-for="(assignment, index) in assignments"
        :key="assignment.id"
        :class="{ 'collapse-open max-h-96 shadow-xl': openedNotes === index }"
        @focusin="openedNotes = index"
      >
        <!-- #FIXME: Edit card opening all at same time -->
        <!-- #FIXME: Edit Buttons for patch -->
        <div class="absolute top-5 right-5 flex w-20 flex-row justify-evenly">
          <!-- <PencilIcon
            v-if="subjectEdit[index]"
            @click="subjectEdit[index] = !subjectEdit[index]"
            class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
          /> -->
          <!-- <CheckIcon
            v-else
            @click="editPatch(assignment, index)"
            class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
          /> -->
          <div class="tooltip tooltip-left" data-tip="Delete Subject">
            <!-- deleteAnnouncement(assignment.slug) -->
            <a href="#delete-warning">
              <TrashIcon
                @click="tempVal = assignment.id"
                v-show="subjectEdit[index]"
                class="slow-effect z-10 h-7 w-5 text-pink-500 hover:text-pink-300"
              />
            </a>
          </div>
        </div>
        <input
          type="text"
          v-model="assignment.title"
          class="collapse-title font-heading text-base font-medium uppercase md:text-lg lg:text-xl"
          :class="{ 'subject-edit-input': !subjectEdit[index] }"
          :disabled="subjectEdit[index]"
          placeholder="assignment title"
        />
        <section class="collapse-content">
          <table class="collapse-content w-full table-auto text-center">
            <tr class="border-b-2 border-gray-400">
              <!-- <th>-</th> -->
              <th>Description</th>
              <th>Marks</th>
              <th>Due Date</th>
              <th>Due Time</th>
            </tr>
            <tr class="border-b-2 border-gray-400">
              <td class="w-full columns-1 px-4 py-3 text-center">
                <input
                  type="text"
                  v-model="assignment.description"
                  class="w-full columns-2 font-body text-xl"
                  :class="{
                    'subject-edit-input collapse-title': !subjectEdit[index],
                  }"
                  :disabled="subjectEdit[index]"
                  placeholder="assignment description"
                />
              </td>
              <td>
                <input
                  type="number"
                  v-model="assignment.alloted_marks"
                  class="columns-1 px-3 text-center font-body text-xl font-bold text-danger-dark"
                  :class="{
                    'subject-edit-input collapse-title': !subjectEdit[index],
                  }"
                  :disabled="subjectEdit[index]"
                  placeholder="assignment description"
                />
              </td>
              <td>
                <input
                  type="date"
                  v-model="assignment.due_date"
                  class="columns-1 px-3 font-body text-xl font-bold text-danger-dark"
                  :class="{
                    'subject-edit-input collapse-title': !subjectEdit[index],
                  }"
                  :disabled="subjectEdit[index]"
                  pattern="\d{4}-\d{2}-\d{2}"
                  placeholder="assignment description"
                />
              </td>
              <td>
                <input
                  type="time"
                  v-model="assignment.due_time"
                  class="columns-1 px-3 font-body text-xl font-bold text-danger-dark"
                  :class="{
                    'subject-edit-input collapse-title': !subjectEdit[index],
                  }"
                  :disabled="subjectEdit[index]"
                  pattern="\d{2}:\d{2}:\d{2}"
                  placeholder="assignment description"
                />
              </td>
            </tr>
            <tr class="mx-2 py-2 px-4">
              <td class="font-heading text-xl">Assignment PDF :</td>
              <td>
                <a
                  class="slow-effect group bottom-5 flex flex-col items-center justify-evenly hover:scale-105 hover:animate-pulse hover:text-danger-light"
                  :href="'http://localhost:8000' + assignment.attached_files"
                >
                  <DocumentDownloadIcon
                    class="slow-effect slow-effect w-14 text-info-dark hover:scale-110 group-hover:text-danger-light"
                  />
                  <span
                    class="slow-effect text-sm font-bold text-info-dark group-hover:text-danger-light"
                    >attached file</span
                  >
                </a>
              </td>
              <td colspan="2" class="py-2 px-4">
                <button
                  class="slow-effect w-full rounded-xl bg-info-dark px-3 py-3 font-heading text-2xl font-bold text-bglight-base shadow-md hover:bg-info-light hover:shadow-xl"
                  @click="
                    showSubmissions(assignment.id, assignment.alloted_marks)
                  "
                >
                  Evaluate
                </button>
              </td>
            </tr>
          </table>
          <!-- <div class="col-span-1 row-span-1 w-full">
            <p for="px-2 inline-block text-2xl font-heading">Description :</p>
            <input
              type="text"
              v-model="assignment.description"
              class="w-full columns-2 font-body text-xl"
              :class="{
                'subject-edit-input collapse-title': !subjectEdit[index],
              }"
              :disabled="subjectEdit[index]"
              placeholder="assignment description"
            />
          </div> -->
          <!-- <div class="col-span-1 row-span-1 flex flex-col justify-evenly">
            <section
              class="flex flex-row flex-wrap items-center justify-start text-center align-middle"
            >
              <label class="label" for="marks">Marks</label>
              <input
                type="number"
                v-model="assignment.alloted_marks"
                class="columns-1 px-3 font-body text-xl font-bold text-danger-dark"
                :class="{
                  'subject-edit-input collapse-title': !subjectEdit[index],
                }"
                :disabled="subjectEdit[index]"
                placeholder="assignment description"
              />
            </section>
            <section class="flex flex-row flex-wrap items-center justify-start">
              <label class="label" for="marks">Due Date</label>
              <input
                type="date"
                v-model="assignment.due_date"
                class="columns-1 px-3 font-body text-xl font-bold text-danger-dark"
                :class="{
                  'subject-edit-input collapse-title': !subjectEdit[index],
                }"
                :disabled="subjectEdit[index]"
                pattern="\d{4}-\d{2}-\d{2}"
                placeholder="assignment description"
              />
            </section>
            <section class="flex flex-row flex-wrap items-center justify-start">
              <label class="label" for="marks">Due Time</label>
              <input
                type="time"
                v-model="assignment.due_time"
                class="columns-1 px-3 font-body text-xl font-bold text-danger-dark"
                :class="{
                  'subject-edit-input collapse-title': !subjectEdit[index],
                }"
                :disabled="subjectEdit[index]"
                pattern="\d{2}:\d{2}:\d{2}"
                placeholder="assignment description"
              />
            </section>
          </div> -->
          <!-- <div
            class="col-span-1 row-span-1 flex flex-row flex-wrap items-center justify-start space-x-2 rounded-lg bg-sky-100 shadow-md"
          >
            <label for="" class="ml-14 font-heading text-lg font-bold"
              >Assignment</label
            >
            <a
              class="slow-effect group bottom-5 flex flex-col items-center justify-evenly hover:scale-105 hover:animate-pulse hover:text-danger-light"
              :href="'http://localhost:8000' + assignment.attached_files"
            >
              <DocumentDownloadIcon
                class="slow-effect slow-effect w-14 text-info-dark hover:scale-110 group-hover:text-danger-light"
              />
              <span
                class="slow-effect text-sm font-bold text-info-dark group-hover:text-danger-light"
                >attached file</span
              >
            </a>
          </div> -->
          <!-- <div class="w-full">
            <button
              class="bttn w-full"
              @click="showSubmissions(assignment.id, assignment.alloted_marks)"
            >
              Show Submissions
            </button>
          </div> -->
        </section>
      </section>
    </section>
    <!-- Assignment Cards -->

    <!-- Assignment Submissions Cards -->
    <Transition>
      <router-view class="col-span-6 mt-5" />
    </Transition>
    <!--EOF --- Assignment Submissions Cards End-->
  </main>
</template>

<script>
// import Datepicker from "@vuepic/vue-datepicker";
// import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";
import { mapGetters } from "vuex";
import {
  // PencilIcon,
  // CheckIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/vue/solid";
import LoaderView from "../../../components/LoaderView.vue";
import { DocumentDownloadIcon } from "@heroicons/vue/solid";
export default {
  name: "assignmentTeacher",
  props: ["classroom_slug", "semester_no", "subject_slug"],
  components: {
    LoaderView,
    // Datepicker,
    // PencilIcon,
    PlusCircleIcon,
    // CheckIcon,
    TrashIcon,
    DocumentDownloadIcon,
  },
  data() {
    return {
      min_time: null,
      isFormOpen: false,
      min_due_time: new Date(),
      min_due_date:
        new Date().getFullYear() +
        "-" +
        parseInt(new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      formValues: {
        title: "",
        description: "",
        alloted_marks: 100,
        attached_pdf: null,
        due_date: null,
        due_time: null,
      },
      attached_files: [],
      loader: true,
      assignments: [], //#FIXME: this might be an array
      id: "",
      isActive: 1,
      openedNotes: -1,
      tempVal: null,
      subjectEdit: [],
    };
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  mounted() {
    this.formValues.due_date = new Date();
  },
  async created() {
    this.loader = true;
    console.log(this.min_due_date);
    for (let semCard of this.semCards) {
      if (`${semCard.sem_no}` === this.no) {
        this.id = semCard.id;
      }
    }
    try {
      const assignmentResponse = await axios.get(
        `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/`
      );
      this.assignments = assignmentResponse.data;
      for (let i = 0; i < this.assignments.length; i++) {
        this.subjectEdit.push(true);
      }
      // var dateControl = document.querySelector('input[type="date"]');
      // dateControl.value = this.min_due_date;
      // this.formValues.due_date = this.min_due_date;
    } catch (e) {
      console.log(e);
    }
    // this.formValues.due_date = new Date().getUTCDate();
    this.loader = false;
  },
  methods: {
    // selectDate() {
    //   console.log(this.formValues.due_date);
    //   console.log(this.formValues.due_time);
    // },
    changeMinTime(modelData) {
      // console.log(modelData);
      this.min_time =
        modelData.getDay() === new Date().getDay()
          ? {
              hours: this.min_due_time.getHours(),
              minutes: this.min_due_time.getMinutes(),
              seconds: this.min_due_time.getSeconds(),
            }
          : null;
      // console.log(this.min_time);
    },
    async editPatch(assignment, index) {
      try {
        this.subjectEdit[index] = !this.subjectEdit[index];
        const id = assignment.id;
        // const assignmentPatch = {
        //   title: assignment.title,
        //   description: assignment.description,
        //   alloted_marks: assignment.alloted_marks,
        //   due_date: assignment.due_date,
        //   due_time: assignment.due_time,
        // };
        const FormValues = new FormData();
        FormValues.append("title", this.formValues.title);
        FormValues.append("description", this.formValues.description);
        FormValues.append("alloted_marks", this.formValues.alloted_marks);
        FormValues.append("due_date", this.formValues.due_date);
        FormValues.append("due_time", this.formValues.due_time);
        // TODO:FormDAta
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${id}/`,
          FormValues
        );

        // console.log(res);
        // this.$router.go();
      } catch (e) {
        console.log(e);
      }
    },
    async deleteNote(id) {
      // console.log("inside delete");
      try {
        // this.subjectEdit.pop(); //FIXME:This may cause error
        // console.log(id);
        this.assignment = this.assignments.filter(function (obj) {
          return obj.id !== id;
        });
        await axios.delete(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${id}/`
        );
        this.tempVal = null;
        // delete below code later
        const assignmentResponse = await axios.get(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/`
        );
        this.assignments = assignmentResponse.data;
        for (let i = 0; i < this.assignments.length; i++) {
          this.subjectEdit.push(true);
        }
        // this.$router.replace({ name: "assignmentTeacher" });
      } catch (e) {
        console.log(e);
      }
    },
    async addAssignment() {
      this.isFormOpen = !this.isFormOpen;
      //TODO: Convert to FormData
      console.log("date");
      const date = this.formValues.due_date;
      const form_date = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      console.log(form_date);
      const time = `${this.formValues.due_time.hours}:${this.formValues.due_time.minutes}:00`;
      // console.log(time);
      try {
        const FormValues = new FormData();
        FormValues.append("title", this.formValues.title);
        FormValues.append("description", this.formValues.description);
        FormValues.append("alloted_marks", this.formValues.alloted_marks);
        FormValues.append("due_date", form_date);
        FormValues.append("due_time", time);
        FormValues.append("attached_pdf", this.formValues.attached_pdf);
        const res = await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/`,
          FormValues,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": this.formValues.attached_pdf,
              boundary: "attached_pdf",
              Filename: this.formValues.attached_pdf.name,
            },
          }
        );
        const assignmentResponse = await axios.get(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/`
        );
        this.assignments = assignmentResponse.data;
        this.subjectEdit.push(true);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    async handleFileUpload(event) {
      this.formValues.attached_pdf = event.target.files[0];
      console.log(this.formValues.attached_pdf);
    },
    showSubmissions(id, alloted_marks) {
      console.log(id);
      console.log(alloted_marks);
      this.$router.replace({
        name: "assignmentSubmission",
        params: {
          id: id,
          subject_slug: this.subject_slug,
          semester_no: this.semester_no,
          classroom_slug: this.classroom_slug,
          marks: alloted_marks,
        },
      });
    },
  },
};
</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
