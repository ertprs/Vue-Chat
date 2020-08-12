<template>
  <div id="app">
    <Blocker />
    <Contatos />
    <Chat />
    <Informacoes v-on:click="clickInformacoes($event)"/>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { mapGetters } from "vuex"
import axios from 'axios'
import { mapMutations } from 'vuex'
import Blocker from './components/templates/Blocker'
import Contatos from './components/templates/Contatos'
import Chat from './components/templates/Chat'
import Informacoes from './components/templates/Informacoes'
import Teste from './components/templates/Teste'

export default {
  components: {
    Blocker,
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