<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6>
          <ImageInput
            imgUrl="https://cdn.vuetifyjs.com/images/cards/road.jpg"
            sliderLabel="Style image A size"
            :items="items"
          />
        </v-flex>

        <v-flex d-flex xs12 sm6>
          <ImageInput
            imgUrl="https://cdn.vuetifyjs.com/images/cards/house.jpg"
            sliderLabel="Style image B size"
            :items="items"
          />
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card flat>
                <ImageInput
                  imgUrl="https://cdn.vuetifyjs.com/images/cards/plane.jpg"
                  sliderLabel="Content image size"
                  :items="items"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs12>
          <v-layout row justify-center>
            <v-flex xs12 sm6>
              <v-card color="lime" class="white--text" height="200px">
                <StylizeControl
                  buttonLabel="Combine Styles"
                  sliderLabel="Stylization Ratio"
                  :items="items"
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

    </v-container>
  </v-card>
</template>

<script>
import ImageInput from "./ImageInput";
import StylizeControl from "./StylizeControl";

export default {
  name: "StylizePanelLayout",
  components: {
    ImageInput,
    StylizeControl
  },
  data: function() {
    return {
      items: ["Take a picture", "Select from file", "Fizz", "Buzz"]
    };
  },
};
</script>
