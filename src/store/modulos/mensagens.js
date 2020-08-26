export default {
  state: {
    todasMensagens: [],
    tipoMsg: '',
    abrirMsgTipo2: false
  },
  mutations: {
    setTodasMensagens(state, novaMensagem){
      state.todasMensagens.push(novaMensagem)
    },
    limparTodasMensagens(state){
      state.todasMensagens = []
    },
    setTipoMsg(state, tipoMsg){
      state.tipoMsg = tipoMsg
    },
    setAbrirMsgTipo2(state, abrirMsgTipo2){
      state.abrirMsgTipo2 = abrirMsgTipo2
    }
  },
  actions: {
    setTodasMensagens: (context, payload) => {
      context.commit('setTodasMensagens', payload)
    },
    limparTodasMensagens: context => {
      context.commit('limparTodasMensagens')
    },
    setTipoMsg: (context, payload) => {
      context.commit('setTipoMsg', payload)
    },
    setAbrirMsgTipo2: (context, payload) => {
      context.commit('setAbrirMsgTipo2', payload)
    }
  },
  getters: {
    getTodasMensagens(state){
      return state.todasMensagens
    },
    getTipoMsg(state){
      return state.tipoMsg
    },
    getAbrirMsgTipo2(state){
      return state.abrirMsgTipo2
    }
  }
}