<template>
  <div id="chat" class="resizable-content" :class="{'z-index-superior' : blocker && origemBlocker == 'msg-formatada'}">
    <template v-if="atendimentoAtivo.informacoes && (caso == '' || caso == 200)">
      <ChatOpcoes />
      <ChatCorpo id="chat-operador"/>
      <ChatRodape />
    </template>
    <template v-else-if="!atendimentoAtivo.informacoes || caso == 400 || caso == 206 || caso == 600">
      <div class="chat-opcoes">
        <div class="chat-opcoes-titulo">
          <h1> <i class="fas fa-comments"></i> Chat </h1>
        </div>
      </div>
      <div class="lista-chat-container-vazio">
        <div>
          <i class="fas fa-comment-slash"></i>
          <p> Selecione um contato </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatOpcoes from '../ChatOpcoes'
import ChatCorpo from '../ChatCorpo'
import ChatRodape from '../ChatRodape'

export default {
  components: {
    ChatOpcoes,
    ChatCorpo,
    ChatRodape
  },
  computed: {
    ...mapGetters({
      zonaDeTeste: 'getZonaDeTeste',
      atendimentoAtivo: 'getAtendimentoAtivo',
      caso: 'getCaso',
      blocker: 'getBlocker',
      origemBlocker: 'getOrigemBlocker'
    })
  }
}
</script>