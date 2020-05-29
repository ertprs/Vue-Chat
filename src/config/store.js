import Vue from "vue";
import Vuex from "vuex";
import controlaAba from './modulos/controleAba'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zonaDeTeste: true,
    formularioCliente: false,
    todasMensagens: [],
    clienteMandouMensagem: false,
    habilitaRolagem: false,
    informacoesAberto: false
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
    }
  },
  modules: { controlaAba }
});