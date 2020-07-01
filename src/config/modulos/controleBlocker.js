export default {
  state: {
    blocker: false
  },
  mutations: {
    setBlocker(state, blocker){
      state.blocker = blocker
    }
  },
  getters: {
    getBlocker(state){
      return state.blocker
    }
  }
}