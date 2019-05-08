<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6>
          <ImageInput
            ref="styleImgA"
            :imgUrl="imageUrls[0]"
            sliderLabel="Style image A size"
            :options="styleOptions"
            @imageSelected="updateInputImage($event, 0)"
          />
        </v-flex>

        <v-flex d-flex xs12 sm6>
          <ImageInput
            ref="styleImgB"
            :imgUrl="imageUrls[1]"
            sliderLabel="Style image B size"
            :options="styleOptions"
            @imageSelected="updateInputImage($event, 1)"
          />
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card flat>
                <ImageInput
                  ref="contentImg"
                  :imgUrl="imageUrls[2]"
                  sliderLabel="Content image size"
                  :options="contentOptions"
                  @imageSelected="updateInputImage($event, 2)"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card color>
                <StylizeControl
                  ref="styleControl"
                  buttonLabel="Combine Styles"
                  sliderLabel="Stylization Ratio"
                  :items="items"
                  @styleAction="transferStyle"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <canvas ref="canvas" id="canvas-single" width="400px" height="400px"></canvas>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <ModalCamera/>
          </v-layout>
        </v-flex>

      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import ImageInput from "./ImageInput";
import StylizeControl from "./StylizeControl";
import ModalCamera from "./ModalCamera";
import StyleTransfer from "../lib/StyleTransfer";

let styleTransfer = new StyleTransfer();
styleTransfer.loadMobileNetStyleModel();
styleTransfer.loadOriginalTransformerModel();

export default {
  name: "StylizePanelLayout",
  components: {
    ImageInput,
    StylizeControl,
    ModalCamera
  },
  data: function() {
    return {
      imageUrls: [
        "https://cdn.vuetifyjs.com/images/cards/road.jpg",
        "https://cdn.vuetifyjs.com/images/cards/house.jpg",
        "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
      ],
      items: ["Take a picture", "Select from file", "Fizz", "Buzz"],
      styleOptions: [ 'Select from file', 'Random image from wikiart.org',
        'udnie', 'stripes', 'bricks', 'clouds', 'towers', 'sketch', 'seaport', 'red_circles', 'zigzag'],
      contentOptions: [ 'Take a picture', 'Select from file',
        'stata', 'diana', 'golden_gate', 'beach', 'chicago', 'statue_of_liberty'],
    };
  },
  methods: {
    updateInputImage: function(selected, idx) {
      alert(selected);

      switch (selected) {
        case 'Take a picture':
          break;
        case 'Select from file':
          break;
        case 'Random image from wikiart.org':
          break;
        default:
          const url = `/images/${selected}.jpg`;
          this.$set(this.imageUrls, idx, url);
      }
    },
    transferStyle: function() {
      let styleImgA = this.$refs.styleImgA.$refs['image'],
          styleImgB = this.$refs.styleImgB.$refs['image'],
          contentImg = this.$refs.contentImg.$refs['image'],
          slider = this.$refs.styleControl.$refs['slider'],
          styleRatio = slider.value? slider.value/100 : 1;

      let params = {
        contentImg,
        styleImg: styleImgA,
        styleRatio,
        reportStatus: (msg) => console.log(msg),
        destination: this.$refs.canvas,
      };
      styleTransfer.startStyling(params);
    }
  }
};

const showCanvas = true;
if (showCanvas) {
  window.addEventListener("DOMContentLoaded", function(eventt) {
    var c = document.getElementById("canvas-single");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(0, 0, 400, 400);
  });
}
</script>

<style>
canvas {
  outline: 10px lime solid;
}
</style>
