export default {
  state: {
    caso: ''
  },
  mutations: {
    setCaso(state, caso){
      state.caso = caso
    }
  },
  actions: {
    setCaso: (context, payload) => {
      context.commit('setCaso', payload)
    }
  },
  getters: {
    getCaso(state){
      return state.caso
    }
  }
}