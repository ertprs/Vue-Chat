<template>
  <div id="app">
    <Teste v-if="testeAtivo" />
    <template v-else>
      <Formulario v-if="!formularioCliente" />
      <template  v-else>
        <Contatos />
        <Chat />
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { mapGetters } from "vuex"

import axios from 'axios'
import { mapMutations } from 'vuex'

import Formulario from './components/templates/Formulario'
import Contatos from './components/templates/Contatos'
import Chat from './components/templates/Chat'

import Teste from './components/templates/Teste'

export default {
  components: {
    Formulario,
    Contatos,
    Chat,
    Teste
  },
  data(){
    return{
      testeAtivo: false
    }
  },
  computed: {
    ...mapGetters({
      formularioCliente: 'getFormularioCliente'
    })
  }
}

</script>