<template>
  <div id="chat">
    <ChatCliente v-if="zonaDeTeste"/>

    <template v-if="clienteMandouMensagem">
      <ChatOpcoes />
      <div class="chat-corpo-rodape">
        <ChatCorpo id="chat-operador" />
        <ChatRodape />
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
      clienteMandouMensagem: 'getClienteMandouMensagem'
    })
  }
}
</script>