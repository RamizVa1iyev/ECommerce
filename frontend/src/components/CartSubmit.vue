<template>
  <div>
    <v-card>
      <v-card-title
        >Submit cart: Total price is
        <span style="color: red">{{ cart.price }}</span></v-card-title
      >
      <v-card-text>
        <v-form>
          <v-text-field
            label="UserName"
            :readonly="true"
            v-model="username"
          ></v-text-field>
          <div class="flex-container">
            <v-btn
              variant="text"
              size="xx-small"
              rounded="false"
              icon="mdi-image-filter-center-focus"
              @click="centerView"
            ></v-btn>
            Location (click or drag to set)
          </div>
          <VMap
            ref="vmap"
            style="height: 200px"
            :center="center"
            zoom="15"
            @click="setMarker"
          >
            <VMapIconMarker
              ref="vmarker"
              v-model:latlng="cartTest.coords"
              :icon-url="require('leaflet/dist/images/marker-icon.png')"
              :icon-retina-url="
                require('leaflet/dist/images/marker-icon-2x.png')
              "
              :icon-shadow-url="
                require('leaflet/dist/images/marker-shadow.png')
              "
              :icon-size="[28, 46]"
              :icon-anchor="[17, 46]"
              draggable
            ></VMapIconMarker>
            <VMapGoogleTileLayer />
            <VMapZoomControl />
          </VMap>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add">Submit</v-btn>
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
// import styles of vue-map-ui
import "leaflet/dist/leaflet.css";
import "vue-map-ui/dist/normalize.css";
import "vue-map-ui/dist/style.css";
import "vue-map-ui/dist/theme-all.css";

import {
  VMap,
  VMapGoogleTileLayer,
  VMapZoomControl,
  VMapIconMarker,
} from "vue-map-ui";

import common from "../mixins/common";

export default {
  name: "CartEditor",
  props: ["cart", "user"],
  components: {
    VMap,
    VMapGoogleTileLayer,
    VMapZoomControl,
    VMapIconMarker,
  },
  emits: ["cancel", "submited"],
  mixins: [common],
  methods: {
    add() {
      fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.cart),
      })
        .then((res) => {
          if (res.status === 200) {
            this.$emit("submited");
          }
        })
        .catch((err) => console.error(err.message));
    },
    cancel() {
      this.$emit("cancel");
    },
    setMarker(event) {
      this.cartTest.coords = event.latlng;
    },
    centerView() {
      this.center = this.cartTest.coords;
      this.$refs.vmap.map.flyTo(this.center);
    },
  },
  data() {
    return {
      cartTest: {
        coords: this.defaultCoords(),
      },
      center: this.defaultCoords(),
      dialog: false,
      username: "",
    };
  },
  mounted() {
    this.username = this.user.username;
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
}
.flex-container > div {
  padding: 20px;
}
</style>
