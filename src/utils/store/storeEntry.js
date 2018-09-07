import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

import stores from './store.js';

let store = new Vuex.Store(stores);

export default store;