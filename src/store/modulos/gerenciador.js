export default {
  state: {
    gerenciador: [],
    ativo: false
  },
  mutations: {
    setGerenciador(state, gerenciador){
      state.gerenciador = gerenciador
    },
    setAtivo(state, ativo){
      state.ativo = ativo
    }
  },
  actions: {
    setGerenciador: (context, payload) => {
      context.commit("setGerenciador", payload)
    },
    setAtivo: (context, payload) => {
      context.commit("setAtivo", payload)
    }
  },
  getters: {
    getGerenciador(state){
      return state.gerenciador
    },
    getAtivo(state){
      return state.ativo
    }
  }
}