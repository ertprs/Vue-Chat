export default {
    state: {
      iframesDisponiveis: []
    },
    mutations: {
      setIframesDisponiveis(state, iframe) {
        state.iframesDisponiveis.push(iframe)
      }
    },
    getters: {
      getIframesDisponiveis(state) {
        return state.iframesDisponiveis
      }
    }
  }