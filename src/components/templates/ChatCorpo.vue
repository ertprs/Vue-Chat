<template>
  <div class="chat-corpo" @click="focaTextarea($event)">
    <div class="chat-corpo-mensagens" v-on:scroll.prevent="verificaPosicaoBarraRolagem()">
      <div v-if="atendimentoAtivo.arrMsg.st_ret == 'ERRO'" class="container-msg-erro">
        <p class="msg-erro" v-text="dicionario.msg_erro"></p>
      </div>
      <div v-else>
        <div v-for="(arrMsg, index) in atendimentoAtivo.arrMsg" :key="index">
          <div class="chat-corpo-container" v-if="arrMsg.data_ini && arrMsg.login">
            <hr>
            <div>
              <h5 class="separador-mensagens">
                <template v-if="arrMsg.data_ini && arrMsg.data_ini !== '1111-11-11 00:00:00'">{{ dicionario.msg_divisao_ini + " " + acionaFormataDataHora(arrMsg.data_ini) }}</template>
                <template v-if="arrMsg.login">{{ ` ${dicionario.msg_divisao_ope} `  + arrMsg.login }}</template>
              </h5>
            </div>
            <hr>
          </div>
          <Mensagens
            v-for="(msg, i) in arrMsg.msg" :key="i"
            :autor="msg.autor"
            :origem="msg.origem"
            :msg="msg.msg"
            :link="msg.link"
            :horario="msg.horario"
            :status="msg.status"
            :logo="msg.logo"
            :anexo="msg.anexo"
            :imgAnexo="msg.imgAnexo"
            :tipoDoc="msg.tipoDoc"
            :docAnexo="msg.docAnexo"
            :nomeArquivo="msg.nomeArquivo"
            :audio="msg.audio"
            :video="msg.video"
            :msgTooltip="msg.tooltip"
          />
          <div class="chat-corpo-container" v-if="arrMsg.data_fim && arrMsg.login">
            <template v-if="arrMsg.data_fim !== '1111-11-11 00:00:00' && arrMsg.data_fim !== '1111-11-11 1111-11-11'">
              <hr>
              <div>
                <h5 class="separador-mensagens">
                  {{ dicionario.msg_divisao_fim + " " + acionaFormataDataHora(arrMsg.data_fim) }}
                  {{ ` ${dicionario.msg_divisao_ope} `  + arrMsg.login }}
                </h5>
              </div>
              <hr>
            </template>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="btn-rolagem" v-show="habilitaRolagem" v-on:click="rolaChat()">
        <div class="sinalizar-msg-nova" :title="dicionario.title_nova_msg" v-show="atendimentoAtivo.novaMsgCttAtivo"></div>
        <font-awesome-icon :icon="['fas', 'arrow-circle-down']" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

<script>
import Mensagens from '../Mensagens'
import { mapGetters } from 'vuex'

import { formataDataHora } from "@/services/formatacaoDeTextos"
import axios_api from '@/services/serviceAxios'

export default {
  components: {
    Mensagens
  },
  data(){
    return{
      qtdErrosStatusMsg: 0,
      tokenStatus: "",
      primeiraReq: true,
      idAtendimento: ""
    }
  },
  beforeDestroy(){
    this.$root.$off("rola-chat")
  },
  mounted() {
    this.$root.$on('rola-chat', () => {
      this.rolaChat()
    })

    if(this.atendimentoAtivo){
      this.idAtendimento = this.atendimentoAtivo.id
    }

    this.verificaPosicaoBarraRolagem()
    setTimeout(() => {
      this.rolaChat()
    }, 500)

    this.atualizarStatusMensagens()
    setInterval(() => {
      if(this.atendimentoAtivo && this.atendimentoAtivo.token_cliente){
        if(this.origemBlocker != "atd-parado" && this.origemBlocker != "atd-bloqueado"){
          this.atualizarStatusMensagens()
        }
      }
    }, 10000)
  },
  updated(){
    this.$nextTick(() => {
      if(!this.habilitaRolagem){
        this.rolaChat()
      }else{
        if(this.idAtendimento !== this.atendimentoAtivo.id){
          this.rolaChat()
          this.idAtendimento = this.atendimentoAtivo.id
        }
      }
    })
  },
  methods:{
    focaTextarea(event){
      if(window.getSelection().toString()){
        return
      }else{
        const textarea = document.querySelector("#textarea")
        if(textarea){
          textarea.focus()
        }
      }
    },
    rolaChat(){
      if(this.atendimentoAtivo.novaMsgCttAtivo){
        this.$set(this.atendimentoAtivo, "novaMsgCttAtivo", false)
      }

      const corpoMensagens = document.querySelector('.chat-corpo-mensagens')
      if(corpoMensagens){
        corpoMensagens.scroll(0, corpoMensagens.scrollHeight)
      }
    },
    verificaPosicaoBarraRolagem(){
      this.$store.dispatch('setHabilitaRolagem', true)
      if(this.habilitaRolagem){
        let containerMensagens = document.querySelector("#chat-operador > div")
        if(containerMensagens){
          let posicaoDaBarra = containerMensagens.scrollTop
          let tamanhoContainer = containerMensagens.offsetHeight
          let tamanhoBarra = containerMensagens.scrollHeight
          if(posicaoDaBarra == (tamanhoBarra - tamanhoContainer)){
            this.$store.dispatch('setHabilitaRolagem', false)
          }else if(parseInt(posicaoDaBarra) + tamanhoContainer == tamanhoBarra || parseInt(posicaoDaBarra) + tamanhoContainer == tamanhoBarra + 1 || parseInt(posicaoDaBarra) + tamanhoContainer == tamanhoBarra - 1){
            this.$store.dispatch('setHabilitaRolagem', false)
          }
        }
      }
    },
    atualizarStatusMensagens(){
      axios_api.get(`get-status-messages?token_cliente=${this.atendimentoAtivo.token_cliente}${this.tokenStatus}&${this.reqTeste}`)
        .then(response => {
          if(response.status === 200){
            // console.log(response.data)

            this.qtdErrosStatusMsg = 0

            this.tokenStatus = `&token_status=${response.data.token_status}`

            let arrStatusMsg = response.data.msg_ret
            let chaveStatusMsg = Object.keys(arrStatusMsg)
            let j = 0

            for(let index in this.atendimentoAtivo.arrMsg){
              if(chaveStatusMsg.includes(index)){
                for(let i = 0; i < this.atendimentoAtivo.arrMsg[index].msg.length; i++){
                  if(this.atendimentoAtivo.arrMsg[index].msg[i].origem == "principal"){
                    if(arrStatusMsg[index][j]){
                      this.$set(this.atendimentoAtivo.arrMsg[index].msg[i], "status", arrStatusMsg[index][j].status)

                      let msgStatus = "msg_status_"+arrStatusMsg[index][j].status
                      let str = `<p class="tooltip-titulo-status-message">${this.dicionario[msgStatus]}</p>`
                      if(arrStatusMsg[index][j].data_hora_status && arrStatusMsg[index][j].data_hora_status !== "1111-11-11 00:00:00"){
                        str += `<p>${this.acionaFormataDataHora(arrStatusMsg[index][j].data_hora_status, true)}</p>`
                      }
                      str += `<ul class="tooltip-list">`
                      if(arrStatusMsg[index][j].data_hora_gravacao && arrStatusMsg[index][j].data_hora_gravacao !== "1111-11-11 00:00:00"){
                        str += `<li>${this.dicionario.msg_data_hora_gravacao} - ${this.acionaFormataDataHora(arrStatusMsg[index][j].data_hora_gravacao, true)}</li>`
                      }
                      if(arrStatusMsg[index][j].data_hora_envio_fila && arrStatusMsg[index][j].data_hora_envio_fila !== "1111-11-11 00:00:00"){
                        str += `<li>${this.dicionario.msg_data_hora_envio_fila} - ${this.acionaFormataDataHora(arrStatusMsg[index][j].data_hora_envio_fila, true)}</li>`
                      }
                      if(arrStatusMsg[index][j].data_hora_envio_cliente && arrStatusMsg[index][j].data_hora_envio_cliente !== "1111-11-11 00:00:00"){
                        str += `<li>${this.dicionario.msg_data_hora_envio_cliente} - ${this.acionaFormataDataHora(arrStatusMsg[index][j].data_hora_envio_cliente, true)}</li>`
                      }
                      if(arrStatusMsg[index][j].data_hora_entrega && arrStatusMsg[index][j].data_hora_entrega !== "1111-11-11 00:00:00"){
                        str += `<li>${this.dicionario.msg_data_hora_entrega} - ${this.acionaFormataDataHora(arrStatusMsg[index][j].data_hora_entrega, true)}</li>`
                      }
                      if(arrStatusMsg[index][j].data_hora_leitura && arrStatusMsg[index][j].data_hora_leitura !== "1111-11-11 00:00:00"){
                        str += `<li>${this.dicionario.msg_data_hora_leitura} - ${this.acionaFormataDataHora(arrStatusMsg[index][j].data_hora_leitura, true)}</li>`
                      }
                      if(arrStatusMsg[index][j].status_msg){
                        str += `<li>${arrStatusMsg[index][j].status_msg}</li>`
                      }
                      str += "</ul>"

                      if(!str.endsWith('<ul class="tooltip-list"></ul>')){
                        this.$set(this.atendimentoAtivo.arrMsg[index].msg[i], "tooltip", str)
                      }

                      j++
                      this.$forceUpdate()
                    }else{
                      j = j <= 0 ? 0 : j--
                    }
                  }
                }
              }
            }

          }
        })
        .catch(error => {
          this.qtdErrosStatusMsg++
          if(this.qtdErrosStatusMsg == 10){
            console.log('Erro get status messages: ', error)
          }
        })

        this.primeiraReq = false
    },
    acionaFormataDataHora(dataHora, origem){
      return formataDataHora(dataHora, origem)
    },
  },
  computed:{
    ...mapGetters({
      limiteErrosMsg: 'getLimiteErrosMsg',
      habilitaRolagem: 'getHabilitaRolagem',
      atendimentoAtivo: 'getAtendimentoAtivo',
      reqTeste: 'getReqTeste',
      dicionario: 'getDicionario',
      origemBlocker: 'getOrigemBlocker'
    })
  }
}
</script>
