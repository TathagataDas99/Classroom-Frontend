import axios from "axios";

// axios.defaults.baseURL = "https://lms-classroom-api.herokuapp.com"; //TODO:uncomment this
axios.defaults.baseURL = "http://localhost:8000/"; //TODO: Comment in production

// axios.defaults.headers.common["Authorization"] =
//   "JWT " + sessionStorage.getItem("token");
axios.defaults.timeout = 10000;