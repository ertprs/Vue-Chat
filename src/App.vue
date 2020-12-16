<template>
  <div id="app">
    <Blocker />
    <Popup />
    <Contatos />
    <MenuBotaoDireito />
    <Chat />
    <Informacoes />
    <Gerenciador />
  </div>
</template>

<script>

import axios from 'axios'
import { mapGetters } from "vuex"

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
      handlers: ['r'],
      indice: 0
    }
  },
  methods: {
    habilitarNotificacoes(){
      // Caso o navegador nao suporte notificacoes
      if(!("Notification" in window)){
        alert(this.dicionario.sem_suporte_notificacao)
      }
      // limitar tamanho da msg
      Notification.requestPermission().then(permission => {
        if(permission === "denied"){
          if(this.forcarNotificacoes){
            this.$store.dispatch("setBlocker", true)
            this.$store.dispatch("setOrigemBlocker", "atd-bloqueado")
          }
        }else if(permission === "granted"){
          this.$store.dispatch("setBlocker", false)
          this.$store.dispatch("setOrigemBlocker", "")
        }
      })
    },
    criarNotificacao(corpo, icone, titulo, tempo){
      icone = `${this.dominio}/callcenter/imagens/ext_top_${icone}.png`

      const lengthLimite = 197

      if(corpo.length > lengthLimite){
        corpo = corpo.substring(0, lengthLimite) + "..."
      }

      const notification = new Notification(titulo, {
        body: corpo,
        icon: icone,
        tag: new Date().getMilliseconds()
      })

      notification.onclick = (e) => {
        console.log("e: ", e)
      }

      if(document.visibilityState === "visible"){
        notification.close()
        return
      }

      if(tempo){
        tempo = parseInt(tempo)*1000

        setTimeout(() => {
          notification.close()
        }, tempo)
      }

    },
    setDominio(){
      let baseUrl = ''
      if(window.location.hostname == 'localhost'){
        baseUrl = 'http://linux03'
        this.$store.dispatch("setReqTeste", "teste=rmix0101") // teste
      }else{
        baseUrl = 'https://'+window.location.hostname
      }

      this.$store.dispatch("setDominio", baseUrl)
    },
    adicionaBlocker(){
      this.$store.dispatch('setBlocker', true)
      this.$store.dispatch('setOrigemBlocker', 'chat')
    },
  },
  mounted(){
    this.setDominio()

    this.$root.$on("habilitar-notificacoes", () => {
      this.habilitarNotificacoes()
    })

    this.$root.$on("criar-notificacao", (corpo, icone, titulo, tempo) => {
      this.criarNotificacao(corpo, icone, titulo, tempo)
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
      corDestaque: "getCorDestaque",
      forcarNotificacoes: "getForcarNotificacoes",
      dominio: "getDominio"
    })
  }
}

</script>
