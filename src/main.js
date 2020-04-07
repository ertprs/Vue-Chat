import Vue from "vue";
import "@babel/polyfill"

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import "../public/assets/css/style.css";
import "./config/msgs";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import App from "./App.vue";
import router from "./router";

import Formulario from './components/templates/Formulario'
import Chat from './components/templates/Chat'

import store from "./config/store"

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  Chat,
  Formulario,
  render: h => h(App)
}).$mount("#app");