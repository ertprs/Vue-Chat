import Vue from "vue";
import Vuex from "vuex";
import controleBlocker from './modulos/controleBlocker'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zonaDeTeste: true,
    formularioCliente: false,
    todasMensagens: [],
    habilitaRolagem: false,
    atendimentoAtivo: {},
    tokenAtd: '',
    tokenManager: '',
    todosAtendimentos: {},
    url: '',
    abaContatos: false,
    testeContador: 0
  },
  mutations: {
    setFormularioCliente(state, formularioCliente){
      state.formularioCliente = formularioCliente
    },
    setTodasMensagens(state, todasMensagens){
      state.todasMensagens.push(todasMensagens)
    },
    limparTodasMensagens(state){
      state.todasMensagens = []
    },
    setZonaDeTeste(state, zonaDeTeste){
      state.zonaDeTeste = zonaDeTeste
    },
    setHabilitaRolagem(state, habilitaRolagem){
      state.habilitaRolagem = habilitaRolagem
    },
    setURL(state, newURI){
      state.url = newURI
    },
    setAtendimentosIniciais(state, todosAtendimentos){
      state.todosAtendimentos = todosAtendimentos
      // console.log( state.todosAtendimentos )
    },
    atualizarMensagens(state, objAtendimentos){
      // var currentdate = new Date();
      // var currentTime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()

      var textoOperador = ''
      var textoCliente = ''
      var idCliente = ''
      var msgOperador = {}
      var msgCliente = {}
      for (var indexRamal in objAtendimentos) {
        var lenArrMessages = objAtendimentos[indexRamal].cliente.messages.length
        if (lenArrMessages > 0) {
          textoOperador = objAtendimentos[indexRamal].cliente.messages[lenArrMessages - 2].texto
          textoCliente = objAtendimentos[indexRamal].cliente.messages[lenArrMessages - 1].texto
          idCliente = objAtendimentos[indexRamal].cliente.id
          console.log('cliente: ' + objAtendimentos[indexRamal].cliente.informacoes.nome + ' | qtdMensagens: ' + lenArrMessages)
          console.log('Mensagem Operador: ' + textoOperador)
          console.log('Mensagem Cliente: ' + textoCliente)
          state.testeContador % 3 == 0 ? idCliente = '5516987987911' : false

          msgCliente = {
            "id_cliente": idCliente,
            "texto": textoCliente,
            "resp_msg": "CLI",
            "origem": "outros",
            "data": "07-06-2020",
            "hora": "14:34:11"
          }
          msgOperador = {
            "id_cliente": idCliente,
            "texto": textoOperador,
            "resp_msg": "OPE",
            "origem": "principal",
            "data": "07-06-2020",
            "hora": "14:34:11"
          }
          // carrega mensagens teste no contato ativo
          var arrayDeMensagensNovas = [msgOperador, msgCliente]
          for (var k in arrayDeMensagensNovas) {
            state.todosAtendimentos[0].cliente.messages.push(arrayDeMensagensNovas[k])
            var idDoAtendimentoAtivo = state.atendimentoAtivo.id
            if (arrayDeMensagensNovas[k].id_cliente == idDoAtendimentoAtivo) {
              // carrega array e mostra a mensagem
              let objMensagem = {
                autor: arrayDeMensagensNovas[k].resp_msg, // Operador, Cliente
                origem: arrayDeMensagensNovas[k].origem, // principal e outros
                msg: arrayDeMensagensNovas[k].texto,
                horario: '88:88',
                anexo: '',
                imgAnexo: ''
              };
              state.todasMensagens.push(objMensagem)
            } else {
              // destacar que existe mensagem nova em outro cliente com o id
              for (let i in state.todosAtendimentos) {
                if (state.todosAtendimentos[i].cliente.id == idCliente) {
                  var arrAlvo = state.todosAtendimentos[i]
                  arrAlvo.cliente.alertaMsgNova = true
                  arrAlvo.cliente.qtdMsgNova = state.testeContador
                  state.todosAtendimentos.splice(i, 1)
                  state.todosAtendimentos.unshift(arrAlvo)
                  continue
                }
              }
            }
          }
        }
      }

      // teste para adicionar novo cliente
      state.testeContador ++
      if( state.testeContador == 2 ) {
        var arrAlvo2 = state.todosAtendimentos[6]
        arrAlvo2.cliente.id = '5516987955555'
        arrAlvo2.cliente.informacoes.nome = 'NovoCliente'
        arrAlvo2.cliente.novoContato = true
        arrAlvo2.cliente.alertaMsgNova = true
        arrAlvo2.cliente.qtdMsgNova = 8
        state.todosAtendimentos.splice(6, 1)
        state.todosAtendimentos.unshift( arrAlvo2 )
      }
    },
    setAtendimentoAtivo(state, objInformacoes){
      state.atendimentoAtivo = objInformacoes
    },
    limparAtendimentoAtivo(state) {
      state.atendimentoAtivo = {}
    },
    setTokenAtd( state, tokenAtd ) {
      state.tokenAtd = tokenAtd
    },
    setTokenManager( state, tokenManager ) {
      state.tokenManager = tokenManager
    },
    toggleAbaContatos(state, abaContatos){
      state.abaContatos = abaContatos
    }
  },
  getters: {
    getTodasMensagens(state){
      return state.todasMensagens
    },
    getZonaDeTeste(state){
      return state.zonaDeTeste
    },
    getHabilitaRolagem(state){
      return state.habilitaRolagem
    },
    getURL(state) {
      return state.url
    },
    getTodosAtendimentos(state){
      return state.todosAtendimentos
    },
    getAtendimentoAtivo(state){
      return state.atendimentoAtivo
    },
    getTokenAtd(state) {
      return state.tokenAtd
    },
    getTokenManager(state) {
      return state.tokenManager
    },
    getAbaContatos(state){
      return state.abaContatos
    }
  },
  modules: { controleBlocker }
});