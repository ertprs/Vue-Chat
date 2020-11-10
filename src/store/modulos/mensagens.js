export default {
  state: {
    tipoMsg: '',
    abrirMsgTipo2: false,
    grupo: '',
    categoria: '',
    assunto: '',
    nroChat: '',
  },
  mutations: {
    setTipoMsg(state, tipoMsg){
      state.tipoMsg = tipoMsg
    },
    setAbrirMsgTipo2(state, abrirMsgTipo2){
      state.abrirMsgTipo2 = abrirMsgTipo2
    },
    setGrupo(state, grupo){
      state.grupo = grupo
    },
    setCategoria(state, categoria){
      state.categoria = categoria
    },
    setAssunto(state, assunto){
      state.assunto = assunto
    },
    setNroChat(state, nroChat){
      state.nroChat = nroChat
    }
  },
  actions: {
    setTipoMsg: (context, payload) => {
      context.commit('setTipoMsg', payload)
    },
    setAbrirMsgTipo2: (context, payload) => {
      context.commit('setAbrirMsgTipo2', payload)
    },
    setGrupo: (context, payload) => {
      context.commit('setGrupo', payload)
    },
    setCategoria: (context, payload) => {
      context.commit('setCategoria', payload)
    },
    setAssunto: (context, payload) => {
      context.commit('setAssunto', payload)
    },
    setNroChat: (context, payload) => {
      context.commit('setNroChat', payload)
    }
  },
  getters: {
    getTipoMsg(state){
      return state.tipoMsg
    },
    getAbrirMsgTipo2(state){
      return state.abrirMsgTipo2
    },
    getGrupo(state){
      return state.grupo
    },
    getCategoria(state){
      return state.categoria
    },
    getAssunto(state){
      return state.assunto
    },
    getNroChat(state){
      return state.nroChat
    }
  }
}