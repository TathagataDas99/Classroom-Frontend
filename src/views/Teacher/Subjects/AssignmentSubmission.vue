<template>
  <div class="h-screen w-screen text-center">
    <h1 class="text-2xl">{{ submissions }}</h1>

    <section class="w-full">
      <table class="table-auto">
        <tr>
          <th>Student Name</th>
          <th>University roll</th>
          <th>Email Id</th>
          <th>Answer Section</th>
          <th>Submitted File</th>
          <th>Score Given</th>
          <th>Remarks</th>
        </tr>
        <tr v-for="(submission, index) in submissions" :key="submission.id">
          <td>
            {{
              submission.submitted_by.user.first_name +
              " " +
              submission.submitted_by.user.last_name
            }}
          </td>
          <td>{{ submission.submitted_by.university_roll }}</td>
          <td>{{ submission.submitted_by.user.email }}</td>
          <td>{{ submission.answer_section }}</td>
          <td><a :href="submission.submitted_file">Download</a></td>
          <td>
            <input
              class="w-full bg-bglight-shade text-lg text-zinc-700 decoration-transparent"
              :class="{ 'subject-edit-input': !subjectEditArr[index] }"
              :disabled="subjectEditArr[index]"
              type="number"
              min="0"
              max="100"
              v-model="formValueList[index].score"
            />
          </td>
          <td>
            <textarea
              v-model="formValueList[index].remarks"
              class="bg-bglight-shade text-lg text-zinc-700 decoration-transparent"
              :class="{ 'subject-edit-input': !subjectEditArr[index] }"
              :disabled="subjectEditArr[index]"
            ></textarea>
          </td>
          <td
            class="z-30 flex flex-col items-center justify-evenly"
            :class="{ 'rounded-xl bg-bgdark-base p-3': !subjectEditArr[index] }"
          >
            <PencilIcon
              v-if="subjectEditArr[index]"
              @click="subjectEditArr[index] = !subjectEditArr[index]"
              class="slow-effect h-7 w-5 text-zinc-700 hover:text-zinc-500"
            />
            <CheckIcon
              v-else
              @click="editPatch(submission, index)"
              class="slow-effect h-7 w-5 rounded-lg border-2 border-primary-light text-primary-dark hover:text-primary-light"
            />
          </td>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import {
  PencilIcon,
  CheckIcon,
  // TrashIcon,
  // ReplyIcon,
} from "@heroicons/vue/solid";
export default {
  components: {
    PencilIcon,
    CheckIcon,
  },
  data() {
    return {
      subjectEditArr: [],
      submissions: [],
      formValueList: [],
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
    for (let i of this.submissions) {
      this.subjectEditArr.push(true);
      this.formValueList.push({
        has_scored: true,
        score: i.score,
        remarks: i.remarks,
      });
    }
  },
  methods: {
    async editPatch(submission, index) {
      try {
        await axios.patch(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${this.id}/submission/${submission.id}/`,
          this.formValueList[index]
        );
        this.subjectEditArr[index] = !this.subjectEditArr[index];
        const submissionsResp = await axios.get(
          `/classroom-app/teacher/${this.userProfile.teacher_id}/subject/${this.subject_slug}/assignment/${this.id}/submission/`
        );
        this.submissions = submissionsResp.data;
        for (let i of this.submissions) {
          this.subjectEditArr.push(true);
          this.formValueList.push({
            has_scored: true,
            score: i.score,
            remarks: i.remarks,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
