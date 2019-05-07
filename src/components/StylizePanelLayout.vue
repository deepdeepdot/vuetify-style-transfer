<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6>
          <ImageInput
            ref="styleImgA"
            imgUrl="https://cdn.vuetifyjs.com/images/cards/road.jpg"
            sliderLabel="Style image A size"
            :items="styleOptions"
          />
        </v-flex>

        <v-flex d-flex xs12 sm6>
          <ImageInput
            ref="styleImgB"
            imgUrl="https://cdn.vuetifyjs.com/images/cards/house.jpg"
            sliderLabel="Style image B size"
            :items="styleOptions"
          />
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card flat>
                <ImageInput
                  ref="contentImg"
                  imgUrl="https://cdn.vuetifyjs.com/images/cards/plane.jpg"
                  sliderLabel="Content image size"
                  :items="contentOptions"
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

// function StyleTransfer() {
//   return {
//     transfer: function() { alert('lets move it'); }
//   }
// }

let styleTransfer = new StyleTransfer();
styleTransfer.loadMobileNetStyleModel().then();
styleTransfer.loadOriginalTransformerModel();

console.log(styleTransfer.styleNet, styleTransfer.transformNet);

export default {
  name: "StylizePanelLayout",
  components: {
    ImageInput,
    StylizeControl,
    ModalCamera
  },
  data: function() {
    return {
      items: ["Take a picture", "Select from file", "Fizz", "Buzz"],
      styleOptions: [ // 'Select from file', 'Random image from wikiart.org',
        'udnie', 'stripes', 'bricks', 'clouds', 'towers', 'sketch', 'seaport', 'red_circles', 'zigzag'],
      contentOptions: [ // 'Take a picture', 'Select from file',
        'stata', 'diana', 'golden_gate', 'beach', 'chicago', 'statue_of_liberty'],
    };
  },
  methods: {
    transferStyle: function() {
      // Not pretty... but it works with composition
      let styleImgA = this.$refs.styleImgA.$refs.image;
      let styleImgB = this.$refs.styleImgB.$refs.image;
      let contentImg = this.$refs.contentImg.$refs.image;

      // styleTransfer.transfer(styleImgA, styleImgB, contentImg);
      alert('Time to have fun!' + contentImg.src);

      let styleRatio = 0.8;
      let reportStatus = (msg) => console.log(msg);
      let destination = this.$refs.canvas;

      styleTransfer.startStyling({ contentImg, styleImg: styleImgA, styleRatio, destination, reportStatus });
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
