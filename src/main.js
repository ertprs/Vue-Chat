import Vue from "vue";
import "@babel/polyfill"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import "../public/assets/css/style.css";
import "./config/msgs";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from "./App.vue";
import router from "./router";
import Chat from './components/templates/Chat'
import store from "./store"
import { mapGetters } from "vuex";
import axios from "axios"
import { axiosTokenJWT } from "./services/serviceAxios"
import axios_api from './services/serviceAxios'
import { carregarIframe } from "./services/serviceIframe"

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false;
var status_gerenciador = 0 // 0 = Liberado; 1 = bloqueado
var TEMPO_ATUALIZACAO = 4000

var app = new Vue({
  router,
  store,
  Chat,
  render: h => h(App),
  created: () => {
    store.dispatch('setURL', "https://linux03/im/atdHumano/middleware/atd_api.php/")
  },
  computed: {
    ...mapGetters({
      tokenAtd: 'getTokenAtd',
      tokenManager: 'getTokenManager',
      todosAtendimentos: 'getTodosAtendimentos',
      idAtendimentoAtivo: 'getIdAtendimentoAtivo',
      tokenJWT: 'getTokenJWT',
      emojis: 'getEmojis'
    })
  },
  mounted() {
    this.adicionaCaso('aguardando')
    this.buscaAtendimentos()

    this.$root.$on('busca-atendimentos', () => {
      console.log('chamando busca atendimentos pelo on')
      // this.buscaAtendimentos()
    })
  },
  methods: {
    buscaAtendimentos() {
      this.liberaRequest()
      axios({
        method: 'get',
        url: this.$store.getters.getURL + 'get-atendimento'
      })
        .then(response => {
          axiosTokenJWT(response.headers.authorization)
          switch (response.status) {
            case 200:
              var mainData = response.data
              if (!mainData) {
                console.log('IF negacao do mainData')
                alert('aqui')
                setTimeout( () => {
                  this.adicionaCaso(400)
                  this.buscaAtendimentos()
                }, TEMPO_ATUALIZACAO)
              }
              if (mainData.atendimentos != null && mainData.token_manager != null) {
                this.adicionaCaso('')

                // Percorrendo todas mensagens para transformar em emojis
                for (let atd in mainData.atendimentos) {
                  this.getRules(mainData.atendimentos[atd].token_cliente, mainData.atendimentos[atd].login_usu)
                  
                  for (let i = 0; i < mainData.atendimentos[atd].arrMsg.length; i++) {
                    let regex = ''
                    for (let j = 0; j < this.emojis.length; j++) {
                      regex = new RegExp(this.emojis[j].hexa, 'gi')
                      mainData.atendimentos[atd].arrMsg[i].msg = mainData.atendimentos[atd].arrMsg[i].msg.replace(regex, this.emojis[j].emoji)
                    }
                  }
                }

                carregarIframe(mainData.atendimentos)
                this.$store.dispatch('setAtendimentos', mainData.atendimentos)
                const agenda = ['Maria', 'Joao', 'Joana', 'Frederico']
                this.$store.dispatch('setAgenda', agenda)
                mainData.token_atd != null ? this.$store.dispatch('setTokenAtd', mainData.token_atd) : this.$store.dispatch('setTokenAtd', '')
                mainData.token_manager != null ? this.$store.dispatch('setTokenManager', mainData.token_manager) : this.$store.dispatch('setTokenManager', '')
                
                this.loopAtualizacaoDeAtendimentos()
              } else {
                if (mainData.token_manager != null) { // quando o token e valido mas nao recebemos o atendimento
                  setTimeout( () => {
                    this.adicionaCaso(206)
                    this.buscaAtendimentos()
                  }, TEMPO_ATUALIZACAO)
                } else {
                  console.log('Erro ao tentar obter dados no servidor')
                  console.log(mainData)
                  setTimeout( () => {
                    this.adicionaCaso(400)
                    this.buscaAtendimentos()
                  }, TEMPO_ATUALIZACAO)
                }
              }
              break;

            case 206:
              console.log('Status ' + response.status + ' ' + response.statusText)
              console.log('Aguardando Cliente')
              setTimeout( () => {
                this.buscaAtendimentos()
                this.adicionaCaso(206)
              }, TEMPO_ATUALIZACAO)
              break;

            default:
              console.log('ERRO STATUS ' + response.status + ' ' + response.statusText)
              console.log(response)
              this.adicionaCaso(400)
              this.reiniciarApp()
              break
          }
        })
        .catch(err =>{
          this.adicionaCaso(400)
          console.log(err)
          }
        )
    },
    reiniciarApp() {
      var self = this
      setTimeout(function () {
        document.location.reload(true);
      }, TEMPO_ATUALIZACAO)

    },
    adicionaCaso(caso) {
      this.$store.dispatch('setCaso', caso)
    },
    loopAtualizacaoDeAtendimentos(count = 0) {
      setTimeout(async () => {
        if (this.verificaRequest()) {
          this.bloqueiaRequest()
          await this.atualizarAtendimentos()
        }
        this.loopAtualizacaoDeAtendimentos(count = count + 1)
      }, TEMPO_ATUALIZACAO);
    },
    verificaRequest() {
      if (status_gerenciador === 0) {
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
      await axios_api({
        method: 'get',
        url: this.$store.getters.getURL + urlComToken
      }) // segundo get-atendimento, agora com parametros
        .then(response => {
          let mainData = response.data
          // Quando chega um novo contato, o st_ret não vem, e acaba caindo no ultimo else
          if (mainData.st_ret === 'OK' || mainData.atendimentos) {
            mainData.token_atd != null ? this.$store.dispatch('setTokenAtd', mainData.token_atd) : this.$store.dispatch('setTokenAtd', '')
            mainData.token_manager != null ? this.$store.dispatch('setTokenManager', mainData.token_manager) : this.$store.dispatch('setTokenManager', '')
            this.atualizarClientes(mainData)
          } else if (mainData.st_ret === 'AVISO') {
            console.log('Nao existe clientes na fila')
            this.adicionaCaso(206)
            setTimeout( () => {
              this.buscaAtendimentos()
            }, TEMPO_ATUALIZACAO)
          } else {
            console.log('ERRO! Status:', response)
            if(response.data){
              for(let atd in response.data){
                if(typeof response.data[atd] == 'object'){
                  if(response.data[atd].arrMsg > 0){
                    response.data[atd].novoContato = true
                    let novoAtd = new Object(),
                    chave = atd
                    novoAtd[chave] = response.data[atd]
                  }
                }
              }
            }else{
              setTimeout( () => {
                this.buscaAtendimentos()
              }, TEMPO_ATUALIZACAO)
            }
          }
          this.liberaRequest()
        })
        .catch(err => console.log(err))
    },
    atualizarClientes: function (mainData) {
      var atendimentosServer = mainData.atendimentos
      var atendimentosLocal = this.todosAtendimentos
      var novosAtendimentos = {}

      for (var ramal_local in this.todosAtendimentos) {
        novosAtendimentos[ramal_local] = this.todosAtendimentos[ramal_local]
      }

      for (var ramal_server in atendimentosServer) {
        var temClienteNovo = true
        for (var ramal_local in this.todosAtendimentos) {
          if(atendimentosServer[ramal_server] && atendimentosLocal[ramal_local]){
            if (atendimentosServer[ramal_server].id_cli === atendimentosLocal[ramal_local].id_cli) {
              temClienteNovo = false
            }
          }
        }
        if (temClienteNovo) {
          novosAtendimentos[ramal_server] = atendimentosServer[ramal_server]
          novosAtendimentos[ramal_server].novoContato = true
          console.log('cliente novo: ', novosAtendimentos)

          this.$store.dispatch('setAtendimentos', novosAtendimentos)
        } else {
          this.atualizarMensagens(atendimentosServer[ramal_server], ramal_server, novosAtendimentos)
        }
      }
    },
    atualizarMensagens: function (cliente, ramal, novosAtendimentos) {
      if (novosAtendimentos[ramal].arrMsg.length > 0) { //verifica se o cliente antigo ou novo
        const seqs = novosAtendimentos[ramal].arrMsg.map(message => (message.seq)); //seq das mensagens antigas
        if (cliente.arrMsg.length > 0) {
          cliente.arrMsg.map((message) => { //mensagens novas
            if (!seqs.includes(message.seq)) {

              // Transformando codigo hexadecimal recebido em emoji
              let regex = ''
              for (let i = 0; i < this.emojis.length; i++) {
                regex = new RegExp(this.emojis[i].hexa, 'gi')
                message.msg = message.msg.replace(regex, this.emojis[i].emoji)
              }

              novosAtendimentos[ramal].arrMsg.push(message)// adiciono as mensagens novas no array global

              console.log('seq: ' + message.seq + ' msg: ' + message.msg + ', tipo: ' + message.resp_msg)
              if (this.idAtendimentoAtivo !== novosAtendimentos[ramal].id_cli) {
                novosAtendimentos[ramal].alertaMsgNova = true
                if (!novosAtendimentos[ramal].qtdMsgNova) {
                  novosAtendimentos[ramal].qtdMsgNova = 1;
                } else {
                  novosAtendimentos[ramal].qtdMsgNova += 1;
                }
              } else {
                if (message.resp_msg == 'CLI') {
                  this.$root.$emit('rolaChatClienteAtivo', cliente.id_cli)
                  this.$root.$off('rolaChatClienteAtivo')
                  this.$root.$emit('atualizar_mensagem', message)
                  this.$root.$off('atualizar_mensagem')
                }
              }

            }
          });
        }
      } else { //cliente novo
        novosAtendimentos[ramal] = cliente;
        novosAtendimentos[ramal].qtdMsgNova = cliente.arrMsg.length;
        novosAtendimentos[ramal].alertaMsgNova = true
      }

      this.$store.dispatch('setAtendimentos', novosAtendimentos)
    },
    getRules(tokenCliente, id){

      axios_api.get(`get-rules?token_cliente=${tokenCliente}`)
        .then(response => {
          if(response.data.st_ret == 'OK'){
            const arrayRegras = response.data
            let objRegra = {
              id: id,
              regras: arrayRegras
            }
            this.$store.dispatch('setTodasRegras', objRegra)
          }
        })
        .catch(error => {
          console.log('Erro getRules: ', error)
        })
    }
  }
}).$mount("#app");