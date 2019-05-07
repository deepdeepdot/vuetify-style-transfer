import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
// import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#e91e63',
    secondary: '#673ab7',
    accent: '#9c27b0',
    error: '#f44336',
    warning: '#2196f3',
    info: '#3f51b5',
    success: '#00bcd4'
  },
  iconfont: 'md',
})