<template>
  <div class="chat-corpo">
    <div class="chat-corpo-mensagens" v-on:scroll="verificaPosicaoBarraRolagem()">

      <!-- MSG Operador -->
      <Mensagens
      v-for="msg in todasMensagens" :key="msg.id"
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
    transition: opacity .5s;
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
  mounted() {
    this.$root.$on('rolaChat', () => {
      this.rolaChat()
    })
  },
  methods:{
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
      todasMensagens: 'getTodasMensagens',
      habilitaRolagem: 'getHabilitaRolagem',
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}
</script>