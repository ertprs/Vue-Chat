export default {
    state: {
      iframesDisponiveis: []
    },
    mutations: {
      setIframesDisponiveis(state, iframe) {
        state.iframesDisponiveis = iframe
      },
      pushIframesDisponiveis(state, iframe){
        state.iframesDisponiveis.push(iframe)
      }
    },
    actions: {
      setIframesDisponiveis: (context, payload) => {
        context.commit('setIframesDisponiveis', payload)
      }
    },
    getters: {
      getIframesDisponiveis(state) {
        return state.iframesDisponiveis
      }
    }
  }
