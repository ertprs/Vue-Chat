<template>
  <div id="chat" class="resizable-content" :class="{'z-index-superior' : blocker && origemBlocker == 'msg-formatada'}">
    <template v-if="atendimentoAtivo && (caso == '' || caso == 200)">
      <template v-if="atendimentoAtivo.tipo == 'ligacao'">
        <ChatOpcoes />
        <div class="lista-chat-container-vazio">
          <Ligacao />
        </div>
      </template>
      <template v-else-if="atendimentoAtivo.informacoes && (!atendimentoAtivo.tipo || atendimentoAtivo.tipo == 'chat')">
        <ChatOpcoes />
        <ChatCorpo id="chat-operador"/>
        <ChatRodape />
        <BotoesAcoes />
      </template>
    </template>
    <template v-else-if="!atendimentoAtivo || caso == 400 || caso == 206">
      <div class="chat-opcoes tamanho-titulos" id="titulo-ligacao">
        <div class="chat-opcoes-titulo">
          <h1> <font-awesome-icon :icon="['fas', 'comments']" /> {{ dicionario.titulo_chat }} </h1>
        </div>
      </div>
      <div class="lista-chat-container-vazio">
        <div>
          <font-awesome-icon :icon="['fas', 'comment-slash']" />
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
import Ligacao from '../Ligacao'

export default {
  components: {
    ChatOpcoes,
    ChatCorpo,
    ChatRodape,
    BotoesAcoes,
    Ligacao
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
