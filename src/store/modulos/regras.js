// Arquivo a ser excluido caso nao esteja sendo utilizado

export default {
  state: {
    regrasDoClienteAtivo: {}
  },
  mutations: {
    setRegrasDoClienteAtivo(state, regras) {
      state.regrasDoClienteAtivo = regras
    }
  },
  actions: {
    setRegrasDoClienteAtivo: (context, payload) => {
      context.commit('setRegrasDoClienteAtivo', payload)
    }
  },
  getters: {
    getRegrasDoClienteAtivo(state) {
      return state.regrasDoClienteAtivo
    }
  }
}