<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent width="580">
      <div>
          <v-toolbar
            color="pink"
            dark
          >
            <v-toolbar-title>Take a Snapshot!!</v-toolbar-title>
          </v-toolbar>

          <v-card>
            <v-container
              fluid
              grid-list-lg
            >
              <v-layout row wrap>

                <v-flex xs12 class="centered">
                    <video ref="webcam-video" width="500" height="375"></video>
                </v-flex>

                <v-flex xs12>
                  <v-card flat>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
                      <v-btn color="primary" @click="snap">Snap!!</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card>

        </div>
    </v-dialog>
  </v-layout>
</template>

<script>

import CameraCapture from '@/lib/CameraCapture';

export default {
  data () {
    return {
      dialog: false,
      cameraCapture: null,
    }
  },
  mounted() {
    let video = this.$refs['webcam-video'];
    this.cameraCapture = new CameraCapture(video);
  },
  methods: {
    reportError(err) {
      alert(err);
    },
    async openCameraModal(image) {
      let { cameraCapture } = this;
      cameraCapture.setImageDestination(image);
      try {
        await cameraCapture.activate();
      } catch (e) {
        this.reportError("An error occurred: " + e);
      }
      this.dialog = true;
    },
    snap() {
      this.cameraCapture.captureImageFromCamera();
      setTimeout(() => {
        this.dialog = false;
      }, 300);
    }
  },
  watch: {
    dialog(show /*, oldValue */) {
      if (!show) {
        this.cameraCapture.deactivate();
      }
    }
  }
}

</script>

<style>

video {
  border: 2px solid lime;
  margin: auto;
}

.centered > * {
  display: flex;
}

</style>
