import store from "../store"
import axios_api from "./serviceAxios"

export function obterMsgFormatada(tipo, tokenCliente) {
    return axios_api({
            method: 'get',
            url: `${store.getters.getURL}get-messages/${tipo}?token_cliente=${tokenCliente}`
        })
        .then(response => {
            // console.log(response.data)
            if(response.data.st_ret === 'OK') {
                return response.data.nivel
            }
        })
        .catch(err => console.log(err))
}
