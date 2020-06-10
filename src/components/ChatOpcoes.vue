<template>
  <div class="chat-opcoes">
      <div class="chat-opcoes-titulo">
        <h1 :title="chatTitulo"> <i class="fas fa-comments"></i> {{ chatTitulo }} </h1>
        <p v-if="atendimentoAtivo.informacoes.protocolo"> {{ ' - Protocolo: ' + atendimentoAtivo.informacoes.protocolo }} </p>
      </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  data(){
    return{
      chatTitulo: 'Chat'
    }
  },
  computed: {
    ...mapGetters({
      atendimentoAtivo: 'getAtendimentoAtivo'
    })
  }
}

</script>