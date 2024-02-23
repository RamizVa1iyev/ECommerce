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
  name: "ProductChart",
  components: { ApexChart },
  data() {
    return {
      ready: false,
      chartOptions: {
        chart: { type: "bar" },
        labels: [],
        fill: { type: "gradient" },
      },
      series: [{ name: "Products", data: [] }],
    };
  },
  mounted() {
    fetch("/product?limit=1000", {
      method: "GET",
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            const groupedCategories = data.reduce((acc, product) => {
              const { categoryName } = product;

              // If the category doesn't exist in the accumulator, create it
              if (!acc[categoryName]) {
                acc[categoryName] = {
                  count: 1,
                  products: [product],
                };
              } else {
                // If the category exists, increment the count and add the product
                acc[categoryName].count++;
                acc[categoryName].products.push(product);
              }

              return acc;
            }, {});

            // Convert the result to an array
            const resultArray = Object.entries(groupedCategories).map(
              ([categoryName, data]) => ({
                categoryName,
                count: data.count,
                products: data.products,
              })
            );
            this.series[0].data = resultArray.map((result) => result.count);
            this.chartOptions.labels = resultArray.map(
              (result) => result.categoryName
            );
            this.ready = true;
          })
          .catch((err) => console.error(err.message));
      })
      .catch((err) => console.error(err.message));
  },
};
</script>
