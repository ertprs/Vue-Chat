import Vue from "vue";
import Vuex, { Store } from "vuex";

import controleBlocker from './modulos/controleBlocker'
import tratativaDeCasos from './modulos/tratativaDeCasos'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    abaContatos: false,
    agenda: [],
    idAtendimentoAtivo: '',
    atendimentoAtivo: {},
    formularioCliente: false,
    habilitaRolagem: false,
    testeContador: 0,
    todasMensagens: [],
    tokenAtd: '',
    tokenManager: '',
    todosAtendimentos: {},
    url: '',
    zonaDeTeste: true
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
    setAgenda(state, agenda) {
      state.agenda = agenda
    },
    setAtendimentos(state, todosAtendimentos){
      state.todosAtendimentos = todosAtendimentos
    },
    setIdAtendimentoAtivo(state, idAtendimentoAtivo){
      state.idAtendimentoAtivo = idAtendimentoAtivo
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
    getAgenda(state) {
      return state.agenda
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
    },
    getIdAtendimentoAtivo(state){
      return state.idAtendimentoAtivo
    }
  },
  modules: { controleBlocker, tratativaDeCasos }
});