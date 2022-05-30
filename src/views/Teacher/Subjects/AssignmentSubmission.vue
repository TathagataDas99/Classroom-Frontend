<template>
  <div class="h-screen w-screen text-center">
    <h1 class="text-2xl">{{ submissions }}</h1>

    <section class="w-full">
      <table class="table-auto ">
        <th>
          <td>Student Name</td>
          <td>University roll</td>
          <td>Email Id</td>
          <td>Answer Section</td>
          <td>Submited File</td>
          <td>Score Given</td>
          <td>Remarks</td>
        </th>
        <tr v-for="submission in submissions" :key="submission.id">
          <td>{{submission.submitted_by.user.first_name + " " +submission.submitted_by.user.last_name}}</td>
          <td>{{submission.submitted_by.university_roll}}</td>
          <td>{{submission.submitted_by.user.email}}</td>
          <td>{{submission.answer_section}}</td>
          <td><a :href="submission.submitted_file">Download</a></td>
          <td><input class="input-box" type="number" min="0" max="100"/></td>
          <td><textarea></textarea></td>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      submissions: [],
    };
  },
  props: ["classroom_slug", "semester_no", "subject_slug", "id"],
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  async created() {
    const submissionsResp = await axios.get(
      `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${this.id}/submission/`
    );
    this.submissions = submissionsResp.data;
  },
};
</script>

<style lang="scss" scoped></style>
