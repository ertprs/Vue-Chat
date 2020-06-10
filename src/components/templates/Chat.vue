<template>
  <div id="chat" class="chat-fechado">
    <!-- <ChatCliente v-if="zonaDeTeste"/> -->

    <template v-if="atendimentoAtivo.informacoes">
      <ChatOpcoes />
      <div class="chat-corpo-rodape">
        <ChatCorpo id="chat-operador" />
        <ChatRodape />
      </div>
    </template>
    <template v-else>
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

import ChatCliente from '../ChatCliente'
import ChatOpcoes from '../ChatOpcoes'
import ChatCorpo from '../ChatCorpo'
import ChatRodape from '../ChatRodape'

export default {
  components: {
    ChatCliente,
    ChatOpcoes,
    ChatCorpo,
    ChatRodape
  },
  computed: {
    ...mapGetters({
      zonaDeTeste: 'getZonaDeTeste',
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}
</script>