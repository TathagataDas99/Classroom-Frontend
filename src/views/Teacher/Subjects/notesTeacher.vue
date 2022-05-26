<template>
  <main class="w-screen">
    <h1>{{ notes }}</h1>
    <!-- <h1>{{attached_files}}</h1> -->
    <!-- notes add form -->
    <aside class="absolute bottom-7 right-2 z-50 md:right-10">
      <button class="add-subject" @click="this.isFormOpen = !this.isFormOpen">
        <PlusCircleIcon class="my-auto inline-block w-7" />
        Notes
      </button>
      <form
        v-if="isFormOpen"
        class="form accent-primary-dark"
        @submit.prevent="addAnnouncement"
        enctype="multipart/form-data"
      >
        <div class="form-section">
          <label class="label">Notes Title</label>
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.title"
            required
          />
        </div>
        <div class="form-section">
          <label class="label">Notes Description</label>
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.description"
            required
          />
        </div>
        <div class="form-section">
          <label class="label">Add notes</label>
          <input
            ref="file"
            @change="handleFileUpload"
            type="file"
            multiple
            accept=".xlsx, .pdf, .docs"
          />
          <!-- multiple -->
        </div>
        <button class="bttn">Add</button>
      </form>
    </aside>
    <!-- notes add form -->
    <div
      class="mt-5 grid grid-flow-row grid-cols-1 items-center justify-evenly gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3"
    >
      <template v-if="loader">
        <template v-for="i in 4" :key="i">
          <LoaderCard class="col-span-1 row-span-1 place-self-center" />
        </template>
      </template>
      <section
        class="card col-span-1 row-span-1 place-self-center"
        v-for="note in notes"
        :key="note.slug"
        :class="{ 'h-full w-full overflow-auto scrollbar-hide': !subjectEdit }"
      >
        <!-- #FIXME: Edit card opening all at same time -->
        <div class="absolute top-5 right-5">
          <PencilIcon
            v-if="subjectEdit"
            @click="subjectEdit = !subjectEdit"
            class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
          />
          <CheckIcon
            v-else
            @click="editPatch(note)"
            class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
          />
          <div class="tooltip" data-tip="Delete Subject">
            <TrashIcon
              @click="deleteAnnouncement(note.slug)"
              class="slow-effect h-7 w-5 text-pink-500 hover:text-pink-300"
            />
          </div>
        </div>
        <!-- TODO:Dynamic v-model : LINK: https://stackoverflow.com/questions/60703994/how-do-you-conditional-bind-v-model-in-vue -->
        <input
          type="text"
          v-model="note.title"
          class="w-full bg-slate-50 text-lg text-zinc-700"
          :class="{ 'input-box': !subjectEdit }"
          :disabled="subjectEdit"
          placeholder="note title"
        />
        <!-- TODO: @priyesh :- make proper design -->
        <input
          type="text"
          v-model="note.description"
          class="w-full bg-slate-50 text-lg text-zinc-700"
          :class="{ 'input-box': !subjectEdit }"
          :disabled="subjectEdit"
          placeholder="note code"
        />
        <a
          class="slow-effect bottom-5 flex flex-row hover:text-primary-light"
          :href="'http://localhost:8000' + file.file_path"
          v-for="file in note.attached_files"
          :key="file.title"
        >
          <DocumentDownloadIcon
            class="slow-effect inline-block h-4 w-4 text-primary-dark hover:scale-110 hover:text-primary-light"
          />
          <!-- <span class="text-sm font-bold">file-{{ index + 1 }}</span> -->
        </a>
      </section>
    </div>
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
import LoaderCard from "../../../components/LoaderCard.vue";
import { DocumentDownloadIcon } from "@heroicons/vue/solid";
export default {
  props: ["classroom_slug", "no", "subject_slug"],
  components: {
    LoaderCard,
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
      notes: "", //#FIXME: this might be an array
      id: "",
      isActive: 1,
      subjectEdit: true,
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
      const announcementsResponse = await axios.get(
        `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/`
      );
      this.notes = announcementsResponse.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    async editPatch(note) {
      try {
        this.subjectEdit = !this.subjectEdit;
        const slug = note.slug;
        const notePatch = { title: note.title, description: note.description };
        const res = await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/${slug}/`,
          notePatch
        );
        console.log(res);
        this.$router.go();
      } catch (e) {
        console.log(e);
      }
    },
    async deleteAnnouncement(slug) {
      try {
        // this.subjectEdit = !this.subjectEdit;
        console.log(slug);
        this.notes = this.notes.filter(function (obj) {
          return obj.slug !== slug;
        });
        await axios.delete(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/${slug}/`
        );
      } catch (e) {
        console.log(e);
      }
    },
    async addAnnouncement() {
      this.isFormOpen = !this.isFormOpen;
      try {
        const res = await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/`,
          this.formValues
        );
        // console.log(res);
        this.notes.push(res.data);
        for (let i of this.attached_files) {
          let fd = new FormData();
          fd.append("file_path", i);
          console.log(fd);
          const link = `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/${res.data.slug}/notes-files/`;
          await axios.post(link, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": i,
              boundary: "file_path",
              Filename: i.name,
            },
          });
        }
        // this.$router.go();
        console.log(this.attached_files);
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

<style lang="scss" scoped></style>
