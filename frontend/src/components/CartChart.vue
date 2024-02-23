<template>
  <div>
    <ApexChart
      v-if="ready"
      :options="chartOptions"
      :series="series"
    ></ApexChart>
  </div>
</template>

<script>
import ApexChart from "vue3-apexcharts";

export default {
  name: "CartChart",
  components: { ApexChart },
  data() {
    return {
      ready: false,
      chartOptions: {
        chart: { type: "donut" },
        labels: [],
        fill: { type: "gradient" },
      },
      series: [],
    };
  },
  mounted() {
    fetch("/cart?limit=1000", {
      method: "GET",
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            const productSoldCounts = {};

            data.forEach((cart) =>
              cart.cartItems.forEach((item) => {
                const { productName, count } = item;
                if (!productSoldCounts[productName]) {
                  productSoldCounts[productName] = count;
                } else {
                  productSoldCounts[productName] += count;
                }
              })
            );

            const productSoldArray = Object.entries(productSoldCounts).map(
              ([productName, totalSoldCount]) => ({
                productName,
                totalSoldCount,
              })
            );

            this.series = productSoldArray.map(
              (product) => product.totalSoldCount
            );
            this.chartOptions.labels = productSoldArray.map(
              (product) => product.productName
            );
            this.ready = true;
          })
          .catch((err) => console.error(err.message));
      })
      .catch((err) => console.error(err.message));
  },
};
</script>
