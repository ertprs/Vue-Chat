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
      tokenManager: 'getTokenManager',
      todosAtendimentos: 'getTodosAtendimentos'
    })
  },
  mounted() {
    this.$on('atualizarAtendimentos', this.atualizarAtendimentos)
    axios({ method: 'get', url: this.$store.getters.getURL+'get-atendimento'}) // primeiro get-atendimento, sem passar parametros
      .then(response => {
        console.log('atualizar atendimentos: ', response.data)
        let mainData = response.data
        if( mainData.atendimentos != null && mainData.gerenciador != null) {
          this.setAtendimentosIniciais( mainData.atendimentos.ramais )
          mainData.atendimentos.token_atd != null ? this.setTokenAtd(mainData.atendimentos.token_atd) : this.setTokenAtd('-')
          mainData.gerenciador.token_manager != null ? this.setTokenManager( mainData.gerenciador.token_manager ) : this.setTokenManager('-')
          this.iniciarAtualizacaoDeAtendimentos()
        } else {
          alert( 'Erro ao tentar obter dados no servidor')
          console.log( mainData )
        }
      })
      .catch(err => console.log(err))
   },
  methods: {
    ...mapMutations(["setAtendimentosIniciais", "adicionarMensagem", "adicionarClienteNovo", "setTokenAtd", "setTokenManager"]),
    iniciarAtualizacaoDeAtendimentos() {
     var temporizador = setInterval( this.atualizarAtendimentos, 2000 );
    },
    atualizarAtendimentos() {
      let urlComToken = 'get-atendimento?token_atd=' + this.tokenAtd + '&token_manager=' + this.tokenManager
      axios({ method: 'get', url: this.$store.getters.getURL + urlComToken }) // segundo get-atendimendo, agora com parametros
      .then(response => {
        let mainData = response.data
        if(!mainData || !mainData.atendimentos){
          return
        }
        var arrClientesNovos = mainData.atendimentos.ramais

        //verifica se existe clientes novos
        var temClienteNovo = false
        var temMsgAntiga = false

        for (var indiceClientesNovos in arrClientesNovos) {

          if (arrClientesNovos[indiceClientesNovos]) {
            for (var indiceClientesAtuais in this.todosAtendimentos) {
              temClienteNovo = false
              if(!arrClientesNovos[indiceClientesNovos]){
                break;
              }

              if (arrClientesNovos[indiceClientesNovos].cliente.id === this.todosAtendimentos[indiceClientesAtuais].cliente.id) {
                // atualizar as mensagens de contatos já existentes
                for (var indexMsgsNovas in arrClientesNovos[indiceClientesNovos].cliente.messages) {
                  temMsgAntiga = false
                  for (var indexTodasMsgs in this.todosAtendimentos[indiceClientesAtuais].cliente.messages) {
                    if (arrClientesNovos[indiceClientesNovos].cliente.messages[indexMsgsNovas].id_msg === this.todosAtendimentos[indiceClientesAtuais].cliente.messages[indexTodasMsgs].id_msg) {
                      temMsgAntiga = true
                      indexMsgsNovas++
                    } else {
                      temMsgAntiga = false
                    }
                  }

                  // Criando novas posições nos clientes
                  arrClientesNovos[indiceClientesNovos].cliente.ativo = false
                  arrClientesNovos[indiceClientesNovos].cliente.qtdMsgNova = 0
                  arrClientesNovos[indiceClientesNovos].cliente.alertaMsgNova = false

                  if (temMsgAntiga == false) {
                    let objCliente = arrClientesNovos[indiceClientesNovos]
                    if(objCliente.cliente.ativo == false){
                      objCliente.indiceRef = indiceClientesNovos
                      objCliente.cliente.alertaMsgNova = true
                      objCliente.cliente.qtdMsgNova++
                      console.log('Obj Cliente: ', objCliente)
                    }
                    this.adicionarMensagem(objCliente)
                  }
                }
                arrClientesNovos[indiceClientesNovos].cliente.id
                indiceClientesNovos++
              } else {
                temClienteNovo = true
              }
            }
            if (temClienteNovo) {
              console.log('Adicionando Cliente Novo')
              let objCliente = arrClientesNovos[indiceClientesNovos]
              objCliente.cliente.novoContato = true
              console.log(objCliente)
              this.adicionarClienteNovo(objCliente)
              temClienteNovo = false
            }
          }
        }
      })
      .catch(err => console.log(err))
    }
  }
}).$mount("#app");