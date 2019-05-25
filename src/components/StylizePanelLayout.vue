<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 v-bind="{['sm6']: twoStyles && canFitInSingleRow }">
          <ImageInput
            ref="styleImgA"
            sliderLabel="Style image A size"
            imgUrl="/images/stripes.jpg"
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
            imgUrl="/images/clouds.jpg"
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
                  imgUrl="/images/chicago.jpg"
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
                  :styleTransfer="styleTransfer"
                  :buttonLabel="twoStyles? 'Combine Styles' : 'Stylize'"
                  sliderLabel="Stylization Ratio"
                  @styleAction="transferStyle"
                  @modelLoaded="enableStylizeButtons"
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
          ref="select-file"
          accept="image/x-png, image/gif, image/jpeg"
          class="invisible"
        />
        <input
          type="file"
          ref="shoot-photo"
          accept="image/*"
          capture="camera"
          class="invisible"
        />
      </v-layout>
    </v-container>
    <div class="stylize-panel-layout-filler"></div>
  </v-card>
</template>

<script>
import ImageInput from './ImageInput';
import StylizeControl from './StylizeControl';
import CameraModal from './CameraModal';
import links from './links';
import {
    loadImageFromFile,
    loadImageFromFileSelect,
    resizeImageToDestination,
} from '@/lib/ImageUtils';

const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

const StylizePanelLayout = {
  name: 'StylizePanelLayout',
  components: {
    ImageInput,
    StylizeControl,
    CameraModal
  },
  props: {
    twoStyles: Boolean,
    styleTransfer: Object
  },
  data() {
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
    getStyleControl() {
      return this.$refs['styleControl'];
    },
    reportStatus(msg) {
        this.getStyleControl().stylizeButtonLabel = msg;
    },
    initializeModels() {
      this.getStyleControl().initializeModels();
    },
    enableStylizeButtons() {
      let readyMsg = this.twoStyles? 'Combine Styles' : 'Stylize';
      this.reportStatus(readyMsg);
      this.getStyleControl().enableStylizeButtons();
    },
    disableStylizeButtons() {
      this.getStyleControl().disableStylizeButtons();
    },
    imageSizeChanged( /* unused: size, idx */) {
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
    updateImageSource(selected, idx) {
      let mapping = ['styleImgA', 'styleImgB', 'contentImg'],
          image = this.$refs[mapping[idx]].$refs['image'],
          randomNumber,
          fileSelect,
          url;

      image.crossOrigin = 'Anonymous'; // for tensorflow

      switch (selected) {
        case 'Take a picture':
          if (isMobile) {
            let shootPhoto = this.$refs['shoot-photo'];
            shootPhoto.onchange = function shootPhoto(evt) {
              let file = evt.target.files[0];
              loadImageFromFile(file, image, { width: 320 });
            };
            shootPhoto.click();
          } else {
            this.$refs['modal-camera'].openCameraModal(image);
          }
          break;
        case 'Select from file':
          fileSelect = this.$refs['select-file'];
          loadImageFromFileSelect(image, fileSelect, isMobile? {width: 320}:null);
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
    async transferStyle() {
      let refs = this.$refs,
          styleImgA = refs['styleImgA'].$refs['image'],
          contentImg = refs['contentImg'].$refs['image'],
          slider = refs['styleControl'].$refs['slider'],
          styleRatio = slider.value ? slider.value / 100 : 1,
          params;

      let reportStatus = this.reportStatus;

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
        this.enableStylizeButtons();
      }
    }
  }
};

export default StylizePanelLayout;

</script>

<style>

.stylize-panel-layout-filler {
  display: block;
  height: 50px important!;
}

.invisible {
  display: none;
}

</style>
