<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Arbitrary Style Transfer in the Browser</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://reiinakano.github.io/arbitrary-image-stylization-tfjs/" target="_blank">
        <span class="mr-2">Based on Reiichiro Nakano</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <Tabs/>
    </v-content>
  </v-app>
</template>

<script>
import StylizePanelLayout from "./components/StylizePanelLayout";
import Cards from "./test/Cards";
import GridLayout from "./test/GridLayout";
// import CameraModal from "./components/CameraModal";
import Tabs from "./components/Tabs";

export default {
  name: "App",
  components: {
    StylizePanelLayout,
    GridLayout,
    Cards,
    Tabs,
  },
  data: function() {
    return {};
  }
};
</script>
