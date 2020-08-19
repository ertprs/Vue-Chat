<template>
  <div id="app">
    <Blocker />
    
    <!-- Contatos -->
    <vue-resizable
      :minWidth="60"
      :width="widthContatos"
      :maxWidth="275"
      :active="handlers"
      @resize:end="resizeContatos">
      <Contatos />
    </vue-resizable>

    <!-- Chat -->
    <vue-resizable
      :minWidth="300"
      :maxWidth="700"
      :width="widthChat"
      :active="handlers"
      @resize:start="adicionaBlocker"
      @resize:end="insereWidthChatNoLocalStorage">
      <Chat />
    </vue-resizable>

    <!-- Informacoes -->
    <!-- <vue-resizable
      :minWidth="500"
      :width="widthInformacoes"
      :active="handlers"
      :fitParent="true"> -->
      <Informacoes v-on:click="clickInformacoes($event)"/>
    <!-- </vue-resizable> -->

  </div>
</template>

<script>

import axios from 'axios'
import { mapGetters } from "vuex"

import VueResizable from 'vue-resizable'
import Blocker from './components/templates/Blocker'
import Contatos from './components/templates/Contatos'
import Chat from './components/templates/Chat'
import Informacoes from './components/templates/Informacoes'
import Teste from './components/templates/Teste'

export default {
  components: {
    'vue-resizable' : VueResizable,
    Blocker,
    Contatos,
    Chat,
    Informacoes,
    Teste
  },
  data(){
    return{
      widthContatos: '20%',
      widthChat: '30%',
      widthInformacoes: '50%',
      handlers: ['r']
    }
  },
  methods: {
    resizeContatos(data){
      let widthContatos = data.width
      
      if(widthContatos < 90 && !this.fechado){
        this.$root.$emit('toggle-contatos')
      }else if(widthContatos > 90 && this.fechado){
        this.$root.$emit('toggle-contatos')
      }
    },
    insereWidthChatNoLocalStorage(data){
      let widthAtual = data.width+'px'
      localStorage.setItem('largura-chat', widthAtual)

      this.$store.dispatch('setBlocker', false)
    },
    verificaLocalStorage(){
      let fechado = localStorage.getItem('status-contatos')
      if(fechado == "true"){
        this.widthContatos = "60px"
      }

      let width = localStorage.getItem('largura-chat')
      if(width){
        this.widthChat = width 
        this.alteraWidthChat(width)
      }
    },
    alteraWidthChat(widthNovo){
      const chat = document.querySelector('#chat')
      if(chat){
        chat.style.width = widthNovo
      }
    },
    adicionaBlocker(){
      this.$store.dispatch('setBlocker', true)
    }
  },
  created(){
    this.verificaLocalStorage()
  },
  computed: {
    ...mapGetters({
      fechado: "getAbaContatos"
    })
  }
}

</script>