<template>
  <main class="w-screen" @click="openedNotes = -1">
    <!-- <h1>{{ notes }}</h1> -->
    <!-- <h1>{{attached_files}}</h1> -->
    <!-- notes add form -->
    <aside class="absolute bottom-7 right-2 z-50 md:right-10">
      <button
        class="add-subject"
        @click="this.isFormOpen = !this.isFormOpen"
        v-show="!this.isFormOpen"
      >
        <PlusCircleIcon class="my-auto inline-block w-7" />
        Notes
      </button>
      <form
        v-if="isFormOpen"
        class="form z-30 border-2 border-primary-dark accent-primary-dark"
        @submit.prevent="addNote"
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
              required
            />
          </section>
        </div>
        <div class="form-section">
          <label class="label">Attachments</label>
          <section class="input-section-file">
            <input
              class="input-file"
              ref="file"
              @change="handleFileUpload"
              type="file"
              multiple
              accept=".xlsx, .pdf, .docs"
            />
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
      formValues: {
        title: "",
        description: "",
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
    this.loader = false;
  },
  methods: {
    async editPatch(assignment, index) {
      try {
        this.subjectEdit[index] = !this.subjectEdit[index];
        const slug = assignment.slug;
        const assignmentPatch = {
          title: assignment.title,
          description: assignment.description,
          alloted_marks: assignment.alloted_marks,
          due_date: assignment.due_date,
          due_time: assignment.due_time,
        };
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${slug}/`,
          assignmentPatch
        );

        // console.log(res);
        // this.$router.go();
      } catch (e) {
        console.log(e);
      }
    },
    async deleteNote(slug) {
      // console.log("inside delete");
      try {
        // this.subjectEdit.pop();
        console.log(slug);
        this.assignment = this.assignment.filter(function (obj) {
          return obj.slug !== slug;
        });
        await axios.delete(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${slug}/`
        );
        this.tempVal = null;
      } catch (e) {
        console.log(e);
      }
    },
    async addNote() {
      this.isFormOpen = !this.isFormOpen;
      try {
        const res = await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/`,
          this.formValues
        );
        this.subjectEdit.push(true);
        // console.log(res);
        this.assignment.push(res.data);
        for (let i of this.attached_files) {
          let fd = new FormData();
          fd.append("file_path", i);
          console.log(fd);
          const link = `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${res.data.slug}/assignment-files/`;
          await axios.post(link, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": i,
              boundary: "file_path",
              Filename: i.name,
            },
          });
          //step 2 : fetch again
          const announcementsResponse = await axios.get(
            `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/`
          );
          this.notes = announcementsResponse.data;
        }
        // this.$router.go();
        // console.log(this.attached_files);
      } catch (e) {
        console.log(e);
      }
    },
    async handleFileUpload(event) {
      this.attached_files = event.target.files;
      console.log(this.attached_files);
    },
  },
};
</script>
