import Vue from 'vue';
import ElementUi from 'element-ui';
import Vuex from 'vuex';


//一、VUE的扩展
Vue.use(Vuex);
Vue.use(ElementUi);

import App from './App.vue';

//二、实例的扩展管理
import router from './utils/router/routerEntry.js';         //路由
import store from './utils/store/storeEntry.js';            //状态管理


//三、应用的全局样式
import 'element-ui/lib/theme-chalk/index.css';
import './css/awesome/css/font-awesome.min.css';
import './css/caresSym.scss';
import './css/cares-element.scss';

import pagination from './components/pagination.vue';
Vue.component('Pagination',pagination);


//五、创建实例
new Vue({
    el:"#App",
    store,
    router,
    render:(h)=>h(App),
})