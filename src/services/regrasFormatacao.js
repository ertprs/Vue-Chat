import store from "../store"
import axios_api from "./serviceAxios"

export function executarRegrasFormatacao(mainData) {
    for (let atd in mainData.atendimentos) {
        getRules(mainData.atendimentos[atd].token_cliente, mainData.atendimentos[atd].login_usu)
    }
}

function getRules(tokenCliente, id) {
    axios_api.get(`get-rules?token_cliente=${tokenCliente}`)
        .then(response => {
            if (response.data.st_ret == 'OK') {
                const arrayRegras = response.data
                let objRegra = {
                    id: id,
                    regras: arrayRegras
                }
                store.dispatch('setTodasRegras', objRegra)
            }
        })
        .catch(error => {
            console.log('Erro getRules: ', error)
        })
}