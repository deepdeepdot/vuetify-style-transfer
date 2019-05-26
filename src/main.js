import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  options: {
    customProperties: true // to allow CSS variables for theme colors
  },
  theme: {
    primary: '#e91e63',
    secondary: '#673ab7',
    accent: '#9c27b0',
    error: '#f44336',
    warning: '#2196f3',
    info: '#3f51b5',
    success: '#00bcd4',
    lightBackground: '#eec'
  },
  iconfont: 'md',
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
