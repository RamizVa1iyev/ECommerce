<template>
  <v-app>
    <v-navigation-drawer
      expand-on-hover
      rail
      permanent
      v-model="showNavigation"
    >
      <v-list density="compact" nav>
        <template v-for="item in navigation" :key="item.title">
          <v-list-item
            style="position: relative"
            :href="item.href"
            :prepend-icon="item.icon"
            :title="item.title"
            exact
            v-show="checkIfInRole(user, item.roles)"
          >
            <span
              v-if="item.title == 'Cart' && this.cart?.cartItems?.length > 0"
              style="
                position: absolute;
                left: 30px;
                top: 0px;
                font-size: 10px;
                background-color: red;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                color: white;
              "
            >
              {{ this.cart?.cartItems.length }}
            </span>
          </v-list-item>
        </template>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="user.username">
        <v-list-item
          :prepend-avatar="'/uploads/' + user.username + '.jpg?' + cacheKey"
          :title="user.username"
          @click="uploadFileDialog = true"
        >
        </v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item
          key="Login"
          @click="prepareToLogin"
          prepend-icon="mdi-login"
          title="Login"
          exact
          v-if="!user.username"
        />
        <v-list-item
          key="Logout"
          @click="logoutConfirmation = true"
          prepend-icon="mdi-logout"
          title="Logout"
          exact
          v-if="user.username"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view :user="user" :cart="cart"></router-view>
    </v-main>

    <v-dialog v-model="loginDialog" width="25em">
      <Login
        @cancel="loginDialog = false"
        @loginFailed="loginDialog = false"
        @loginSuccess="login"
      />
    </v-dialog>

    <v-dialog v-model="logoutConfirmation" width="auto">
      <ConfirmationDialog
        :question="'Are you sure to logout?'"
        @ok="logout"
        @cancel="logoutConfirmation = false"
      />
    </v-dialog>

    <v-dialog v-model="uploadFileDialog" width="25em">
      <UploadFile :user="user" @close="closeUploadFileDialog" />
    </v-dialog>
  </v-app>
</template>

<script>
import common from "./mixins/common";
import Login from "./components/Login.vue";
import ConfirmationDialog from "./components/ConfirmationDialog.vue";
import UploadFile from "./components/UploadFile.vue";

export default {
  name: "App",
  components: { Login, ConfirmationDialog, UploadFile },
  mixins: [common],
  data() {
    return {
      navigation: [
        { title: "Dashboard", icon: "mdi-view-dashboard", href: "#/" },
        { title: "Products", icon: "mdi-cube-outline", href: "#/products" },
        {
          title: "Cart",
          icon: "mdi-cart-outline",
          href: "#/cart",
          roles: [0, 1],
        },
        { title: "Chat", icon: "mdi-chat-processing-outline", href: "#/chat" },
      ],
      showNavigation: false,
      user: {},
      loginDialog: false,
      logoutConfirmation: false,
      uploadFileDialog: false,
      cacheKey: Date.now(),
      cart: {},
    };
  },
  methods: {
    setUser(data) {
      this.loginDialog = false;
      Object.keys(this.user).forEach((key) => delete this.user[key]);
      Object.assign(this.user, data);
      this.$router.push("/");
      this.showNavigation = true;
      if (this.user.username) {
        this.cart = JSON.parse(
          localStorage.getItem(this.user.username + ".cart")
        );
        if (!this.cart) {
          this.cart = {
            price: 0,
            userName: "",
            cartItems: [],
          };
          localStorage.setItem(
            this.user.username + ".cart",
            JSON.stringify(this.cart)
          );
        }
      }
    },
    logout() {
      this.logoutConfirmation = false;
      this.showNavigation = false;
      fetch("/auth", { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => this.setUser(data));
    },
    prepareToLogin() {
      this.showNavigation = false;
      this.loginDialog = true;
    },
    login(data) {
      this.loginDialog = false;
      this.setUser(data);
    },
    closeUploadFileDialog() {
      this.uploadFileDialog = false;
      this.cacheKey = Date.now();
    },
  },
  mounted() {
    fetch("/auth", { method: "GET" })
      .then((res) => res.json())
      .then((data) => this.setUser(data))
      .then(() => {
        if (this.user.username) {
          this.cart = JSON.parse(
            localStorage.getItem(this.user.username + ".cart")
          );
          if (!this.cart) {
            this.cart = {
              price: 0,
              userName: "",
              cartItems: [],
            };
            localStorage.setItem(
              this.user.username + ".cart",
              JSON.stringify(this.cart)
            );
          }
        }
      });
  },
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
</style>
