export default {
  state: {
    caso: ''
  },
  mutations: {
    setCaso(state, caso){
      state.caso = caso
    }
  },
  getters: {
    getCaso(state){
      return state.caso
    }
  }
}