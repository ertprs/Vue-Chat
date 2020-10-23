export default {
  state: {
    todosAtendimentos: {},
    idAtendimentoAtivo: '',
    atendimentoAtivo: {},
    ultimoIdRemovido: '',
    dominio: '',
    reqTeste: "",
    statusAtd: "em-atendimento"
  },
  mutations: {
    setAtendimentos(state, todosAtendimentos){
      state.todosAtendimentos = todosAtendimentos
    },
    setIdAtendimentoAtivo(state, idAtendimentoAtivo){
      state.idAtendimentoAtivo = idAtendimentoAtivo
    },
    limparIdAtendimentoAtivo(state){
      state.idAtendimentoAtivo = ''
    },
    setAtendimentoAtivo(state, objInformacoes){
      state.atendimentoAtivo = objInformacoes
    },
    limparAtendimentoAtivo(state) {
      state.atendimentoAtivo = {}
    },
    setUltimoIdRemovido(state, ultimoIdRemovido){
      state.ultimoIdRemovido = ultimoIdRemovido
    },
    setDominio(state, dominio){
      state.dominio = dominio
    },
    setReqTeste(state, reqTeste){
      state.reqTeste = reqTeste
    },
    setStatusAtd(state, statusAtd){
      state.statusAtd = statusAtd
    }
  },
  actions: {
    setAtendimentos: (context, payload) => {
      context.commit('setAtendimentos', payload)
    },
    setIdAtendimentoAtivo: (context, payload) => {
      context.commit('setIdAtendimentoAtivo', payload)
    },
    limparIdAtendimentoAtivo: context => {
      context.commit('limparIdAtendimentoAtivo')
    },
    setAtendimentoAtivo: (context, payload) => {
      context.commit('setAtendimentoAtivo', payload)
    },
    limparAtendimentoAtivo: context => {
      context.commit('limparAtendimentoAtivo')
    },
    setUltimoIdRemovido: (context, payload) => {
      context.commit('setUltimoIdRemovido', payload)
    },
    setDominio: (context, payload) => {
      context.commit('setDominio', payload)
    },
    setReqTeste: (context, payload) => {
      context.commit('setReqTeste', payload)
    },
    setStatusAtd: (context, payload) => {
      context.commit("setStatusAtd", payload)
    }
  },
  getters: {
    getTodosAtendimentos(state){
      return state.todosAtendimentos
    },
    getIdAtendimentoAtivo(state){
      return state.idAtendimentoAtivo
    },
    getAtendimentoAtivo(state){
      return state.atendimentoAtivo
    },
    getUltimoIdRemovido(state){
      return state.ultimoIdRemovido
    },
    getDominio(state){
      return state.dominio
    },
    getReqTeste(state){
      return state.reqTeste
    },
    getStatusAtd(state){
      return state.statusAtd
    }
  } 
}