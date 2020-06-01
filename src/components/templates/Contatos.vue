<template>
  <div id="todos-contatos" > <!--  v-if="clienteMandouMensagem" -->
    <div class="titulo-contatos">
      <h1> Contatos </h1>
    </div>
      {{ objetoContato }}
  </div>
</template>

<script>
// Essa lógica com certeza será alterada

import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setAbaAtiva']),
    toggleAbaAtiva(aba){
      this.setAbaAtiva(aba)
    }
  },
  computed: {
    ...mapGetters({
      clienteMandouMensagem: 'getClienteMandouMensagem',
      objetoContato: 'getTodasMensagens'
    })
  }
}
</script>

<style>

</style>