export default {
  state: {
    forcarNotificacoes: false,
    usaNotificacaoCli: false,
    usaNotificacaoMsg: false,
    tituloCli: "",
    timeCli: "",
    tituloMsg: "",
    timeMsg: ""
  },
  mutations: {
    setForcarNotificacoes(state, forcarNotificacoes){
      state.forcarNotificacoes = forcarNotificacoes
    },
    setUsaNotificacaoCli(state, usaNotificacaoCli){
      state.usaNotificacaoCli = usaNotificacaoCli
    },
    setUsaNotificacaoMsg(state, usaNotificacaoMsg){
      state.usaNotificacaoMsg = usaNotificacaoMsg
    },
    setTituloCli(state, tituloCli){
      state.tituloCli = tituloCli
    },
    setTimeCli(state, timeCli){
      state.timeCli = timeCli
    },
    setTituloMsg(state, tituloMsg){
      state.tituloMsg = tituloMsg
    },
    setTimeMsg(state, timeMsg){
      state.timeMsg = timeMsg
    }
  },
  actions: {
    setForcarNotificacoes: (context, payload) => {
      context.commit("setForcarNotificacoes", payload)
    },
    setUsaNotificacaoCli: (context, payload) => {
      context.commit("setUsaNotificacaoCli", payload)
    },
    setUsaNotificacaoMsg: (context, payload) => {
      context.commit("setUsaNotificacaoMsg", payload)
    },
    setTituloCli: (context, payload) => {
      context.commit("setTituloCli", payload)
    },
    setTimeCli: (context, payload) => {
      context.commit("setTimeCli", payload)
    },
    setTituloMsg: (context, payload) => {
      context.commit("setTituloMsg", payload)
    },
    setTimeMsg: (context, payload) => {
      context.commit("setTimeMsg", payload)
    }
  },
  getters: {
    getForcarNotificacoes(state){
      return state.forcarNotificacoes
    },
    getUsaNotificacaoCli(state){
      return state.usaNotificacaoCli
    },
    getUsaNotificacaoMsg(state){
      return state.usaNotificacaoMsg
    },
    getTituloCli(state){
      return state.tituloCli
    },
    getTimeCli(state){
      return state.timeCli
    },
    getTituloMsg(state){
      return state.tituloMsg
    },
    getTimeMsg(state){
      return state.timeMsg
    }
  }
}
