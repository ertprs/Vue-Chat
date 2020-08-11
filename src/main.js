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
var status_gerenciador = 0 // 0 = Liberado; 1 = bloqueado
const TEMPO_ATUALIZACAO = 1000

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
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      tokenJWT: 'getTokenJWT'
    })
  },
  mounted() {
    this.buscaAtendimentos()
    this.$root.$on('buscaAtendimentos', () => {
      this.buscaAtendimentos()
    })
    this.$root.$on('bloqueiaRequest', (objMessage) => {
      this.bloqueiaRequest()
    })
    this.$root.$on('liberaRequest', (objMessage) => {
      this.liberaRequest()
    })
  },
  methods: {
    ...mapMutations([
      "setAtendimentos",
      "setAgenda",
      "adicionarMensagem",
      "adicionarClienteNovo",
      "setTokenAtd",
      "setTokenManager",
      "setCaso"
    ]),
    buscaAtendimentos() {
    axios({
      method: 'get',
      url: this.$store.getters.getURL + 'get-atendimento'
    })
    .then(response => {
      axiosTokenJWT(response.headers.authorization)
      switch(response.status) {
        case 200:
          let mainData = response.data
          if(!mainData) {
            this.adicionaCaso(200)
            return
          }
          if (mainData.atendimentos != null && mainData.token_manager != null) {
            this.setAtendimentos(mainData.atendimentos)
            this.setAgenda(['Maria', 'Joao', 'Joana', 'Frederico'])
            mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('')
            mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('')
            this.loopAtualizacaoDeAtendimentos()
          } else {
            // quando o token e valido mas nao recebemos o atendimento
            if(mainData.token_manager != null){
              this.adicionaCaso(206)
              setTimeout( function() {
                document.location.reload(true)
              },TEMPO_ATUALIZACAO)
            }else{
              console.log('Erro ao tentar obter dados no servidor')
              console.log(mainData)
              this.adicionaCaso(200)
            }
          }
          break;
        case 206:
          console.log('Status ' + response.status + ' ' + response.statusText)
          console.log('Aguardando Cliente')
          if(response.data.token_manager != null){
            this.setAgenda(['Maria', 'Joao', 'Joana', 'Frederico'])
            response.data.token_atd != null ? this.setTokenAtd(response.data.token_atd) : this.setTokenAtd('')
            response.data.token_manager != null ? this.setTokenManager(response.data.token_manager) : this.setTokenManager('')
          }

          this.adicionaCaso(206)
          var self = this
          setTimeout( function() {
            // document.location.reload(true);
            self.buscaAtendimentos()
          },TEMPO_ATUALIZACAO)
        break;
        default:
          console.log('ERRO STATUS ' + response.status + ' ' + response.statusText)
          console.log(response)
          break
      }
    })
    .catch(err => console.log(err))
    },
    adicionaCaso(caso){
      this.setCaso(caso)
    },
    loopAtualizacaoDeAtendimentos(count = 0) {
      setTimeout(async () => {
        if(this.verificaRequest()) {
          this.bloqueiaRequest()
          await this.atualizarAtendimentos()
        }
        this.loopAtualizacaoDeAtendimentos(count = count + 1)
      }, TEMPO_ATUALIZACAO);
    },
    verificaRequest() {
      if(status_gerenciador === 0) {
        return true
      } else {
        return false
      }
    },
    bloqueiaRequest() {
      status_gerenciador = 1
    },
    liberaRequest() {
      status_gerenciador = 0
    },
    async atualizarAtendimentos() {
      let urlComToken = 'get-atendimento?token_atd=' + this.tokenAtd + '&token_manager=' + this.tokenManager
      await axios({
        method: 'get',
        url: this.$store.getters.getURL + urlComToken
      }) // segundo get-atendimendo, agora com parametros
        .then(response => {
          let mainData = response.data
          // Quando chega um novo contato, o st_ret não vem, e acaba caindo no ultimo else
          if (mainData.st_ret === 'OK') {
            this.atualizarClientes(mainData)
            mainData.token_atd != null ? this.setTokenAtd(mainData.token_atd) : this.setTokenAtd('')
            mainData.token_manager != null ? this.setTokenManager(mainData.token_manager) : this.setTokenManager('')
          } else if(mainData.st_ret === 'AVISO') {
            console.log('Nao existe clientes na fila')
            this.buscaAtendimentos()
          } else {
            console.log('ERRO! Status:', response)
            // this.buscaAtendimentos()
          }
          this.liberaRequest()
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
          console.log('cliente novo: ', novosAtendimentos)
          this.setAtendimentos(novosAtendimentos)
        } else {
          this.atualizarMensagens(atendimentosServer[ramal_server], ramal_server, novosAtendimentos)
        }
      }
    },
    atualizarMensagens: function (cliente, ramal, novosAtendimentos) {
      if(novosAtendimentos[ramal].arrMsg.length > 0){ //verifica se o cliente antigo ou novo
        const seqs = novosAtendimentos[ramal].arrMsg.map(message => (message.seq)); //seq das mensagens antigas
        if(cliente.arrMsg.length > 0) {
          cliente.arrMsg.map((message)=>{ //mensagens novas
            if(!seqs.includes(message.seq)) {
              console.log('seq: ' + message.seq +   ' msg: ' + message.msg + ', tipo: ' + message.resp_msg)
              if(this.idAtendimentoAtivo !== novosAtendimentos[ramal].id_cli) {
                novosAtendimentos[ramal].alertaMsgNova = true
                if(!novosAtendimentos[ramal].qtdMsgNova){
                  novosAtendimentos[ramal].qtdMsgNova = 1;
                } else {
                  novosAtendimentos[ramal].qtdMsgNova += 1;
                }
              } else {
                if(message.resp_msg == 'CLI') {
                  console.log('main')
                  this.$root.$emit('rolaChatClienteAtivo', cliente.id_cli)
                  this.$root.$emit('atualizacao', message)
                }
              }
              // Emoji teste (retornou '??')
              // if(message.msg == '&#x1f61c;'){
              //   message.msg = '??'
              // }
              novosAtendimentos[ramal].arrMsg.push(message)// adiciono as mensagens novas no array global
            }
          });
        }
      } else { //cliente novo
        novosAtendimentos[ramal] = cliente;
        novosAtendimentos[ramal].qtdMsgNova = cliente.arrMsg.length;
        novosAtendimentos[ramal].alertaMsgNova = true
      }
      this.setAtendimentos(novosAtendimentos)
    }
  }
}).$mount("#app");