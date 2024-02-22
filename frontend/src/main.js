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
// import Dashboard from "./components/Dashboard.vue";
import ProductsLister from "./components/ProductsLister.vue";
// import Cart from "./components/Cart.vue";
import Chat from "./components/Chat.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // { path: "/", component: Dashboard },
    { path: "/products", component: ProductsLister },
    // { path: "/cart", component: Cart },
    { path: "/chat", component: Chat },
  ],
});

createApp(App).use(vuetify).use(router).mount("#app");
