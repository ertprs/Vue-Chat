export default {
  state: {
    agenda: []
  },
  mutations: {
    setAgenda(state, agenda) {
      state.agenda = agenda
    }
  },
  actions: {
    setAgenda: (context, payload) => {
      context.commit('setAgenda', payload)
    }
  },
  getters: {
    getAgenda(state) {
      return state.agenda
    }
  }
}