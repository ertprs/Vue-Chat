export default {
  state: {
    abrirEmojis: false
  },
  mutations: {
    setAbrirEmojis(state, abrirEmojis){
      state.abrirEmojis = abrirEmojis
    }
  },
  actions: {
    setAbrirEmojis: (context, payload) => {
      context.commit("setAbrirEmojis", payload)
    }
  },
  getters: {
    getAbrirEmojis(state){
      return state.abrirEmojis
    }
  }
}
