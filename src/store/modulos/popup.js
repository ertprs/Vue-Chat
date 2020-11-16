export default {
  state: {
    abrirPopup: false,
    titulo: '',
    origem: '',
    arrBot: [],
    arrAgentes: [],
    arrGrupos: [],
    bgPopup: '',
    erroTransfer: false,
    msgErro: ""
  },
  mutations: {
    setAbrirPopup(state, abrirPopup){
      state.abrirPopup = abrirPopup
    },
    setTitulo(state, titulo) { 
      state.titulo = titulo
    },
    setOrigem(state, origem){
      state.origem = origem
    },
    setArrBot(state, arrBot){
      state.arrBot.push(arrBot)
    },
    setArrAgentes(state, arrAgentes){
      state.arrAgentes.push(arrAgentes)
    },
    setArrGrupos(state, arrGrupos){
      state.arrGrupos.push(arrGrupos)
    },
    setBgPopup(state, bgPopup){
      state.bgPopup = bgPopup
    },
    setErroTransfer(state, erroTransfer){
      state.erroTransfer = erroTransfer
    },
    setMsgErro(state, msgErro){
      state.msgErro = msgErro
    }
  },
  actions: {
    setAbrirPopup: (context, payload) => {
      context.commit("setAbrirPopup", payload)
    },
    setTitulo: (context, payload) => {
      context.commit("setTitulo", payload)
    },
    setOrigem: (context, payload) => {
      context.commit("setOrigem", payload)
    },
    setArrBot: (context, payload) => {
      context.commit("setArrBot", payload)
    },
    setArrAgentes: (context, payload) => {
      context.commit("setArrAgentes", payload)
    },
    setArrGrupos: (context, payload) => {
      context.commit("setArrGrupos", payload)
    },
    setBgPopup: (context, payload) => {
      context.commit("setBgPopup", payload)
    },
    setErroTransfer: (context, payload) => {
      context.commit("setErroTransfer", payload)
    },
    setMsgErro: (context, payload) => {
      context.commit("setMsgErro", payload)
    }
  },
  getters: {
    getAbrirPopup(state){
      return state.abrirPopup
    },
    getTitulo(state){
      return state.titulo
    },
    getOrigem(state){
      return state.origem
    },
    getArrBot(state){
      return state.arrBot
    },
    getArrAgentes(state){
      return state.arrAgentes
    },
    getArrGrupos(state){
      return state.arrGrupos
    },
    getBgPopup(state){
      return state.bgPopup
    },
    getErroTransfer(state){
      return state.erroTransfer
    },
    getMsgErro(state){
      return state.msgErro
    }
  }
}