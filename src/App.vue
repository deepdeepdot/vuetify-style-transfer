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
      <StylizePanelLayout/>
    </v-content>
  </v-app>
</template>

<script>
import StylizePanelLayout from "./components/StylizePanelLayout";

export default {
  name: "App",
  components: {
    StylizePanelLayout
  },
  data: function() {
    return {};
  }
};
</script>
