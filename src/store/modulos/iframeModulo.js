import { strictEqual } from "assert";

export default {
    state: {
      iframesDisponiveis: [],
      iframeCttAtivo: false
    },
    mutations: {
      setIframeCttAtivo(state, iframeCttAtivo){
        state.iframeCttAtivo = iframeCttAtivo
      },
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
      },
      setIframeCttAtivo: (context, payload) => {
        context.commit("setIframeCttAtivo", payload)
      }
    },
    getters: {
      getIframesDisponiveis(state) {
        return state.iframesDisponiveis
      },
      getIframeCttAtivo(state){
        return state.iframeCttAtivo
      }
    }
  }
