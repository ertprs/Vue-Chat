export default {
  state: {
    aguardando: []
  },
  mutations: {
    setAguardando(state, aguardando) {
      state.aguardando = aguardando
    }
  },
  actions: {
    setAguardando: (context, payload) => {
      context.commit('setAguardando', payload)
    }
  },
  getters: {
    getAguardando(state) {
      return state.aguardando
    }
  }
}