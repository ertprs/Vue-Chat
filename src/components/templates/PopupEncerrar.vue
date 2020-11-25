<template>
  <div class="popup-container">
    <ul
      lista-retornar
      class="popup-lista"
      :class="{'bg' : bg}">
      <li @click="fecharPopup()" class="btn-confirmacao cancelar"> {{ dicionario.btn_cancelar }} </li>
      <li id="encerrarAtendimento"
        class="btn-confirmacao confirmar"
        tabindex="-1"
        @keydown="encerrar()"
        @click="encerrar()">
        {{ dicionario.btn_confirmar }}
      </li>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from "vuex"

import { liberarEncerrar } from '@/services/atendimentos'

export default {
  computed: {
    ...mapGetters({
      bg: "getBgPopup",
      dicionario: "getDicionario"
    })
  },
  mounted(){
    this.focusEncerrar()
  },
  methods: {
    encerrar(){
      this.$root.$emit('encerrar-atendimento')
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
