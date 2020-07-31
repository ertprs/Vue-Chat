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
    store.commit('setURL', "http://linux03/im/atdHumano/middleware/atd_api.php/")
  },
  computed: {
    ...mapGetters({
      tokenAtd: 'getTokenAtd',
      tokenManager: 'getTokenManager',
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo'
    })
  },
  mounted() {
    this.$on('atualizarAtendimentos', this.atualizarAtendimentos)
    axios({ method: 'get', url: this.$store.getters.getURL + 'get-atendimento' }) // primeiro get-atendimento, sem passar parametros
      .then(response => {
        switch(response.status) {
          case 200:
            let mainData = response.data
            mainData.gerenciador = 'teste'
            if (mainData.atendimentos != null && mainData.token_manager != null) {
              this.setAtendimentos(mainData.atendimentos)
              this.setAgenda(['Maria', 'Joao', 'Joana', 'Frederico'])
              mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('-')
              mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('-')
              this.iniciarAtualizacaoDeAtendimentos()
            } else {
              console.log('Erro ao tentar obter dados no servidor')
              console.log(mainData)
            }
            break;
          case 206:
            console.log('Status ' + response.status + ' ' + response.statusText)
            console.log('Aguardando Cliente')
            setTimeout( function() {
              document.location.reload(true);
            },2000)
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
    ...mapMutations(["setAtendimentos", "setAgenda", "adicionarMensagem", "adicionarClienteNovo", "setTokenAtd", "setTokenManager"]),
    iniciarAtualizacaoDeAtendimentos() {
      var temporizador = setInterval(this.atualizarAtendimentos, 2000);
    },
    atualizarAtendimentos() {
      // console.log('token_atd:' + this.tokenAtd)
      // console.log('token_manager:' + this.tokenManager)
      let urlComToken = 'get-atendimento?token_atd=' + this.tokenAtd + '&token_manager=' + this.tokenManager

      // let urlComToken = ''
      axios({ method: 'get', url: this.$store.getters.getURL + urlComToken }) // segundo get-atendimendo, agora com parametros
        .then(response => {
          let mainData = response.data
          if (mainData.st_ret === 'OK') {
            this.atualizarClientes(mainData)
            mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('-')
            mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('-')
          } else {
            console.log('ERRO! Status:' + mainData.st_ret)
            return false
          }
        })
        .catch(err => console.log(err))
    },
    atualizarClientes: function (mainData) {
      var atendimentosServer = mainData.atendimentos
      var atendimentosLocal = this.todosAtendimentos
      var novosAtendimentos = {}

      var testeLinkInformacoes = 1
      for(var ramal_local in this.todosAtendimentos) {
        novosAtendimentos[ramal_local] = this.todosAtendimentos[ramal_local]
        testeLinkInformacoes % 2 == 0 ? novosAtendimentos[ramal_local].url = 'https://www.wikipedia.org/' : novosAtendimentos[ramal_local].url = 'https://linux03/callcenter/bot_param.php?mku=MKUEKqjNF3MhGK0Tuok8xsA6PQJz5a9WdTrEwrGh6uOk72A'
        testeLinkInformacoes ++
      }
      for(var ramal_server in atendimentosServer) {
        var temClienteNovo = true
        for(var ramal_local in this.todosAtendimentos) {
          if(atendimentosServer[ramal_server].id_cli === atendimentosLocal[ramal_local].id_cli) {
            temClienteNovo = false
          }
        }
        if(temClienteNovo) {
          // console.log('cliente novo')
          novosAtendimentos[ramal_server] = atendimentosServer[ramal_server]
          novosAtendimentos[ramal_server].novoContato = true
          this.$store.dispatch('atualizarAtendimentos', novosAtendimentos)
        } else {
          this.atualizarMensagens(atendimentosServer[ramal_server], ramal_server, novosAtendimentos)
        }
      }
    },
    atualizarMensagens: function (cliente, ramal, novosAtendimentos) {
      var clienteLocal = this.todosAtendimentos[ramal]
      // console.log(cliente.arrMsg)
      for (var indexMsgNova in cliente.arrMsg) {
        if (indexMsgNova != 'st_ret') {
          var temMsgNova = true
          for (var indexMsgLocal in clienteLocal.arrMsg) {
            if (indexMsgLocal != 'st_ret') {
              if(clienteLocal.arrMsg[indexMsgLocal].seq === cliente.arrMsg[indexMsgNova].seq) {
                temMsgNova = false
              }
              var indexAux = indexMsgLocal
            }
          }
          if(temMsgNova) {
            if (indexAux != 'st_ret') {
              indexAux ++

              novosAtendimentos[ramal].arrMsg[indexAux] = cliente.arrMsg[indexMsgNova]
              if(this.idAtendimentoAtivo == novosAtendimentos[ramal].id_cli){
                novosAtendimentos[ramal].alertaMsgNova = false
              }else{
                novosAtendimentos[ramal].alertaMsgNova = true
                if(!novosAtendimentos[ramal].qtdMsgNova){
                  novosAtendimentos[ramal].qtdMsgNova = 1
                }else{
                  novosAtendimentos[ramal].qtdMsgNova += 1
                }
              }

              this.$store.dispatch('atualizarAtendimentos', novosAtendimentos)
            }
          }
        }
      }

    }
  }
}).$mount("#app");