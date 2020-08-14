export default {
  state: {
    blocker: false,
    origemBlocker: ''
  },
  mutations: {
    setBlocker(state, blocker){
      state.blocker = blocker
    },
    setOrigemBlocker(state, origemBlocker){
      state.origemBlocker = origemBlocker
    }
  },
  getters: {
    getBlocker(state){
      return state.blocker
    },
    getOrigemBlocker(state){
      return state.origemBlocker
    }
  }
}