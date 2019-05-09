<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-layout row justify-center>
              <v-card>
                <img ref='image'
                     :src='imgUrl'
                     crossorigin='anonymous'
                >
              </v-card>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs10>
            <v-card flat>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 md12>
                    <v-checkbox
                      v-model="checkbox"
                      :label="`Force image to square: ${checkbox.toString()}`"
                      @change="updateImageSize()"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-slider
                        v-model='slider'
                        :label='sliderLabel'
                        thumb-label
                        min=200
                        max=1024
                    ></v-slider>
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
  props: ['sliderLabel', 'imgUrl', 'options'],
  data: () => ({
    slider: 400,
    selected: null,
    checkbox: false,
  }),
  mounted: function mounted() {
    // "this" is not this: undefined?
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
      // Maybe add some debouncing...
      // looks like it's not needed -> focus on dynamic layout (flexible row)
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

