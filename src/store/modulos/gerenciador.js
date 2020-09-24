export default {
  state: {
    gerenciador: []
  },
  mutations: {
    setGerenciador(state, gerenciador){
      state.gerenciador = gerenciador
    }
  },
  actions: {
    setGerenciador: (context, payload) => {
      context.commit("setGerenciador", payload)
    }
  },
  getters: {
    getGerenciador(state){
      return state.gerenciador
    }
  }
}