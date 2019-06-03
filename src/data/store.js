import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        style: '',
        transform: ''
    },
    mutations: {
        styleUpdate(state, style) {
            state.style = style;
        },
        transformUpdate(state, transform) {
            state.transform = transform;
        }
    }
})

export default store;