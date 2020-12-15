<template>
  <div id="chat" :class="{'z-index-superior' : blocker && origemBlocker == 'msg-formatada', 'chat-sem-iframe' : semIframe}" ref="chat-container"> <!-- class="resizable-content" -->
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

    <resize :origem="'chat'" />
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
      dicionario: "getDicionario",
      semIframe: "getSemIframe"
    })
  }
}
</script>
