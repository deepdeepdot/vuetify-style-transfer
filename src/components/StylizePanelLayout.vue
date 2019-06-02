<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 v-bind="{['sm6']: twoStyles && canFitInSingleRow }">
          <ImageInput
            ref="styleImgA"
            sliderLabel="Style image A size"
            :imgUrl="twoStyles? '/images/seaport.jpg' : '/images/stripes.jpg'"
            :options="styleOptions"
            :showForceSquare="twoStyles"
            @imageSelected="updateImageSource($event, 0)"
            @imageSizeChanged="imageSizeChanged"
          />
        </v-flex>

        <v-flex v-if="twoStyles" d-flex xs12 v-bind="{ ['sm6']: canFitInSingleRow }">
          <ImageInput
            ref="styleImgB"
            sliderLabel="Style image B size"
            imgUrl="/images/clouds.jpg"
            :options="styleOptions"
            :showForceSquare="twoStyles"
            @imageSelected="updateImageSource($event, 1)"
            @imageSizeChanged="imageSizeChanged"
          />
        </v-flex>

        <v-flex d-flex xs12  >
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card flat>
                <ImageInput
                  ref="contentImg"
                  sliderLabel="Content image size"
                  :imgUrl="twoStyles? '/images/statue_of_liberty.jpg' : '/images/chicago.jpg'"
                  :options="contentOptions"
                  :showForceSquare="twoStyles"
                  @imageSelected="updateImageSource($event, 2)"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <canvas
              ref="canvas"
              id="canvas-single"
              width="400px"
              height="200px"
            ></canvas>
          </v-layout>
        </v-flex>
        <v-flex v-if="stylized" d-flex xs12>
          <v-layout row justify-center>
            <v-btn
              color="pink"
              dark
              @click="download"
            >Download</v-btn>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card color>
                <StylizeControl
                  ref="styleControl"
                  sliderLabel="Stylization Ratio"
                  :buttonLabel="twoStyles? 'Combine Styles' : 'Stylize'"
                  :styleTransfer="styleTransfer"
                  @styleAction="transferStyle"
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
          accept="image/x-png, image/gif, image/jpeg"
          class="invisible"
          ref="select-file"
        />
        <input
          type="file"
          accept="image/*"
          capture="camera"
          class="invisible"
          ref="take-picture"
        />
      </v-layout>
    </v-container>
    <div class="stylize-panel-layout-filler"></div>
  </v-card>
</template>

<script>
import CameraModal from './CameraModal';
import ImageInput from './ImageInput';
import StylizeControl from './StylizeControl';
import {
  downloadImageFromDataUrl,
  loadImageFromFileInput,
} from '@/lib/ImageUtils';
import links from '@/data/links';

const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

export default {
  name: 'StylizePanelLayout',
  components: {
    CameraModal,
    ImageInput,
    StylizeControl,
  },
  props: {
    twoStyles: Boolean,
    styleTransfer: Object,
  },
  data() {
    return {
      canFitInSingleRow: true,
      stylized: false,
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
        'zigzag',
      ],
      contentOptions: [
        'Take a picture',
        'Select from file',
        'stata',
        'diana',
        'golden_gate',
        'beach',
        'chicago',
        'statue_of_liberty',
      ],
    };
  },
  mounted() {
    this.styleTransfer.on('modelLoaded', () => {
      this.enableStylizeButtons();
    })
  },
  methods: {
    getStyleControl() {
      return this.$refs['styleControl'];
    },
    reportStatus(msg) {
      this.getStyleControl().stylizeButtonLabel = msg;
    },
    download() {
      let dataUrl = this.$refs['canvas'].toDataURL('image/png');
      downloadImageFromDataUrl(dataUrl, 'sample.png');
      URL.revokeObjectURL(dataUrl);
    },
    enableStylizeButtons() {
      let readyMsg = this.twoStyles? 'Combine Styles' : 'Stylize';
      this.reportStatus(readyMsg);
      this.getStyleControl().enableStylizeButtons();
    },
    disableStylizeButtons() {
      this.getStyleControl().disableStylizeButtons();
    },
    imageSizeChanged() {
      const { styleImgA, styleImgB } = this.$refs;

      if (styleImgB) {
        // TODO: revisit design for UI/UX interaction
        // check against half of window.innerWidth
        // And/or the sum of both (up to some min: 350px)
        // Simpler to test:
        this.canFitInSingleRow = styleImgA.slider < 450 && styleImgB.slider < 450;
        // UX: It does the trick, but the jumping and "out of sync" dragging is not nice
      }
    },
    updateImageSource(selected, idx) {
      let mapping = ['styleImgA', 'styleImgB', 'contentImg'],
          image = this.$refs[mapping[idx]].$refs['image'],
          randomNumber,
          fileSelect;

      image.crossOrigin = 'Anonymous'; // for tensorflow

      switch (selected) {
        case 'Take a picture':
          if (isMobile) {
            let takePicture = this.$refs['take-picture'];
            loadImageFromFileInput(takePicture, image, {width:320});
          } else {
            this.$refs['modal-camera'].openCameraModal(image);
          }
          break;
        case 'Select from file':
          fileSelect = this.$refs['select-file'];
          loadImageFromFileInput(fileSelect, image, isMobile? {width: 320}:null);
          break;
        case 'Random image from wikiart.org':
          randomNumber = Math.floor(Math.random() * links.length);
          image.src = links[randomNumber];
          break;
        default:
          image.src = `/images/${selected}.jpg`;
      }
    },
    async transferStyle() {
      let refs = this.$refs,
          contentImg = refs['contentImg'].$refs['image'],
          styleImgA = refs['styleImgA'].$refs['image'],
          slider = refs['styleControl'].$refs['slider'],
          styleRatio = slider.value ? slider.value / 100 : 1,
          params;

      let { reportStatus } = this;

      let useSingleStyle = !this.twoStyles;
      if (useSingleStyle) {
        params = {
          contentImg,
          styleImg: styleImgA,
          styleRatio,
          destination: refs.canvas,
          reportStatus,
        };
        this.disableStylizeButtons();
        await this.styleTransfer.startStyling(params);
        this.stylized = true; // show download button
        this.enableStylizeButtons();
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
        this.disableStylizeButtons();
        await this.styleTransfer.startCombining(params);
        this.stylized = true; // show download button
        this.enableStylizeButtons();
      }
    }
  }
};

</script>

<style>

.stylize-panel-layout-filler {
  display: block;
  height: 80px;
}

.invisible {
  display: none;
}

</style>
