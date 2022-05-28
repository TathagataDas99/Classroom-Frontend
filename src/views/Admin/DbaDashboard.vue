<template>
  <div
    v-if="anyFormOpen"
    class="absolute top-0 z-10 min-h-screen w-screen bg-slate-700/50 backdrop-blur-sm backdrop-filter"
  ></div>
  <main
    class="mx-4 grid min-h-screen w-screen grid-flow-row grid-cols-1 lg:grid-cols-7 lg:grid-rows-1"
  >
    <!-- Showing classroom -->
    <aside
      id="2"
      class="col-span-2 col-start-6 flex flex-col flex-wrap items-center justify-evenly"
    >
      <div
        class="mx-2 rounded-xl bg-sky-200 px-5 py-2 text-center text-bgdark-base shadow-md"
        v-if="classroomList.length === 0"
      >
        No Classrooms Yet, Please Create One
      </div>
      <div
        v-else
        class="ClassroomCard"
        v-for="classroom in classroomList"
        :key="classroom.id"
      >
        <table class="mx-3 mt-4 table-auto px-2">
          <tr>
            <td class="font-heading text-xl font-bold text-primary-dark">
              Title:
            </td>
            <td class="font-body text-lg font-semibold">
              {{ classroom.title }}
            </td>
          </tr>
          <tr>
            <td class="font-heading text-xl font-bold text-primary-dark">
              Stream:
            </td>
            <td class="font-body text-lg font-semibold">
              {{ classroom.stream }}
            </td>
          </tr>
          <tr>
            <td class="font-heading text-xl font-bold text-primary-dark">
              Batch:
            </td>
            <td class="font-body text-lg font-semibold">
              {{ classroom.start_year }} - {{ classroom.end_year }}
            </td>
          </tr>
          <tr>
            <td class="font-heading text-xl font-bold text-primary-dark">
              Section:
            </td>
            <td class="font-body text-lg font-semibold">
              {{ classroom.section }}
            </td>
          </tr>
          <tr>
            <td class="font-heading text-xl font-bold text-primary-dark">
              Level:
            </td>
            <td class="font-body text-lg font-semibold">
              {{ classroom.level }}
            </td>
          </tr>
          <tr>
            <td class="font-heading text-xl font-bold text-primary-dark">
              Sem:
            </td>
            <td class="font-body text-lg font-semibold">
              {{ classroom.current_sem }}
            </td>
          </tr>
        </table>
        <div class="button-section">
          <button
            class="bttn place-self-end"
            @click="handelOpen(classroom.slug)"
          >
            <!-- TODO:WRITE EDIT FUNCTION OF CLASSROOM -->
            <div class="tooltip" data-tip="Edit Sem &amp; Title">
              <PencilAltIcon class="inline-block w-6 lg:w-5" />
            </div>
          </button>
          <button
            class="bttn-danger place-self-end"
            @click="handelOpen(classroom.slug)"
          >
            <div class="tooltip" data-tip="Delete Classroom">
              <TrashIcon class="inline-block w-4 lg:w-5" />
            </div>
          </button>
        </div>
      </div>
    </aside>
    <section
      id="1"
      class="col-span-5 col-start-1 row-start-1 grid grid-flow-row grid-cols-1"
    >
      <!-- owner-group -->
      <section
        v-if="userProfile.is_owner"
        id="owner-group"
        class="my-4 flex flex-col justify-evenly rounded-lg px-4 shadow-md"
      >
        <section
          class="relative flex flex-row flex-wrap items-center justify-evenly rounded-l-xl border-l-[7px] border-black py-1 shadow-md shadow-gray-300/40"
        >
          <!-- add dbas to stream -->
          <template v-if="userProfile.is_owner">
            <!-- Add dba to the stream -->
            <label for="stream" class="admin-label">Stream Management : </label>
            <button
              class="admin-btn"
              v-if="!isFormOpen"
              @click="this.isFormOpen = !this.isFormOpen"
            >
              <UserAddIcon class="admin-btn-icon" /> Add Admin
            </button>
            <!-- Add dba to the stream Form -->
            <form
              v-if="isFormOpen"
              class="form form-admin"
              @submit.prevent="addDbaToTheStream"
            >
              <div class="form-section">
                <label class="label" for="stream">stream</label>
                <div class="input-section">
                  <select
                    name="stream"
                    id="stream"
                    v-model="formValues.title"
                    class="input-box"
                  >
                    <option
                      :value="stream.title"
                      v-for="stream in userProfile.streams"
                      :key="stream.stream_id"
                    >
                      {{ stream.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-section">
                <label class="label" for="dba">Managed By Admin</label>
                <div class="input-section">
                  <select
                    name="dba"
                    id="dba"
                    class="input-box"
                    v-model="formValues.dba"
                  >
                    <template v-for="dba in dbaList" :key="dba.dba_id">
                      <option
                        v-if="dba.dba_id != userProfile.dba_id"
                        :value="dba.dba_id"
                      >
                        {{ dba.user.first_name + " " + dba.user.last_name }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
              <div class="button-section">
                <button class="bttn">Add</button>
                <button @click="isFormOpen = !isFormOpen" class="bttn-danger">
                  Cancel
                </button>
              </div>
            </form>
          </template>
          <!-- remove dbas from stream -->
          <template v-if="userProfile.is_owner">
            <!-- TODO: -->
            <!-- remove dba to the stream -->
            <button
              v-if="!isFormOpenARFS"
              class="admin-btn-danger"
              @click="this.isFormOpenARFS = !this.isFormOpenARFS"
            >
              <UserRemoveIcon class="admin-btn-icon" />
              remove admin
            </button>
            <!-- Remove dba to the stream Form -->
            <form
              v-if="isFormOpenARFS"
              class="form form-admin"
              @submit.prevent="addDbaToTheStream"
            >
              <div class="form-section">
                <label class="label" for="stream">stream</label>
                <div class="input-section">
                  <select
                    name="stream"
                    id="stream"
                    class="input-box"
                    v-model="formValues.title"
                  >
                    <option
                      :value="stream.title"
                      v-for="stream in userProfile.streams"
                      :key="stream.stream_id"
                    >
                      {{ stream.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-section">
                <label class="label" for="dba">DBA</label>
                <section class="input-section">
                  <select
                    name="dba"
                    id="dba"
                    v-model="formValues.dba"
                    class="input-box"
                  >
                    <template v-for="dba in dbaList" :key="dba.dba_id">
                      <option
                        v-if="dba.dba_id != userProfile.dba_id"
                        :value="dba.dba_id"
                      >
                        {{ dba.user.first_name + " " + dba.user.last_name }}
                      </option>
                    </template>
                  </select>
                </section>
              </div>
              <div class="button-section">
                <button class="bttn">Add</button>
                <button
                  class="bttn-danger"
                  @click="isFormOpenARFS = !isFormOpenARFS"
                >
                  Cancel
                </button>
              </div>
            </form>
          </template>
        </section>
        <!-- college level teacher related operations -->
        <section
          class="relative flex flex-row flex-wrap items-center justify-evenly rounded-l-xl border-l-[7px] border-black py-1 shadow-md shadow-gray-300/40"
        >
          <label for="stream" class="admin-label"
            >College Teacher Management :
          </label>
          <!-- add teacher to the college -->
          <div v-if="userProfile.is_owner">
            <button
              v-if="!isAddingTeacherFormOpenCollege"
              class="admin-btn"
              @click="
                this.isAddingTeacherFormOpenCollege =
                  !this.isAddingTeacherFormOpenCollege
              "
            >
              <UserAddIcon class="admin-btn-icon" />
              Add Teacher
            </button>
            <form
              v-if="isAddingTeacherFormOpenCollege"
              class="form sticky top-20 z-30 place-content-center accent-primary-dark lg:col-span-2"
              @submit.prevent="addTeacherCollege"
            >
              <section class="form-section">
                <label class="label">Email Id</label>
                <section class="input-section">
                  <input
                    class="input-box"
                    type="email"
                    placeholder="Email Id"
                    v-model.trim.lazy="addTeacherForm.email"
                    required
                  />
                </section>
              </section>
              <section class="button-section">
                <button class="bttn">Add</button>
                <button
                  @click="
                    isAddingTeacherFormOpenCollege =
                      !isAddingTeacherFormOpenCollege
                  "
                  class="bttn-danger"
                >
                  Cancel
                </button>
              </section>
            </form>
          </div>
          <!-- delete teacher from college by owner -->
          <div v-if="userProfile.is_owner">
            <button
              class="admin-btn-danger"
              @click="
                this.isDeleteTeacherCollegeFormOpen =
                  !this.isDeleteTeacherCollegeFormOpen
              "
            >
              <UserRemoveIcon class="admin-btn-icon" />
              Remove Teacher
            </button>
            <form
              v-if="isDeleteTeacherCollegeFormOpen"
              class="form place-content-center accent-primary-dark lg:col-span-2"
              @submit.prevent="deleteTeacherCollege"
            >
              <div class="form-section">
                <label class="label" for="teacher">Select Teacher</label>
                <select
                  name="teacher"
                  id="teacher"
                  v-model="deleteTeacherFormData.id"
                >
                  <template v-for="teacher in teacherList" :key="teacher.id">
                    <option :value="teacher.id">
                      {{ teacher.email }}
                    </option>
                  </template>
                </select>
              </div>
              <section class="button-section">
                <button class="bttn">Delete</button>
              </section>
            </form>
          </div>
        </section>
      </section>
      <!-- creating classroom -->
      <section>
        <button
          class="btn rounded-full"
          @click="
            this.isCreateClassRoomFormOpen = !this.isCreateClassRoomFormOpen
          "
        >
          Add Classroom
        </button>
        <form
          v-if="isCreateClassRoomFormOpen"
          class="form place-content-center accent-primary-dark lg:col-span-2"
          enctype="multipart/form-data"
          @submit.prevent="createCollege"
        >
          <section class="form-section">
            <label class="label">Title</label>
            <section class="input-section">
              <input
                class="input-box"
                type="text"
                placeholder="classroom name"
                v-model.trim.lazy="createCollegeFormValues.title"
                required
              />
            </section>
          </section>
          <section class="form-section">
            <label class="label">Level</label>
            <section class="input-section">
              <select
                name="level"
                id="level"
                v-model="createCollegeFormValues.level"
              >
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
              </select>
            </section>
          </section>
          <section class="form-section">
            <label class="label">Stream</label>
            <section class="input-section">
              <select
                name="stream"
                id="stream"
                v-model="createCollegeFormValues.stream"
              >
                <option selected disabled>Select Stream</option>
                <option
                  :value="stream.title"
                  v-for="stream in userProfile.streams"
                  :key="stream.stream_id"
                >
                  {{ stream.title }}
                </option>
              </select>
            </section>
          </section>
          <section class="form-section">
            <label class="label">Start Year</label>
            <section class="input-section">
              <input
                class="input-box"
                type="number"
                v-model.trim.lazy="createCollegeFormValues.start_year"
                required
              />
            </section>
          </section>
          <section class="form-section">
            <label class="label">Course Duration</label>
            <section class="input-section">
              <input
                class="input-box"
                type="number"
                min="2"
                v-model.trim.lazy="duration"
              />
            </section>
          </section>
          <section class="form-section">
            <label class="label">Current Sem</label>
            <section class="input-section">
              <input
                class="input-box"
                type="number"
                min="1"
                v-model.trim.lazy="this.createCollegeFormValues.current_sem"
                required
              />
            </section>
          </section>
          <section class="form-section">
            <label class="label">Section</label>
            <section class="input-section">
              <select v-model="createCollegeFormValues.section">
                <option :value="i" v-for="i in sections" :key="i">
                  {{ i }}
                </option>
              </select>
            </section>
          </section>
          <section class="form-section">
            <label class="label col-span-2">Teachers list</label>
            <section class="input-section-file">
              <input
                required
                class="input-file"
                ref="file_teacher"
                @change="handleTeacherFileUpload"
                type="file"
                title="upload the full teacher list of the college"
                accept=".xlsx, .csv"
              />
            </section>
          </section>
          <section class="form-section">
            <label class="label">Student list</label>
            <section class="input-section-file">
              <input
                class="input-file"
                ref="file_dba"
                @change="handleStudentFileUpload"
                type="file"
                title="upload the full dba list of the college"
                accept=".xlsx, .csv"
              />
            </section>
          </section>
          <section class="button-section">
            <button class="bttn">Create</button>
          </section>
        </form>
      </section>
      <!-- adding teachers to classroom -->
      <div>
        <button
          class="btn rounded-full"
          @click="this.isAddingTeacherFormOpen = !this.isAddingTeacherFormOpen"
        >
          Add Teacher To Classroom
        </button>
        <form
          v-if="isAddingTeacherFormOpen"
          class="form place-content-center accent-primary-dark lg:col-span-2"
          @submit.prevent="addTeacher"
        >
          <div class="form-section">
            <label class="label" for="classroom">Class Room</label>
            <select name="classroom" id="classroom" v-model="classroomSlug">
              <template v-for="classroom in classroomList" :key="classroom.id">
                <option :value="classroom.slug">
                  {{ classroom.title }}
                </option>
              </template>
            </select>
          </div>
          <section class="form-section">
            <label class="label">Email Id</label>
            <section class="input-section">
              <input
                class="input-box"
                type="email"
                placeholder="Email Id"
                v-model.trim.lazy="addTeacherForm.email"
                required
              />
            </section>
          </section>
          <section class="button-section">
            <button class="bttn">Add</button>
          </section>
        </form>
      </div>

      <!-- delete teacher from particular classroom -->
      <div>
        <button
          class="btn rounded-full"
          @click="
            this.isDeleteTeacherClassroomFormOpen =
              !this.isDeleteTeacherClassroomFormOpen
          "
        >
          Delete Teacher From Classroom
        </button>
        <form
          v-if="isDeleteTeacherClassroomFormOpen"
          class="form place-content-center accent-primary-dark lg:col-span-2"
          @submit.prevent
        >
          <div class="form-section">
            <label class="label" for="classroom">Select Classroom</label>
            <select name="classroom" id="classroom" v-model="classroomSlug">
              <template
                v-for="classroom in classroomList"
                :key="classroom.slug"
              >
                <option :value="classroom.slug">
                  {{ classroom.title }}
                </option>
              </template>
            </select>
          </div>
          <button class="bttn" @click="getTeachersInClassroom(classroomSlug)">
            Get Teachers
          </button>
          <div class="form-section" v-if="classroomTeacherList">
            <label class="label" for="teacher">Select Teacher</label>
            <select
              name="teacher"
              id="teacher"
              v-model="deleteTeacherClassroomFormData.id"
            >
              <template
                v-for="teacher in classroomTeacherList"
                :key="teacher.id"
              >
                <option :value="teacher.id">
                  {{ teacher.email }}
                </option>
              </template>
            </select>
          </div>
          <section class="button-section">
            <button class="bttn" @click="deleteTeacherClassroom">Delete</button>
          </section>
        </form>
      </div>
      <!-- add student to the classroom -->
      <div>
        <button
          class="btn rounded-full"
          @click="this.isStudentAddFormOpen = !this.isStudentAddFormOpen"
        >
          Add Student To Classroom
        </button>
        <form
          v-if="isStudentAddFormOpen"
          class="form place-content-center accent-primary-dark lg:col-span-2"
          @submit.prevent="addStudent"
        >
          <div class="form-section">
            <label class="label" for="classroom">Class Room</label>
            <select name="classroom" id="classroom" v-model="classroomSlug">
              <template v-for="classroom in classroomList" :key="classroom.id">
                <option :value="classroom.slug">
                  {{ classroom.title }}
                </option>
              </template>
            </select>
          </div>
          <section class="form-section">
            <label class="label">Email Id</label>
            <section class="input-section">
              <input
                class="input-box"
                type="email"
                placeholder="Email Id"
                v-model.trim.lazy="addStudentForm.email"
                required
              />
            </section>
          </section>
          <section class="form-section">
            <label class="label">University Roll</label>
            <section class="input-section">
              <input
                class="input-box"
                type="number"
                placeholder="University Roll"
                v-model.trim.lazy="addStudentForm.university_roll"
                required
              />
            </section>
          </section>
          <section class="button-section">
            <button class="bttn">Add</button>
          </section>
        </form>
      </div>
      <!-- delete student from particular classroom -->
      <div>
        <button
          class="btn rounded-full"
          @click="
            this.isDeleteStudentClassroomFormOpen =
              !this.isDeleteStudentClassroomFormOpen
          "
        >
          Delete Student From Classroom
        </button>
        <form
          v-if="isDeleteStudentClassroomFormOpen"
          class="form place-content-center accent-primary-dark lg:col-span-2"
          @submit.prevent
        >
          <div class="form-section">
            <label class="label" for="classroom">Select Classroom</label>
            <select name="classroom" id="classroom" v-model="classroomSlug">
              <template
                v-for="classroom in classroomList"
                :key="classroom.slug"
              >
                <option :value="classroom.slug">
                  {{ classroom.title }}
                </option>
              </template>
            </select>
          </div>
          <button class="bttn" @click="getStudentsInClassroom(classroomSlug)">
            Get Students
          </button>
          <div class="form-section" v-if="classroomStudentList">
            <label class="label" for="teacher">Select Student</label>
            <select
              name="teacher"
              id="teacher"
              v-model="deleteStudentClassroomFormData.id"
            >
              <template
                v-for="student in classroomStudentList"
                :key="student.id"
              >
                <option :value="student.id">
                  {{ student.email }}
                </option>
              </template>
            </select>
          </div>
          <section class="button-section">
            <button class="bttn" @click="deleteStudentClassroom">Delete</button>
          </section>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { TrashIcon, PencilAltIcon } from "@heroicons/vue/outline";
import { UserRemoveIcon, UserAddIcon } from "@heroicons/vue/solid";

export default {
  components: {
    PencilAltIcon,
    TrashIcon,
    UserRemoveIcon,
    UserAddIcon,
  },
  data() {
    return {
      isCreateClassRoomFormOpen: false,
      isAddingTeacherFormOpen: false,
      isAddingTeacherFormOpenCollege: false,
      isDeleteTeacherCollegeFormOpen: false,
      isDeleteTeacherClassroomFormOpen: false,
      isDeleteStudentClassroomFormOpen: false,
      isStudentAddFormOpen: false,
      isFormOpen: false,
      isFormOpenARFS: false,
      sections: ["A", "B", "C", "D", "E", "F"],
      classroomList: [],
      teacherList: [],
      classroomTeacherList: [],
      classroomStudentList: [],
      formValues: {
        dba: "",
        title: "",
      },
      dbaList: [],
      duration: 2,
      createCollegeFormValues: {
        title: "",
        level: "Bachelors",
        stream: "",
        start_year: 2020,
        end_year: 2022,
        section: "A",
        no_of_semesters: 4,
        current_sem: 1,
        allowed_student_list: null,
        allowed_teacher_list: null,
      },
      classroomSlug: "",
      addTeacherForm: {
        email: "",
      },
      deleteTeacherFormData: {
        id: 1,
      },
      deleteTeacherClassroomFormData: {
        id: 1,
      },
      deleteStudentClassroomFormData: {
        id: 1,
      },
      addStudentForm: {
        email: "",
        university_roll: 1,
      },
    };
  },
  // watch: {
  //   classroomSlug(newValue) {
  //     if (newValue) {
  //       this.getTeachersInClassroom(newValue);
  //     }
  //   },
  // },
  async created() {
    this.loader = true;
    try {
      const response1 = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + sessionStorage.getItem("token"),
        },
      });
      const userId = response1.data.id;
      const userTypeResponse = await axios.get(
        `/classroom-app/user-type/${userId}`
      );
      const userTypeObj = {
        userType: userTypeResponse.data.user_type,
        userTypeId: Object.values(userTypeResponse.data)[1],
      };
      this.$store.dispatch("userType", userTypeObj);

      const userProfileResponse = await axios.get(
        `/classroom-app/dba/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);

      const dbaListRes = await axios.get(
        `/classroom-app/college-create/${this.userProfile.college.slug}/dbas/`
      );
      this.dbaList = dbaListRes.data;

      const classroomListResp = await axios.get(
        `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/`,
        {
          headers: {
            Authorization: "JWT " + sessionStorage.getItem("token"),
          },
        }
      );
      this.classroomList = classroomListResp.data;

      const teacherListResp = await axios.get(
        `/classroom-app/college-dba/${this.userProfile.college.slug}/manage-teacher-college/`,
        {
          headers: {
            Authorization: "JWT " + sessionStorage.getItem("token"),
          },
        }
      );
      this.teacherList = teacherListResp.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
    // calculateEndYear: {
    //   get() {
    //     return this.createCollegeFormValues.start_year + this.duration;
    //   },
    // set(newValue) {
    //   this.createCollegeFormValues.end_year = newValue;
    // },
    // },
    anyFormOpen() {
      // `this` points to the component instance
      return (
        this.isFormOpen ||
        this.isFormOpenARFS ||
        this.isAddingTeacherFormOpen ||
        this.isAddingTeacherFormOpenCollege ||
        this.isCreateClassRoomFormOpen ||
        this.isDeleteTeacherClassroomFormOpen ||
        this.isDeleteTeacherCollegeFormOpen ||
        this.isStudentAddFormOpen
      );
    },
  },
  methods: {
    async addDbaToTheStream() {
      this.isFormOpen = !this.isFormOpen;
      const res = await axios.post(
        `/classroom-app/college-streams/${this.userProfile.college.slug}/stream/`,
        this.formValues
      );
      console.log(res);
    },
    handleTeacherFileUpload(event) {
      this.createCollegeFormValues.allowed_teacher_list = event.target.files[0];
      console.log(this.createCollegeFormValues.allowed_teacher_list);
    },
    handleStudentFileUpload(event) {
      this.createCollegeFormValues.allowed_student_list = event.target.files[0];
      console.log(this.createCollegeFormValues.allowed_student_list);
    },
    async createCollege() {
      this.isCreateClassRoomFormOpen = !this.isCreateClassRoomFormOpen;
      this.loader = true;
      const endYear =
        parseInt(this.createCollegeFormValues.start_year) +
        parseInt(this.duration);
      try {
        let formData = new FormData();
        formData.append("title", this.createCollegeFormValues.title);
        formData.append("level", this.createCollegeFormValues.level);
        formData.append("stream", this.createCollegeFormValues.stream);
        formData.append("start_year", this.createCollegeFormValues.start_year);
        formData.append("end_year", endYear);
        formData.append("section", this.createCollegeFormValues.section);
        formData.append(
          "no_of_semesters",
          this.createCollegeFormValues.no_of_semesters
        );
        formData.append(
          "current_sem",
          this.createCollegeFormValues.current_sem
        );
        formData.append(
          "allowed_teacher_list",
          this.createCollegeFormValues.allowed_teacher_list
        );
        formData.append(
          "allowed_student_list",
          this.createCollegeFormValues.allowed_student_list
        );
        const res = await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/`,
          formData,
          {
            headers: {
              Authorization: "JWT " + sessionStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": [
                this.createCollegeFormValues.allowed_teacher_list,
                this.createCollegeFormValues.allowed_student_list,
              ],
              // boundary: "allowed_teacher_list",
              Filename: [
                this.createCollegeFormValues.allowed_teacher_list.name,
                this.createCollegeFormValues.allowed_student_list.name,
              ],
            },
          }
        );
        console.log(res);
        // }
      } catch (e) {
        console.log(e);
      }
      this.loader = false;
    },
    async addTeacher() {
      try {
        await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${this.classroomSlug}/manage-teacher/`,
          this.addTeacherForm
        );
        this.addTeacherForm = "";
      } catch (e) {
        console.log(e);
      }
    },
    async addTeacherCollege() {
      try {
        await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/manage-teacher-college/`,
          this.addTeacherForm
        );
      } catch (e) {
        console.log(e);
      }
    },
    async deleteTeacherCollege() {
      this.isDeleteTeacherCollegeFormOpen =
        !this.isDeleteTeacherCollegeFormOpen;
      try {
        await axios.delete(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/manage-teacher-college/${this.deleteTeacherFormData.id}`
        );
      } catch (e) {
        console.log(e);
      }
    },
    async getTeachersInClassroom(slug) {
      console.log(slug);
      const classroomTeacherListResp = await axios.get(
        `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${slug}/manage-teacher/`
      );
      this.classroomTeacherList = classroomTeacherListResp.data;
      console.log(classroomTeacherListResp.data);
    },
    async deleteTeacherClassroom() {
      this.isDeleteTeacherClassroomFormOpen =
        !this.isDeleteTeacherClassroomFormOpen;
      try {
        await axios.delete(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${this.classroomSlug}/manage-teacher/${this.deleteTeacherClassroomFormData.id}/`
        );
      } catch (e) {
        console.log(e);
      }
    },
    async addStudent() {
      this.isStudentAddFormOpen = !this.isStudentAddFormOpen;
      try {
        await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${this.classroomSlug}/manage-student/`,
          this.addStudentForm
        );
      } catch (e) {
        console.log(e);
      }
    },
    async getStudentsInClassroom(slug) {
      console.log(slug);
      const classroomStudentListResp = await axios.get(
        `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${slug}/manage-student/`
      );
      this.classroomStudentList = classroomStudentListResp.data;
      console.log(classroomStudentListResp.data);
    },
    async deleteStudentClassroom() {
      this.isDeleteStudentClassroomFormOpen =
        !this.isDeleteStudentClassroomFormOpen;
      console.log(this.deleteStudentClassroomFormData.id);
      try {
        await axios.delete(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${this.classroomSlug}/manage-student/${this.deleteStudentClassroomFormData.id}/`
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
