<template>
  <div>
    <h1>{{ notes }}</h1>
    <hr />
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
          <input ref="file" @change="handleFileUpload" type="file" multiple />
          <!-- multiple -->
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
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/vue/solid";
import LoaderCard from "../../../components/LoaderCard.vue";
export default {
  props: ["classroom_slug", "no", "subject_slug"],
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
  components: {
    LoaderCard,
    PencilIcon,
    CheckIcon,
    TrashIcon,
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
        let fd = new FormData();
        fd.append("file", this.attached_files);
        fd.append("filename", this.attached_files.name);
        console.log(fd);
        const link = `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/notes/${res.data.slug}/notes-files/`;
        await axios.post(link, fd, {
          headers: {
            // "Access-Control-Allow-Origin": "*",
            // "access-control-allow-headers":
            //   "origin, x-requested-with, content-type, accept",
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
            "Content-Disposition": this.attached_files,
            Filename: this.attached_files.name,
            // boundary: "file",
          },
        });
        console.log(this.attached_files);
      } catch (e) {
        console.log(e);
      }
    },
    async handleFileUpload(event) {
      this.attached_files = event.target.files[0];
      console.log(this.attached_files);
    },
  },
};
</script>

<style lang="scss" scoped></style>
