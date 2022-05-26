<template>
  <div class="w-screen">
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
        @submit.prevent="addAnnouncement"
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
    <div class="mt-5">
      <!-- <template v-if="loader">
        <template v-for="i in 4" :key="i">
          <LoaderCard class="col-span-1 row-span-1 place-self-center" />
        </template>
      </template> -->
      <section
        :tabindex="announcement.id"
        class="announcement-collapse"
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
              />
              <!-- @click="deleteAnnouncement(announcement.id)" -->
            </a>
            <div class="modal" id="delete-warning">
              <div class="modal-box">
                <h3 class="text-lg font-bold">
                  Do you want to delete the announcement
                </h3>
                <div class="modal-action">
                  <section class="button-section">
                    <a
                      @click="deleteAnnouncement(announcement.id)"
                      class="bttn"
                    >
                      Yes!
                    </a>
                    <a href="" class="bttn-danger">No</a>
                  </section>
                  <!-- <a href="#" class="btn">Yes!</a> -->
                </div>
              </div>
            </div>
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
import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/vue/solid";
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
      subjectEdit: true,
    };
  },
  components: {
    // LoaderCard,
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
