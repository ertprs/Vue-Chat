import Vue from "vue";
import Vuex from "vuex";

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
    atendimentosAbertos: {},
    url: ''
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
    
    setURL(state, newURI) {
      state.url = newURI
    },
    setAtendimentosAbertos(state, atendimentosAbertos){
      state.atendimentosAbertos = atendimentosAbertos
    },
    setAtendimentoAtivo(state, objInformacoes){
      state.atendimentoAtivo = objInformacoes
    },
    setTokenAtd( state, tokenAtd ) {
      state.tokenAtd = tokenAtd
    },
    setTokenManager( state, tokenManager ) {
      state.tokenManager = tokenManager
    }
  },
  getters: {
    getFormularioCliente(state){
      return state.formularioCliente
    },
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
    getAtendimentosAbertos(state){
      return state.atendimentosAbertos
    },
    getAtendimentoAtivo(state){
      return state.atendimentoAtivo
    },
    getTokenAtd(state) {
      return state.tokenAtd
    },
    getTokenManager(state) {
      return state.tokenManager
    }
  }
});