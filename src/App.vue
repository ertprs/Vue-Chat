<template>
  <div id="app">
    <Blocker />
    <Popup />
    <!-- Contatos -->
    <vue-resizable
      :minWidth="objContatos.min_width"
      :maxWidth="objContatos.max_width"
      :width="objContatos.width"
      :active="handlers"
      @resize:start="adicionaBlocker"
      @resize:end="resizeContatos">
      <Contatos />
    </vue-resizable>

    <MenuBotaoDireito />

    <!-- Chat -->
    <vue-resizable
      :minWidth="objChat.min_width"
      :maxWidth="objChat.max_width"
      :width="objChat.width"
      :active="handlers"
      @resize:start="adicionaBlocker"
      @resize:end="insereWidthChatNoLocalStorage">
      <Chat />
    </vue-resizable>

    <!-- Informacoes -->
    <Informacoes v-on:click="clickInformacoes($event)"/>

    <!-- Gerenciador -->
    <Gerenciador />

  </div>
</template>

<script>

import axios from 'axios'
import { mapGetters } from "vuex"

import VueResizable from 'vue-resizable'

import Blocker from './components/templates/Blocker'
import Popup from './components/templates/Popup'
import Contatos from './components/templates/Contatos'
import MenuBotaoDireito from './components/MenuBotaoDireito'
import Chat from './components/templates/Chat'
import Informacoes from './components/templates/Informacoes'
import Gerenciador from './components/templates/Gerenciador'

import axios_api from './services/serviceAxios'

export default {
  components: {
    'vue-resizable' : VueResizable,
    Blocker,
    Popup,
    Contatos,
    MenuBotaoDireito,
    Chat,
    Informacoes,
    Gerenciador
  },
  data(){
    return{
      objContatos: {
        min_width: 60,
        width: 275,
        max_width: 275
      },
      objChat: {
        min_width: 320,
        width: 540,
        max_width: 540
      },
      handlers: ['r']
    }
  },
  methods: {
    habilitarNotificacoes(){
      // Caso o navegador nao suporte notificacoes
      if(!("Notification" in window)){
        alert("Este browser nao suporta notificacoes de Desktop")
      }

      Notification.requestPermission(permission => {
        if(permission === "granted"){
          this.criarNotificacao("Voce sera notificado quando houverem novas mensagens e novos clientes", "", "Sobre as notificacoes")
        }else if(permission === "denied"){
          alert("Voce nao sera notificado caso houverem novas mensagens e novos clientes")
        }
      })
    },
    criarNotificacao(corpo, icone, titulo){
      const opcoes = {
        body: corpo,
        icon: icone
      }

      const notification = new Notification(titulo, opcoes)
    },
    setDominio(){
      let baseUrl = ''
      if(window.location.hostname == 'localhost'){
        baseUrl = 'http://linux03'
        this.$store.dispatch("setReqTeste", "teste=teste") // rmix0101
      }else{
        baseUrl = 'https://'+window.location.hostname
      }

      this.$store.dispatch("setDominio", baseUrl)
    },
    resizeContatos(data){
      let widthContatos = data.width

      if(widthContatos < 90 && !this.fechado){
        this.$root.$emit('toggle-contatos')
      }else if(widthContatos > 90 && this.fechado){
        this.$root.$emit('toggle-contatos')
      }

      localStorage.setItem('largura-contatos', widthContatos + 'px')
      this.$store.dispatch('setBlocker', false)
    },
    insereWidthChatNoLocalStorage(data){
      let widthAtual = data.width+'px'
      localStorage.setItem('largura-chat', widthAtual)

      this.$store.dispatch('setBlocker', false)
    },
    verificaLocalStorage(){
      let fechado = localStorage.getItem('status-contatos')
      if(fechado == "true"){
        this.objContatos.width = "60px"
      }else{
        let widthCtt = localStorage.getItem('largura-contatos')
        if(widthCtt){
          this.alteraWidth("todos-contatos", widthCtt)
          setTimeout( () => {
            if(document.querySelector('#todos-contatos')){
              document.querySelector('#todos-contatos').parentElement.style.width = widthCtt
            }
          }, 100)
        }
      }

      let widthChat = localStorage.getItem('largura-chat')
      if(widthChat){
        this.objChat.width = widthChat
        this.alteraWidth("chat", widthChat)
        setTimeout( () => {
          if(document.querySelector('#chat')){
            document.querySelector('#chat').parentElement.style.width = widthChat
          }
        }, 100)
      }
    },
    alteraWidth(id, widthNovo){
      const elem = document.querySelector(`#${id}`)
      if(elem){
        elem.style.width = widthNovo
      }
    },
    adicionaBlocker(){
      this.$store.dispatch('setBlocker', true)
      this.$store.dispatch('setOrigemBlocker', 'chat')
    },
    setHeightMaximo(){
      setTimeout(() => {
        const paiChat = document.querySelector('#chat').parentElement
        const paiContatos = document.querySelector('#todos-contatos').parentElement
        paiChat.style.height = '100%'
        paiContatos.style.height = '100%'
      }, 1000)
    }
  },
  created(){
    this.verificaLocalStorage()
  },
  mounted(){
    this.habilitarNotificacoes()
    this.setDominio()
    this.setHeightMaximo()

    this.$root.$on("criar-notificacao", (corpo, icone, titulo) => {
      this.criarNotificacao(corpo, icone, titulo)
    })
  },
  watch: {
    corDestaque(){
      if(this.corDestaque){
        const root = document.documentElement
        root.style.setProperty('--cor', this.corDestaque)
      }
    }
  },
  computed: {
    ...mapGetters({
      fechado: "getAbaContatos",
      corDestaque: "getCorDestaque"
    })
  }
}

</script>
