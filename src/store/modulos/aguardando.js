export default {
  state: {
    aguardando: [],
    todos: []
  },
  mutations: {
    setAguardando(state, aguardando) {
      state.aguardando = aguardando
    },
    adicionarCliAguardando(state, aguardando){
      state.aguardando.push(aguardando)
    },
    setTodos(state, todos){
      state.todos = todos
    }
  },
  actions: {
    setAguardando: (context, payload) => {
      context.commit('setAguardando', payload)
    },
    setTodos: (context, payload) => {
      context.commit('setTodos', payload)
    }
  },
  getters: {
    getAguardando(state) {
      return state.aguardando
    },
    getTodos(state){
      return state.todos
    }
  }
}
