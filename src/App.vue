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
      <Tabs ref="tabs" :styleTransfer="styleTransfer"/>
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
  data() {
    return {
      styleTransfer: new StyleTransfer()
    }
  },
  mounted() {
    let tabs = this.$refs['tabs'],
        { stylePanel1 } = tabs.$refs,
        { styleControl } = stylePanel1.$refs;

    styleControl.initializeModels();
  },
};
</script>
