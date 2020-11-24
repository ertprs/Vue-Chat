export default {
  state: {
    aguardando: [],
    todos: [],
    contadorAguardando: 0,
    contadorTodos: 0,
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
    },
    setContadorAguardando(state, contadorAguardando){
      state.contadorAguardando = contadorAguardando
    },
    setContadorTodos(state, contadorTodos){
      state.contadorTodos = contadorTodos
    }
  },
  actions: {
    setAguardando: (context, payload) => {
      context.commit('setAguardando', payload)
    },
    setTodos: (context, payload) => {
      context.commit('setTodos', payload)
    },
    setContadorAguardando: (context, payload) => {
      context.commit("setContadorAguardando", payload)
    },
    setContadorTodos: (context, payload) => {
      context.commit("setContadorTodos", payload)
    }
  },
  getters: {
    getAguardando(state) {
      return state.aguardando
    },
    getTodos(state){
      return state.todos
    },
    getContadorAguardando(state){
      return state.contadorAguardando
    },
    getContadorTodos(state){
      return state.contadorTodos
    }
  }
}
