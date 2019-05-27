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
      <Tabs ref="tabs"/>
    </v-content>
  </v-app>
</template>

<script>
import Tabs from "./components/Tabs";
import StyleTransfer from './lib/StyleTransfer';

export default {
  name: "App",
  components: {
    Tabs,
  },
  mounted() {
    let styleTransfer = new StyleTransfer();

    let tabs = this.$refs['tabs'],
        { stylePanel1, stylePanel2 } = tabs.$refs;

    let { styleControl: styleControl2 } = stylePanel2.$refs;
    styleControl2.styleTransfer = styleTransfer;
    stylePanel2.styleTransfer = styleTransfer;

    let { styleControl } = stylePanel1.$refs;
    stylePanel1.styleTransfer = styleTransfer;
    styleControl.styleTransfer = styleTransfer;
    styleControl.initializeModels();
  },
};
</script>
