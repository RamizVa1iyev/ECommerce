import "@fontsource/roboto/index.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  ssr: true,
  components,
  directives,
  icons: { iconfont: "mdi" },
});

// Router
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Dashboard },
    { path: "/persons", component: PersonsLister },
    { path: "/projects", component: ProjectsLister },
    { path: "/map", component: ProjectsMap },
    { path: "/chat", component: Chat },
  ],
});

createApp(App).mount("#app");
