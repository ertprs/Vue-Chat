export default {
  state: {
    abaAtiva: 'chat'
  },
  mutations: {
    setAbaAtiva(state, aba){
      state.abaAtiva = aba
    }
  },
  getters: {
    getAbaAtiva(state){
      return state.abaAtiva
    }
  }
}