export default {
  state: {
    abrirPopup: false,
    titulo: '',
    origem: '',
    arrAgentes: [],
    arrGrupos: [],
    bgPopup: ''
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
    setArrAgentes(state, arrAgentes){
      state.arrAgentes.push(arrAgentes)
    },
    limparArrAgentes(state){
      state.arrAgentes = []
    },
    setArrGrupos(state, arrGrupos){
      state.arrGrupos.push(arrGrupos)
    },
    limparArrGrupos(state){
      state.arrGrupos = []
    },
    setBgPopup(state, bgPopup){
      state.bgPopup = bgPopup
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
    setArrAgentes: (context, payload) => {
      context.commit("setArrAgentes", payload)
    },
    setArrGrupos: (context, payload) => {
      context.commit("setArrGrupos", payload)
    },
    setBgPopup: (context, payload) => {
      context.commit("setBgPopup", payload)
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
    getArrAgentes(state){
      return state.arrAgentes
    },
    getArrGrupos(state){
      return state.arrGrupos
    },
    getBgPopup(state){
      return state.bgPopup
    }
  }
}