export default {
  state: {
    abaContatos: false,
    habilitaRolagem: false,
    blocker: false,
    origemBlocker: '',
    caso: '',
    mensagemViaTextarea: false
  },
  mutations: {
    setAbaContatos(state, abaContatos){
      state.abaContatos = abaContatos
    },
    setHabilitaRolagem(state, habilitaRolagem){
      state.habilitaRolagem = habilitaRolagem
    },
    setBlocker(state, blocker){
      state.blocker = blocker
    },
    setOrigemBlocker(state, origemBlocker){
      state.origemBlocker = origemBlocker
    },
    setCaso(state, caso){
      state.caso = caso
    },
    setMensagemViaTextarea(state, mensagemViaTextarea){
      state.mensagemViaTextarea = mensagemViaTextarea
    }
  },
  actions: {
    setAbaContatos: (context, payload) => {
      context.commit('setAbaContatos', payload)
    },
    setHabilitaRolagem: (context, payload) => {
      context.commit('setHabilitaRolagem', payload)
    },
    setBlocker: (context, payload) => {
      context.commit('setBlocker', payload)
    },
    setOrigemBlocker: (context, payload) => {
      context.commit('setOrigemBlocker', payload)
    },
    setCaso: (context, payload) => {
      context.commit('setCaso', payload)
    },
    setMensagemViaTextarea: (context, payload) => {
      context.commit('setMensagemViaTextarea', payload)
    }
  },
  getters: {
    getAbaContatos(state){
      return state.abaContatos
    },
    getHabilitaRolagem(state){
      return state.habilitaRolagem
    },
    getBlocker(state){
      return state.blocker
    },
    getOrigemBlocker(state){
      return state.origemBlocker
    },
    getCaso(state){
      return state.caso
    },
    getMensagemViaTextarea(state){
      return state.mensagemViaTextarea
    }
  } 
}