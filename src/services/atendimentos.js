import store from "../store"
import axios from "axios"
import axios_api from "./serviceAxios"
import { axiosTokenJWT } from "./serviceAxios"
import { carregarIframe } from "./iframe"
import { converterHexaParaEmojis } from "./emojis"

const TEMPO_ATUALIZACAO = 2000
var status_gerenciador = 0 // 0 = Liberado; 1 = bloqueado
var status_encerrando = 0 // 0 = liberado; 1 = em pausa
var contador_request_erro = 0
var parar_request = false
var app

export function getAtendimentos(appVue) {
    if(appVue) {
        app = appVue
    } else {
        console.error('É necessário informar a instância do vue')
        return
    }
    bloqueiaRequest()
    liberaRequest()
    verificarAlertaErroRequest()
    axios({
        method: 'get',
        url: store.getters.getURL + 'get-atendimento?teste=teste'
    })
        .then(response => {
            contador_request_erro = 0
            tratarResponse(response)
        })
        .catch(err => {
            setTimeout(() => {
                contador_request_erro ++
                console.error(err)
                if(!parar_request){
                    getAtendimentos(app)
                }
                adicionaCaso(400)
            }, 500)
        }
    )
}

function verificarAlertaErroRequest() {
    if(contador_request_erro > 0) {
        console.error('Erro de conexao ' + contador_request_erro)
    }

    if(contador_request_erro > 5) {
        if(window.confirm('Nao foi possivel estabelecer conexao. \nClique em "OK" se quiser tentar novamente.')){
            document.location.reload();
        }else{
            parar_request = true
        }
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
        setTimeout(() => {
            console.error('Erro na autorizacao')
            adicionaCaso(400)
            getAtendimentos(app)
        }, TEMPO_ATUALIZACAO)
        return
    }

    var status = response.status
    var mainData = response.data
    switch (status) {
        case 200:
            if (!mainData) { // tratando erro quando os dados não chegaram da api
                console.error('Negacao do mainData')
                setTimeout(() => {
                    console.error('Timeout negacao mainData')
                    adicionaCaso(400)
                    getAtendimentos(app)
                }, TEMPO_ATUALIZACAO)
                return
            } else {
                if (mainData.atendimentos) { // executando fluxo normal sem erros
                    adicionaCaso(200)
                    mainData = converterHexaParaEmojis(mainData)
                    let regex = /\s|\]|\[/g
                    for(let atd in mainData.atendimentos){
                        if(mainData.atendimentos[atd].login_usu.match(regex)){
                            mainData.atendimentos[atd].login_usu = mainData.atendimentos[atd].login_usu.replace(regex, '')
                        }
                    }
                    store.dispatch('setAtendimentos', mainData.atendimentos)
                    carregarIframe(mainData.atendimentos)
                    acionaProcessos(mainData)
                    loopAtualizacaoDeAtendimentos()
                } else { // tratando erro quando os atendimentos nao chegaram nos dados da api
                    console.log('Erro ao tentar obter dados no servidor')
                    console.log(mainData)
                    adicionaCaso(400)
                    setTimeout(() => {
                        console.log('timeout erro obter dados no servidor')
                        getAtendimentos(app)
                    }, TEMPO_ATUALIZACAO)
                    return
                }
            }
            break;

        case 206:
            setTimeout(() => { // Timeout aguardando cliente
                adicionaCaso(206)
                acionaProcessos(mainData)
                getAtendimentos(app)
            }, TEMPO_ATUALIZACAO)
            break;

        default:
            console.error('ERRO STATUS ' + response.status + ' ' + response.statusText)
            console.log(response)
            adicionaCaso(400)
            break
    }
}

let primeiraRequest = true

function acionaProcessos(mainData){
    
    if(primeiraRequest){
        // Pausa/Em atendimento
        if(mainData.status_operacao){
            store.dispatch("setStatusAtd", "em-atendimento")
        }else{
            store.dispatch("setStatusAtd", "parado")
        }
    }

    // Ativar Cliente
    if(mainData.ativo){
        store.dispatch("setAtivo", mainData.ativo)
    }
    
    // Gerenciador
    if(mainData.gerenciador){
        store.dispatch("setGerenciador", mainData.gerenciador)
    }
    
    // Agenda
    if(mainData.agenda && mainData.agenda.length){
        store.dispatch("setAgenda", mainData.agenda)
    }
    
    // Aguardando
    axios_api.get("get-aguardando?teste=teste")
    .then(response => {
        const arrAguardando = response.data.ret
        if(arrAguardando.length){
            store.dispatch("setAguardando", arrAguardando)
        }
    })
    .catch(error => {
        console.log('error get aguardando: ', error)
    })

    primeiraRequest = false
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

function acionaProcessosAtualizacao(mainData){
    // Pausa/Em atendimento
    if(mainData.status_operacao){
        store.dispatch("setStatusAtd", "em-atendimento")
    }else{
        store.dispatch("setStatusAtd", "parado")
    }

    // Gerenciador
    if(mainData.gerenciador){
        store.dispatch("setGerenciador", mainData.gerenciador)
    }

    // Agenda
    if(mainData.agenda){
        store.dispatch("setAgenda", mainData.agenda)
    }
}


async function atualizarAtendimentos() {
    await axios_api({
        method: 'get',
        url: store.getters.getURL + 'get-atendimento?teste=teste'
    })
        .then(response => {
            if(response.headers.authorization){
                axiosTokenJWT(response.headers.authorization)
            }
            let mainData = response.data
            if (mainData.st_ret === 'OK' || mainData.atendimentos) {
                adicionaCaso(200)
                atualizarClientes(mainData)
                acionaProcessosAtualizacao(mainData)
            } else if (mainData.st_ret === 'AVISO') {
                console.error('Nao existe clientes na fila')
                adicionaCaso(206)
                acionaProcessosAtualizacao(mainData)
            } else {
                console.error('ERRO! Status:', response)
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
                        console.error('Timeout sem st_ret')
                        getAtendimentos(app)
                    }, TEMPO_ATUALIZACAO)
                    return
                }
            }
            liberaRequest()
        })
        .catch(
            err => {
                contador_request_erro ++
                console.error(err)
                liberaRequest()
                getAtendimentos(app)
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
                // console.log(message)
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
                    } else if(message.resp_msg == "CLI") {
                        app.$root.$emit('atualizar_mensagem', message)
                    } else if(message.resp_msg == "OPE"){
                        if(store.getters.getMensagemViaTextarea){
                            store.dispatch("setMensagemViaTextarea", false)
                        }else{
                            app.$root.$emit('atualizar_mensagem', message) // pode haver duplicacoes de mensagens
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