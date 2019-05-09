<template>
  <div>
    <v-container fluid>

      <v-layout row>
        <v-slider
          ref="slider"
          v-model="slider"
          :label="sliderLabel"
          thumb-label
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
          <v-select v-model="style" :items="styleOptions" @change="loadStyle($event)"></v-select>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex>
          <v-select v-model="transform" :items="transformOptions" @change="loadTransform($event)"></v-select>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
export default {
  name: "StylizeControl",
  props: ["sliderLabel", "buttonLabel"],
  data: function() {
    return {
      slider: 80,
      // TODO: Will this trigger the loadModal?
      style: "[Fast] Distilled MobileNet style model (9.6MB)",
      transform: "[Fast] Separable_conv2d transformer (2.4MB)",
      styleOptions: ["[Fast] Distilled MobileNet style model (9.6MB)", "[High quality] Original Inceptionv3 style model (36.3MB)"],
      transformOptions: ["[Fast] Separable_conv2d transformer (2.4MB)", "[High quality] Original transformer model (7.9MB)"],
    };
  },
  methods: {
    styleAction: function() {
      this.$emit('styleAction');
    },
    loadStyle: function(event) {
      let type = event.startsWith('[Fast]') ? 'MOBILE_STYLE_NET': 'INCEPTION_STYLE_NET';
      this.$emit('loadStyle', type);
    },
    loadTransform: function(event) {
      let type = event.startsWith('[Fast]') ? 'ORIGINAL_TRANSFORM_NET': 'SEPARABLE_TRANSFORM_NET';
      this.$emit('loadTransform', event);
    }
  }
};
</script>
