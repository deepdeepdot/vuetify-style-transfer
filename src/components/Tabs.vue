<template>
  <div>
    <v-tabs
      grow
    >
      <v-tab :key="1" ripple>
        Stylize an image
      </v-tab>
      <v-tab :key="2" ripple>
        Combine two styles
      </v-tab>

      <v-tabs-items v-model="active"
        :touchless="true"
      >
        <v-tab-item :key="1">
          <v-card flat>
            <StylizePanelLayout/>
          </v-card>
        </v-tab-item>

        <v-tab-item :key="2">
          <v-card flat>
            <StylizePanelLayout twoStyles/>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

    </v-tabs>

  </div>
</template>


<script>
  import StylizePanelLayout from './StylizePanelLayout'

  export default {
    data () {
      return {
        active: null,
        model: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    components: {
        StylizePanelLayout,
    },
    watch: {
      active: function() {
        console.log('active', this.active);
      },
      model: function() {
        console.log('model', this.model);
      }
    }
  }
</script>
