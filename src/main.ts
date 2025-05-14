import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faComments,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from "./router";
import Vue3Toastify from "vue3-toastify";
import 'vue3-toastify/dist/index.css'
import { createPinia } from "pinia";

library.add(faComments, faMagnifyingGlass);
const app = createApp(App);

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
});

app.use(router);
app.use(createPinia());

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
