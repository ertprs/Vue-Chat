export default {
  state: {
    todosAtendimentos: {},
    idAtendimentoAtivo: '',
    atendimentoAtivo: {},
    ultimoIdRemovido: ''
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
    }
  } 
}