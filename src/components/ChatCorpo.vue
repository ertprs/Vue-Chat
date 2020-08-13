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
      :imgAnexo="msg.imgAnexo"/>

      <div class="btn-rolagem" v-show="habilitaRolagem" v-on:click="rolaChat()">
        <i class="fas fa-arrow-circle-down"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Mensagens from './Mensagens'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

export default {
  components: {
    Mensagens
  },
  mounted() {
    this.$root.$on('rolaChat', () => {
      this.rolaChat('novaMensagem')
    })
    this.$root.$on('rolaChatClienteAtivo',(id) => {
      this.rolaChatClienteAtivo(id)
    })
  },
  methods:{
    ...mapMutations(['setHabilitaRolagem']),
    rolaChat(origem){
      let corpoMensagens = document.querySelector("#chat-operador > div")
      if(corpoMensagens){
        let tamanhoCorpoMensagem = corpoMensagens.offsetHeight
        let tamanhoScroll = corpoMensagens.scrollHeight

        if(origem == 'novaMensagem'){
          setTimeout(
            () => {
              let corpoMensagens = document.querySelector("#chat-operador > div")
              if(corpoMensagens){
                corpoMensagens.scrollTo(0, corpoMensagens.scrollHeight )
              }
            }
          ), 100
          return
        }

        if(tamanhoScroll && tamanhoCorpoMensagem){
          if(tamanhoScroll > tamanhoCorpoMensagem){
            corpoMensagens.scrollTo(0, corpoMensagens.scrollHeight )
            this.setHabilitaRolagem(false)
          }
        }
      }
    },
    rolaChatClienteAtivo(id) {
      if(id === this.atendimentoAtivo.id_cli) {
        this.rolaChat('novaMensagem')
      }
    },
    verificaPosicaoBarraRolagem(){
      this.setHabilitaRolagem(true)
      if(this.habilitaRolagem){
        let containerMensagens = document.querySelector("#chat-operador > div")
        if(containerMensagens){
          let posicaoDaBarra = containerMensagens.scrollTop
          let tamanhoContainer = containerMensagens.offsetHeight
          let tamanhoBarra = containerMensagens.scrollHeight
  
          if(posicaoDaBarra == (tamanhoBarra - tamanhoContainer)){
            this.setHabilitaRolagem(false)
          }else if(parseInt(posicaoDaBarra) + tamanhoContainer == tamanhoBarra || parseInt(posicaoDaBarra) + tamanhoContainer == tamanhoBarra + 1 || parseInt(posicaoDaBarra) + tamanhoContainer == tamanhoBarra - 1){
            this.setHabilitaRolagem(false)
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