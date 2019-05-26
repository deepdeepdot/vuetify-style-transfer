<template>
  <v-card flat>
    <div class="filler"></div>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-layout row justify-center>
              <img ref='image'
                    :src='imgUrl'
              >
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-card class="image-controls">
              <v-container>
                <v-layout row wrap>

                  <v-flex xs12>
                    <v-layout v-if="isDesktop()">
                      <v-flex>
                      <v-slider
                          v-model='slider'
                          min=100
                          max=500
                          :label='sliderLabel'
                      ></v-slider>
                      </v-flex>

                      <v-flex xs1 v-if="showForceSquare">
                        <v-tooltip bottom >
                          <template v-slot:activator="{ on }">
                            <v-checkbox v-on="on"
                              v-model="checkbox"
                              @change="updateImageSize()"
                            ></v-checkbox>
                          </template>
                          <span>Force image to square</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12>
                    <v-select
                      label='Select content'
                      v-model="selected"
                      :items='contentSourceOptions'
                      @change='setSelectedImage($event)'
                    >
                    </v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>

function idToLabel(id) {
  return id.split('_').map(
    word => word[0].toUpperCase() + word.substr(1)
  ).join(' ');
}

const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

export default {
  props: {
    imgUrl: String,
    options: Array,
    showForceSquare: Boolean,
    sliderLabel: String,
  },
  data: () => ({
    checkbox: false,
    selected: null,
    slider: 320,
  }),
  mounted() {
    this.updateImageSize();
  },
  computed: {
    contentSourceOptions() {
      return this.options.map((id) => ({
        value: id,
        text: idToLabel(id)
      }));
    }
  },
  watch: {
    slider() {
      this.dragging();
    }
  },
  methods: {
    isDesktop() {
      return !isMobile;
    },
    dragging() {
      this.$emit('imageSizeChanged', this.slider);
      this.updateImageSize();
    },
    updateImageSize() {
      const square = this.checkbox;
      const height = this.slider;

      const img = this.$refs['image'];
      img.height = height;
      if (img.style.width) {
        // If this branch is triggered, then that means the image
        // was forced to a square using a fixed pixel value.
        img.style.width = img.height+'px';  // Fix width back to a square
      }
      if (square) {
        img.style.width = img.height + 'px';
      } else {
        img.style.width = '';
      }
    },
    setSelectedImage(event) {
      this.$emit('imageSelected', event);

      let choice = this.selected || ' ';
      /*
      // Reset selected options like:
      // 'Take a picture'
      // 'Select from file'
      // 'Random image from wikiart.org'
      //
      // This is to allow multiple choices of the same
      // (Say multiple 'Take a picture', to trigger another @change event)
      */
      let resetSelectedOptions =
        choice.split(' ').length > 1 &&
        choice[0] === choice[0].toUpperCase();

      if (resetSelectedOptions) {
        // https://stackoverflow.com/questions/48869649/clearing-select-field-automatically-after-selecting-item
        this.$nextTick(() => {
            this.selected = null;
        });
      }
    }
  }
};

</script>

<style>

.image-controls .container {
  max-width: 500px;
}

.image-controls .container .layout .flex,
.image-controls .container .layout .flex > div
{
  padding-top: 0;
  padding-bottom: 0;
}

</style>
