<template>
  <div id="chat" class="resizable-content" :class="{'z-index-superior' : blocker && origemBlocker == 'msg-formatada'}">
    <template v-if="atendimentoAtivo.informacoes && (caso == '' || caso == 200)">
      <ChatOpcoes />
      <ChatCorpo id="chat-operador"/>
      <ChatRodape />
      <BotoesAcoes />
    </template>
    <template v-else-if="!atendimentoAtivo.informacoes || caso == 400 || caso == 206">
      <div class="chat-opcoes tamanho-titulos">
        <div class="chat-opcoes-titulo">
          <h1> <i class="fas fa-comments"></i> {{ dicionario.titulo_chat }} </h1>
        </div>
      </div>
      <div class="lista-chat-container-vazio">
        <div>
          <i class="fas fa-comment-slash"></i>
          <p v-text="dicionario.msg_sem_chat"></p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChatOpcoes from './ChatOpcoes'
import ChatCorpo from './ChatCorpo'
import ChatRodape from './ChatRodape'
import BotoesAcoes from '../BotoesAcoes'

export default {
  components: {
    ChatOpcoes,
    ChatCorpo,
    ChatRodape,
    BotoesAcoes
  },
  computed: {
    ...mapGetters({
      zonaDeTeste: "getZonaDeTeste",
      atendimentoAtivo: "getAtendimentoAtivo",
      caso: "getCaso",
      blocker: "getBlocker",
      origemBlocker: "getOrigemBlocker",
      dicionario: "getDicionario"
    })
  },
  mounted(){
    this.diminuirWidthResize()
  },
  methods: {
    diminuirWidthResize(){
      const todosResizes = document.querySelectorAll("#app > .resizable-component > div.resizable-r")
      if(!todosResizes){
        return
      }
      if(todosResizes[1]){
        let resizeChat = todosResizes[1]
        resizeChat.style.width = "6px"
      }
    }
  }
}
</script>
