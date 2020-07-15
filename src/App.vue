<template>
  <div id="app">
    <!-- <Teste v-if="testeAtivo" /> -->
    <!-- <template v-else> -->
      <!-- <Formulario v-if="!formularioCliente" /> -->
      <!-- <template  v-else> -->
        <Blocker />
        <Contatos />
        <Chat />
        <Informacoes v-on:click="clickInformacoes($event)"/>
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
      testeAtivo: false,
      arrWidthChatPadrao: [],
      arrWidthInformacoesPadrao: []
    }
  },
  methods: {
    observador(){

      const observer = new ResizeObserver(entries => {
        for(const entry of entries){
          if(entry.contentRect){
            // Chat
            if(entry.target == document.querySelector('#chat')){
              this.arrWidthChatPadrao.push(entry.contentRect.width)
              this.verificaTamanhoMinimo('chat', entry.contentRect.width)
            // Informacoes
            }else if(entry.target == document.querySelector('#informacoes')){
              this.arrWidthInformacoesPadrao.push(entry.contentRect.width)
              this.verificaTamanhoMinimo('informacoes', entry.contentRect.width)
            }
            // console.log('width: ', entry.contentRect.width)
            // console.log('target: ', entry.target)
          }
        }
      })

      observer.observe(document.querySelector('#informacoes'))
      observer.observe(document.querySelector('#chat'))
    },
    verificaTamanhoMinimo(alvo, widthAtual){
      if(alvo == 'informacoes'){
        if(widthAtual < this.arrWidthInformacoesPadrao[0] - 100){
          document.querySelector(`#${alvo}`).style.width = (this.arrWidthInformacoesPadrao[0] - 100) + 'px'
        }else if(widthAtual > this.arrWidthInformacoesPadrao[0] + 100){
          document.querySelector(`#${alvo}`).style.width = (this.arrWidthInformacoesPadrao[0] + 100) + 'px'
        }
      }else if(alvo == 'chat'){
        if(widthAtual < this.arrWidthChatPadrao[0]){
          document.querySelector(`#${alvo}`).style.width = this.arrWidthChatPadrao[0] + 'px'
        }else if(widthAtual > this.arrWidthChatPadrao[0] + 200){
          document.querySelector(`#${alvo}`).style.width = (this.arrWidthChatPadrao[0] + 200) + 'px'
        }
      }
    }
  },
  watch: {
    
  },
  mounted(){
    this.observador()
  }
}

</script>