import store from "../store"
import axios from "axios"
import axios_api from "./serviceAxios"
import { axiosTokenJWT } from "./serviceAxios"
import { carregarIframe } from "./iframe"
import { converterHexaParaEmojis } from "./emojis"
import { executarRegrasFormatacao } from "./regrasFormatacao"

const TEMPO_ATUALIZACAO = 4000
var status_gerenciador = 0 // 0 = Liberado; 1 = bloqueado
var app

export function getAtendimentos(appVue) {
    app = appVue
    liberaRequest()
    axios({
        method: 'get',
        url: store.getters.getURL + 'get-atendimento'
    })
        .then(response => {
            axiosTokenJWT(response.headers.authorization)
            tratarResponse(response.status, response.data)
        })
        .catch(err => {
            adicionaCaso(400)
            console.log(err)
        }
        )
}

function loopAtualizacaoDeAtendimentos(count = 0) {
    setTimeout(async () => {
        if (verificaRequest()) {
            bloqueiaRequest()
            await atualizarAtendimentos()
        }
        loopAtualizacaoDeAtendimentos(count = count + 1)
    }, TEMPO_ATUALIZACAO);
}

function tratarResponse(status, mainData) {

    switch (status) {
        case 200:
            if (!mainData) {
                console.log('Negação do mainData')
                setTimeout(() => {
                    adicionaCaso(400)
                    getAtendimentos()
                }, TEMPO_ATUALIZACAO)
            }
            if (mainData.atendimentos != null) {
                mainData = converterHexaParaEmojis(mainData)
                executarRegrasFormatacao(mainData)
                carregarIframe(mainData.atendimentos)
                store.dispatch('setAtendimentos', mainData.atendimentos)
                const agenda = ['Maria', 'Joao', 'Joana', 'Frederico']
                store.dispatch('setAgenda', agenda)
                loopAtualizacaoDeAtendimentos()
            } else {
                console.log('Erro ao tentar obter dados no servidor')
                console.log(mainData)
                setTimeout(() => {
                    adicionaCaso(400)
                    getAtendimentos()
                }, TEMPO_ATUALIZACAO)
            }
            break;

        case 206:
            console.log('Status ' + response.status + ' ' + response.statusText)
            console.log('Aguardando Cliente')
            setTimeout(() => {
                getAtendimentos()
                adicionaCaso(206)
            }, TEMPO_ATUALIZACAO)
            break;

        default:
            console.log('ERRO STATUS ' + response.status + ' ' + response.statusText)
            console.log(response)
            adicionaCaso(400)
            // this.reiniciarApp()
            break
    }
}

function verificaRequest() {
    if (status_gerenciador === 0) {
        return true
    } else {
        return false
    }
}

function bloqueiaRequest() {
    status_gerenciador = 1
}

function liberaRequest() {
    status_gerenciador = 0
}

function adicionaCaso(caso) {
    store.dispatch('setCaso', caso)
}


async function atualizarAtendimentos() {
    await axios_api({
        method: 'get',
        url: store.getters.getURL + 'get-atendimento'
    })
        .then(response => {
            let mainData = response.data
            // Quando chega um novo contato, o st_ret não vem, e acaba caindo no ultimo else
            if (mainData.st_ret === 'OK' || mainData.atendimentos) {
                atualizarClientes(mainData)
            } else if (mainData.st_ret === 'AVISO') {
                console.log('Nao existe clientes na fila')
                adicionaCaso(206)
                setTimeout(() => {
                    getAtendimentos()
                }, TEMPO_ATUALIZACAO)
            } else {
                console.log('ERRO! Status:', response)
                if (response.data) {
                    for (let atd in response.data) {
                        if (typeof response.data[atd] == 'object') {
                            if (response.data[atd].arrMsg > 0) {
                                response.data[atd].novoContato = true
                                let novoAtd = new Object(),
                                    chave = atd
                                novoAtd[chave] = response.data[atd]
                            }
                        }
                    }
                } else {
                    setTimeout(() => {
                        getAtendimentos()
                    }, TEMPO_ATUALIZACAO)
                }
            }
            liberaRequest()
        })
        .catch(err => console.log(err))
}

function atualizarClientes(mainData) {
    var atendimentosServer = mainData.atendimentos
    var atendimentosLocal = store.getters.getTodosAtendimentos
    var novosAtendimentos = {}

    for (var ramal_local in atendimentosLocal) {
        novosAtendimentos[ramal_local] = atendimentosLocal[ramal_local]
    }

    for (var ramal_server in atendimentosServer) {
        var temClienteNovo = true
        for (var ramal_local in atendimentosLocal) {
            if (atendimentosServer[ramal_server] && atendimentosLocal[ramal_local]) {
                if (atendimentosServer[ramal_server].id_cli === atendimentosLocal[ramal_local].id_cli) {
                    temClienteNovo = false
                }
            }
        }
        if (temClienteNovo) {
            novosAtendimentos[ramal_server] = atendimentosServer[ramal_server]
            novosAtendimentos[ramal_server].novoContato = true
            store.dispatch('setAtendimentos', novosAtendimentos)
            console.log('cliente novo: ', novosAtendimentos)
            temClienteNovo = false
        } else {
            atualizarMensagens(atendimentosServer[ramal_server], ramal_server, novosAtendimentos)
        }
    }
}

function atualizarMensagens(cliente, ramal, novosAtendimentos) {
    if (novosAtendimentos[ramal].arrMsg.length > 0) { //verifica se o cliente antigo ou novo
        const seqs = novosAtendimentos[ramal].arrMsg.map(message => (message.seq)); //seq das mensagens antigas
        if (cliente.arrMsg.length > 0) {
            cliente.arrMsg.map((message) => { //mensagens novas
                if (!seqs.includes(message.seq)) {

                    // Transformando codigo hexadecimal recebido em emoji
                    let regex = ''
                    for (let i = 0; i < store.getters.getEmojis.length; i++) {
                        regex = new RegExp(store.getters.getEmojis[i].hexa, 'gi')
                        message.msg = message.msg.replace(regex, store.getters.getEmojis[i].emoji)
                    }
                    novosAtendimentos[ramal].arrMsg.push(message)// adiciono as mensagens novas no array global
                    console.log('seq: ' + message.seq + ' msg: ' + message.msg + ', tipo: ' + message.resp_msg)
                    if (store.getters.getIdAtendimentoAtivo !== novosAtendimentos[ramal].id_cli && message.resp_msg == 'CLI') {
                        novosAtendimentos[ramal].alertaMsgNova = true
                        if (!novosAtendimentos[ramal].qtdMsgNova) {
                            novosAtendimentos[ramal].qtdMsgNova = 1;
                        } else {
                            novosAtendimentos[ramal].qtdMsgNova += 1;
                        }
                    } else {
                        if (message.resp_msg == 'CLI') {
                            app.$root.$emit('rolaChat')
                            app.$root.$emit('atualizar_mensagem', message)
                        }
                    }

                }
            });
        }
    } else { //cliente novo
        novosAtendimentos[ramal] = cliente;
        novosAtendimentos[ramal].qtdMsgNova = cliente.arrMsg.length;
        novosAtendimentos[ramal].alertaMsgNova = true
    }
    store.dispatch('setAtendimentos', novosAtendimentos)
}

function reiniciarApp() {
    setTimeout(function () {
        document.location.reload(true);
    }, TEMPO_ATUALIZACAO)
}