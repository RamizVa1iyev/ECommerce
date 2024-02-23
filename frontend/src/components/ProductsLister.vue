<template>
  <div>
    <v-card variant="text">
      <v-card-title>Products</v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                variant="solo"
                label="Search"
                v-model="search"
                @input="retrieve"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                variant="solo"
                type="number"
                label="Skip"
                v-model="skip"
                @input="retrieve"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                variant="solo"
                type="number"
                label="Limit"
                v-model="limit"
                @input="retrieve"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
      <v-card-text>
        <v-table density="compact" hover>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Category Name</th>
              <th class="text-left">Price</th>
              <th class="text-left">Stock Amount</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) in products"
              :key="index"
              @click="checkIfInRole(user, [0]) && click(product)"
            >
              <td>{{ product.name }}</td>
              <td>{{ product.categoryName }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.stockAmount }}</td>
              <v-snackbar
                v-if="checkIfInRole(user, [0, 1])"
                :timeout="2000"
                color="green"
                rounded="pill"
              >
                <template v-slot:activator="{ props }">
                  <td>
                    <button
                      v-bind="props"
                      @click="
                        (e) =>
                          addToCart(
                            e,
                            cart,
                            user.username,
                            product.name,
                            product.price
                          )
                      "
                    >
                      <v-icon icon="mdi-cart-plus"></v-icon>
                    </button>
                  </td>
                </template>

                {{ product.name }} added to cart
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
          @click="add"
          v-if="checkIfInRole(user, [0])"
          >Add</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="editor" width="50%">
      <ProductEditor
        :id="id"
        @dataChanged="retrieve"
        @cancel="cancel"
        :connection="connection"
      />
    </v-dialog>
  </div>
</template>

<script>
import common from "../mixins/common";
import ProductEditor from "./ProductEditor.vue";

export default {
  name: "ProductsLister",
  components: { ProductEditor },
  props: ["user", "cart"],
  mixins: [common],
  methods: {
    retrieve() {
      this.id = null;
      this.editor = false;
      fetch(
        "/product?search=" +
          this.search +
          "&skip=" +
          this.skip +
          "&limit=" +
          this.limit,
        {
          method: "GET",
        }
      )
        .then((res) => {
          res
            .json()
            .then((data) => {
              this.products = data;
            })
            .catch((err) => console.error(err.message));
        })
        .catch((err) => console.error(err.message));
    },
    add() {
      this.id = null;
      this.editor = true;
    },
    click(row) {
      this.id = row._id;
      this.editor = true;
    },
    cancel() {
      this.id = null;
      this.editor = false;
    },
    addToCart(e, cart, userName, productName, price) {
      e.stopPropagation();
      let found = false;
      cart.userName = userName;
      cart.cartItems.forEach((cartItem) => {
        if (cartItem.productName === productName) {
          cartItem.count++;
          cartItem.price += price;
          found = true;
        }
      });
      if (!found) {
        cart.cartItems.push({
          productName: productName,
          count: 1,
          price: price,
        });
      }
      cart.price += price;
      localStorage.setItem(this.user.username + ".cart", JSON.stringify(cart));
    },
  },
  data() {
    return {
      connection: null,
      editor: false,
      products: [],
      id: null,
      search: "",
      skip: 0,
      limit: 10,
    };
  },
  mounted() {
    this.connection = new WebSocket(
      "ws://" + window.location.host + "/websocket"
    );
    this.connection.onopen = () => {
      console.log("Websocket connection established");
      setTimeout(
        () =>
          this.connection.send(
            JSON.stringify({
              event: "INIT",
              session: this.user.sessionid || null,
            })
          ),
        500
      );
    };
    this.connection.onmessage = (event) => {
      let data = {};
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error("Broken WS data", event.data);
        return;
      }
      if (data.event == "PRODUCT") {
        fetch(
          "/product?search=" +
            this.search +
            "&skip=" +
            this.skip +
            "&limit=" +
            this.limit,
          {
            method: "GET",
          }
        )
          .then((res) => {
            res
              .json()
              .then((data) => {
                this.products = data;
              })
              .catch((err) => console.error(err.message));
          })
          .catch((err) => console.error(err.message));
      }
    };
    this.retrieve();
  },
};
</script>
