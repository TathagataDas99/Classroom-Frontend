<template>
  <div
    class="mt-5 grid grid-flow-row grid-cols-1 items-center justify-evenly gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3"
  >
    <template v-if="loader">
      <template v-for="i in 8" :key="i">
        <LoaderCard class="col-span-1 row-span-1 place-self-center" />
      </template>
    </template>
    <section
      class="card col-span-1 row-span-1 place-self-center"
      v-for="subject in subjects"
      :key="subject.slug"
    >
      <h1 class="card-title text-2xl text-zinc-700">
        {{ subject.title }}
      </h1>
      <h1 class="card-title text-sm text-zinc-700">
        {{ subject.subject_code }}
      </h1>
      <span class="text-2xl font-semibold text-zinc-700"
        >{{ subject.created_by.user.first_name }}
        {{ subject.created_by.user.last_name }}</span
      >
      <button class="btn" @click="handelOpen(this.no, subject.slug)">
        Open
      </button>
    </section>
    <!-- {{ subjects }} -->
  </div>
</template>

<script>
import axios from "axios";
// import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import LoaderCard from "../../components/LoaderCard.vue";
// import { mapActions } from "vuex";
export default {
  data() {
    return {
      loader: false,
      subjects: [],
      id: "",
    };
  },
  props: ["no"],
  components: {
    LoaderCard,
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
      const subjectResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject`
      );
      this.subjects = subjectResponse.data;
      // console.log(this.semCards);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    handelOpen(no, slug) {
      // this.$router.push(`/student-dashboard/semester-${no}/subjects/${slug}`)
      this.$router.push({
        name: "ParticularSubject",
        params: {
          no: no,
          subject_slug: slug,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
