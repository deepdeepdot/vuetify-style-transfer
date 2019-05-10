<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-layout row justify-center>
                <img ref='image'
                     :src='imgUrl'
                     crossorigin='anonymous'
                >
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-card flat>
              <v-container style="max-width:500px">
                <v-layout row wrap>

                  <v-flex xs12 md12>

                    <v-layout>
                      <v-flex>
                      <v-slider
                          v-model='slider'
                          :label='sliderLabel'
                          min=100
                          max=500
                      ></v-slider>
                      </v-flex>

                      <v-flex xs1 v-if="showSquare">
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
                  <v-flex xs12 md12>
                    <v-select
                        v-model="selected"
                        @change='setSelectedImage($event)'
                        :items='getItemsForSelect'
                        label='Select content'
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
        (word) => word[0].toUpperCase() + word.substr(1)
    ).join(' ');
}

export default {
  props: ['sliderLabel', 'imgUrl', 'options', 'showSquare'],
  data: () => ({
    slider: 300,
    selected: null,
    checkbox: false,
  }),
  mounted: function mounted() {
    this.updateImageSize();
  },
  computed: {
      getItemsForSelect: function() {
          return this.options.map((id) => ({
              value: id,
              text: idToLabel(id)
          }));
      }
  },
  watch: {
    slider: function() {
      this.dragging();
    }
  },
  methods: {
    dragging: function() {
      this.$emit('imageSizeChanged', this.slider);
      this.updateImageSize();
    },
    updateImageSize: function() {
      const square = this.checkbox;
      const height = this.slider;

      const img = this.$refs['image'];
      img.height = height;
      if (img.style.width) {
        // If this branch is triggered, then that means the image was forced to a square using
        // a fixed pixel value.
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
        // https://stackoverflow.com/questions/48869649/clearing-select-field-automatically-after-selecting-item
        this.$nextTick(() => {
            this.selected = null;
        });
    }
  }
};

</script>

