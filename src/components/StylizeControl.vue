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
            <v-btn ref="styleButton" color="pink" block @click="styleAction">{{ buttonLabelValue }}</v-btn>
          </v-card>
        </v-flex>
        <!-- <v-flex shrink>
          <v-card dark>
            <v-btn color="pink" block @click="randomize">Randomize</v-btn>
          </v-card>
        </v-flex> -->
      </v-layout>

      <v-layout row>
        <v-flex>
          <v-select ref="modelSelectStyle" v-model="style" :items="styleOptions" @change="loadStyle($event)"></v-select>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex>
          <v-select ref="modelSelectTransformer" v-model="transform" :items="transformOptions" @change="loadTransform($event)"></v-select>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
export default {
  name: "StylizeControl",
  props: {
    sliderLabel: String,
    buttonLabel: String,
  },
  data() {
    return {
      stylizeButtonLabel: null,
      slider: 70,
      style: "[Fast] Distilled MobileNet style model (9.6MB)",
      transform: "[Fast] Separable_conv2d transformer (2.4MB)",
      styleOptions: ["[Fast] Distilled MobileNet style model (9.6MB)", "[High quality] Original Inceptionv3 style model (36.3MB)"],
      transformOptions: ["[Fast] Separable_conv2d transformer (2.4MB)", "[High quality] Original transformer model (7.9MB)"],
    };
  },
  computed: {
    buttonLabelValue() {
      return this.stylizeButtonLabel || this.buttonLabel;
    }
  },
  methods: {
    styleAction() {
      this.$emit('styleAction');
    },
    randomize() {
      alert('not implemented');
    },
    loadStyle(event) {
      let type = event.startsWith('[Fast]') ? 'MOBILE_STYLE_NET': 'INCEPTION_STYLE_NET';
      this.$emit('loadStyle', type);
    },
    loadTransform(event) {
      let type = event.startsWith('[Fast]') ? 'ORIGINAL_TRANSFORM_NET': 'SEPARABLE_TRANSFORM_NET';
      this.$emit('loadTransform', type);
    },
    enableStylizeButtons() {
      this.$refs['styleButton'].disable = false;
      this.$refs['modelSelectStyle'].disable = false;
      this.$refs['modelSelectTransformer'].disable = false;
    },
    disableStylizeButtons() {
      this.$refs['styleButton'].disable = true;
      this.$refs['modelSelectStyle'].disable = true;
      this.$refs['modelSelectTransformer'].disable = true;
    }
  }
};
</script>
