<template>
  <div class="chat-corpo" @click="focaTextarea()">
    <div class="chat-corpo-mensagens" v-on:scroll="verificaPosicaoBarraRolagem()">
      <div v-for="(arrMsg, index) in this.atendimentoAtivo.arrMsg" :key="index">
        <div class="chat-corpo-container">
          <hr>
          <div>
            <h5 class="separador-mensagens">
              <template v-if="arrMsg.data_ini && arrMsg.data_ini !== '1111-11-11 00:00:00'">{{ formataDataHora(arrMsg.data_ini) }}</template>
              <template v-if="arrMsg.data_fim && arrMsg.data_fim !== '1111-11-11 00:00:00'">{{ " - " + formataDataHora(arrMsg.data_fim) }}</template>
              <template v-if="arrMsg.login">{{ " por " + arrMsg.login }}</template>
            </h5>
          </div>
        </div>
        <Mensagens
          v-for="(msg, i) in arrMsg.msg" :key="i"
          :autor="msg.autor"
          :origem="msg.origem"
          :msg="msg.msg"
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
        />
      </div>
    </div>
    <transition name="fade">
      <div class="btn-rolagem" v-show="habilitaRolagem" v-on:click="rolaChat()">
        <i class="fas fa-arrow-circle-down"></i>
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
import Mensagens from './Mensagens'
import { mapGetters } from 'vuex'

import axios_api from '@/services/serviceAxios';

export default {
  components: {
    Mensagens
  },
  data(){
    return{
      limitador: 0,
      tokenStatus: "",
      primeiraReq: true,
      rolagemAtiva: false
    }
  },
  beforeDestroy(){
    this.$root.$off("rolaChat")
  },
  mounted() {
    this.$root.$on('rola-chat', () => {
      this.rolaChat()
    })

    this.rolaChat()

    this.atualizarStatusMensagens()
    setInterval(() => {
      if(this.atendimentoAtivo && this.atendimentoAtivo.token_cliente){
        this.atualizarStatusMensagens()
      }
    }, 5000)
  },
  updated(){
    if(!this.rolagemAtiva){
      this.rolaChat()
    }
  },
  methods:{
    focaTextarea(){
      const textarea = document.querySelector("#textarea")
      if(textarea){
        textarea.focus()
      }
    },
    rolaChat(){
      const corpoMensagens = document.querySelector('.chat-corpo-mensagens')
      if(corpoMensagens){
        setTimeout(() => {
          corpoMensagens.scroll(0, corpoMensagens.scrollHeight)
        }, 150)
      }else{
        this.limitador++
        if(this.limitador >= 10){
          return
        }
        setTimeout(() => {
          this.rolaChat
        }, 300)
      }
    },
    verificaPosicaoBarraRolagem(){

      this.rolagemAtiva = true
      setTimeout(() => {
        this.rolagemAtiva = false
      }, 3000)
      
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
            this.tokenStatus = `&token_status${response.data.token_status}`

            let arrStatusMsg = response.data.msg_ret
            let chaveStatusMsg = Object.keys(arrStatusMsg)
            let j = 0

            for(let index in this.atendimentoAtivo.arrMsg){
              if(chaveStatusMsg.includes(index)){
                for(let i = 0; i < this.atendimentoAtivo.arrMsg[index].msg.length; i++){
                  if(this.atendimentoAtivo.arrMsg[index].msg[i].autor == "Operador"){
                    if(arrStatusMsg[index][j]){
                      this.$set(this.atendimentoAtivo.arrMsg[index].msg[i], "status", arrStatusMsg[index][j].status)
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
          console.log('Erro get status messages: ', error)
        })

        this.primeiraReq = false
    },
    formataDataHora(dataHora){
      if(!dataHora){
        return ""
      }

      let arrDataHora = dataHora.split(" ")
      if(arrDataHora.length){
        let data = arrDataHora[0]
        let hora = arrDataHora[1]

        if(!data || !hora){
          return dataHora
        }

        data = data.split("-")
        data = data.reverse()
        data = data.join("/")

        hora = hora.slice(0, 5)

        return `${data} \u00e0s ${hora}` 
      }else{
        return dataHora
      }
    }
  },
  computed:{
    ...mapGetters({
      limiteErrosMsg: 'getLimiteErrosMsg',
      habilitaRolagem: 'getHabilitaRolagem',
      atendimentoAtivo: 'getAtendimentoAtivo',
      reqTeste: 'getReqTeste'
    })
  }
}
</script>