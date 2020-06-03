import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zonaDeTeste: true,
    formularioCliente: false,
    todasMensagens: [],
    clienteMandouMensagem: true,
    habilitaRolagem: false,
    informacoesAberto: true,
    informacoesDoCliente: {},
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
    setZonaDeTeste(state, zonaDeTeste){
      state.zonaDeTeste = zonaDeTeste
    },
    setClienteMandouMensagem(state, clienteMandouMensagem){
      state.clienteMandouMensagem = clienteMandouMensagem
    },
    setHabilitaRolagem(state, habilitaRolagem){
      state.habilitaRolagem = habilitaRolagem
    },
    setInformacoesAberto(state, informacoesAberto){
      state.informacoesAberto = informacoesAberto
    },
    setURL(state, newURI) {
      state.url = newURI
    },
    setAtendimentosAbertos(state, atendimentosAbertos){
      state.atendimentosAbertos = atendimentosAbertos
    },
    setInformacoesDoCliente(state, objInformacoes){
      state.informacoesDoCliente = objInformacoes
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
    getClienteMandouMensagem(state){
      return state.clienteMandouMensagem
    },
    getHabilitaRolagem(state){
      return state.habilitaRolagem
    },
    getInformacoesAberto(state){
      return state.informacoesAberto
    },
    getURL(state) {
      return state.url
    },
    getAtendimentosAbertos(state){
      return state.atendimentosAbertos
    },
    getInformacoesDoCliente(state){
      return state.informacoesDoCliente
    }
  }
});