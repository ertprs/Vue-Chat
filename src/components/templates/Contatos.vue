<template>
  <div id="todos-contatos"> <!--  v-if="clienteMandouMensagem" -->
    <h1> Visualizar Contatos </h1>
    <ul class="lista-contatos">
      <li v-for=" (objeto,indice) in objetoContato" :key="indice" v-on:click="setAbaAtiva('chat')">
        <i v-if="indice % 2 == 0" class="fas fa-user"></i>
        <i v-else class="far fa-user"></i>
        {{ objeto.autor }}
      </li>
    </ul>
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