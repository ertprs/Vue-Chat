<template>
  <div id="popup" popup @click="fecharPopup($event)" v-if="abrirPopup && blocker">
    <div>
      <h2 class="popup-titulo" :style="'background-color: '+bg">{{ titulo }}</h2>
      <popup-transferir v-if="origem == 'Transferir'" />
      <popup-retornar v-else-if="origem == 'Retornar'" />
      <popup-encerrar v-else-if="origem == 'Encerrar'" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import axios_api from '../../services/serviceAxios'

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
      }
    },
    alterarCoresLi(){
      const root = document.documentElement
      root.style.setProperty('--bg-alternativo', this.bg)
    }
  }
}
</script>
