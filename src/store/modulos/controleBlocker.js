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
  actions: {
    setBlocker: (context, payload) => {
      context.commit('setBlocker', payload)
    },
    setOrigemBlocker: (context, payload) => {
      context.commit('setOrigemBlocker', payload)
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