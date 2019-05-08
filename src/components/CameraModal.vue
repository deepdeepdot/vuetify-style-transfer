
<template>
  <v-layout row justify-center>

    <v-dialog v-model="dialog" persistent max-width="700" max-height="600">
      <v-card>
        <v-card-title class="headline">Take a snapshot!</v-card-title>

        <video id="webcam-video" class="centered" width="500" height="375"></video>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="snap">Snap!!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>

import CameraCapture from '../lib/camera';

let cameraCapture = new CameraCapture('webcam-video');

export default {
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    captureImage: function(image) {
      cameraCapture.setImageDestination(image);
      this.dialog = true;
    },
    snap: async function() {
      await cameraCapture.captureImageFromCamera();
      setTimeout(() => {
        this.dialog = false;
      }, 300);
    }
  },
  watch: {
    dialog: function(newValue, oldValue) {
      if (newValue) {
        cameraCapture.activate();
      } else {
        cameraCapture.deactivate();
      }
    }
  }
}

</script>