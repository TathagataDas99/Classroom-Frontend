<template>
  <div>
    <div v-if="loader">
      <LoaderView />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      loader: false,
    };
  },
  props: ["no"],
  components: {
    LoaderView,
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
  async created() {
    this.loader = true;
    console.log(this.userProfile.classroom.slug);
    try {
      const subjectCards = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.userType.userTypeId}/`
      );
      console.log(subjectCards);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
};
</script>

<style lang="scss" scoped></style>
