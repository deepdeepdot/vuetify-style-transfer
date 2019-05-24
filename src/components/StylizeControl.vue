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

let modelLoaded = false;

export default {
  name: "StylizeControl",
  props: {
    sliderLabel: String,
    buttonLabel: String,
    styleTransfer: Object,
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
  async mounted() {
    if (modelLoaded) return;
    try {
      await this.initializeModels();
      modelLoaded = true;
      this.$emit('modelLoaded');
    } catch(e) {
      this.reportStatus(e);
    }
  },
  computed: {
    buttonLabelValue() {
      return this.stylizeButtonLabel || this.buttonLabel;
    }
  },
  methods: {
    reportStatus(msg) {
      this.stylizeButtonLabel = msg;
    },
    styleAction() {
      this.$emit('styleAction');
    },
    randomize() {
      alert('not implemented');
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
    },
    initializeModels() {
      let { loadMobileNetStyleModel, loadSeparableTransformerModel } = this.styleTransfer;
      this.disableStylizeButtons();
      return Promise.all([
        loadMobileNetStyleModel(this.reportStatus),
        loadSeparableTransformerModel(this.reportStatus),
      ]).then(() => {
        this.enableStylizeButtons();
      });
    },
    async loadStyle(event) {
      let type = event.startsWith('[Fast]') ? 'MOBILE_STYLE_NET': 'INCEPTION_STYLE_NET',
          { loadMobileNetStyleModel, loadInceptionStyleModel} = this.styleTransfer;
      
      try {
        this.disableStylizeButtons();
        if (type == 'MOBILE_STYLE_NET') {
          await loadMobileNetStyleModel(this.reportStatus);
        } else {
          await loadInceptionStyleModel(this.reportStatus);
        }
        this.enableStylizeButtons();
        this.$emit('modelLoaded');
      } catch (error) {
        this.reportStatus(error);
      }
    },
    async loadTransform(event) {
      let type = event.startsWith('[Fast]') ? 'SEPARABLE_TRANSFORM_NET' : 'ORIGINAL_TRANSFORM_NET',
          { loadOriginalTransformerModel, loadSeparableTransformerModel } = this.styleTransfer;

      try {
        this.disableStylizeButtons();
        if (type == 'ORIGINAL_TRANSFORM_NET') {
          await loadOriginalTransformerModel(this.reportStatus);
        } else {
          await loadSeparableTransformerModel(this.reportStatus);
        }
        this.enableStylizeButtons();
        this.$emit('modelLoaded');
      } catch (error) {
        this.reportStatus(error);
      }
    }
  }
};
</script>
