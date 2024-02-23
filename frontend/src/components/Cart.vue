<template>
  <div v-if="checkIfInRole(user, [0, 1])">
    <v-card variant="text">
      <v-card-title>Cart</v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row v-if="showAlert">
            <v-alert
              type="success"
              title="Thank you"
              text="Your order successfully submited. Thank you for using our system"
            ></v-alert>
          </v-row>
          <v-row>
            <v-col style="font-size: large">
              Total price of cart is {{ cart.price }}
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
      <v-card-text>
        <v-table density="compact" hover>
          <thead>
            <tr>
              <th class="text-left">Product Name</th>
              <th class="text-left">Count</th>
              <th class="text-left">Price</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cartItem, index) in cart.cartItems" :key="index">
              <td>{{ cartItem.productName }}</td>
              <td>{{ cartItem.count }}</td>
              <td>{{ cartItem.price }}</td>
              <v-snackbar :timeout="2000" color="red" rounded="pill">
                <template v-slot:activator="{ props }">
                  <td>
                    <button
                      v-bind="props"
                      @click="removeFromCart(cartItem, cart)"
                    >
                      <v-icon icon="mdi-cart-off"></v-icon>
                    </button>
                  </td>
                </template>

                {{ cartItem.productName }} removed from cart
              </v-snackbar>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="elevated"
          color="success"
          @click="
            () => {
              submit = true;
            }
          "
          v-if="checkIfInRole(user, [0, 1]) && cart.cartItems.length > 0"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="submit" width="50%">
      <CartSubmit
        :cart="cart"
        :user="user"
        @cancel="cancel"
        @submited="submited(cart)"
      />
    </v-dialog>
  </div>
</template>

<script>
import common from "../mixins/common";
import CartSubmit from "./CartSubmit.vue";

export default {
  name: "CartView",
  props: ["cart", "user"],
  mixins: [common],
  methods: {
    removeFromCart(cartItem, cart) {
      let productPrice = cartItem.price / cartItem.count;
      const indexToRemove = cart.cartItems.findIndex(
        (item) => item.productName === cartItem.productName
      );
      if (cartItem.count === 1) {
        cart.cartItems.splice(indexToRemove, 1);
      } else {
        cart.cartItems[indexToRemove].count--;
        cart.cartItems[indexToRemove].price -= productPrice;
      }
      cart.price -= productPrice;
      localStorage.setItem(this.user.username + ".cart", JSON.stringify(cart));
    },
    cancel() {
      this.submit = false;
    },
    submited(cart) {
      this.submit = false;
      cart.cartItems = [];
      cart.price = 0;
      localStorage.setItem(this.user.username + ".cart", JSON.stringify(cart));
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    },
  },
  data() {
    return {
      search: "",
      submit: false,
      showAlert: false,
    };
  },
  components: { CartSubmit },
};
</script>
