import store from "../store"
import axios_api from "./serviceAxios"

export function obterMsgFormatada(tipo, tokenCliente) {
    return axios_api({
            method: 'get',
            url: `${store.getters.getURL}get-messages/${tipo}?token_cliente=${tokenCliente}&${store.getters.getReqTeste}`
        })
        .then(response => {
          if(response.data.st_ret === 'OK') {
            if(response.data.tipo){
              store.dispatch('setTipoMsg', response.data.tipo)
            }
            return response.data.nivel
          }else if(response.data.st_ret === 'AVISO'){
            return response.data.msg_ret
          }
        })
        .catch(err => console.log(err))
}
