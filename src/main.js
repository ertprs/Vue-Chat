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
    axios({ method: 'get', url: this.$store.getters.getURL + 'get-atendimento' }) // primeiro get-atendimento, sem passar parametros
      .then(response => {
        // define('BAD_REQUEST',               'HTTP/1.1 400 BAD REQUEST');
        // define('ERROR_INTERN',              'HTTP/1.1 500 ERROR INTERN');
        // define('PARTIAL_CONTENT',           'HTTP/1.1 206 PARTIAL CONTENT');
        // define('REQUEST_SUCCESS',           'HTTP/1.1 200 REQUEST SUCCESS');
        // define('METHOD_NOT_ALLOWED',        'HTTP/1.1 405 METHOD NOT ALLOWED');
        // define('TOKEN_ACCESS_INVALID_KEY',  'HTTP/1.1 401 TOKEN ACCESS INVALID');
        // define('ROUTE_NOT_IMPLEMENTED',     'HTTP/1.1 501 ROUTE NOT IMPLEMENTED');
        // define('NO_RESPONSE_FOR_REQUEST',   'HTTP/1.1 444 NO RESPONSE FOR REQUEST');
        switch(response.status) {
          case 200:
            let mainData = response.data
            mainData.gerenciador = 'teste'
            if (mainData.atendimentos != null && mainData.token_manager != null) {
              this.setAtendimentosIniciais(mainData.atendimentos)
              this.setAgenda(['Maria', 'Joao', 'Joana', 'Frederico'])
              mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('-')
              mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('-')
              this.iniciarAtualizacaoDeAtendimentos()
            } else {
              console.log('Erro ao tentar obter dados no servidor')
              console.log(mainData)
            }
            break;
          default:
            console.log('ERRO STATUS ' + response.status + ' ' + response.statusText)
            console.log(response)
            break
        }
      })
      .catch(err => console.log(err))
  },
  methods: {
    ...mapMutations(["setAtendimentosIniciais", "setAgenda", "adicionarMensagem", "adicionarClienteNovo", "setTokenAtd", "setTokenManager"]),
    iniciarAtualizacaoDeAtendimentos() {
      var temporizador = setInterval(this.atualizarAtendimentos, 2000);
    },
    atualizarAtendimentos() {
      let urlComToken = 'get-atendimento?token_atd=' + this.tokenAtd + '&token_manager=' + this.tokenManager
      axios({ method: 'get', url: this.$store.getters.getURL + urlComToken }) // segundo get-atendimendo, agora com parametros
<<<<<<< HEAD
        .then(response => {
          let mainData = response.data
          if (mainData.st_ret !== 'OK') {
            console.log('ERRO! Status:' + mainData.st_ret)
            return false
          } else {
            this.atualizarMensagens(mainData)
=======
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
>>>>>>> 3833648c8193903a0ef3cb76dc0645a345d384c4
          }
        })
        .catch(err => console.log(err))
    },
    atualizarMensagens: function (mainData) {
      this.setAtendimentosIniciais(mainData.atendimentos)
    }
  }
}).$mount("#app");