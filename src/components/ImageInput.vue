<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-layout row justify-center>
              <v-card>
                <img ref="image" :src="imageUrl" style="max-width:100%">
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
                    <v-slider v-model="slider" :label="sliderLabel"></v-slider>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-select
                        @change="onChange($event)"
                        :items="selectLabels" label="Select content" solo
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

function idToLabels(id) {
    return id[0].toUpperCase() + id.substr(1).replace(/_/g, ' ');
}

function labelToId(label) {
    return label.toLowerCase().replace(/ /g, '_');
}

export default {
  props: ["sliderLabel", "imgUrl", "items", "doSomething"],
  data: () => ({
    slider: "",
    newImageUrl: ''
  }),
  computed: {
      imageUrl: function() {
          return this.newImageUrl || this.imgUrl;
      },
      selectLabels: function() {
          return this.items.map(idToLabels);
      }
  },
  methods: {
    onChange(event) {
        let id = labelToId(event);
        this.newImageUrl = `/images/${id}.jpg`;
        console.log(id);
    }
  }
};

</script>

