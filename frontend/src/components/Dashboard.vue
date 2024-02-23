<template>
  <v-card variant="text">
    <v-card-title>Dashboard</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <ProductChart />
        </v-col>
        <v-col cols="6">
          <CartChart />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import common from "../mixins/common";
import ProductChart from "./ProductChart.vue";
import CartChart from "./CartChart.vue";
export default {
  name: "DashboardView",
  components: { ProductChart, CartChart },
  mixins: [common],
  props: ["user"],
};
</script>

<style scoped></style>
