<template>
  <div
    class="flex h-screen flex-col items-center justify-evenly bg-bglight-base"
  >
    <div v-if="loader">
      <LoaderView />
    </div>
    <!-- {{ semCards }} -->
    <div
      class="grid w-full flex-shrink grid-rows-2 place-content-center md:grid-cols-5 md:grid-rows-1"
    >
      <nav class="tabs col-span-1 place-self-center md:col-span-2">
        <router-link
          :to="{
            name: 'announcementTeacher',
            props: {
              classroom_slug,
              semester_no,
              subject_slug,
            },
          }"
          class="tab tab-lifted tab-sm lg:tab-lg"
          :class="{
            'tab-active': isActive === 1,
            'tab-active-dynamic': isActive === 1,
          }"
          @click="activeTab(1)"
          >Announcement</router-link
        >
        <router-link
          class="tab tab-lifted tab-sm lg:tab-lg"
          :to="{
            name: 'notesTeacher',
            props: {
              classroom_slug,
              semester_no,
              subject_slug,
            },
          }"
          :class="{
            'tab-active': isActive === 2,
            'tab-active-dynamic': isActive === 2,
          }"
          @click="activeTab(2)"
          >Notes</router-link
        >
        <router-link
          class="tab tab-lifted tab-sm lg:tab-lg"
          :to="{
            name: 'assignmentTeacher',
            props: {
              classroom_slug,
              semester_no,
              subject_slug,
            },
          }"
          :class="{
            'tab-active': isActive === 3,
            'tab-active-dynamic': isActive === 3,
          }"
          @click="activeTab(3)"
          >Assignments</router-link
        >
      </nav>
      <div
        class="row-start-2 hidden md:col-span-2 md:col-start-3 md:row-start-1 md:block"
      >
        <div class="page-header-2">
          <p>Subject - {{ subject_slug }}</p>
        </div>
      </div>
      <div class="col-span-1 row-start-1 place-self-center md:col-start-5">
        <button
          class="link-danger columns-1"
          @click="
            $router.replace({
              name: 'TeacherSubjectCards',
              semester_no,
              classroom_slug,
            })
          "
        >
          <ReplyIcon class="inline-block w-6 text-danger-dark" />
          Subject Page
        </button>
      </div>
    </div>
    <router-view class="flex-1" />
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import { ReplyIcon } from "@heroicons/vue/solid";
export default {
  props: ["classroom_slug", "no", "subject_slug"],
  data() {
    return {
      loader: false,
      announcements: [], //#FIXME: this might be an array
      id: "",
      isActive: 1,
    };
  },
  components: {
    LoaderView,
    ReplyIcon,
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  //   updated() {
  //     this.$router.go();
  //   },
  async created() {
    //   this.$router.go();
    this.loader = true;
    for (let semCard of this.semCards) {
      if (`${semCard.sem_no}` === this.no) {
        this.id = semCard.id;
      }
    }
    try {
      const announcementsResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}`
      );
      this.announcements = announcementsResponse.data;
      this.$router.replace({ name: "announcementTeacher" });
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    activeTab(no) {
      this.isActive = no;
    },
  },
};
</script>

<style lang="scss" scoped></style>
