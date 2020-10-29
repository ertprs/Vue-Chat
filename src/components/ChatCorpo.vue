<template>
  <div class="chat-corpo">
    <div class="chat-corpo-mensagens" v-on:scroll="verificaPosicaoBarraRolagem()">
      <div id="chat-load-container" v-if="iniciarLoad">
        <transition name="fade">
          <div class="load" v-show="!limiteErrosMsg">
            <i class="fas fa-hourglass-end"></i>
          </div>
        </transition>
        <transition name="fade">
          <div id="chat-error-container" v-show="limiteErrosMsg">
            <p> Falha ao carregar as mensagens </p>
            <p class="refresh" @click="refreshAtendimento()"> <i class="fas fa-redo"></i> Clique aqui para tentar novamente </p>
          </div> 
        </transition>
      </div>
      <template v-else>
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

export default {
  components: {
    Mensagens
  },
  data(){
    return{
      limitador: 0
    }
  },
  beforeDestroy(){
    this.$root.$off("rolaChat")
  },
  mounted() {
    this.$root.$on('rolaChat', () => {
      this.rolaChat()
    })
  },
  methods:{
    refreshAtendimento(){
      this.$root.$emit("refresh-msg", this.atendimentoAtivo)
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
    }
  },
  computed:{
    ...mapGetters({
      limiteErrosMsg: 'getLimiteErrosMsg',
      iniciarLoad: 'getIniciarLoad',
      mensagensAtivas: 'getMensagensAtivas',
      habilitaRolagem: 'getHabilitaRolagem',
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}
</script>