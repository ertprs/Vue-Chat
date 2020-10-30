<template>
  <div id="popup" popup @click="fecharPopup($event)" v-show="abrirPopup && blocker">
    <transition name="fade">
      <div class="popup-container-geral" v-show="abrirPopup && blocker">
        <h2 class="popup-titulo" :style="`border-bottom: 3px solid ${bg}`">{{ titulo }}</h2>
        <popup-transferir v-if="origem == 'Transferir'" />
        <popup-retornar v-else-if="origem == 'Retornar'" />
        <popup-encerrar v-else-if="origem == 'Encerrar'" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 300ms;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

<script>

import { mapGetters } from 'vuex'

import PopupTransferir from './PopupTransferir'
import PopupRetornar from './PopupRetornar'
import PopupEncerrar from './PopupEncerrar'

export default {
  computed: {
    ...mapGetters({
      blocker: 'getBlocker',
      abrirPopup: 'getAbrirPopup',
      titulo: 'getTitulo',
      origem: 'getOrigem',
      bg: 'getBgPopup'
    })
  },
  components: {
    'popup-transferir' : PopupTransferir,
    'popup-retornar' : PopupRetornar,
    'popup-encerrar' : PopupEncerrar
  },
  watch: {
    abrirPopup(){
      if(this.abrirPopup){
        this.alterarCoresLi()
      }
    }
  },
  methods: {
    fecharPopup(event){
      if(event.target === document.querySelector('#popup')){       
        this.$store.dispatch('setBlocker', false)
        this.$store.dispatch('setAbrirPopup', false)
        this.$store.dispatch('setOrigem', "")
      }
    },
    alterarCoresLi(){
      const root = document.documentElement
      root.style.setProperty('--bg-alternativo', this.bg)
      // root.style.setProperty('--bg-calendar', this.bg)
    }
  }
}
</script>
