// Arquivo a ser excluido caso nao esteja sendo utilizado

export default {
  state: {
    todasRegras: []
  },
  mutations: {
    setTodasRegras(state, regras) {
      state.todasRegras.push(regras)
    }
  },
  actions: {
    setTodasRegras: (context, payload) => {
      context.commit('setTodasRegras', payload)
    }
  },
  getters: {
    getTodasRegras(state) {
      return state.todasRegras
    }
  }
}