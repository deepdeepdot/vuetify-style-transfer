<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 v-bind="{['sm6']: twoStyles && canFitInSingleRow }">
          <ImageInput
            ref="styleImgA"
            sliderLabel="Style image A size"
            imgUrl="http://cdn.vuetifyjs.com/images/cards/road.jpg"
            :options="styleOptions"
            @imageSelected="updateImageSource($event, 0)"
            @imageSizeChanged="imageSizeChanged($event, 0)"
            :showSquare="twoStyles"
            :resetSelectedOptions="resetOptions"
          />
        </v-flex>

        <v-flex v-if="twoStyles" d-flex xs12 v-bind="{ ['sm6']: canFitInSingleRow }">
          <ImageInput
            ref="styleImgB"
            sliderLabel="Style image B size"
            imgUrl="http://cdn.vuetifyjs.com/images/cards/house.jpg"
            :options="styleOptions"
            @imageSelected="updateImageSource($event, 1)"
            @imageSizeChanged="imageSizeChanged($event, 1)"
            :showSquare="twoStyles"
            :resetSelectedOptions="resetOptions"
          />
        </v-flex>

        <v-flex d-flex xs12  >
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card flat>
                <ImageInput
                  ref="contentImg"
                  sliderLabel="Content image size"
                  imgUrl="http://cdn.vuetifyjs.com/images/cards/plane.jpg"
                  :options="contentOptions"
                  @imageSelected="updateImageSource($event, 2)"
                  :showSquare="twoStyles"
                  :resetSelectedOptions="resetOptions"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <canvas ref="canvas" id="canvas-single" width="400px" height="200px"></canvas>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card color>
                <StylizeControl
                  ref="styleControl"
                  :buttonLabel="twoStyles? 'Combine Styles' : 'Stylize'"
                  sliderLabel="Stylization Ratio"
                  @styleAction="transferStyle()"
                  @loadStyle="loadStyle($event)"
                  @loadTransform="loadTransform($event)"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <CameraModal ref="modal-camera"/>
          </v-layout>
        </v-flex>

        <input
          type="file"
          ref="fileSelect"
          style="display: none"
          accept="image/x-png, image/gif, image/jpeg"
        >
      </v-layout>
    </v-container>
    <div class="filler"></div>
  </v-card>
</template>

<script>
import ImageInput from './ImageInput';
import StylizeControl from './StylizeControl';
import CameraModal from './CameraModal';

import StyleTransfer from '../lib/StyleTransfer';
import links from './links';

let styleTransfer = new StyleTransfer();
styleTransfer.loadMobileNetStyleModel();
styleTransfer.loadOriginalTransformerModel();

function loadImageFromFile(image, fileSelect) {
  fileSelect.onchange = evt => {
    let f = evt.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = e => {
      image.crossOrigin = "anonymous";
      image.src = e.target.result;
    };
    fileReader.readAsDataURL(f);
    fileSelect.value = '';
  };
  fileSelect.click();
}

const StylizePanelLayout = {
  name: 'StylizePanelLayout',
  components: {
    ImageInput,
    StylizeControl,
    CameraModal
  },
  props: {
    twoStyles: Boolean
  },
  data: function() {
    return {
      canFitInSingleRow: true,
      resetOptions: [
        'Random image from wikiart.org',
        'Select from file',
        'Take a picture',
      ],
      styleOptions: [
        'Select from file',
        'Random image from wikiart.org',
        'udnie',
        'stripes',
        'bricks',
        'clouds',
        'towers',
        'sketch',
        'seaport',
        'red_circles',
        'zigzag'
      ],
      contentOptions: [
        'Take a picture',
        'Select from file',
        'stata',
        'diana',
        'golden_gate',
        'beach',
        'chicago',
        'statue_of_liberty'
      ],
    };
  },
  methods: {
    imageSizeChanged: function(size, idx) {
      const styleImgA = this.$refs['styleImgA'];
      const styleImgB = this.$refs['styleImgB'];

      if (styleImgB) {
        // check against half of window.innerWidth
        // And/or the sum of both (up to some min: 350px)

        // Simpler to test:
        this.canFitInSingleRow = styleImgA.slider < 450 && styleImgB.slider < 450;
        // It does the trick, but the jumping and "out of sync" dragging is not nice
      }
    },
    updateImageSource: function(selected, idx) {
      let mapping = ['styleImgA', 'styleImgB', 'contentImg'],
          image = this.$refs[mapping[idx]].$refs['image'],
          randomNumber,
          fileSelect,
          url;

      switch (selected) {
        case 'Take a picture':
          this.$refs['modal-camera'].captureImage(image);
          break;
        case 'Select from file':
          fileSelect = this.$refs['fileSelect'];
          loadImageFromFile(image, fileSelect);
          break;
        case 'Random image from wikiart.org':
          randomNumber = Math.floor(Math.random() * links.length);
          url = links[randomNumber];
          image.src = url;
          break;
        default:
          url = `/images/${selected}.jpg`;
          image.src = url;
      }
    },
    transferStyle: function() {
      let refs = this.$refs,
          styleImgA = refs.styleImgA.$refs['image'],
          contentImg = refs.contentImg.$refs['image'],
          slider = refs.styleControl.$refs['slider'],
          styleRatio = slider.value ? slider.value / 100 : 1,
          params;

      let reportStatus = function(msg) {
        refs.styleControl.newButtonLabel = msg;
      }

      const useSingleStyle = !this.twoStyles;
      if (useSingleStyle) {
        params = {
          contentImg,
          styleImg: styleImgA,
          styleRatio,
          destination: refs.canvas,
          reportStatus,
        };
        styleTransfer.startStyling(params).then(() => {
          reportStatus('Stylize');
        });
      }
      else {
        let styleImgB = refs.styleImgB.$refs['image'];
        params = {
          combContentImg: contentImg,
          combStyleImg1: styleImgA,
          combStyleImg2: styleImgB,
          combStyleRatio: styleRatio,
          destination: refs.canvas,
          reportStatus,
        };
        styleTransfer.startCombining(params).then(() => {
          reportStatus('Combine Styles');
        });
      }
    },
    loadStyle: function(name) {
      if (name == 'MOBILE_STYLE_NET') {
        styleTransfer.loadMobileNetStyleModel();
      } else {
        styleTransfer.loadInceptionStyleModel();
      }
    },
    loadTransform: function(name) {
      if (name == 'ORIGINAL_TRANSFORM_NET') {
        styleTransfer.loadOriginalTransformerModel();
      } else {
        styleTransfer.loadSeparableTransformerModel();
      }
    }
  }
};

export default StylizePanelLayout;

</script>

<style>

.filler {
  display: block;
  height: 50px important!;
}

</style>
