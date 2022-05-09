import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/css/index.css";
import "@/css/style.css";
import "./axios";
import store from "./store";

const app = createApp(App);

app.use(router);

app.use(store);

app.mount("#app");
