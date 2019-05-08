<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-layout row justify-center>
              <v-card>
                <img ref="image"
                     :src="imgUrl"
                     style="max-width:100%"
                     crossorigin="anonymous"
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
                    <v-slider
                        v-model="slider"
                        :label="sliderLabel"
                        thumb-label
                    ></v-slider>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-select
                        @change="setSelectedImage($event)"
                        :items="selectLabels"
                        item-text="text"
                        label="Select content"
                        solo
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
  props: ["sliderLabel", "imgUrl", "options"],
  data: () => ({
    slider: "",
  }),
  computed: {
      selectLabels: function() {
          return this.options.map((id) => ({
              value: id,
              text: idToLabel(id)
          }));
      }
  },
  methods: {
    setSelectedImage(event) {
        this.$emit('imageSelected', event);
    }
  }
};

</script>

