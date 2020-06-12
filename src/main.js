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
import { mapMutations, mapGetters } from "vuex";
import axios from "axios"

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

var app = new Vue({
  router,
  store,
  Chat,
  Formulario,
  render: h => h(App),
  created: () => {
    store.commit('setURL', "https://linux03/im/atdHumano/middleware/atd_api.php/")
  },
  computed: {
    ...mapGetters({
      tokenAtd: 'getTokenAtd',
      tokenManager: 'getTokenManager'
    })
  },
  mounted() {
    this.$on('atualizarAtendimentos', this.atualizarAtendimentos)
    axios({ method: 'get', url: this.$store.getters.getURL+'get-atendimento'}) // primeiro get-atendimento, sem passar parametros
      .then(response => {
        let mainData = response.data
        if( mainData.atendimentos != null && mainData.gerenciador != null) {
          this.setObjAtendimentosAbertos( mainData )
          mainData.atendimentos.token_atd != null ? this.setTokenAtd(mainData.atendimentos.token_atd) : this.setTokenAtd('-')
          mainData.gerenciador.token_manager != null ? this.setTokenManager( mainData.gerenciador.token_manager ) : this.setTokenManager('-')
          this.iniciarAtualizacaoDeAtendimentos()
        } else {
          alert( 'Erro ao tentar obter dados no servidor')
          console.log( mainData )
          // let mainDataTeste = {"gerenciador":{"token_manager":"MKUrPwwim4l5wwwwim4l5ww8Tmkb1TN1l5qFcQUkQ2VjYPL8tDgqa51ui8vO7AT","fila":6,"ret":0,"ag":0},"atendimentos":{"token_atd":"MKUX3xPMCc7LloGzbRpszSDrB81iQR24a0ixZpwgNNcf9Tb","ramais":[{"grupo":"HW41U1","label":"Alguma coisa","status":true,"cliente":{"id":"5516987987900","url":"https:\/\/codepen.io\/drew_mc\/pen\/oXdZNR","informacoes":{"nome":"FRANCISCO","protocolo":"46422379870","tempo_conectado":"00:10:43","tempo_fila":"00:09:25"},"messages":[{"id_cliente":5516987987900,"texto":"Ol\ufffd","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987900,"texto":"Em que posso ajudar","resp_msg":"OPE","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987900,"texto":"Eu preciso verificar meu renavam","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987900,"texto":"Okay vamos pesquisar algumas coisas pra vc","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"}]}},{"grupo":"HW41U1","label":"Alguma coisa","status":true,"cliente":{"id":"5516987987911","url":"https:\/\/codepen.io\/drew_mc\/pen\/oXdZNR","informacoes":{"nome":"ANTONIO","protocolo":"46422379871","tempo_conectado":"00:10:43","tempo_fila":"00:09:25"},"messages":[{"id_cliente":5516987987911,"texto":"Hey, como vc vai","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987911,"texto":"Eu estou tranquilo, preciso analizar meu lucro","resp_msg":"OPE","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987911,"texto":"Beleza, vou te transferir pro seu contador","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987911,"texto":"Aguarda um pouco a\ufffd blz","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"}]}},{"grupo":"HW41U1","label":"Alguma coisa","status":true,"cliente":{"id":"5516987987933","url":"https:\/\/codepen.io\/drew_mc\/pen\/oXdZNR","informacoes":{"nome":"ANA","protocolo":"46422379873","tempo_conectado":"00:10:43","tempo_fila":"00:09:25"},"messages":[{"id_cliente":5516987987933,"texto":"Hey, you","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987933,"texto":"Whats need you?","resp_msg":"OPE","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987933,"texto":"I can talk human, please","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987933,"texto":"Okay I will tranfer you to human","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"}]}},{"grupo":"HW41U1","label":"Alguma coisa","status":true,"cliente":{"id":"5516987987944","url":"https:\/\/codepen.io\/drew_mc\/pen\/oXdZNR","informacoes":{"nome":"JOSE","protocolo":"46422379874","tempo_conectado":"00:10:43","tempo_fila":"00:09:25"},"messages":[{"id_cliente":5516987987944,"texto":"Ol\u00e1","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987944,"texto":"Em que posso ajudar","resp_msg":"OPE","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987944,"texto":"Conversar com gente","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987944,"texto":"Okay em alguns instantes um de nossos Foguetes ir\u00e1 te atender","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"}]}},{"grupo":"HW41U1","label":"Alguma coisa","status":true,"cliente":{"id":"5516987987988","url":"https:\/\/codepen.io\/drew_mc\/pen\/oXdZNR","informacoes":{"nome":"PEDRO","protocolo":"46422379878","tempo_conectado":"00:10:43","tempo_fila":"00:09:25"},"messages":[]}},{"grupo":"HW41U1","label":"Alguma coisa","status":true,"cliente":{"id":"5516987987999","url":"https:\/\/codepen.io\/drew_mc\/pen\/oXdZNR","informacoes":{"nome":"LUCAS","protocolo":"46422379879","tempo_conectado":"00:10:43","tempo_fila":"00:09:25"},"messages":[{"id_cliente":5516987987999,"texto":"Oi","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987999,"texto":"Ajuda","resp_msg":"OPE","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987999,"texto":"\ufffd com pessoa","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"},{"id_cliente":5516987987999,"texto":"Okay vamos te atender","resp_msg":"CLI","data":"2020-06-04","hora":"09:07:23"}]}}]}}
          // this.setObjAtendimentosAbertos( mainDataTeste )
          // mainDataTeste.atendimentos.token_atd != null ? this.setTokenAtd(mainDataTeste.atendimentos.token_atd) : this.setTokenAtd('-')
          // mainDataTeste.gerenciador.token_manager != null ? this.setTokenManager( mainDataTeste.gerenciador.token_manager ) : this.setTokenManager('-')
          // this.iniciarAtualizacaoDeAtendimentos()

          // console.log('Usando objeto teste:')
          // console.log( mainDataTeste )
        }
      })
      .catch(err => console.log(err))
   },
  methods: {
    ...mapMutations(["setAtendimentosAbertos", "setTokenAtd", "setTokenManager"]),
    setObjAtendimentosAbertos( mainData ) {
      this.setAtendimentosAbertos( mainData.atendimentos.ramais )
    },
    iniciarAtualizacaoDeAtendimentos() {
     var temporizador = setInterval( this.atualizarAtendimentos, 2000 );
    },
    atualizarAtendimentos() {
      // let url = 'get-atendimento?token_atd=' + this.tokenAtd + '&token_manager=' + this.tokenManager
      let url = 'get-atendimento'
      axios({ method: 'get', url: this.$store.getters.getURL + url }) // segundo get-atendimendo, agora com parametros
      .then(response => {
        let mainData = response.data
        this.setObjAtendimentosAbertos( mainData )
      })
      .catch(err => console.log(err))
    }
  }
}).$mount("#app");