export default {
  state: {
    tipoMsg: '',
    abrirMsgTipo2: false,
    grupo: '',
    categoria: '',
    assunto: '',
    nroChat: '',
    temMensagemFormatada: false,
    temAnexo: true
  },
  mutations: {
    setTipoMsg(state, tipoMsg){
      state.tipoMsg = tipoMsg
    },
    setAbrirMsgTipo2(state, abrirMsgTipo2){
      state.abrirMsgTipo2 = abrirMsgTipo2
    },
    setCategoria(state, categoria){
      state.categoria = categoria
    },
    setAssunto(state, assunto){
      state.assunto = assunto
    },
    setTemMensagemFormatada(state, temMensagemFormatada){
      state.temMensagemFormatada = temMensagemFormatada
    },
    setTemAnexo(state, temAnexo){
      state.temAnexo = temAnexo
    }
  },
  actions: {
    setTipoMsg: (context, payload) => {
      context.commit('setTipoMsg', payload)
    },
    setAbrirMsgTipo2: (context, payload) => {
      context.commit('setAbrirMsgTipo2', payload)
    },
    setCategoria: (context, payload) => {
      if(payload.cod){
        context.commit('setCategoria', payload.cod)
      }else{
        context.commit('setCategoria', payload)
      }
    },
    setAssunto: (context, payload) => {
      if(payload.cod){
        context.commit('setAssunto', payload.cod)
      }else{
        context.commit('setAssunto', payload)
      }
    },
    setTemMensagemFormatada: (context, payload) => {
      context.commit('setTemMensagemFormatada', payload)
    },
    setTemAnexo: (context, payload) => {
      context.commit('setTemAnexo', payload)
    }
  },
  getters: {
    getTipoMsg(state){
      return state.tipoMsg
    },
    getAbrirMsgTipo2(state){
      return state.abrirMsgTipo2
    },
    getCategoria(state){
      return state.categoria
    },
    getAssunto(state){
      return state.assunto
    },
    getTemMensagemFormatada(state){
      return state.temMensagemFormatada
    },
    getTemAnexo(state){
      return state.temAnexo
    }
  }
}
