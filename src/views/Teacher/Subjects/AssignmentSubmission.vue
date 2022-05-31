<template>
  <div
    class="mr-4 h-screen snap-mandatory overflow-y-scroll text-center scrollbar-hide"
  >
    <!-- <h1 class="text-2xl">{{ submissions }}</h1> -->

    <table class="group w-full table-auto rounded-b-lg shadow-lg">
      <tr class="border-x-2 border-t-2 border-gray-200 py-4">
        <th>Name</th>
        <th>Roll</th>
        <!-- <th>Email</th> -->
        <!-- <th>Answer Section</th> -->
        <th>File</th>
        <th>Score</th>
        <th>Remarks</th>
      </tr>
      <tr
        v-for="(submission, index) in submissions"
        :key="submission.id"
        class="my-2 mx-1 rounded-lg border-x-2 border-gray-200 px-3 py-2 odd:bg-sky-100 even:bg-green-100"
      >
        <td class="font-heading text-lg font-bold">
          {{
            submission.submitted_by.user.first_name +
            " " +
            submission.submitted_by.user.last_name
          }}
        </td>
        <td>{{ submission.submitted_by.university_roll }}</td>
        <!-- <td>{{ submission.submitted_by.user.email }}</td> -->
        <!-- <td>{{ submission.answer_section }}</td> -->
        <td>
          <a class="text-center" :href="submission.submitted_file"
            ><DocumentDownloadIcon
              class="slow-effect w-8 text-center text-danger-light hover:scale-125"
          /></a>
        </td>
        <td class="odd:bg-sky-100">
          <input
            class="w-full text-center text-lg text-zinc-700 even:bg-green-100"
            :class="{ 'subject-edit-input': !subjectEditArr[index] }"
            :disabled="subjectEditArr[index]"
            type="number"
            min="0"
            :max="50"
            v-model="formValueList[index].score"
          />
          //TODO: Upper Limit check add
        </td>
        <td class="odd:bg-sky-100">
          <input
            type="text"
            v-model="formValueList[index].remarks"
            class="text-lg text-zinc-700 even:bg-green-100"
            :class="{ 'subject-edit-input': !subjectEditArr[index] }"
            :disabled="subjectEditArr[index]"
          />
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
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import {
  PencilIcon,
  CheckIcon,
  DocumentDownloadIcon,
  // TrashIcon,
  // ReplyIcon,
} from "@heroicons/vue/solid";
export default {
  components: {
    PencilIcon,
    CheckIcon,
    DocumentDownloadIcon,
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
