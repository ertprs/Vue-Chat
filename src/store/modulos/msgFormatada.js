export default {
  state: {
    tipoMsg: '',
    abrirMsgTipo2: false
  },
  mutations: {
    setTipoMsg(state, tipoMsg){
      state.tipoMsg = tipoMsg
    },
    setAbrirMsgTipo2(state, abrirMsgTipo2){
      state.abrirMsgTipo2 = abrirMsgTipo2
    }
  },
  actions: {
    setTipoMsg: (context, payload) => {
      context.commit('setTipoMsg', payload)
    },
    setAbrirMsgTipo2: (context, payload) => {
      context.commit('setAbrirMsgTipo2', payload)
    }
  },
  getters: {
    getTipoMsg(state){
      return state.tipoMsg
    },
    getAbrirMsgTipo2(state){
      return state.abrirMsgTipo2
    }
  }
}