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
      var currentdate = new Date();
      var currentTime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
      for( let i in objAtendimentos ) {
        console.log(objAtendimentos)
      }

      
      let msgCliente = {
        "id_cliente": 5516987987900,
        "texto": "Cliente ",
        "resp_msg": "CLI",
        "origem": "outros",
        "data": "07-06-2020",
        "hora": "14:34:11"
      }
      msgCliente.texto = 'Msg cliente ' + currentTime
      
      let msgOperador = {
        "id_cliente": 5516987987900,
        "texto": "99",
        "resp_msg": "OPE",
        "origem": "principal",
        "data": "07-06-2020",
        "hora": "14:34:11"
      }
      msgOperador.texto = 'Msg operador ' + currentTime
      // teste para adicionar novas mensagens para contato
      state.testeContador ++
      var qtdMsgNova = state.testeContador
      var idAlvo = "5516987987933"
      for( let i in state.todosAtendimentos ){
        if( state.todosAtendimentos[i].cliente.id == idAlvo ) {
          var arrAlvo = state.todosAtendimentos[i]
          arrAlvo.cliente.alertaMsgNova = true
          arrAlvo.cliente.qtdMsgNova = qtdMsgNova
          state.todosAtendimentos.splice(i, 1)
          state.todosAtendimentos.unshift( arrAlvo )
          continue
        }
      }

      // teste para adicionar novo cliente
      if( state.testeContador == 3 ) {
        var arrAlvo2 = state.todosAtendimentos[6]
        arrAlvo2.cliente.id = '5516987955555'
        arrAlvo2.cliente.informacoes.nome = 'NovoCliente'
        arrAlvo2.cliente.novoContado = true
        arrAlvo2.cliente.qtdMensagem = 8
        state.todosAtendimentos.splice(6, 1)
        state.todosAtendimentos.unshift( arrAlvo2 )
      }

      // carrega mensagens teste no contato ativo
      var arrayDeMensagensNovas = [ msgOperador, msgCliente ]
      for( var i in arrayDeMensagensNovas ) {
        state.todosAtendimentos[0].cliente.messages.push( arrayDeMensagensNovas[i] )
        var idDoAtendimentoAtivo = state.atendimentoAtivo.id
        if( arrayDeMensagensNovas[i].id_cliente == idDoAtendimentoAtivo ) {
          // carrega array e mostra a mensagem
          let objMensagem = {
            autor: arrayDeMensagensNovas[i].resp_msg, // Operador, Cliente
            origem: arrayDeMensagensNovas[i].origem, // principal e outros
            msg: arrayDeMensagensNovas[i].texto,
            horario: '88:88',
            anexo: '',
            imgAnexo: ''
          };
          state.todasMensagens.push(objMensagem)
        } else {
          // destacar que existe mensagem nova em outro cliente com o id
        }
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