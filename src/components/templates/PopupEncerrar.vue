<template>
  <div class="popup-container">
    <ul 
      lista-retornar
      class="popup-lista"
      :class="{'bg' : bg}">
      <li @click="fecharPopup()" class="btn-confirmacao cancelar"> Cancelar </li>
      <li id="encerrarAtendimento"
        class="btn-confirmacao confirmar"
        tabindex="-1"
        @keydown="encerrar()"
        @click="encerrar()">
        Confirmar
      </li>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from "vuex"

import { liberarEncerrar } from '../../services/atendimentos'

export default {
  computed: {
    ...mapGetters({
      bg: "getBgPopup"
    })
  },
  mounted(){
    this.focusEncerrar()
  },
  methods: {
    encerrar(){
      this.$root.$emit('encerrarAtendimento')
      // Limpando pilha de eventos afim de evitar que a funcao de encerrar seja chamada mais de uma vez
      this.fecharPopup('encerrarAtendimento')
    },
    fecharPopup(encerramento){
      if(encerramento){
        liberarEncerrar()
        this.$store.dispatch('setBlocker', false)
        this.$store.dispatch('setAbrirPopup', false)
      }else{
        this.$store.dispatch('setBlocker', false)
        this.$store.dispatch('setAbrirPopup', false)
      }
    },
    focusEncerrar(){
      const btnEncerrar = document.querySelector('#encerrarAtendimento')
      if(btnEncerrar){
        btnEncerrar.focus()
      }
    }
  }
}
</script>

<style>

</style>