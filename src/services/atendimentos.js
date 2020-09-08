import store from "../store"
import axios from "axios"
import axios_api from "./serviceAxios"
import { axiosTokenJWT } from "./serviceAxios"
import { carregarIframe } from "./iframe"
import { converterHexaParaEmojis } from "./emojis"
// import { executarRegrasFormatacao } from "./regrasFormatacao"

const TEMPO_ATUALIZACAO = 2000
var status_gerenciador = 0 // 0 = Liberado; 1 = bloqueado
var status_encerrando = 0 // 0 = liberado; 1 = em pausa
var contador_request_erro = 0
var app

export function getAtendimentos(appVue) {
    appVue ? app = appVue : false
    liberaRequest()
    verificarAlertaErroRequest()
    axios({
        method: 'get',
        url: store.getters.getURL + 'get-atendimento?teste' //?teste
    })
        .then(response => {
            contador_request_erro = 0
            tratarResponse(response)
        })
        .catch(err => {
            setTimeout(() => {
                contador_request_erro ++
                console.log(err)
                getAtendimentos()
                adicionaCaso(400)
            }, 500)
        }
        )
}

function verificarAlertaErroRequest() {
    if(contador_request_erro > 0) {
        console.error('Erro de conexao ' + contador_request_erro)
    }

    if(contador_request_erro > 2) {
        alert('Existe um erro na conexao com a internet')
        document.location.reload(true);
    }
}

function loopAtualizacaoDeAtendimentos(count = 0) {
    // console.log(count)
    start()
    setTimeout(async () => {
        if (verificaRequest()) {
            bloqueiaRequest()
            await atualizarAtendimentos()
        }
        end()
        loopAtualizacaoDeAtendimentos(count = count + 1)
    }, TEMPO_ATUALIZACAO);
}

function tratarResponse(response) {
    if (response.headers.authorization) {
        axiosTokenJWT(response.headers.authorization)
    } else {
        console.error('Erro na autorização')
        console.log(response)
        adicionaCaso(400)
    }
    var status = response.status
    var mainData = response.data
    switch (status) {
        case 200:
            if (!mainData) {
                console.error('Negacao do mainData')
                setTimeout(() => {
                    adicionaCaso(400)
                    console.log('Timeout negacao mainData')
                    getAtendimentos()
                }, TEMPO_ATUALIZACAO)
            } else {
                if (mainData.atendimentos != null) {
                    adicionaCaso(200)
                    mainData = converterHexaParaEmojis(mainData)
                    // executarRegrasFormatacao(mainData)
                    carregarIframe(mainData.atendimentos)
                    store.dispatch('setAtendimentos', mainData.atendimentos)
                    const agenda = ['Maria', 'Joao', 'Joana', 'Frederico']
                    store.dispatch('setAgenda', agenda)
                    loopAtualizacaoDeAtendimentos()
                } else {
                    console.log('Erro ao tentar obter dados no servidor')
                    console.log(mainData)
                    adicionaCaso(400)
                    setTimeout(() => {
                        console.log('timeout erro obter dados no servidor')
                        getAtendimentos()
                    }, TEMPO_ATUALIZACAO)
                }
            }
            break;

        case 206:
            // console.log('Status ' + response.status + ' ' + response.statusText)
            // console.log('Aguardando Cliente')
            setTimeout(() => {
                // console.log('Timeout aguardando cliente')
                getAtendimentos()
                adicionaCaso(206)
            }, TEMPO_ATUALIZACAO)
            break;

        default:
            console.error('ERRO STATUS ' + response.status + ' ' + response.statusText)
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
    // console.log('aguardando retorno do request')
    status_gerenciador = 1
}

function liberaRequest() {
    // console.log('request liberado')
    status_gerenciador = 0
}

export function executandoEncerrar() {
    // console.log('-> pausar para encerrar contato')
    status_encerrando = 1
}

export function liberarEncerrar() {
    // console.log('-> voltando ao fluxo normal')
    status_encerrando = 0
    liberaRequest()
}

function verificaEncerramento() {
    if(status_encerrando === 0) {
        return true
    } else {
        return false
    }
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
                adicionaCaso(200)
                atualizarClientes(mainData)
            } else if (mainData.st_ret === 'AVISO') {
                console.log('Nao existe clientes na fila')
                adicionaCaso(206)
                // setTimeout(() => {
                //     console.log('Timeout st_ret == Aviso')
                //     getAtendimentos()
                // }, TEMPO_ATUALIZACAO)
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
                        console.log('Timeout sem st_ret')
                        getAtendimentos()
                    }, TEMPO_ATUALIZACAO)
                }
            }
            liberaRequest()
        })
        .catch(
            err => {
                contador_request_erro ++
                console.log(err)
                liberaRequest()
                getAtendimentos()
            }
        )
}

function atualizarClientes(mainData) {
    var atendimentosServer = mainData.atendimentos
    var atendimentosLocal = store.getters.getTodosAtendimentos
    var novosAtendimentos = {}

    if(Object.keys(atendimentosServer).length < Object.keys(atendimentosLocal).length) {
        for (var ramal_server in atendimentosServer) {
            novosAtendimentos[ramal_server] = atendimentosServer[ramal_server]
        }
    } else {
        for (var ramal_local in atendimentosLocal) {
            novosAtendimentos[ramal_local] = atendimentosLocal[ramal_local]
        }
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

        if (temClienteNovo && verificaEncerramento()) {
            if(store.getters.getUltimoIdRemovido == atendimentosServer[ramal_server].id_cli){
                store.dispatch('setUltimoIdRemovido', '')
                return
            }
            novosAtendimentos[ramal_server] = atendimentosServer[ramal_server]
            novosAtendimentos[ramal_server].novoContato = true
            store.dispatch('setAtendimentos', novosAtendimentos)
            // console.log('cliente novo: ', novosAtendimentos)
            temClienteNovo = false
        } else {
            atualizarMensagens(atendimentosServer[ramal_server], ramal_server, novosAtendimentos)
        }
    }
}

function atualizarMensagens(cliente, ramal, novosAtendimentos) {
    if(!novosAtendimentos[ramal]){
        return
    }

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
                    // console.log('seq: ' + message.seq + ' msg: ' + message.msg + ', tipo: ' + message.resp_msg)
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

var startTime, endTime;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms

  // get seconds
  var seconds = Math.round(timeDiff);
  return seconds
//   console.log(seconds + " miliseconds");
}