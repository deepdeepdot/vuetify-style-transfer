<template>
  <div>
    <v-container fluid>
      <v-layout row>
        <v-slider
          ref="slider
          v-model="slider"
          :label="sliderLabel"
          thumb-label="always"
          value=100
        ></v-slider>
      </v-layout>

      <v-layout row>
        <v-flex grow>
          <v-card dark>
            <v-btn color="pink" block @click="styleAction">{{ buttonLabel }}</v-btn>
          </v-card>
        </v-flex>
        <v-flex shrink>
          <v-card dark>
            <v-btn color="pink" block>Randomize</v-btn>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex>
          <v-select :items="items" outline></v-select>
        </v-flex>
        <v-flex>
          <v-select :items="items" outline></v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "StylizeControl",
  props: ["sliderLabel", "buttonLabel", "items"],
  data: function() {
    return {
      slider: 80
    };
  },
  methods: {
    styleAction: function() {
      this.$emit('styleAction');
    }
  }
};
</script>
