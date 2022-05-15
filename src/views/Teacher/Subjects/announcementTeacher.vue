<template>
  <div>
    <h1>{{ announcements }}</h1>
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
        @submit="addAnnouncement"
      >
        <div class="form-section">
          <label class="label">Announcement Heading</label>
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.heading"
            required
          />
        </div>
        <div class="form-section">
          <label class="label">Announcement Body</label>
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.body"
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
      <section
        class="card col-span-1 row-span-1 place-self-center"
        v-for="announcement in announcements"
        :key="announcement.id"
        :class="{ 'h-full w-full overflow-auto scrollbar-hide': !subjectEdit }"
      >
        <div class="absolute top-5 right-5">
          <PencilIcon
            v-if="subjectEdit"
            @click="subjectEdit = !subjectEdit"
            class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
          />
          <CheckIcon
            v-else
            @click="editPatch(announcement)"
            class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
          />
          <div class="tooltip" data-tip="Delete Subject">
            <TrashIcon
              @click="deleteAnnouncement(announcement.id)"
              class="slow-effect h-7 w-5 text-pink-500 hover:text-pink-300"
            />
          </div>
        </div>
        <!-- TODO:Dynamic v-model : LINK: https://stackoverflow.com/questions/60703994/how-do-you-conditional-bind-v-model-in-vue -->
        <input
          type="text"
          v-model="announcement.heading"
          class="w-full bg-slate-50 text-lg text-zinc-700"
          :class="{ 'input-box': !subjectEdit }"
          :disabled="subjectEdit"
          placeholder="announcement title"
        />
        <!-- TODO: @priyesh :- make proper design -->
        <input
          type="text"
          v-model="announcement.body"
          class="w-full bg-slate-50 text-lg text-zinc-700"
          :class="{ 'input-box': !subjectEdit }"
          :disabled="subjectEdit"
          placeholder="announcement code"
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
        heading: "",
        body: "",
      },
      loader: false,
      announcements: "", //#FIXME: this might be an array
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
        `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/announcement/`
      );
      this.announcements = announcementsResponse.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    async editPatch(announcement) {
      try {
        this.subjectEdit = !this.subjectEdit;
        const id = announcement.id;
        delete announcement.id;
        delete announcement.created_at;
        delete announcement.updated_at;
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/announcement/${id}/`,
          announcement
        );
        this.$router.go();
      } catch (e) {
        console.log(e);
      }
    },
    async deleteAnnouncement(id) {
      try {
        // this.subjectEdit = !this.subjectEdit;
        console.log(id);
        this.announcements = this.announcements.filter(function (obj) {
          return obj.id !== id;
        });
        await axios.delete(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/announcement/${id}/`
        );
      } catch (e) {
        console.log(e);
      }
    },
    async addAnnouncement() {
      try {
        await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/announcement/`,
          this.formValues
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
