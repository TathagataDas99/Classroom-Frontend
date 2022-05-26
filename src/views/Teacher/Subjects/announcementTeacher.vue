<template>
  <div class="w-screen">
    <!-- <h1>{{ announcements }}</h1> -->
    <aside class="absolute bottom-7 right-2 md:right-10">
      <button
        class="add-subject"
        @click="this.isFormOpen = !this.isFormOpen"
        v-show="!this.isFormOpen"
      >
        <PlusCircleIcon class="inline-block w-8" />
        Announcement
      </button>
      <form
        v-if="isFormOpen"
        class="form border-2 border-primary-dark accent-primary-dark"
        @submit.prevent="addAnnouncement"
      >
        <div class="form-section">
          <label class="label">Announcement Heading</label>
          <section class="input-section">
            <input
              class="input-box"
              type="text"
              v-model.trim.lazy="formValues.heading"
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
              v-model.trim.lazy="formValues.body"
              required
            />
          </section>
        </div>
        <section class="flex flex-col justify-evenly md:flex-row">
          <button class="bttn">Add</button>
          <button class="bttn-danger" @click="isFormOpen = !isFormOpen">
            Cancel
          </button>
        </section>
      </form>
    </aside>
    <div class="modal z-50" id="delete-warning" v-show="delAnnId > -1">
      <div class="modal-box">
        <h3 class="text-center text-lg font-bold">
          Do you want to delete the announcement ?
        </h3>
        <div class="modal-action">
          <section class="button-section">
            <a class="bttn text-center" @click="deleteAnnouncement(delAnnId)">
              Yes
            </a>
            <a href="" class="bttn-danger text-center">No</a>
          </section>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <!-- <template v-if="loader">
        <template v-for="i in 4" :key="i">
          <LoaderCard class="col-span-1 row-span-1 place-self-center" />
        </template>
      </template> -->
      <section
        :tabindex="announcement.id"
        class="announcement-collapse relative z-10"
        v-for="announcement in announcements"
        :key="announcement.id"
        :class="{
          'collapse-open overflow-auto scrollbar-hide': !subjectEdit,
        }"
      >
        <!-- #FIXME: Edit card opening all at same time -->
        <div class="absolute top-5 right-5 flex w-32 flex-row justify-evenly">
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
          <div class="tooltip tooltip-left" data-tip="Delete Subject">
            <a href="#delete-warning">
              <TrashIcon
                class="slow-effect h-7 w-5 text-pink-500 hover:text-pink-300"
                v-show="subjectEdit"
                @click="delAnnId = announcement.id"
              />
            </a>
          </div>
        </div>
        <!-- TODO:Dynamic v-model : LINK: https://stackoverflow.com/questions/60703994/how-do-you-conditional-bind-v-model-in-vue -->
        <input
          type="text"
          v-model="announcement.heading"
          class="collapse-title font-heading text-base font-medium uppercase md:text-lg lg:text-xl"
          :class="{ 'subject-edit-input': !subjectEdit }"
          :disabled="subjectEdit"
          placeholder="announcement title"
        />
        <!-- TODO: @priyesh :- make proper design -->
        <input
          type="text"
          v-model="announcement.body"
          class="collapse-content font-body md:text-lg"
          :class="{ 'subject-edit-input': !subjectEdit }"
          :disabled="subjectEdit"
          placeholder="announcement body"
        />
      </section>
    </div>
  </div>
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
      delAnnId: -1,
      subjectEdit: true,
    };
  },
  components: {
    // LoaderCard,
    PencilIcon,
    CheckIcon,
    TrashIcon,
    PlusCircleIcon,
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
        const res = await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/announcement/${id}/`,
          announcement
        );
        console.log(res);
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
        this.$router.replace({ name: "announcementTeacher" });
        this.delAnnId = -1;
      } catch (e) {
        console.log(e);
      }
    },
    async addAnnouncement() {
      this.isFormOpen = !this.isFormOpen;
      try {
        const res = await axios.post(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/announcement/`,
          this.formValues
        );
        console.log(res);
        this.announcements.push(res.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
