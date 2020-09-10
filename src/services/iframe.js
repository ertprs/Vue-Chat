import store from "../store"

export function carregarIframe(atendimentos) {
    for(let ramal in atendimentos) {
        if(atendimentos[ramal].url !== '') {
            let regex = /\s/g
            let id = ""
            
            if(atendimentos[ramal].login_usu.match(regex)){
                id = atendimentos[ramal].login_usu.replace(regex, '')
            }else{
                id = atendimentos[ramal].login_usu
            }

            var objIframe = {id: id, url: atendimentos[ramal].url}
            store.commit('setIframesDisponiveis', objIframe)
        }
    }
}
