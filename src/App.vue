<template>
  <div id="app">
    <!-- <Teste v-if="testeAtivo" /> -->
    <!-- <template v-else> -->
      <!-- <Formulario v-if="!formularioCliente" /> -->
      <!-- <template  v-else> -->
        <Blocker />
        <Contatos />
        <Chat />
        <Informacoes />
      <!-- </template> -->
    <!-- </template> -->
  </div>
</template>

<script>
import { mapState } from "vuex"
import { mapGetters } from "vuex"
import axios from 'axios'
import { mapMutations } from 'vuex'
import Blocker from './components/templates/Blocker'
import Formulario from './components/templates/Formulario'
import Contatos from './components/templates/Contatos'
import Chat from './components/templates/Chat'
import Informacoes from './components/templates/Informacoes'
import Teste from './components/templates/Teste'

export default {
  components: {
    Blocker,
    Formulario,
    Contatos,
    Chat,
    Informacoes,
    Teste
  },
  data(){
    return{
      testeAtivo: false
    }
  }
}

</script>