import store from "../config/store"

export function carregarIframe(atendimentos) {
    for(let ramal in atendimentos) {
        var objIframe = {id: atendimentos[ramal].login_usu, url: atendimentos[ramal].url}
        store.commit('setIframesDisponiveis', objIframe)
    }
}
