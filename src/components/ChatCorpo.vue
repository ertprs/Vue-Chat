<template>
  <div class="chat-corpo" @click="focaTextarea()">
    <div class="chat-corpo-mensagens" v-on:scroll="verificaPosicaoBarraRolagem()">
      <template>
        <!-- MSG Operador -->
        <Mensagens
        v-for="msg in mensagensAtivas" :key="msg.id"
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
        :nomeArquivo="msg.nomeArquivo"/>
      </template>
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
      primeiraReq: true
    }
  },
  beforeDestroy(){
    this.$root.$off("rolaChat")
  },
  mounted() {
    this.$root.$on('rolaChat', () => {
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
            for(let msg in this.atendimentoAtivo.arrMsg){
              if(arrStatusMsg[msg]){
                if(arrStatusMsg[msg].status){
                  if(arrStatusMsg[msg].status !== this.mensagensAtivas[msg].status){
                    if(arrStatusMsg[msg].seq === this.atendimentoAtivo.arrMsg[msg].seq && this.atendimentoAtivo.arrMsg[msg].resp_msg == "OPE"){
                      this.mensagensAtivas[msg].status = arrStatusMsg[msg].status
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
    }
  },
  computed:{
    ...mapGetters({
      limiteErrosMsg: 'getLimiteErrosMsg',
      mensagensAtivas: 'getMensagensAtivas',
      habilitaRolagem: 'getHabilitaRolagem',
      atendimentoAtivo: 'getAtendimentoAtivo',
      reqTeste: 'getReqTeste'
    })
  }
}
</script>