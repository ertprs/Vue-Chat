<template>
  <div id="app">
    <Teste v-if="testeAtivo" />
    <template v-else>
      <div id="container">
        <BotoesSuperiores />
        <!-- <Formulario v-if="!formularioCliente" /> -->
        <!-- <template  v-else> -->
          <Contatos v-if="abaAtiva == 'contatos'" />
          <Chat v-if="abaAtiva == 'chat'" />
          <!-- <Informacoes /> -->
        <!-- </template> -->
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { mapGetters } from "vuex"

import axios from 'axios'
import { mapMutations } from 'vuex'

// import Formulario from './components/templates/Formulario'
import Contatos from './components/templates/Contatos'
import Chat from './components/templates/Chat'
import Informacoes from './components/templates/Informacoes'

import BotoesSuperiores from './components/templates/BotoesSuperiores'

import Teste from './components/templates/Teste'

export default {
  components: {
    // Formulario,
    BotoesSuperiores,
    Contatos,
    Chat,
    Informacoes,
    Teste
  },
  data(){
    return{
      testeAtivo: false
    }
  },
  computed: {
    ...mapGetters({
      // formularioCliente: 'getFormularioCliente',
      abaAtiva: 'getAbaAtiva'
    })
  }
}

</script>