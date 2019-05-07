<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-layout row justify-center>
              <v-card>
                <img :src="imgUrl" style="max-width:100%">
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
                    <v-select :items="items" label="Select content" outline></v-select>
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
export default {
  props: ["sliderLabel", "imgUrl", "items"],
  data: () => ({
    slider: ""
  })
};

</script>

