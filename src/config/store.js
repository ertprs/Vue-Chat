import Vue from "vue";
import Vuex from "vuex";
import controleBlocker from './modulos/controleBlocker'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    abaContatos: false,
    agenda: [],
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
      // console.log(todasMensagens)
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
    setAtendimentosIniciais(state, todosAtendimentos){
      state.todosAtendimentos = todosAtendimentos
    },
    adicionarMensagem(state, objCliente) {
      state.todosAtendimentos.splice(objCliente.indiceRef, 1, objCliente)
    },
    adicionarClienteNovo(state, objCliente) {
      state.todosAtendimentos.push(objCliente)
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
    }
  },
  modules: { controleBlocker }
});