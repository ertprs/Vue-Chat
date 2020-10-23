// Arquivo a ser excluido caso nao esteja sendo utilizado

export default {
  state: {
    regrasDoClienteAtivo: {},
    extImgs: "",
    extDocs: ""
  },
  mutations: {
    setRegrasDoClienteAtivo(state, regras) {
      state.regrasDoClienteAtivo = regras
    },
    setExtImgs(state, extImgs){
      state.extImgs = extImgs
    },
    setExtDocs(state, extDocs){
      state.extDocs = extDocs
    }
  },
  actions: {
    setRegrasDoClienteAtivo: (context, payload) => {
      context.commit('setRegrasDoClienteAtivo', payload)
    },
    setExtImgs: (context, payload) => {
      context.commit('setExtImgs', payload)
    },
    setExtDocs: (context, payload) => {
      context.commit('setExtDocs', payload)
    }
  },
  getters: {
    getRegrasDoClienteAtivo(state) {
      return state.regrasDoClienteAtivo
    },
    getExtImgs(state){
      return state.extImgs
    },
    getExtDocs(state){
      return state.extDocs
    }
  }
}