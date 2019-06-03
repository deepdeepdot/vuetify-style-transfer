import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        style: '',
        transform: '',
        styleTransfer: null,
    },
    mutations: {
        styleUpdate(state, style) {
            state.style = style;
        },
        transformUpdate(state, transform) {
            state.transform = transform;
        },
        styleTransferUpdate(state, styleTransfer) {
            state.styleTransfer = styleTransfer;
        }
    }
})

export default store;