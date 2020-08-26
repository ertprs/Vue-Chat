export default{
  state: {
    url: ''
  },
  mutations: {
    setURL(state, newURI){
      state.url = newURI
    }
  },
  actions: {
    setURL: (context, payload) => {
      context.commit('setURL', payload)
    }
  },
  getters: {
    getURL(state) {
      return state.url
    }
  }
}