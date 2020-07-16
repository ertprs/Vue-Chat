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
    },
    adicionarMensagem(state, objCliente) {
      state.todosAtendimentos.splice(objCliente.indiceRef, 1, objCliente)
    },
    adicionarClienteNovo(state, objCliente) {
      // state.todosAtendimentos.splice(0, 0, objCliente)
      state.todosAtendimentos.push(objCliente)
      // state.todosAtendimentos.unshift(objCliente)
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