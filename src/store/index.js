import Vue from "vue";
import Vuex from "vuex";
import controleBlocker from './modulos/controleBlocker'
import tratativaDeCasos from './modulos/tratativaDeCasos'
import emojis from './modulos/emojis'
import iframeModulo from './modulos/iframeModulo'
import rules from './modulos/rules'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    abaContatos: false,
    agenda: [],
    idAtendimentoAtivo: '',
    atendimentoAtivo: {},
    habilitaRolagem: false,
    testeContador: 0,
    todasMensagens: [],
    tokenAtd: '',
    tokenManager: '',
    todosAtendimentos: {},
    url: ''
  },
  mutations: {
    setTodasMensagens(state, novaMensagem){
      state.todasMensagens.push(novaMensagem)
    },
    limparTodasMensagens(state){
      state.todasMensagens = []
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
    limparIdAtendimentoAtivo(state){
      state.idAtendimentoAtivo = ''
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
    setAbaContatos(state, abaContatos){
      state.abaContatos = abaContatos
    }
  },
  actions: {
    setTodasMensagens: (context, payload) => {
      context.commit('setTodasMensagens', payload)
    },
    limparTodasMensagens: context => {
      context.commit('limparTodasMensagens')
    },
    setHabilitaRolagem: (context, payload) => {
      context.commit('setHabilitaRolagem', payload)
    },
    setURL: (context, payload) => {
      context.commit('setURL', payload)
    },
    setAgenda: (context, payload) => {
      context.commit('setAgenda', payload)
    },
    setAtendimentos: (context, payload) => {
      context.commit('setAtendimentos', payload)
    },
    setIdAtendimentoAtivo: (context, payload) => {
      context.commit('setIdAtendimentoAtivo', payload)
    },
    limparIdAtendimentoAtivo: context => {
      context.commit('limparIdAtendimentoAtivo')
    },
    setAtendimentoAtivo: (context, payload) => {
      context.commit('setAtendimentoAtivo', payload)
    },
    limparAtendimentoAtivo: context => {
      context.commit('limparAtendimentoAtivo')
    },
    setTokenAtd: (context, payload) => {
      context.commit('setTokenAtd', payload)
    },
    setTokenManager: (context, payload) => {
      context.commit('setTokenManager', payload)
    },
    setAbaContatos: (context, payload) => {
      context.commit('setAbaContatos', payload)
    }
  },
  getters: {
    getAgenda(state) {
      return state.agenda
    },
    getTodasMensagens(state){
      return state.todasMensagens
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
  modules: { controleBlocker, tratativaDeCasos, emojis, iframeModulo, rules }
});