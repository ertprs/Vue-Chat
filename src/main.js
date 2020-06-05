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
import { mapMutations } from "vuex";
import axios from "axios"

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  Chat,
  Formulario,
  render: h => h(App),
  created: () => {
    store.commit('setURL', "https://linux03/im/atdHumano/middleware/atd_api.php/")
  },
  mounted() {
    axios({ method: 'get', url: this.$store.getters.getURL+'get-atendimento'})
      .then(response => {
        let mainData = response.data
        this.setObjAtendimentosAbertos( mainData )
        this.updateAtendimentos()
      })
      .catch(err => console.log(err))
  },
  methods: {
    ...mapMutations(["setAtendimentosAbertos"]),
    setObjAtendimentosAbertos( mainData ) {
      this.setAtendimentosAbertos( mainData.ramais )
    },
    updateAtendimentos() {
     // setInterval( this.obterAtendimentoHorarioAtual, 5000 );
    },
    obterAtendimentoHorarioAtual() {
      // let hora         = new Date().getHours()
      // hora             = hora < 10 ? "0" + hora : hora;
      // let minutos      = new Date().getMinutes()
      // minutos          = minutos < 10 ? "0" + minutos : minutos;
      // let horarioAtual = hora + ':' + minutos

      // console.log( horarioAtual )
    }
  }
}).$mount("#app");