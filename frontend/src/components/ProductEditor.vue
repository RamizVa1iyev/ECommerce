<template>
  <div>
    <v-card>
      <v-card-title>{{ id ? "Edit" : "Create" }} product</v-card-title>
      <v-card-text>
        <v-form v-model="isProductValid">
          <v-text-field
            variant="solo"
            label="Name"
            v-model="product.name"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            variant="solo"
            type="number"
            label="Price"
            v-model="product.price"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            variant="solo"
            type="number"
            label="Stock Amount"
            v-model="product.stockAmount"
            :rules="[rules.required]"
          ></v-text-field>
          <v-select
            v-model="product.categoryName"
            label="Category"
            :rules="[rules.required]"
            :items="
              categories.map((category) => ({
                value: category.name,
                title: category.name,
              }))
            "
            chips
          >
          </v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="elevated"
          color="success"
          @click="add"
          :disabled="!isProductValid"
          v-if="!id"
          >Add</v-btn
        >
        <v-btn
          variant="elevated"
          color="success"
          @click="modify"
          :disabled="!isProductValid"
          v-if="id"
          >Modify</v-btn
        >
        <v-btn variant="elevated" color="error" @click="remove" v-if="id"
          >Remove</v-btn
        >
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog
        :question="'Are you sure to delete \'' + product.name + '\' ?'"
        @ok="removeReal"
        @cancel="confirmation = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import ConfirmationDialog from "./ConfirmationDialog.vue";

export default {
  name: "productEditor",
  props: ["id", "connection"],
  components: { ConfirmationDialog },
  emits: ["cancel", "dataChanged"],
  methods: {
    sendProduct() {
      this.connection.send(
        JSON.stringify({
          event: "PRODUCT",
        })
      );
    },
    add() {
      fetch("/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.product),
      })
        .then((res) => {
          res
            .json()
            .then(() => {
              this.sendProduct();
              this.$emit("dataChanged");
            })
            .catch((err) => console.error(err.message));
        })
        .catch((err) => console.error(err.message));
    },
    modify() {
      fetch("/product?_id=" + this.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.product),
      })
        .then((res) => {
          res
            .json()
            .then(() => {
              this.sendProduct();
              this.$emit("dataChanged");
            })
            .catch((err) => console.error(err.message));
        })
        .catch((err) => console.error(err.message));
    },
    remove() {
      this.confirmation = true;
    },
    removeReal() {
      this.confirmation = false;
      fetch("/product?_id=" + this.id, {
        method: "DELETE",
      })
        .then((res) => {
          res
            .json()
            .then(() => {
              this.sendProduct();
              this.$emit("dataChanged");
            })
            .catch((err) => console.error(err.message));
        })
        .catch((err) => console.error(err.message));
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  data() {
    return {
      isProductValid: false,
      rules: {
        required: (value) => !!value || "empty value is not allowed",
        validBirthDate: (value) =>
          !isNaN(new Date(value)) || "valid date required",
      },
      product: {},
      dialog: false,
      confirmation: false,
      categories: [],
    };
  },
  mounted() {
    this.categories = [
      { _id: 1, name: "Beverages" },
      { _id: 2, name: "Meat" },
      { _id: 3, name: "Vegetables" },
      { _id: 4, name: "Food" },
      { _id: 5, name: "Fruits" },
      { _id: 6, name: "Flour products" },
    ];
    if (this.id) {
      fetch("/product?_id=" + this.id, { method: "GET" })
        .then((res) => {
          res
            .json()
            .then((data) => {
              Object.assign(this.product, data);
            })
            .catch((err) => console.error(err.message));
        })
        .catch((err) => console.error(err.message));
    } else {
      this.product = {};
    }
  },
};
</script>
