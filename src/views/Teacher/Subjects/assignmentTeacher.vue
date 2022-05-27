<template>
  <main class="w-screen" @click="openedNotes = -1">
    <h1>{{ assignment }}</h1>
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
            <input
              class="input-box"
              type="date"
              :min="min_due_date"
              v-model.trim.lazy="formValues.due_date"
              required
            />
            <input
              class="input-box"
              type="time"
              v-model.trim.lazy="formValues.due_time"
              required
            />
          </section>
        </div>
        <div class="form-section">
          <label class="label">Attachment (1 PDF only, Max Size: 5 MB)</label>
          <section class="input-section-file">
            <input
              title="1 PDF only, Max Size: 5 MB"
              class="input-file"
              ref="file"
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

    <section>
      <!-- <template v-if="loader">
        <template v-for="i in 4" :key="i">
          <LoaderCard class="col-span-1 row-span-1 place-self-center" />
        </template>
      </template> -->
      <section
        :tabindex="index"
        class="announcement-collapse"
        v-for="(note, index) in notes"
        :key="note.slug"
        :class="{ 'collapse-open max-h-96': openedNotes === index }"
        @focusin="openedNotes = index"
      >
        <!-- #FIXME: Edit card opening all at same time -->
        <div class="absolute top-5 right-5 flex w-20 flex-row justify-evenly">
          <PencilIcon
            v-if="subjectEdit[index]"
            @click="subjectEdit[index] = !subjectEdit[index]"
            class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
          />
          <CheckIcon
            v-else
            @click="editPatch(note, index)"
            class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
          />
          <div class="tooltip tooltip-left" data-tip="Delete Subject">
            <!-- deleteAnnouncement(note.slug) -->
            <a href="#delete-warning">
              <TrashIcon
                @click="tempVal = note.slug"
                v-show="subjectEdit[index]"
                class="slow-effect z-10 h-7 w-5 text-pink-500 hover:text-pink-300"
              />
            </a>
          </div>
        </div>
        <input
          type="text"
          v-model="note.title"
          class="collapse-title font-heading text-base font-medium uppercase md:text-lg lg:text-xl"
          :class="{ 'subject-edit-input': !subjectEdit[index] }"
          :disabled="subjectEdit[index]"
          placeholder="note title"
        />
        <input
          type="text"
          v-model="note.description"
          class="collapse-content columns-1 font-body text-base font-medium md:col-span-3"
          :class="{ 'subject-edit-input collapse-title': !subjectEdit[index] }"
          :disabled="subjectEdit[index]"
          placeholder="note description"
        />
        <!-- <section
          class="collapse-content col-span-1 row-span-1 flex flex-row flex-wrap items-center justify-start font-body lg:col-start-4 lg:row-start-3"
        > -->
        <div
          class="collapse-content col-span-full row-span-1 flex flex-row flex-wrap items-center justify-evenly md:col-span-2 md:row-start-2"
        >
          <a
            class="slow-effect bottom-5 flex flex-col items-center justify-evenly hover:text-primary-light"
            :href="'http://localhost:8000' + file.file_path"
            v-for="(file, index2) in note.attached_files"
            :key="file.title"
          >
            <DocumentDownloadIcon
              class="slow-effect w-10 text-primary-dark hover:scale-110 hover:text-primary-light"
            />
            <span class="text-sm font-bold">file-{{ index2 + 1 }}</span>
          </a>
        </div>
        <!-- </section> -->
      </section>
    </section>
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
} from "@heroicons/vue/solid";
// import LoaderCard from "../../../components/LoaderCard.vue";
import { DocumentDownloadIcon } from "@heroicons/vue/solid";
export default {
  name: "assignmentTeacher",
  props: ["classroom_slug", "no", "subject_slug"],
  components: {
    // LoaderCard,
    PencilIcon,
    PlusCircleIcon,
    CheckIcon,
    TrashIcon,
    DocumentDownloadIcon,
  },
  data() {
    return {
      isFormOpen: false,
      min_due_date:
        new Date().getDate() +
        "-" +
        parseInt(new Date().getMonth()) +
        "-" +
        new Date().getFullYear(),
      formValues: {
        title: "",
        description: "",
        alloted_marks: 100,
        attached_pdf: null,
        due_date: null,
        due_time: null,
      },
      attached_files: [],
      loader: false,
      assignment: "", //#FIXME: this might be an array
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
      this.assignment = assignmentResponse.data;
      for (let i = 0; i < this.assignment.length; i++) {
        this.subjectEdit.push(true);
      }
    } catch (e) {
      console.log(e);
    }
    this.formValues.due_date = new Date().getUTCDate();
    this.loader = false;
  },
  methods: {
    async editPatch(assignment, index) {
      try {
        this.subjectEdit[index] = !this.subjectEdit[index];
        const id = assignment.id;
        const assignmentPatch = {
          title: assignment.title,
          description: assignment.description,
          alloted_marks: assignment.alloted_marks,
          due_date: assignment.due_date,
          due_time: assignment.due_time,
        };
        // TODO:FormDAta
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${id}/`,
          assignmentPatch
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
        this.subjectEdit.pop(); //FIXME:This may cause error
        console.log(id);
        this.assignment = this.assignment.filter(function (obj) {
          return obj.id !== id;
        });
        await axios.delete(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${id}/`
        );
        this.tempVal = null;
      } catch (e) {
        console.log(e);
      }
    },
    async addAssignment() {
      this.isFormOpen = !this.isFormOpen;
      //TODO: Convert to FormData
      try {
        const FormValues = new FormData();
        FormValues.append("title", this.formValues.title);
        FormValues.append("description", this.formValues.description);
        FormValues.append("alloted_marks", this.formValues.alloted_marks);
        FormValues.append("due_date", this.formValues.due_date);
        FormValues.append("due_time", this.formValues.due_time);
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
        this.subjectEdit.push(true);
        console.log(res);
        // this.assignment.push(res.data); //TODO: Open if needed
        // for (let i of this.attached_files) {
        //   let fd = new FormData();
        //   fd.append("file_path", i);
        //   console.log(fd);
        //   const link = `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${res.data.slug}/assignment-files/`;
        //   await axios.post(link, fd, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //       Accept: "*/*",
        //       "Content-Disposition": i,
        //       boundary: "file_path",
        //       Filename: i.name,
        //     },
        //   });
        //step 2 : fetch again
        // }
        // this.$router.go();
        // console.log(this.attached_files);
      } catch (e) {
        console.log(e);
      }
      const announcementsResponse = await axios.get(
        `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/`
      );
      this.assignment = announcementsResponse.data;
    },
    async handleFileUpload(event) {
      this.formValues.attached_pdf = event.target.files[0];
      console.log(this.formValues.attached_pdf);
    },
  },
};
</script>
