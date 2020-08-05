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
import { axiosTokenJWT} from "./services/axios_api"

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
    // store.commit('setTokenJWT', "asdfasfasdf")
  },
  computed: {
    ...mapGetters({
      tokenAtd: 'getTokenAtd',
      tokenManager: 'getTokenManager',
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      tokenJWT: 'getTokenJWT'
    })
  },
  mounted() {
    this.$on('atualizarAtendimentos', this.atualizarAtendimentos)
    this.atualizarAtendimentosIniciais()
  },
  methods: {
    ...mapMutations(["setAtendimentos", "setAgenda", "adicionarMensagem", "adicionarClienteNovo", "setTokenAtd", "setTokenManager"]),
    iniciarAtualizacaoDeAtendimentos() {
      var temporizador = setInterval(this.atualizarAtendimentos, 3000);
    },
    atualizarAtendimentosIniciais() {
    axios({
      method: 'get',
      url: this.$store.getters.getURL + 'get-atendimento'
    })
    .then(response => {
      // response.headers.authorization != null ? this.setTokenJWT(response.headers.authorization): this.setTokenJWT('')
      axiosTokenJWT(response.headers.authorization)
      switch(response.status) {
        case 200:
          let mainData = response.data
          mainData.gerenciador = 'teste'
          if (mainData.atendimentos != null && mainData.token_manager != null) {
            console.log(mainData.atendimentos)
            this.setAtendimentos(mainData.atendimentos)
            this.setAgenda(['Maria', 'Joao', 'Joana', 'Frederico'])
            mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('')
            mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('')
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
          },7000)
        break;
        default:
          console.log('ERRO STATUS ' + response.status + ' ' + response.statusText)
          console.log(response)
          break
      }
    })
    .catch(err => console.log(err))
    },
    atualizarAtendimentos() {
      let urlComToken = 'get-atendimento?token_atd=' + this.tokenAtd + '&token_manager=' + this.tokenManager
      axios({
        method: 'get',
        url: this.$store.getters.getURL + urlComToken
      }) // segundo get-atendimendo, agora com parametros
        .then(response => {
          // let tokenBearer = response.config.headers.authorization

          let mainData = response.data
          if (mainData.st_ret === 'OK') {
            this.atualizarClientes(mainData)
            mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('-')
            mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('-')
          } else if(mainData.st_ret === 'AVISO') {
            console.log('Nao existe clientes na fila')
            this.atualizarAtendimentosIniciais()
          } else {
            console.log(`ERRO! Status: ${response}`)
            return false
          }
        })
        .catch(err => console.log(err))
    },
    atualizarClientes: function (mainData) {
      var atendimentosServer = mainData.atendimentos
      var atendimentosLocal = this.todosAtendimentos
      var novosAtendimentos = {}

      for(var ramal_local in this.todosAtendimentos) {
        novosAtendimentos[ramal_local] = this.todosAtendimentos[ramal_local]
      }

      for(var ramal_server in atendimentosServer) {
        var temClienteNovo = true
        for(var ramal_local in this.todosAtendimentos) {
          if(atendimentosServer[ramal_server].id_cli === atendimentosLocal[ramal_local].id_cli) {
            temClienteNovo = false
          }
        }
        if(temClienteNovo) {
          novosAtendimentos[ramal_server] = atendimentosServer[ramal_server]
          novosAtendimentos[ramal_server].novoContato = true
          this.setAtendimentos(novosAtendimentos)
        } else {
          this.atualizarMensagens(atendimentosServer[ramal_server], ramal_server, novosAtendimentos)
        }
      }
    },
    atualizarMensagens: function (cliente, ramal, novosAtendimentos) {
      var aux = 0
      const seqs = novosAtendimentos[ramal].arrMsg.map(message => (message.seq)); //seq das mensagens antigas
      if(cliente.arrMsg.length > 0) {
        cliente.arrMsg.map((message)=>{ //mensagens novas
          if(!seqs.includes(message.seq)) {
            if(message.resp_msg == 'CLI') {
              aux = aux + 1
              this.$root.$emit('rolaChatClienteAtivo', cliente.id_cli)
              console.log(message)
            }
            novosAtendimentos[ramal].arrMsg.push(message)// adiciono as mensagens novas no array global
          }
        });
      }
      // novosAtendimentos[ramal].qtdMsgNova = aux + novosAtendimentos[ramal].qtdMsgNova;
      this.setAtendimentos(novosAtendimentos)

    }
  }
}).$mount("#app");