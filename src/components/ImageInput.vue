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
                     style='max-width:100%'
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
                    <v-slider
                        v-model='slider'
                        :label='sliderLabel'
                        thumb-label
                    ></v-slider>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-select
                        v-model="selected"
                        @change='setSelectedImage($event)'
                        :items='selectLabels'
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
    slider: '50',
    selected: null,
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
        // https://stackoverflow.com/questions/48869649/clearing-select-field-automatically-after-selecting-item
        this.$nextTick(() => {
            this.selected = null;
        });
    }
  }
};

</script>

