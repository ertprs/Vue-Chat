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

      <!-- MSG Cliente -->
      <!-- <div class="mensagem-cliente">
        <div class="mensagem" id="msg-1-cliente">
          <b-tooltip target="msg-1-cliente" triggers="hover" placement="right">
          Enviado por: Cliente
        </b-tooltip>
          <p> Mensagem Cliente </p>
          <span class="horario-envio"> 16h20 </span>
        </div>
      </div> -->
      <div class="btn-rolagem" v-if="habilitaRolagem" v-on:click="rolaChat()">
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
  methods:{
    ...mapMutations(['setHabilitaRolagem']),
    rolaChat(){
      let corpoMensagens = document.querySelector("#chat-operador > div")
      let tamanhoCorpoMensagem = corpoMensagens.offsetHeight
      let tamanhoScroll = corpoMensagens.scrollHeight

      if(tamanhoScroll > tamanhoCorpoMensagem){
        let ultimoFilho = corpoMensagens.lastElementChild
        corpoMensagens.scrollTo(0, ultimoFilho.offsetTop )

        this.setHabilitaRolagem(false)
      }
    },
    verificaPosicaoBarraRolagem(){
      if(this.habilitaRolagem){
        let containerMensagens = document.querySelector("#chat-operador > div")
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
  },
  computed:{
    ...mapGetters({
      todasMensagens: 'getTodasMensagens',
      habilitaRolagem: 'getHabilitaRolagem'
    })
  },
  watch: {
    todasMensagens(){
      this.rolaChat()
    }
  }
}
</script>