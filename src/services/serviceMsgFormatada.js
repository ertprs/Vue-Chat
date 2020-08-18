import store from "../store"
import axios_api from "./serviceAxios"

export function obterMsgFormatada(tipo) {
    return axios_api({ method: 'get', url: store.getters.getURL + 'get-messages' })
        .then(response => {
            if(response.data.st_ret === 'OK') {
                return response.data.tipos
            }
        })
        .catch(err => console.log(err))

    // store.commit('setIframesDisponiveis', objIframe)
}
