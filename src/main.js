import Vue from "vue";
import "@babel/polyfill"
import { Datetime } from 'vue-datetime'
import VueTippy, { TippyComponent } from "vue-tippy";
import 'vue-datetime/dist/vue-datetime.css'
import "../public/assets/css/style.css";
import "./config/msgs";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from "./App.vue";
import router from "./router";
import Chat from './components/templates/Chat'
import store from "./store"
import { getAtendimentos } from "./services/atendimentos"

Vue.use(Datetime)
Vue.use(VueTippy)
Vue.component("tippy", TippyComponent)
Vue.config.productionTip = false;

var app = new Vue({
  router,
  store,
  Chat,
  render: h => h(App),
  created: () => {
    let baseUrl = ''
    if(window.location.hostname == 'localhost'){
      baseUrl = 'https://linux03'
    }else{
      baseUrl = 'https://'+window.location.hostname
    }

    store.dispatch('setURL', `${baseUrl}/im/atdHumano/middleware/atd_api.php/`)
  },
  mounted() {
    store.dispatch('setCaso', 206)
    getAtendimentos(this)
  }
}).$mount("#app");
